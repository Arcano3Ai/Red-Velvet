const express = require('express');
const router = express.Router();
const { query } = require('../db/database');
const { requireAdminAuth } = require('../middleware/auth');

// Helper para convertir datos de producto de la base de datos a formato JSON
const formatProduct = (p) => {
    if (!p) return null;
    return {
        ...p,
        specs: p.specs_json ? (typeof p.specs_json === 'string' ? JSON.parse(p.specs_json) : p.specs_json) : {},
        images: p.images_json ? (typeof p.images_json === 'string' ? JSON.parse(p.images_json) : p.images_json) : [p.photo_main],
        is_featured: Boolean(p.is_featured),
        is_active: Boolean(p.is_active)
    };
};

// GET /api/products/categories/list
router.get('/categories/list', async (req, res) => {
    try {
        const rows = await query.all(`
            SELECT category, COUNT(*) as count 
            FROM products 
            WHERE is_active = 1 
            GROUP BY category 
            ORDER BY count DESC
        `);
        res.json({ success: true, categories: rows });
    } catch (err) {
        console.error('Error al obtener categorías:', err);
        res.status(500).json({ success: false, error: 'Error al consultar categorías.' });
    }
});

// GET /api/products (Filtros: category, search, featured, sort)
router.get('/', async (req, res) => {
    try {
        const { category, search, featured, sort } = req.query;

        let sql = 'SELECT * FROM products WHERE is_active = 1';
        const params = [];

        if (category && category !== 'all' && category !== 'Todos') {
            sql += ' AND category = ?';
            params.push(category);
        }

        if (featured === '1' || featured === 'true') {
            sql += ' AND is_featured = 1';
        }

        if (search) {
            sql += ' AND (name LIKE ? OR subtitle LIKE ? OR description LIKE ?)';
            const term = `%${search.trim()}%`;
            params.push(term, term, term);
        }

        if (sort === 'price_asc') {
            sql += ' ORDER BY price ASC';
        } else if (sort === 'price_desc') {
            sql += ' ORDER BY price DESC';
        } else if (sort === 'newest') {
            sql += ' ORDER BY created_at DESC';
        } else {
            sql += ' ORDER BY sort_order ASC, created_at DESC';
        }

        const rows = await query.all(sql, params);
        const formatted = rows.map(formatProduct);

        res.json({
            success: true,
            count: formatted.length,
            products: formatted
        });
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ success: false, error: 'Error al obtener catálogo de productos.' });
    }
});

// GET /api/products/:id (id o slug)
router.get('/:id', async (req, res) => {
    try {
        const idOrSlug = req.params.id;
        const product = await query.get(
            'SELECT * FROM products WHERE id = ? OR slug = ? LIMIT 1',
            [idOrSlug, idOrSlug]
        );

        if (!product) {
            return res.status(404).json({ success: false, error: 'Producto no encontrado.' });
        }

        res.json({ success: true, product: formatProduct(product) });
    } catch (err) {
        console.error('Error al obtener producto:', err);
        res.status(500).json({ success: false, error: 'Error al consultar detalle del producto.' });
    }
});

// POST /api/products (Crear nuevo producto - Admin)
router.post('/', requireAdminAuth, async (req, res) => {
    try {
        const {
            name, category, subtitle, price, compare_price, stock,
            description, sensory_notes, specs, images, photo_main,
            badge, is_featured, sort_order
        } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({ success: false, error: 'Nombre, precio y categoría son obligatorios.' });
        }

        const id = `PROD-${Date.now().toString().slice(-6)}`;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + id.toLowerCase();
        const mainImg = photo_main || (images && images.length ? images[0] : 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=900');
        const specsJson = typeof specs === 'object' ? JSON.stringify(specs) : (specs || '{}');
        const imagesJson = Array.isArray(images) ? JSON.stringify(images) : JSON.stringify([mainImg]);

        await query.run(`
            INSERT INTO products (
                id, name, slug, category, subtitle, price, compare_price, stock,
                description, sensory_notes, specs_json, images_json, photo_main,
                badge, is_featured, is_active, sort_order
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        `, [
            id, name.trim(), slug, category.trim(), subtitle || '', Number(price),
            compare_price ? Number(compare_price) : null,
            stock !== undefined ? Number(stock) : 10,
            description || '', sensory_notes || '', specsJson, imagesJson, mainImg,
            badge || '', is_featured ? 1 : 0, sort_order || 0
        ]);

        await query.run('INSERT INTO activity_logs (action, details, ip_address) VALUES (?, ?, ?)', [
            'PRODUCT_CREATED',
            `Producto creado: ${name} (${id})`,
            req.ip
        ]);

        const created = await query.get('SELECT * FROM products WHERE id = ?', [id]);
        res.status(201).json({ success: true, product: formatProduct(created) });
    } catch (err) {
        console.error('Error al crear producto:', err);
        res.status(500).json({ success: false, error: 'Error interno al registrar el producto.' });
    }
});

