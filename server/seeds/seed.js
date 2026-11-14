const fs = require('fs');
const path = require('path');
const { query, initDatabase } = require('../db/database');

const seedData = async () => {
    await initDatabase();

    console.log('🔄 Sembrando catálogo maestro del nuevo mayorista RED VELVET (+20% precio público)...');

    // 1. Cupones de descuento y bienvenida
    const initialCoupons = [
        { code: 'VELVET10', discount_percent: 10, discount_amount: 0, min_purchase: 500, max_uses: 1000, note: '10% de bienvenida para nuevos clientes' },
        { code: 'VELVET15', discount_percent: 15, discount_amount: 0, min_purchase: 500, max_uses: 5000, note: '15% de cortesía The Velvet Circle' },
        { code: 'VIP20', discount_percent: 20, discount_amount: 0, min_purchase: 2500, max_uses: 500, note: '20% de descuento en pedidos mayores a $2,500 MXN' },
        { code: 'SECRET50', discount_percent: 15, discount_amount: 0, min_purchase: 1000, max_uses: 200, note: 'Código exclusivo membresía secreta' },
        { code: 'GOLD30', discount_percent: 30, discount_amount: 0, min_purchase: 4000, max_uses: 100, note: '30% descuento en pedidos Gold Suite' }
    ];

    for (const c of initialCoupons) {
        await query.run(`
            INSERT OR REPLACE INTO coupons (code, discount_percent, discount_amount, min_purchase, max_uses, used_count, is_active, note)
            VALUES (?, ?, ?, ?, ?, 0, 1, ?)
        `, [c.code, c.discount_percent, c.discount_amount, c.min_purchase, c.max_uses, c.note]);
    }

    // Códigos de invitación VIP
    const initialCodes = [
        { code: 'VELVET-VIP', role: 'Cliente VIP', max_uses: 'Ilimitado', note: 'Acceso Miembro Preferencial' },
        { code: 'ADMIN-999', role: 'Administrador', max_uses: 'Exclusivo', note: 'Token Maestro Dirección' }
    ];

    for (const c of initialCodes) {
        await query.run(`
            INSERT OR IGNORE INTO invitation_codes (code, role, max_uses, used_count, is_active, note)
            VALUES (?, ?, ?, 0, 1, ?)
        `, [c.code, c.role, c.max_uses, c.note]);
    }

    // 2. Cargar Catálogo Maestro RED VELVET
    let catalogPath = path.join(__dirname, '../../data/redvelvet_catalog_full.json');
    if (!fs.existsSync(catalogPath)) {
        catalogPath = path.join(__dirname, '../../data/products.json');
    }

    if (!fs.existsSync(catalogPath)) {
        console.error('❌ Archivo de catálogo no encontrado en:', catalogPath);
        return;
    }

    const products = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

    // Desactivar o purgar productos anteriores
    await query.run("UPDATE products SET is_active = 0 WHERE id NOT LIKE 'PROD-RV-%'");

    for (const p of products) {
        const specsJson = typeof p.specs_json === 'string' ? p.specs_json : JSON.stringify(p.specs_json || p.specs || {});
        const imagesJson = typeof p.images_json === 'string' ? p.images_json : JSON.stringify(p.images_json || p.images || []);

        await query.run(`
            INSERT OR REPLACE INTO products (
                id, name, slug, category, subtitle, price, compare_price, stock, 
                description, sensory_notes, specs_json, images_json, photo_main, 
                badge, is_featured, is_active, sort_order, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, CURRENT_TIMESTAMP)
        `, [
            p.id, p.name, p.slug, p.category, p.subtitle, p.price, p.compare_price, p.stock || 24,
            p.description, p.sensory_notes, specsJson, imagesJson, p.photo_main,
            p.badge, p.is_featured ? 1 : 0, p.sort_order || 0
        ]);
    }

    console.log(`✅ Nuevo catálogo sembrado con éxito: ${products.length} productos exclusivos del mayorista.`);
};

if (require.main === module) {
    seedData()
        .then(() => process.exit(0))
        .catch(err => {
            console.error('Error en seed:', err);
            process.exit(1);
        });
}

module.exports = { seedData };
