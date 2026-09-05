const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'red-velvet-executive-secret-key-2026';

const requireAdminAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Acceso no autorizado: Token de autenticación ausente.' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.adminUser = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Sesión inválida o expirada. Por favor identifícate nuevamente.' });
    }
};

module.exports = {
    requireAdminAuth,
    JWT_SECRET
};
