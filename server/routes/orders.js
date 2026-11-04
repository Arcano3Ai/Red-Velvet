const express = require('express');
const router = express.Router();
const { query } = require('../db/database');
const { requireAdminAuth } = require('../middleware/auth');

// Formateador de orden
const formatOrder = (o) => {
    if (!o) return null;
    return {
        ...o,
        items: o.items_json ? (typeof o.items_json === 'string' ? JSON.parse(o.items_json) : o.items_json) : []
    };
};

// GET /api/orders (Listar órdenes de compra - Admin)
router.get('/', requireAdminAuth, async (req, res) => {
    try {
        const { status, limit } = req.query;
        let sql = 'SELECT * FROM orders';
        const params = [];

        if (status && status !== 'all') {
            sql += ' WHERE status = ?';
            params.push(status);
        }

        sql += ' ORDER BY created_at DESC';

        if (limit) {
            sql += ' LIMIT ?';
            params.push(Number(limit));
        }

        const rows = await query.all(sql, params);
        res.json({
            success: true,
            count: rows.length,
            orders: rows.map(formatOrder)
        });
    } catch (err) {
        console.error('Error al listar pedidos:', err);
        res.status(500).json({ success: false, error: 'Error al consultar órdenes de compra.' });
    }
});

// GET /api/orders/:id (Detalle de una orden - Admin)
router.get('/:id', requireAdminAuth, async (req, res) => {
    try {
        const order = await query.get('SELECT * FROM orders WHERE id = ?', [req.params.id]);
        if (!order) {
            return res.status(404).json({ success: false, error: 'Pedido no encontrado.' });
        }
        res.json({ success: true, order: formatOrder(order) });
    } catch (err) {
        console.error('Error al obtener detalle del pedido:', err);
        res.status(500).json({ success: false, error: 'Error al consultar pedido.' });
    }
});

