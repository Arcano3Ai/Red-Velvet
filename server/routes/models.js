const express = require('express');
const router = express.Router();
const { query } = require('../db/database');
const { requireAdminAuth } = require('../middleware/auth');

// GET /api/models — Catálogo público de perfiles activos
router.get('/', async (req, res) => {
    try {
        const { city, category, includeInactive } = req.query;

        let sql = 'SELECT * FROM models WHERE 1=1';
        const params = [];

        // Si no es petición interna administrativa, solo mostrar activas
        if (includeInactive !== 'true') {
            sql += ' AND is_active = 1';
        }

        if (city && city !== 'Todas las ciudades' && city !== 'all') {
            sql += ' AND city LIKE ?';
            params.push(`%${city}%`);
        }

        if (category && category !== 'Todas' && category !== 'all') {
            sql += ' AND category = ?';
            params.push(category);
        }

        sql += ' ORDER BY is_elite DESC, sort_order ASC, created_at DESC';

        const rows = await query.all(sql, params);

        // Parsear campos JSON como gallery
        const formatted = rows.map(m => ({
            ...m,
            gallery: m.gallery ? JSON.parse(m.gallery) : [],
            is_active: Boolean(m.is_active),
            is_elite: Boolean(m.is_elite)
        }));

        res.json(formatted);
    } catch (err) {
        console.error('Error al listar modelos:', err);
        res.status(500).json({ error: 'Error al consultar catálogo de modelos.' });
    }
});

// GET /api/models/:id — Detalle individual de modelo
router.get('/:id', async (req, res) => {
    try {
        const row = await query.get('SELECT * FROM models WHERE id = ?', [req.params.id]);
        if (!row) {
            return res.status(404).json({ error: 'Perfil no encontrado.' });
        }
        res.json({
            ...row,
            gallery: row.gallery ? JSON.parse(row.gallery) : [],
            is_active: Boolean(row.is_active),
            is_elite: Boolean(row.is_elite)
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al consultar perfil.' });
    }
});

// POST /api/models — Crear nueva modelo (Admin)
router.post('/', requireAdminAuth, async (req, res) => {
    try {
        const {
            alias,
            age,
            city,
            rate,
            nationality,
            measurements,
            languages,
            services,
            category = 'VIP',
            photo_main,
            gallery = [],
            bio = '',
            is_elite = 0
        } = req.body;

        if (!alias || !age || !city || !rate || !photo_main) {
            return res.status(400).json({ error: 'Faltan campos obligatorios (alias, edad, ciudad, tarifa, foto principal).' });
        }

        const id = 'MOD-' + Date.now().toString(36).toUpperCase();
        const galleryJson = JSON.stringify(Array.isArray(gallery) ? gallery : []);

        await query.run(`
            INSERT INTO models (
                id, alias, age, city, rate, nationality, measurements,
                languages, services, category, photo_main, gallery, bio, is_elite
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            id, alias, parseInt(age, 10), city, rate, nationality || 'Mexicana',
            measurements || '90-60-90', languages || 'Español, Inglés',
            services || 'GFE, Cenas, Eventos VIP', category, photo_main,
            galleryJson, bio, is_elite ? 1 : 0
        ]);

        await query.run(
            'INSERT INTO activity_logs (action, details) VALUES (?, ?)',
            ['MODEL_CREATED', `Se creó el perfil de la modelo ${alias} (ID: ${id})`]
        );

        res.status(201).json({
            success: true,
            id,
            message: `Perfil de ${alias} creado y publicado con éxito.`
        });
    } catch (err) {
        console.error('Error al crear modelo:', err);
        res.status(500).json({ error: 'Error al registrar la modelo en la base de datos.' });
    }
});

// PUT /api/models/:id — Editar modelo existente (Admin)
router.put('/:id', requireAdminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const current = await query.get('SELECT * FROM models WHERE id = ?', [id]);
        if (!current) {
            return res.status(404).json({ error: 'Perfil no encontrado.' });
        }

        const {
            alias = current.alias,
            age = current.age,
            city = current.city,
            rate = current.rate,
            nationality = current.nationality,
            measurements = current.measurements,
            languages = current.languages,
            services = current.services,
            category = current.category,
            photo_main = current.photo_main,
            gallery = current.gallery ? JSON.parse(current.gallery) : [],
            bio = current.bio,
            is_active = current.is_active,
            is_elite = current.is_elite
        } = req.body;

        const galleryJson = JSON.stringify(Array.isArray(gallery) ? gallery : []);

        await query.run(`
            UPDATE models SET
                alias = ?, age = ?, city = ?, rate = ?, nationality = ?,
                measurements = ?, languages = ?, services = ?, category = ?,
                photo_main = ?, gallery = ?, bio = ?, is_active = ?, is_elite = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [
            alias, parseInt(age, 10), city, rate, nationality,
            measurements, languages, services, category, photo_main,
            galleryJson, bio, is_active ? 1 : 0, is_elite ? 1 : 0, id
        ]);

        res.json({ success: true, message: `Perfil de ${alias} actualizado exitosamente.` });
    } catch (err) {
        console.error('Error al actualizar modelo:', err);
        res.status(500).json({ error: 'Error al actualizar datos de la modelo.' });
    }
});

// PATCH /api/models/:id/toggle — Pausar / Activar modelo en catálogo
router.patch('/:id/toggle', requireAdminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const model = await query.get('SELECT * FROM models WHERE id = ?', [id]);
        if (!model) return res.status(404).json({ error: 'Modelo no encontrada.' });

        const newStatus = model.is_active ? 0 : 1;
        await query.run('UPDATE models SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [newStatus, id]);

        res.json({
            success: true,
            is_active: Boolean(newStatus),
            message: `Modelo ${model.alias} ahora está ${newStatus ? 'ACTIVA' : 'PAUSADA'} en catálogo.`
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al cambiar estado de la modelo.' });
    }
});

// DELETE /api/models/:id — Eliminar modelo de catálogo
router.delete('/:id', requireAdminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const model = await query.get('SELECT * FROM models WHERE id = ?', [id]);
        if (!model) return res.status(404).json({ error: 'Modelo no encontrada.' });

        await query.run('DELETE FROM models WHERE id = ?', [id]);

        await query.run(
            'INSERT INTO activity_logs (action, details) VALUES (?, ?)',
            ['MODEL_DELETED', `Se eliminó a la modelo ${model.alias} (ID: ${id})`]
        );

        res.json({ success: true, message: `Modelo ${model.alias} eliminada definitivamente.` });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar modelo.' });
    }
});

module.exports = router;