// PUT /api/products/:id (Actualizar producto - Admin)
router.put('/:id', requireAdminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await query.get('SELECT * FROM products WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({ success: false, error: 'Producto no encontrado.' });
        }

        const {
            name, category, subtitle, price, compare_price, stock,
            description, sensory_notes, specs, images, photo_main,
            badge, is_featured, is_active, sort_order
        } = req.body;

        const specsJson = specs ? (typeof specs === 'object' ? JSON.stringify(specs) : specs) : existing.specs_json;
        const imagesJson = images ? (Array.isArray(images) ? JSON.stringify(images) : images) : existing.images_json;

        await query.run(`
            UPDATE products SET
                name = COALESCE(?, name),
                category = COALESCE(?, category),
                subtitle = COALESCE(?, subtitle),
                price = COALESCE(?, price),
                compare_price = COALESCE(?, compare_price),
                stock = COALESCE(?, stock),
                description = COALESCE(?, description),
                sensory_notes = COALESCE(?, sensory_notes),
                specs_json = COALESCE(?, specs_json),
                images_json = COALESCE(?, images_json),
                photo_main = COALESCE(?, photo_main),
                badge = COALESCE(?, badge),
                is_featured = COALESCE(?, is_featured),
                is_active = COALESCE(?, is_active),
                sort_order = COALESCE(?, sort_order),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [
            name !== undefined ? name.trim() : null,
            category !== undefined ? category.trim() : null,
            subtitle !== undefined ? subtitle : null,
            price !== undefined ? Number(price) : null,
            compare_price !== undefined ? (compare_price ? Number(compare_price) : null) : null,
            stock !== undefined ? Number(stock) : null,
            description !== undefined ? description : null,
            sensory_notes !== undefined ? sensory_notes : null,
            specsJson,
            imagesJson,
            photo_main !== undefined ? photo_main : null,
            badge !== undefined ? badge : null,
            is_featured !== undefined ? (is_featured ? 1 : 0) : null,
            is_active !== undefined ? (is_active ? 1 : 0) : null,
            sort_order !== undefined ? Number(sort_order) : null,
            id
        ]);

        const updated = await query.get('SELECT * FROM products WHERE id = ?', [id]);
        res.json({ success: true, product: formatProduct(updated) });
    } catch (err) {
        console.error('Error al actualizar producto:', err);
        res.status(500).json({ success: false, error: 'Error al actualizar el producto.' });
    }
});

// DELETE /api/products/:id (Desactivar o eliminar producto - Admin)
router.delete('/:id', requireAdminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await query.get('SELECT * FROM products WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({ success: false, error: 'Producto no encontrado.' });
        }

        // Marcado como inactivo (soft delete) para proteger integridad histórica de pedidos
        await query.run('UPDATE products SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);

        await query.run('INSERT INTO activity_logs (action, details, ip_address) VALUES (?, ?, ?)', [
            'PRODUCT_DEACTIVATED',
            `Producto desactivado del catálogo: ${id}`,
            req.ip
        ]);

        res.json({ success: true, message: `Producto ${id} removido del catálogo exitosamente.` });
    } catch (err) {
        console.error('Error al eliminar producto:', err);
        res.status(500).json({ success: false, error: 'Error al procesar la baja del producto.' });
    }
});

module.exports = router;

