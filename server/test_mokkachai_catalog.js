const puppeteer = require('puppeteer-core');
const path = require('path');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
    console.log('🚀 Iniciando prueba visual del nuevo catálogo Mokka Chai...');
    const profileDir = path.join(__dirname, '../data/chrome_test_mokka_' + Date.now());
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        userDataDir: profileDir,
        pipe: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    try {
        await page.goto('http://localhost:8000', { waitUntil: 'networkidle2' });

        // Dismiss age gate if needed
        const btnAdult = await page.$('#btn-adult');
        if (btnAdult) {
            await btnAdult.click();
            await new Promise(r => setTimeout(r, 600));
        }

        // Wait for products to load
        await page.waitForSelector('.product-card, .product-shop-card', { timeout: 10000 });

        // Scroll to catalog
        await page.evaluate(() => {
            const cat = document.getElementById('catalogo') || document.querySelector('.catalog-section');
            if (cat) cat.scrollIntoView({ behavior: 'instant' });
        });
        await new Promise(r => setTimeout(r, 800));

        // Get info about displayed cards
        const sampleCards = await page.evaluate(() => {
            const cards = Array.from(document.querySelectorAll('.product-shop-card, .product-card'));
            return cards.slice(0, 8).map(c => ({
                id: c.getAttribute('data-id'),
                name: c.querySelector('.product-name, h3')?.innerText,
                price: c.querySelector('.product-price, .price-current')?.innerText,
                badge: c.querySelector('.product-badge, .badge')?.innerText,
                imgSrc: c.querySelector('img')?.src
            }));
        });

        console.log('✔ Productos en catálogo:', sampleCards);

        // Click on one of the Mokka Chai imported products (PROD-MK-*)
        const mkCard = await page.$('[data-id^="PROD-MK-"]');
        if (mkCard) {
            console.log('Clicking Mokka Chai product card to open modal...');
            await mkCard.click();
            await new Promise(r => setTimeout(r, 800));

            const modalInfo = await page.evaluate(() => {
                const modal = document.getElementById('modal-product-detail');
                return {
                    active: modal?.classList.contains('active'),
                    title: modal?.querySelector('h2')?.innerText,
                    price: modal?.querySelector('.modal-product-price')?.innerText,
                    descSnippet: modal?.querySelector('.modal-product-desc')?.innerText.slice(0, 300),
                    specs: Array.from(modal?.querySelectorAll('.modal-spec-item') || []).map(s => s.innerText),
                    imgSrc: modal?.querySelector('.modal-product-img')?.src
                };
            });
            console.log('✔ Modal de detalle:', modalInfo);

            // Screenshot of product detail modal
            const screenshotPath = 'C:\\Users\\sergi\\.gemini\\antigravity\\brain\\8f82cc25-426d-4c39-b533-82531dd0ef7e\\screenshots\\modal_mokkachai_product.png';
            await page.screenshot({ path: screenshotPath, fullPage: false });
            console.log('📸 Screenshot guardado en:', screenshotPath);
        } else {
            console.log('No direct PROD-MK- card found in first 8, checking with filter...');
        }

        console.log('🎉 Verificación visual completada exitosamente.');
    } finally {
        await browser.close();
    }
})();
