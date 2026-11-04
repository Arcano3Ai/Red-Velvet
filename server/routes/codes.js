const express = require('express');
const router = express.Router();
const { query } = require('../db/database');
const { requireAdminAuth } = require('../middleware/auth');

// POST /api/codes/verify (Verificación pública de cupones y códigos VIP)
router.post('/verify', async (req, res) => {
    try {
        const { code, subtotal } = req.body;
        if (!code) {
            return res.status(400).json({ success: false, error: 'Código no proporcionado.' });
        }

        const cleanCode = code.trim().toUpperCase();

        // 1. Buscar en cupones de descuento
        const coupon = await query.get(
            'SELECT * FROM coupons WHERE code = ? AND is_active = 1',
            [cleanCode]
        );

        if (coupon) {
            const currentSubtotal = Number(subtotal) || 0;
            if (coupon.min_purchase && currentSubtotal < coupon.min_purchase) {
                return res.status(400).json({
                    success: false,
                    error: `Este cupón requiere una compra mínima de $${coupon.min_purchase.toLocaleString()} MXN.`
                });
            }

            if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
                return res.status(400).json({
                    success: false,
                    error: 'Este cupón ha alcanzado el límite máximo de usos.'
                });
            }

            return res.json({
                success: true,
                type: 'coupon',
                code: coupon.code,
                discount_percent: coupon.discount_percent,
                discount_amount: coupon.discount_amount,
                note: coupon.note
            });
        }

        // 2. Buscar en códigos de invitación VIP
        const vipCode = await query.get(
            'SELECT * FROM invitation_codes WHERE code = ? AND is_active = 1',
            [cleanCode]
        );

        if (vipCode) {
            return res.json({
                success: true,
                type: 'vip',
                code: vipCode.code,
                role: vipCode.role,
                note: vipCode.note
            });
        }

        return res.status(404).json({
            success: false,
            error: 'El código ingresado no existe o no se encuentra activo.'
        });
    } catch (err) {
        console.error('Error al verificar código:', err);
        res.status(500).json({ success: false, error: 'Error al procesar la verificación del código.' });
    }
});

// GET /api/codes (Listar cupones y códigos - Admin)
router.get('/', requireAdminAuth, async (req, res) => {
    try {
        const coupons = await query.all('SELECT * FROM coupons ORDER BY created_at DESC');
        const vipCodes = await query.all('SELECT * FROM invitation_codes ORDER BY created_at DESC');
        res.json({
            success: true,
            coupons,
            vipCodes
        });
    } catch (err) {
        console.error('Error al obtener lista de códigos:', err);
        res.status(500).json({ success: false, error: 'Error al consultar códigos.' });
    }
});

// POST /api/codes/coupon (Crear cupón - Admin)
router.post('/coupon', requireAdminAuth, async (req, res) => {
    try {
        const { code, discount_percent, discount_amount, min_purchase, max_uses, note } = req.body;
        if (!code) {
            return res.status(400).json({ success: false, error: 'El código de cupón es obligatorio.' });
        }

        const cleanCode = code.trim().toUpperCase();

        await query.run(`
            INSERT INTO coupons (code, discount_percent, discount_amount, min_purchase, max_uses, used_count, is_active, note)
            VALUES (?, ?, ?, ?, ?, 0, 1, ?)
        `, [
            cleanCode,
            Number(discount_percent) || 0,
            Number(discount_amount) || 0,
            Number(min_purchase) || 0,
            Number(max_uses) || 100,
            note || ''
        ]);

        res.status(201).json({ success: true, message: `Cupón ${cleanCode} creado exitosamente.` });
    } catch (err) {
        console.error('Error al crear cupón:', err);
        res.status(500).json({ success: false, error: 'Error al crear cupón (verifique si ya existe).' });
    }
});

// DELETE /api/codes/coupon/:code (Eliminar cupón - Admin)
router.delete('/coupon/:code', requireAdminAuth, async (req, res) => {
    try {
        const cleanCode = req.params.code.trim().toUpperCase();
        await query.run('DELETE FROM coupons WHERE code = ?', [cleanCode]);
        res.json({ success: true, message: `Cupón ${cleanCode} eliminado.` });
    } catch (err) {
        console.error('Error al eliminar cupón:', err);
        res.status(500).json({ success: false, error: 'Error al eliminar cupón.' });
    }
});

module.exports = router;
