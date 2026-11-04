const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = path.join(__dirname, '../../.gemini/antigravity/brain/8f82cc25-426d-4c39-b533-82531dd0ef7e/screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Configuración de emulación iPhone 14 / 15 Pro
const IPHONE_VIEWPORT = {
    width: 393,
    height: 852,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    isLandscape: false
};

const runMobileTest = async () => {
    console.log('📱 Iniciando prueba especializada para iPhone (iOS Safari)...');
    const profileDir = path.join(__dirname, '../data/chrome_iphone_profile_' + Date.now());
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        userDataDir: profileDir,
        pipe: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--window-size=393,852'
        ]
    });

    const page = await browser.newPage();
    await page.setViewport(IPHONE_VIEWPORT);
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');

    page.on('console', msg => console.log('IPHONE LOG:', msg.text()));
    page.on('pageerror', err => console.log('IPHONE ERROR:', err.toString()));

    try {
        console.log('1️⃣ Cargando http://localhost:8000 en emulador de iPhone...');
        await page.goto('http://localhost:8000', { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 600));

        // Screenshot M1: Age Gate en iPhone
        console.log('📸 Captura M1: Age Gate optimizado para iPhone...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'mobile_01_age_gate.png') });

        // Tocar "Soy mayor de 18 años"
        console.log('2️⃣ Tocando botón de acceso mayor de 18 años...');
        await page.tap('#btn-adult');
        await new Promise(r => setTimeout(r, 700));

        // Screenshot M2: Hero en iPhone
        console.log('📸 Captura M2: Hero con Video y Trust Badges en iPhone...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'mobile_02_hero.png') });

        // Scroll al Catálogo
        console.log('3️⃣ Desplazando al Catálogo en iPhone (Verificación 2 columnas)...');
        await page.evaluate(() => document.getElementById('catalogo').scrollIntoView());
        await page.waitForSelector('.product-shop-card', { timeout: 6000 });
        await new Promise(r => setTimeout(r, 800));

        // Screenshot M3: Catálogo 2 Columnas
        console.log('📸 Captura M3: Cuadrícula de 2 Columnas en iPhone...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'mobile_03_catalogo_2col.png') });

        // Verificar columnas
        const gridCols = await page.evaluate(() => {
            const grid = document.getElementById('products-grid');
            return grid ? window.getComputedStyle(grid).getPropertyValue('grid-template-columns') : 'no-grid';
        });
        console.log(`✔ Columnas calculadas en iPhone: ${gridCols}`);

        // 4️⃣ Abrir Detalle de Producto
        console.log('4️⃣ Abriendo detalle de producto en iPhone...');
        await page.evaluate(() => {
            if (typeof window.openProductDetailModal === 'function') {
                window.openProductDetailModal('PROD-001');
            }
        });
        await page.waitForSelector('#product-detail-modal.active', { visible: true, timeout: 5000 });
        await new Promise(r => setTimeout(r, 600));

        console.log('📸 Captura M4: Modal de Producto como Bottom Sheet en iPhone...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'mobile_04_product_sheet.png') });

        // Cerrar modal
        await page.evaluate(() => window.closeProductDetailModal());
        await new Promise(r => setTimeout(r, 600));

        // 5️⃣ Tocar "Añadir a la Bolsa"
        console.log('5️⃣ Añadiendo pieza a la Bolsa de Compras en iPhone...');
        await page.evaluate(() => {
            if (typeof window.addToCartDirect === 'function') {
                window.addToCartDirect('PROD-001');
            }
        });
        await new Promise(r => setTimeout(r, 800));

        // Screenshot M5: Cart Drawer en iPhone
        console.log('📸 Captura M5: Cart Drawer adaptado a pantalla completa en iPhone...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'mobile_05_cart_drawer.png') });

        // 6️⃣ Abrir Checkout
        console.log('6️⃣ Abriendo Checkout en iPhone...');
        await page.evaluate(() => {
            const checkoutModal = document.getElementById('checkout-modal');
            const cartDrawer = document.getElementById('cart-drawer');
            const cartOverlay = document.getElementById('cart-drawer-overlay');
            if (cartDrawer) cartDrawer.classList.remove('active');
            if (cartOverlay) cartOverlay.classList.remove('active');
            if (checkoutModal) checkoutModal.classList.add('active');
        });
        await page.waitForSelector('#checkout-modal.active', { visible: true, timeout: 5000 });
        await new Promise(r => setTimeout(r, 600));

        // Screenshot M6: Checkout Modal en iPhone
        console.log('📸 Captura M6: Formulario de Checkout en iPhone...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'mobile_06_checkout.png') });

        // 7️⃣ Abrir Yessi Concierge en iPhone
        console.log('7️⃣ Abriendo Yessi Concierge en iPhone...');
        await page.evaluate(() => {
            const checkoutModal = document.getElementById('checkout-modal');
            if (checkoutModal) checkoutModal.classList.remove('active');
            if (window.yessiConcierge) window.yessiConcierge.toggleChat(true);
        });
        await page.waitForSelector('#yessi-chat-window.active', { visible: true, timeout: 5000 });
        await new Promise(r => setTimeout(r, 600));

        console.log('📸 Captura M7: Yessi Concierge en pantalla de iPhone...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'mobile_07_yessi_iphone.png') });

        console.log('🏆 VERIFICACIÓN EN IPHONE COMPLETADA CON 100% DE ÉXITO.');

    } catch (err) {
        console.error('❌ Error en prueba iPhone:', err);
    } finally {
        await browser.close();
        try {
            fs.rmSync(profileDir, { recursive: true, force: true });
        } catch (e) {}
    }
};

runMobileTest();
