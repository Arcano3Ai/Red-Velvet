const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { query } = require('../db/database');
const { JWT_SECRET } = require('../middleware/auth');

// Endpoint de login administrativo
router.post('/login', async (req, res) => {
    try {
        const { token, pin, username, password } = req.body;

        const cleanToken = (token || username || '').trim().toUpperCase();
        const cleanPin = (pin || password || '').trim();
        const configuredPin = (process.env.ADMIN_MASTER_PIN || '9999').trim();

        // 1. Verificación de credenciales maestras de Dirección General:
        // Usuario principal: YESSICUEVAS con contraseña Negro_1992
        const isYessiCuevas = 
            (cleanToken === 'YESSICUEVAS' || cleanToken === 'YESSI' || cleanToken === 'YESSI CUEVAS') &&
            cleanPin === 'Negro_1992';

        // 2. Verificación de credenciales maestras y retrocompatibilidad
        const isValidMaster = 
            isYessiCuevas ||
            ((cleanToken === 'ADMIN-999' || cleanToken === 'MASTER' || cleanToken === 'ADMIN') &&
             (cleanPin === configuredPin || cleanPin === '9999' || cleanPin === 'admin' || cleanPin === 'velvet2026'));

        if (!isValidMaster) {
            // Verificar también contra códigos VIP activos de rol 'Administrador'
            const dbCode = await query.get(
                "SELECT * FROM invitation_codes WHERE code = ? AND role = 'Administrador' AND is_active = 1",
                [cleanToken]
            );
            if (!dbCode || (cleanPin !== configuredPin && cleanPin !== '9999' && cleanPin !== 'admin' && cleanPin !== 'Negro_1992')) {
                return res.status(401).json({
                    success: false,
                    error: 'Credenciales administrativas no autorizadas o contraseña inválida.'
                });
            }
        }

        const isExecutiveLeader = isYessiCuevas || cleanToken === 'YESSICUEVAS';

        // Generar JWT válido por 24 horas
        const authToken = jwt.sign(
            {
                user: isExecutiveLeader ? 'YESSICUEVAS' : cleanToken,
                role: 'Administrador',
                scope: 'admin:all'
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Registrar log de auditoría
        await query.run(
            'INSERT INTO activity_logs (action, details, ip_address) VALUES (?, ?, ?)',
            ['ADMIN_LOGIN_SUCCESS', `Inicio de sesión exitoso con identificador: ${isExecutiveLeader ? 'YESSICUEVAS' : cleanToken}`, req.ip]
        );

        res.json({
            success: true,
            token: authToken,
            user: {
                username: isExecutiveLeader ? 'Yessi Cuevas' : cleanToken,
                role: 'Administrador',
                label: isExecutiveLeader ? '👑 Dirección General (Yessi Cuevas)' : '⚙️ Suite Dirección'
            },
            expiresIn: '24h'
        });
    } catch (err) {
        console.error('Error en auth/login:', err);
        res.status(500).json({ success: false, error: 'Error interno en el servidor de autenticación.' });
    }
});

module.exports = router;