// POST /api/orders (Crear nuevo pedido - Checkout público)
router.post('/', async (req, res) => {
    try {
        const {
            customer_name, email, phone, shipping_address,
            city, state, postal_code, notes, shipping_type,
            payment_method, items, coupon_code
        } = req.body;

        if (!customer_name || !phone || !shipping_address || !city) {
            return res.status(400).json({
                success: false,
                error: 'Por favor completa todos los datos requeridos de envío y contacto.'
            });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'La bolsa de compra no contiene productos.'
            });
        }

        // Validación y cálculo seguro del lado del servidor (evita manipulación de precios)
        let subtotal = 0;
        const verifiedItems = [];

        for (const item of items) {
            const product = await query.get(
                'SELECT id, name, price, stock, photo_main, category FROM products WHERE id = ? AND is_active = 1',
                [item.id]
            );

            if (!product) {
                return res.status(400).json({
                    success: false,
                    error: `El producto con ID ${item.id} ya no está disponible en catálogo.`
                });
            }

            const qty = Math.max(1, parseInt(item.quantity || 1, 10));
            const itemPrice = Number(product.price);
            subtotal += itemPrice * qty;

            verifiedItems.push({
                id: product.id,
                name: product.name,
                category: product.category,
                price: itemPrice,
                quantity: qty,
                subtotal: itemPrice * qty,
                photo: product.photo_main
            });

            // Reducir stock de forma segura
            await query.run(
                'UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?',
                [qty, product.id]
            );
        }

        // Verificación de cupón de descuento
        let discount = 0;
        let appliedCoupon = null;

        if (coupon_code) {
            const codeClean = coupon_code.trim().toUpperCase();
            const coupon = await query.get(
                'SELECT * FROM coupons WHERE code = ? AND is_active = 1',
                [codeClean]
            );

            if (coupon) {
                if (subtotal >= (coupon.min_purchase || 0)) {
                    if (coupon.discount_percent > 0) {
                        discount = (subtotal * coupon.discount_percent) / 100;
                    } else if (coupon.discount_amount > 0) {
                        discount = Math.min(coupon.discount_amount, subtotal);
                    }
                    appliedCoupon = coupon.code;

                    // Incrementar conteo de uso de cupón
                    await query.run(
                        'UPDATE coupons SET used_count = used_count + 1 WHERE code = ?',
                        [coupon.code]
                    );
                }
            }
        }

        // Envío gratuito en compras superiores a $1,500 MXN, de lo contrario $180 MXN
        const shipping_cost = subtotal >= 1500 ? 0 : 180;
        const total = Math.max(0, subtotal - discount + shipping_cost);

        const orderId = `ORD-${Date.now().toString().slice(-5)}${Math.floor(Math.random() * 90 + 10)}`;

        await query.run(`
            INSERT INTO orders (
                id, customer_name, email, phone, shipping_address, city, state, postal_code,
                notes, shipping_type, payment_method, items_json, subtotal, discount,
                shipping_cost, total, coupon_code, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pendiente')
        `, [
            orderId, customer_name.trim(), email ? email.trim() : '', phone.trim(),
            shipping_address.trim(), city.trim(), state ? state.trim() : '',
            postal_code ? postal_code.trim() : '', notes ? notes.trim() : '',
            shipping_type || 'Discreto Express Blindado',
            payment_method || 'WhatsApp Concierge / SPEI',
            JSON.stringify(verifiedItems),
            subtotal, discount, shipping_cost, total, appliedCoupon
        ]);

        // Construir mensaje y enlace directo a WhatsApp para atención Concierge de lujo
        const itemsListText = verifiedItems.map(i => `• ${i.quantity}x ${i.name} ($${i.price.toLocaleString()} MXN)`).join('\n');
        const waMessage = 
`💎 *RED VELVET — PEDIDO #${orderId}*
━━━━━━━━━━━━━━━━━━━
👤 *Cliente:* ${customer_name}
📱 *Teléfono:* ${phone}
📍 *Destino:* ${city}, ${state || ''}
📦 *Empaque:* Discreto Blindado 100%

🛍️ *Artículos:*
${itemsListText}

💰 *Subtotal:* $${subtotal.toLocaleString()} MXN
${discount > 0 ? `🏷️ *Descuento (${appliedCoupon}):* -$${discount.toLocaleString()} MXN\n` : ''}🚚 *Envío:* ${shipping_cost === 0 ? 'GRATIS' : `$${shipping_cost} MXN`}
💳 *TOTAL:* $${total.toLocaleString()} MXN
━━━━━━━━━━━━━━━━━━━
_Deseo confirmar el pago y los detalles de entrega confidencial._`;

        const conciergePhone = '528112345678'; // Número de concierge RED VELVET
        const whatsappUrl = `https://wa.me/${conciergePhone}?text=${encodeURIComponent(waMessage)}`;

        res.status(201).json({
            success: true,
            orderId,
            total,
            whatsappUrl,
            message: 'Tu pedido ha sido registrado con discreción absoluta. Procede al Concierge para confirmación.'
        });
    } catch (err) {
        console.error('Error al registrar pedido:', err);
        res.status(500).json({ success: false, error: 'Error al procesar el pedido.' });
    }
});

// PATCH /api/orders/:id/status (Actualizar estado de pedido - Admin)
router.patch('/:id/status', requireAdminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Pendiente', 'Empacado Discreto', 'En Camino', 'Entregado', 'Cancelado'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: 'Estado de pedido inválido.' });
        }

        const existing = await query.get('SELECT * FROM orders WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({ success: false, error: 'Pedido no encontrado.' });
        }

        await query.run(
            'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, id]
        );

        await query.run('INSERT INTO activity_logs (action, details, ip_address) VALUES (?, ?, ?)', [
            'ORDER_STATUS_UPDATED',
            `Pedido ${id} actualizado a: ${status}`,
            req.ip
        ]);

        res.json({ success: true, message: `Estado del pedido actualizado a ${status}` });
    } catch (err) {
        console.error('Error al cambiar estado del pedido:', err);
        res.status(500).json({ success: false, error: 'Error al actualizar estado del pedido.' });
    }
});

module.exports = router;

