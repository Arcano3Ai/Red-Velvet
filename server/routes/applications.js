const express = require('express');
const router = express.Router();
const { query } = require('../db/database');
const { requireAdminAuth } = require('../middleware/auth');

// POST /api/applications — Envío público de postulación de modelo
router.post('/', async (req, res) => {
    try {
        const {
            alias,
            age,
            city,
            rate,
            whatsapp,
            nationality,
            measurements,
            photos, // Puede ser URL de /uploads/applications/... o link externo
            gallery = [],
            about
        } = req.body;

        if (!alias || !age || !city || !rate || !whatsapp) {
            return res.status(400).json({ error: 'Faltan campos obligatorios para la postulación.' });
        }

        const ageNum = parseInt(age, 10);
        if (isNaN(ageNum) || ageNum < 18) {
            return res.status(400).json({ error: 'Plataforma estrictamente para mayores de 18 años.' });
        }

        const id = 'RV-' + Math.floor(100000 + Math.random() * 900000);
        const galleryJson = JSON.stringify(Array.isArray(gallery) ? gallery : []);

        await query.run(`
            INSERT INTO applications (
                id, alias, age, city, rate, whatsapp, nationality,
                measurements, photos, gallery, about, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pendiente')
        `, [
            id, alias, ageNum, city, rate, whatsapp,
            nationality || 'Mexicana', measurements || '',
            photos || '', galleryJson, about || ''
        ]);

        await query.run(
            'INSERT INTO activity_logs (action, details, ip_address) VALUES (?, ?, ?)',
            ['APPLICATION_RECEIVED', `Nueva postulación recibida: ${alias} (Folio: ${id})`, req.ip]
        );

        res.status(201).json({
            success: true,
            folio: id,
            message: `Estimada ${alias}, tu postulación con Folio #${id} ha sido registrada de forma confidencial.`
        });
    } catch (err) {
        console.error('Error al registrar postulación:', err);
        res.status(500).json({ error: 'Error al procesar tu solicitud.' });
    }
});

// GET /api/applications — Listar todas las postulaciones (Admin)
router.get('/', requireAdminAuth, async (req, res) => {
    try {
        const { status } = req.query;
        let sql = 'SELECT * FROM applications';
        const params = [];

        if (status) {
            sql += ' WHERE status = ?';
            params.push(status);
        }

        sql += ' ORDER BY created_at DESC';

        const rows = await query.all(sql, params);
        const formatted = rows.map(r => ({
            ...r,
            gallery: r.gallery ? JSON.parse(r.gallery) : []
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: 'Error al consultar postulaciones.' });
    }
});

// PATCH /api/applications/:id/approve — Aprobar y PUBLICAR AUTOMÁTICAMENTE en catálogo
router.patch('/:id/approve', requireAdminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const app = await query.get('SELECT * FROM applications WHERE id = ?', [id]);
        if (!app) return res.status(404).json({ error: 'Postulación no encontrada.' });

        // 1. Actualizar estado de postulación
        await query.run('UPDATE applications SET status = "Aprobada" WHERE id = ?', [id]);

        // 2. Crear o verificar modelo en catálogo
        const modelId = 'MOD-' + app.id.replace('RV-', '');
        const existingModel = await query.get('SELECT * FROM models WHERE id = ?', [modelId]);

        if (!existingModel) {
            await query.run(`
                INSERT INTO models (
                    id, alias, age, city, rate, nationality, measurements,
                    languages, services, category, photo_main, gallery, bio, is_active
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
            `, [
                modelId, app.alias, app.age, app.city, app.rate, app.nationality || 'Mexicana',
                app.measurements || '90-60-90', 'Español', 'GFE, Cenas, Exclusivo',
                'VIP', app.photos || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
                app.gallery || '[]', app.about || 'Acompañante exclusiva verificada de RED VELVET.'
            ]);
        } else {
            await query.run('UPDATE models SET is_active = 1 WHERE id = ?', [modelId]);
        }

        await query.run(
            'INSERT INTO activity_logs (action, details) VALUES (?, ?)',
            ['APPLICATION_APPROVED', `Postulación de ${app.alias} aprobada y publicada en catálogo (ID: ${modelId})`]
        );

        res.json({
            success: true,
            modelId,
            message: `Postulación de ${app.alias} aprobada. Su perfil ya está activo en el catálogo público.`
        });
    } catch (err) {
        console.error('Error al aprobar postulación:', err);
        res.status(500).json({ error: 'Error al procesar la aprobación.' });
    }
});

// PATCH /api/applications/:id/reject — Rechazar postulación (Admin)
router.patch('/:id/reject', requireAdminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const app = await query.get('SELECT * FROM applications WHERE id = ?', [id]);
        if (!app) return res.status(404).json({ error: 'Postulación no encontrada.' });

        await query.run('UPDATE applications SET status = "Rechazada" WHERE id = ?', [id]);

        await query.run(
            'INSERT INTO activity_logs (action, details) VALUES (?, ?)',
            ['APPLICATION_REJECTED', `Postulación de ${app.alias} rechazada`]
        );

        res.json({ success: true, message: `Postulación de ${app.alias} marcada como rechazada.` });
    } catch (err) {
        res.status(500).json({ error: 'Error al rechazar postulación.' });
    }
});

module.exports = router;
