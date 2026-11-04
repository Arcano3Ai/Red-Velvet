const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

const { initDatabase, query } = require('./db/database');
const { seedData } = require('./seeds/seed');

const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const codesRoutes = require('./routes/codes');
const uploadRoutes = require('./routes/upload');
const conciergeRoutes = require('./routes/concierge');

const app = express();
const PORT = process.env.PORT || 8000;

// Configuración de Helmet con Content-Security-Policy flexible para imágenes y fuentes externas
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Servir carpetas estáticas
const ROOT_DIR = path.join(__dirname, '..');
const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/css', express.static(path.join(ROOT_DIR, 'css')));
app.use('/js', express.static(path.join(ROOT_DIR, 'js')));
app.use('/assets', express.static(path.join(ROOT_DIR, 'assets')));

// Rutas de API RESTful
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/codes', codesRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/concierge', conciergeRoutes);

// Retrocompatibilidad temporal para endpoints anteriores
app.use('/api/models', productsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        platform: 'RED VELVET — Luxury Sex Shop & Erotic Boutique',
        timestamp: new Date().toISOString()
    });
});

// Servir páginas HTML principales
app.get('/admin', (req, res) => {
    res.sendFile(path.join(ROOT_DIR, 'admin.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(ROOT_DIR, 'admin.html'));
});

// Handler dinámico para Open Graph (WhatsApp, redes sociales)
const serveIndexWithDynamicOg = (req, res) => {
    const indexPath = path.join(ROOT_DIR, 'index.html');
    fs.readFile(indexPath, 'utf8', (err, html) => {
        if (err) return res.status(500).send('Error loading page');

        const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
        const host = req.get('host');
        const baseUrl = process.env.APP_URL || `${proto}://${host}`;
        const ogImageUrl = `${baseUrl}/assets/logo/og-preview.jpg`;

        let modifiedHtml = html
            .replace(/https:\/\/raw\.githubusercontent\.com\/Arcano3Ai\/Red-Velvet\/main\/assets\/logo\/og-preview\.jpg/g, ogImageUrl)
            .replace(/https:\/\/raw\.githubusercontent\.com\/Arcano3Ai\/Red-Velvet\/main\//g, `${baseUrl}/`);

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(modifiedHtml);
    });
};

app.get('/', serveIndexWithDynamicOg);
app.get('/index.html', serveIndexWithDynamicOg);

// Iniciar servidor tras verificar base de datos
const startServer = async () => {
    try {
        await initDatabase();

        // Verificar si la base de datos de productos está vacía; si es así, sembrar datos de inicio
        const existingProducts = await query.get('SELECT COUNT(*) as count FROM products');
        if (!existingProducts || existingProducts.count === 0) {
            console.log('🌱 Inicializando catálogo maestro de RED VELVET Sex Shop...');
            await seedData();
        }

        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`\n======================================================`);
            console.log(`💎 RED VELVET — LUXURY SEX SHOP & INTIMATE WELLNESS`);
            console.log(`🌐 Tienda Pública:    http://localhost:${PORT}`);
            console.log(`⚙️ Suite de Control:  http://localhost:${PORT}/admin.html`);
            console.log(`🛡️ Base de Datos:     data/redvelvet.db`);
            console.log(`📸 Almacenamiento:    uploads/products/`);
            console.log(`======================================================\n`);
        });

        return server;
    } catch (err) {
        console.error('❌ Error crítico al iniciar servidor RED VELVET:', err);
        process.exit(1);
    }
};

if (require.main === module) {
    startServer();
}

module.exports = { app, startServer };
