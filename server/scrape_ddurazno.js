const fs = require('fs');

async function scrapeAllDdurazno() {
    const urls = JSON.parse(fs.readFileSync('server/ddurazno_product_urls.json', 'utf8'));
    console.log(`Starting scrape of ${urls.length} Ddurazno products...`);

    const products = [];
    const concurrency = 5;
    let index = 0;

    async function worker() {
        while (index < urls.length) {
            const myIndex = index++;
            const url = urls[myIndex];
            try {
                const res = await fetch(url, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                    }
                });
                if (!res.ok) {
                    console.log(`[${myIndex + 1}/${urls.length}] HTTP ${res.status} on ${url}`);
                    continue;
                }
                const html = await res.text();

                // Extract JSON-LD blocks
                const jsonLdBlocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
                let productLd = null;

                for (const b of jsonLdBlocks) {
                    try {
                        const parsed = JSON.parse(b);
                        if (Array.isArray(parsed)) {
                            const p = parsed.find(item => item['@type'] === 'Product');
                            if (p) { productLd = p; break; }
                        } else if (parsed['@type'] === 'Product') {
                            productLd = parsed;
                            break;
                        }
                    } catch (e) {}
                }

                // Extract images from HTML (all cloudinary product images)
                const imgMatches = [...html.matchAll(/https:\/\/res\.cloudinary\.com\/dgzea9m7q\/image\/upload\/[^"'\s>]+/gi)].map(m => m[0]);
                const uniqueImgs = [...new Set(imgMatches)].filter(img => !img.includes('logo'));

                // Extract title
                const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim();

                // Extract description from HTML (paragraphs or body)
                const descBlockMatch = html.match(/<div[^>]*class=["'][^"']*(?:description|detalle|info|product-body)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
                let fullDesc = descBlockMatch ? descBlockMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';

                // Extract price
                let rawPrice = productLd?.offers?.price || null;
                if (!rawPrice) {
                    const priceMatch = html.match(/\$\s*([\d,]+(?:\.\d{2})?)/);
                    if (priceMatch) rawPrice = priceMatch[1].replace(',', '');
                }

                // Product ID from URL
                const idMatch = url.match(/\/producto\/([^\/?#]+)/);
                const productId = idMatch ? idMatch[1] : `DD-${myIndex}`;

                const item = {
                    dduraznoId: productId,
                    url: url,
                    name: productLd?.name || h1 || `Producto ${productId}`,
                    category: productLd?.category || 'Pleasure Tech',
                    sku: productLd?.sku || `DD-${productId}`,
                    price: rawPrice ? parseFloat(rawPrice) : 0,
                    description: productLd?.description || fullDesc || '',
                    images: uniqueImgs.length > 0 ? uniqueImgs : (productLd?.image ? [productLd.image] : []),
                    jsonLd: productLd
                };

                products.push(item);
                if ((myIndex + 1) % 10 === 0 || myIndex === urls.length - 1) {
                    console.log(`[${myIndex + 1}/${urls.length}] Scraped "${item.name}" - $${item.price} (${item.images.length} imgs)`);
                }
            } catch (err) {
                console.error(`Error scraping ${url}:`, err.message);
            }
        }
    }

    const workers = Array.from({ length: concurrency }, () => worker());
    await Promise.all(workers);

    console.log(`\n✅ Finished scraping! Successfully extracted ${products.length} products.`);
    fs.writeFileSync('server/ddurazno_scraped_raw.json', JSON.stringify(products, null, 2));
    console.log('Saved to server/ddurazno_scraped_raw.json');
}

scrapeAllDdurazno();
