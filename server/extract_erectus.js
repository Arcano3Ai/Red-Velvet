const fs = require('fs');
const path = require('path');

async function scrapeErectus() {
    console.log('Fetching products from https://www.erectus.com/products.json...');
    let page = 1;
    let allProducts = [];

    while (true) {
        const url = `https://www.erectus.com/products.json?limit=250&page=${page}`;
        console.log(`Fetching page ${page}...`);
        try {
            const res = await fetch(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
            });

            if (res.status !== 200) {
                console.log(`Page ${page} returned status ${res.status}. Ending pagination.`);
                break;
            }

            const data = await res.json();
            const products = data.products || [];
            if (products.length === 0) {
                console.log(`Page ${page} is empty. Done.`);
                break;
            }

            allProducts = allProducts.concat(products);
            console.log(`Page ${page}: received ${products.length} products. Total so far: ${allProducts.length}`);
            page++;
            // Small pause between requests
            await new Promise(r => setTimeout(r, 400));
        } catch (err) {
            console.error(`Error on page ${page}:`, err.message);
            break;
        }
    }

    console.log(`\nTOTAL EXTRACTED PRODUCTS: ${allProducts.length}`);

    // Save raw products JSON
    const outputPath = path.join(__dirname, '..', 'data', 'erectus_products_raw.json');
    fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2), 'utf8');
    console.log(`Raw data saved to ${outputPath} (${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)`);

    // Analyze types and categories
    const types = {};
    const vendors = {};
    allProducts.forEach(p => {
        const t = p.product_type || 'Uncategorized';
        types[t] = (types[t] || 0) + 1;
        const v = p.vendor || 'Unknown';
        vendors[v] = (vendors[v] || 0) + 1;
    });

    console.log('\nTop Product Types:', Object.entries(types).sort((a,b) => b[1]-a[1]).slice(0, 15));
    console.log('\nTop Vendors/Brands:', Object.entries(vendors).sort((a,b) => b[1]-a[1]).slice(0, 15));
}

scrapeErectus();

