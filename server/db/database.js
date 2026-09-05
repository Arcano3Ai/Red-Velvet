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

    // 1. Modelos activas en catálogo
    await query.run(`
        CREATE TABLE IF NOT EXISTS models (
            id TEXT PRIMARY KEY,
            alias TEXT NOT NULL,
            age INTEGER NOT NULL,
            city TEXT NOT NULL,
            rate TEXT NOT NULL,
            nationality TEXT,
            measurements TEXT,
            languages TEXT,
            services TEXT,
            category TEXT DEFAULT 'VIP',
            photo_main TEXT NOT NULL,
            gallery TEXT, -- JSON array de URLs de fotos
            bio TEXT,
            is_active INTEGER DEFAULT 1,
            is_elite INTEGER DEFAULT 0,
            sort_order INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // 2. Postulaciones entrantes
    await query.run(`
        CREATE TABLE IF NOT EXISTS applications (
            id TEXT PRIMARY KEY,
            alias TEXT NOT NULL,
            age INTEGER NOT NULL,
            city TEXT NOT NULL,
            rate TEXT NOT NULL,
            whatsapp TEXT NOT NULL,
            nationality TEXT,
            measurements TEXT,
            photos TEXT, -- Foto principal (URL o Base64/Archivo)
            gallery TEXT, -- JSON array de fotos adicionales
            about TEXT,
            status TEXT DEFAULT 'Pendiente', -- Pendiente, Aprobada, Rechazada
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // 3. Códigos de invitación VIP
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

    // 4. Usuarios administradores
    await query.run(`
        CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'Administrador',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // 5. Logs de auditoría y seguridad
    await query.run(`
        CREATE TABLE IF NOT EXISTS activity_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT NOT NULL,
            details TEXT,
            ip_address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    console.log('✔ Base de datos SQLite inicializada exitosamente en:', DB_PATH);
};

module.exports = {
    db,
    query,
    initDatabase
};
