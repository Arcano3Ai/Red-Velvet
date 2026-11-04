const fs = require('fs');
const path = require('path');
const { query } = require('./db/database');

function stripHtml(html) {
    if (!html) return '';
    return html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s{2,}/g, ' ')
        .trim();
}

function classifyCategory(p) {
    const text = `${p.product_type || ''} ${p.title || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
    const vendor = (p.vendor || '').toLowerCase();

    // 1. Fine Lingerie
    if (
        text.includes('lenceria') ||
        text.includes('lencería') ||
        text.includes('babydoll') ||
        text.includes('body') ||
        text.includes('conjunto') ||
        text.includes('panty') ||
        text.includes('disfraz') ||
        text.includes('disfraces') ||
        vendor.includes('ola mou')
    ) {
        return 'Fine Lingerie';
    }

    // 2. Soft Fetish / Bondage
    if (
        text.includes('bondage') ||
        text.includes('bdsm') ||
        text.includes('arnes') ||
        text.includes('arnés') ||
        text.includes('fetish') ||
        text.includes('esposas') ||
        text.includes('antifaz') ||
        text.includes('fusta') ||
        text.includes('collar') ||
        text.includes('mordaza')
    ) {
        return 'Soft Fetish';
    }

    // 3. Sensory Care
    if (
        text.includes('lubricante') ||
        text.includes('aceite') ||
        text.includes('afrodis') ||
        text.includes('serum') ||
        text.includes('sérum') ||
        text.includes('estimulante') ||
        text.includes('multiorgas') ||
        text.includes('desensibilizador') ||
        text.includes('feromona') ||
        text.includes('vela') ||
        text.includes('limpiador') ||
        text.includes('higiene') ||
        text.includes('healthy') ||
        vendor.includes('wet')
    ) {
        return 'Sensory Care';
    }

    // 4. Couples
    if (
        text.includes('pareja') ||
        text.includes('juegos de mesa') ||
        text.includes('doble penetrac')
    ) {
        return 'Couples';
    }

    // 5. Pleasure Tech (default for sex toys, vibrators, suction, dildos, plugs, masturbators, etc.)
    return 'Pleasure Tech';
}

function determineBadge(p, price) {
    const vendor = (p.vendor || '').trim();
    if (vendor === 'LELO') return 'LELO Premium';
    if (vendor === 'SATISFAYER') return 'Satisfyer Air Pulse';
    if (vendor === 'SVAKOM') return 'Svakom Smart Tech';
    if (vendor === 'ARCWAVE') return 'Arcwave Pleasure';
    if (vendor === 'CALEXOTICS') return 'CalExotics';
    if (price >= 2500) return 'Ultra Lujo';
    if (price >= 1500) return 'Best Seller';
    if (p.tags && p.tags.some(t => t.toLowerCase().includes('nuevo'))) return 'Nuevo';
    return 'Erectus Selección';
}

async function processErectusProducts() {
    console.log('Reading raw extracted data...');
    const rawPath = path.join(__dirname, '..', 'data', 'erectus_products_raw.json');
    if (!fs.existsSync(rawPath)) {
        console.error('Raw data file not found!');
        return;
    }

    const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
    console.log(`Loaded ${raw.length} raw products from Erectus.`);

    const validProducts = [];
    const csvRows = [
        ['ID', 'Nombre', 'Marca', 'Categoria', 'Precio_MXN', 'Precio_Anterior', 'Imagen_Principal', 'Descripcion_Corta', 'URL_Shopify'].join(',')
    ];

    for (const p of raw) {
        if (!p.images || p.images.length === 0) continue;
        if (!p.variants || p.variants.length === 0) continue;

        const variant = p.variants[0];
        const price = parseFloat(variant.price);
        if (isNaN(price) || price <= 0) continue;

        const comparePrice = variant.compare_at_price ? parseFloat(variant.compare_at_price) : null;
        const category = classifyCategory(p);
        const vendor = p.vendor || 'Erectus';
        const cleanDesc = stripHtml(p.body_html) || `${p.title}. Pieza seleccionada con altos estándares de calidad y biocompatibilidad.`;
        const shortDesc = cleanDesc.slice(0, 180) + (cleanDesc.length > 180 ? '...' : '');

        const badge = determineBadge(p, price);
        const isFeatured = ['LELO', 'SATISFAYER', 'SVAKOM', 'ARCWAVE'].includes(vendor.toUpperCase()) || price > 2000 ? 1 : 0;

        const images = p.images.map(img => img.src);
        const photoMain = images[0];

        // Format specs
        const specs = {
            marca: vendor,
            sku: variant.sku || `ERECTUS-${p.id}`,
            materiales: category === 'Fine Lingerie' ? 'Encaje francés & satén sedoso' : 'Silicona médica hipoalergénica & ABS biocompatible',
            impermeabilidad: category === 'Pleasure Tech' ? 'IPX7 Sumergible' : 'N/A',
            recargable: category === 'Pleasure Tech' ? 'USB Magnético de Carga Rápida' : 'N/A',
            garantia: 'Garantía Oficial de Satisfacción & Bioseguridad',
            empaque: '100% Ciego & Confidencial'
        };

        const sensoryNotes = `${vendor} · ${category}. Diseñado para intensificar el bienestar íntimo con texturas premium y ergonomía de precisión.`;

        const productObj = {
            id: `PROD-E-${p.id}`,
            name: p.title.trim(),
            slug: `${p.handle}-${String(p.id).slice(-4)}`,
            category: category,
            subtitle: `${vendor} · ${badge}`,
            price: price,
            compare_price: comparePrice,
            stock: 25,
            description: cleanDesc,
            sensory_notes: sensoryNotes,
            specs_json: JSON.stringify(specs),
            images_json: JSON.stringify(images),
            photo_main: photoMain,
            badge: badge,
            is_featured: isFeatured,
            is_active: 1,
            sort_order: isFeatured ? 1 : 10
        };

        validProducts.push(productObj);

        // CSV export row
        const escapeCsv = (str) => `"${(str || '').replace(/"/g, '""')}"`;
        csvRows.push([
            escapeCsv(productObj.id),
            escapeCsv(productObj.name),
            escapeCsv(vendor),
            escapeCsv(category),
            price.toFixed(2),
            (comparePrice ? comparePrice.toFixed(2) : ''),
            escapeCsv(photoMain),
            escapeCsv(shortDesc),
            escapeCsv(`https://www.erectus.com/products/${p.handle}`)
        ].join(','));
    }

    console.log(`\nProcessed ${validProducts.length} valid structured products.`);

    // 1. Save Clean JSON Catalog
    const jsonPath = path.join(__dirname, '..', 'data', 'erectus_catalog_full.json');
    fs.writeFileSync(jsonPath, JSON.stringify(validProducts, null, 2), 'utf8');
    console.log(`✅ Clean JSON Catalog saved to ${jsonPath} (${(fs.statSync(jsonPath).size / 1024).toFixed(1)} KB)`);

    // 2. Save CSV Catalog
    const csvPath = path.join(__dirname, '..', 'data', 'erectus_catalog_full.csv');
    fs.writeFileSync(csvPath, csvRows.join('\n'), 'utf8');
    console.log(`✅ CSV Catalog saved to ${csvPath} (${(fs.statSync(csvPath).size / 1024).toFixed(1)} KB)`);

    // Category breakdown
    const catCount = {};
    validProducts.forEach(p => catCount[p.category] = (catCount[p.category] || 0) + 1);
    console.log('\n📊 Category Distribution:');
    console.table(catCount);

    // 3. Upsert into SQLite database
    console.log('\n💾 Inserting/Upserting products into SQLite database (data/redvelvet.db)...');
    let inserted = 0;
    let updated = 0;

    for (const p of validProducts) {
        try {
            const res = await query.run(`
                INSERT INTO products (
                    id, name, slug, category, subtitle, price, compare_price,
                    stock, description, sensory_notes, specs_json, images_json,
                    photo_main, badge, is_featured, is_active, sort_order
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    name = excluded.name,
                    slug = excluded.slug,
                    category = excluded.category,
                    subtitle = excluded.subtitle,
                    price = excluded.price,
                    compare_price = excluded.compare_price,
                    description = excluded.description,
                    sensory_notes = excluded.sensory_notes,
                    specs_json = excluded.specs_json,
                    images_json = excluded.images_json,
                    photo_main = excluded.photo_main,
                    badge = excluded.badge,
                    is_featured = excluded.is_featured,
                    is_active = excluded.is_active,
                    updated_at = CURRENT_TIMESTAMP;
            `, [
                p.id, p.name, p.slug, p.category, p.subtitle, p.price, p.compare_price,
                p.stock, p.description, p.sensory_notes, p.specs_json, p.images_json,
                p.photo_main, p.badge, p.is_featured, p.is_active, p.sort_order
            ]);

            if (res.changes > 0) inserted++;
        } catch (err) {
            console.error(`Error inserting product ${p.id}:`, err.message);
        }
    }

    console.log(`\n🎉 Database sync completed! Total products inserted/updated: ${inserted}`);

    // Verify DB count
    const totalInDb = await query.get('SELECT COUNT(*) as count FROM products WHERE is_active = 1;');
    console.log(`\n🏆 TOTAL ACTIVE PRODUCTS IN RED VELVET DATABASE NOW: ${totalInDb.count}`);
}

processErectusProducts().catch(console.error);
