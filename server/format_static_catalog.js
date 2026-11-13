const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('data/mokkachai_catalog_full.json', 'utf8'));

const formatted = raw.map(p => {
    let specs = {};
    try {
        specs = typeof p.specs_json === 'string' ? JSON.parse(p.specs_json) : (p.specs_json || {});
    } catch (e) {
        specs = {};
    }

    let images = [];
    try {
        images = typeof p.images_json === 'string' ? JSON.parse(p.images_json) : (p.images_json || []);
    } catch (e) {
        images = [p.photo_main];
    }

    return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        subtitle: p.subtitle,
        price: p.price,
        compare_price: p.compare_price,
        stock: p.stock || 20,
        description: p.description,
        sensory_notes: p.sensory_notes,
        specs: specs,
        images: images,
        photo_main: p.photo_main,
        badge: p.badge,
        is_featured: p.is_featured ? 1 : 0,
        is_active: 1
    };
});

fs.writeFileSync('data/products.json', JSON.stringify(formatted, null, 2));
console.log(`Saved formatted data/products.json with ${formatted.length} products.`);

// Generate a JS snippet to update fallbackProducts in js/app.js
fs.writeFileSync('server/new_fallback_products.json', JSON.stringify(formatted));
console.log('Saved server/new_fallback_products.json for app.js insertion.');
