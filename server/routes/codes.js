const express = require('express');
const router = express.Router();
const { query } = require('../db/database');
const { requireAdminAuth } = require('../middleware/auth');

// POST /api/codes/verify — Verificación pública de código de invitación
router.post('/verify', async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ valid: false, error: 'Código no proporcionado.' });
        }

        const cleanCode = code.trim().toUpperCase();
        const codeRecord = await query.get(
            'SELECT * FROM invitation_codes WHERE code = ? AND is_active = 1',
            [cleanCode]
        );

        if (!codeRecord) {
            return res.json({
                valid: false,
                error: 'El código ingresado no existe, está inactivo o ha sido revocado.'
            });
        }

        // Verificar límite de usos si no es Ilimitado
        if (codeRecord.max_uses !== 'Ilimitado') {
            const max = parseInt(codeRecord.max_uses, 10);
            if (!isNaN(max) && codeRecord.used_count >= max) {
                return res.json({
                    valid: false,
                    error: 'Este código de invitación ha alcanzado su límite de usos autorizados.'
                });
            }
        }

        // Incrementar contador de usos
        await query.run(
            'UPDATE invitation_codes SET used_count = used_count + 1 WHERE code = ?',
            [cleanCode]
        );

        let label = '👤 Mi Cuenta';
        if (codeRecord.role === 'Cliente VIP') label = '💎 Mi Perfil';
        if (codeRecord.role === 'Administrador') label = '⚙️ Suite Admin';

        res.json({
            valid: true,
            code: cleanCode,
            role: codeRecord.role,
            label,
            isAdmin: codeRecord.role === 'Administrador'
        });
    } catch (err) {
        console.error('Error al verificar código:', err);
        res.status(500).json({ valid: false, error: 'Error al verificar código de invitación.' });
    }
});

// GET /api/codes — Listar todos los códigos (Admin)
router.get('/', requireAdminAuth, async (req, res) => {
    try {
        const rows = await query.all('SELECT * FROM invitation_codes ORDER BY created_at DESC');
        res.json(rows.map(r => ({
            ...r,
            is_active: Boolean(r.is_active)
        })));
    } catch (err) {
        res.status(500).json({ error: 'Error al consultar códigos VIP.' });
    }
});

// POST /api/codes — Generar nuevo código VIP (Admin)
router.post('/', requireAdminAuth, async (req, res) => {
    try {
        const { code, role = 'Usuario', max_uses = 'Ilimitado', note = '' } = req.body;
        if (!code) {
            return res.status(400).json({ error: 'El código es requerido.' });
        }

        const cleanCode = code.trim().toUpperCase();
        const existing = await query.get('SELECT code FROM invitation_codes WHERE code = ?', [cleanCode]);
        if (existing) {
            return res.status(400).json({ error: 'Este código ya existe en el sistema.' });
        }

        await query.run(`
            INSERT INTO invitation_codes (code, role, max_uses, used_count, is_active, note)
            VALUES (?, ?, ?, 0, 1, ?)
        `, [cleanCode, role, max_uses, note]);

        res.status(201).json({
            success: true,
            code: cleanCode,
            message: `Código ${cleanCode} generado exitosamente.`
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al generar código VIP.' });
    }
});

// PATCH /api/codes/:code/toggle — Activar o Revocar código (Admin)
router.patch('/:code/toggle', requireAdminAuth, async (req, res) => {
    try {
        const { code } = req.params;
        const record = await query.get('SELECT * FROM invitation_codes WHERE code = ?', [code]);
        if (!record) return res.status(404).json({ error: 'Código no encontrado.' });

        const newStatus = record.is_active ? 0 : 1;
        await query.run('UPDATE invitation_codes SET is_active = ? WHERE code = ?', [newStatus, code]);

        res.json({
            success: true,
            is_active: Boolean(newStatus),
            message: `Código ${code} ahora está ${newStatus ? 'ACTIVO' : 'REVOCADO'}.`
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar código.' });
    }
});

module.exports = router;
