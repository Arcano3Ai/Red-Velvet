const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, '../../data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'redvelvet.db');
const db = new sqlite3.Database(DB_PATH);

// Helper methods promisificados
const query = {
    run: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, changes: this.changes });
            });
        });
    },
    get: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },
    all: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
};

// Inicialización de esquemas y tablas
const initDatabase = async () => {
    // Modo WAL para alta concurrencia y velocidad
    await query.run('PRAGMA journal_mode = WAL;');
    await query.run('PRAGMA foreign_keys = ON;');

    // 1. Catálogo de Productos (Sex Shop & Boutique de Lujo)
    await query.run(`
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            category TEXT NOT NULL,
            subtitle TEXT,
            price REAL NOT NULL,
            compare_price REAL,
            stock INTEGER DEFAULT 15,
            description TEXT,
            sensory_notes TEXT,
            specs_json TEXT,       -- JSON: materiales, decibeles, resistencia al agua, modos, batería, carga
            images_json TEXT,      -- JSON array de URLs de fotos
            photo_main TEXT NOT NULL,
            badge TEXT,            -- Best Seller, Nuevo, Edición Limitada, Discreto <40dB
            is_featured INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            sort_order INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // 2. Pedidos y Órdenes de Compra
    await query.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            customer_name TEXT NOT NULL,
            email TEXT,
            phone TEXT NOT NULL,
            shipping_address TEXT NOT NULL,
            city TEXT NOT NULL,
            state TEXT,
            postal_code TEXT,
            notes TEXT,
            shipping_type TEXT DEFAULT 'Discreto Express',
            payment_method TEXT DEFAULT 'WhatsApp Concierge / Transferencia',
            items_json TEXT NOT NULL, -- JSON con array de items comprados
            subtotal REAL NOT NULL,
            discount REAL DEFAULT 0,
            shipping_cost REAL DEFAULT 0,
            total REAL NOT NULL,
            coupon_code TEXT,
            status TEXT DEFAULT 'Pendiente', -- Pendiente, Empacado Discreto, En Camino, Entregado, Cancelado
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // 3. Cupones de descuento y códigos VIP
    await query.run(`
        CREATE TABLE IF NOT EXISTS coupons (
            code TEXT PRIMARY KEY,
            discount_percent INTEGER DEFAULT 10,
            discount_amount REAL DEFAULT 0,
            min_purchase REAL DEFAULT 0,
            max_uses INTEGER DEFAULT 100,
            used_count INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            note TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // 4. Códigos de invitación (retrocompatibilidad)
    await query.run(`
        CREATE TABLE IF NOT EXISTS invitation_codes (
            code TEXT PRIMARY KEY,
            role TEXT NOT NULL DEFAULT 'Usuario',
            max_uses TEXT DEFAULT 'Ilimitado',
            used_count INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            note TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // 5. Usuarios administradores
    await query.run(`
        CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'Administrador',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // 6. Logs de auditoría y seguridad
    await query.run(`
        CREATE TABLE IF NOT EXISTS activity_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT NOT NULL,
            details TEXT,
            ip_address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    console.log('✔ Base de datos SQLite (E-Commerce Luxury Sex Shop) inicializada exitosamente en:', DB_PATH);
};

module.exports = {
    db,
    query,
    initDatabase
};
