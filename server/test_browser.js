const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = path.join(__dirname, '../../.gemini/antigravity/brain/8f82cc25-426d-4c39-b533-82531dd0ef7e/screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const runBrowserTest = async () => {
    console.log('🌐 Iniciando navegador Chrome headless en:', CHROME_PATH);
    const profileDir = path.join(__dirname, '../data/chrome_test_profile_' + Date.now());
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        userDataDir: profileDir,
        pipe: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--window-size=1400,900'
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });

    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));

    try {
        console.log('1️⃣ Navegando a http://localhost:8000 ...');
        await page.goto('http://localhost:8000', { waitUntil: 'domcontentloaded' });

        // Screenshot 1: Age Gate
        console.log('📸 Captura 1: Age Gate (+18 verificación)...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_age_gate.png') });

        // Clic en "Soy mayor de 18 años"
        console.log('2️⃣ Verificando mayoría de edad...');
        await page.click('#btn-adult');
        await new Promise(r => setTimeout(r, 600));

        // Screenshot 2: Storefront Hero & Trust Bar
        console.log('📸 Captura 2: Hero y Pilares de Confidencialidad...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_storefront_hero.png') });

        // Screenshot 2B: El Ritual Velvet
        console.log('📸 Captura 2B: El Ritual Velvet...');
        await page.evaluate(() => {
            const ritual = document.getElementById('ritual');
            if (ritual) ritual.scrollIntoView();
        });
        await new Promise(r => setTimeout(r, 600));
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02b_ritual_velvet.png') });

        // 3️⃣ Scroll a Catálogo y verificar productos cargados
        console.log('3️⃣ Verificando carga dinámica del catálogo de 28 productos...');
        await page.evaluate(() => document.getElementById('catalogo').scrollIntoView());
        await page.waitForSelector('.product-shop-card', { timeout: 5000 });

        const productCardsCount = await page.evaluate(() => document.querySelectorAll('.product-shop-card').length);
        console.log(`✔ Tarjetas de producto renderizadas en DOM: ${productCardsCount}`);
        console.assert(productCardsCount >= 28, `Esperadas >= 28 tarjetas, encontradas: ${productCardsCount}`);

        // Screenshot 3: Catálogo General
        console.log('📸 Captura 3: Catálogo Maestro...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_catalogo_maestro.png') });

        // 4️⃣ Probar filtro de categorías
        console.log('4️⃣ Filtrando por categoría "Pleasure Tech"...');
        await page.click('.cat-pill[data-category="Pleasure Tech"]');
        await new Promise(r => setTimeout(r, 500));
        const filteredCount = await page.evaluate(() => document.querySelectorAll('.product-shop-card').length);
        console.log(`✔ Productos en categoría Pleasure Tech: ${filteredCount}`);

        // 5️⃣ Probar Modal de Detalle / Specs
        console.log('5️⃣ Abriendo vista rápida de producto...');
        const firstQuickBtn = await page.$('.product-quick-view-btn');
        if (firstQuickBtn) {
            await firstQuickBtn.click();
            await page.waitForSelector('.product-modal-container', { visible: true });
            await new Promise(r => setTimeout(r, 400));
            console.log('📸 Captura 4: Modal de Especificaciones Médicas y Notas Sensoriales...');
            await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_product_detail_modal.png') });

            // Cerrar modal
            await page.click('#product-modal-close');
            await new Promise(r => setTimeout(r, 400));
        }

        // 6️⃣ Añadir productos a la bolsa de compras
        console.log('6️⃣ Añadiendo piezas a la bolsa de compra...');
        await page.click('.cat-pill[data-category="all"]'); // volver a todos
        await new Promise(r => setTimeout(r, 400));

        const addButtons = await page.$$('.btn-add-to-bag');
        if (addButtons.length >= 2) {
            await addButtons[0].click(); // Añade producto 1
            await new Promise(r => setTimeout(r, 500));
        }

        // Verificar Drawer abierto y badge
        const badgeCount = await page.$eval('#header-cart-badge', el => el.textContent.trim());
        console.log(`✔ Artículos en badge del carrito: ${badgeCount}`);

        // Probar aplicación de cupón VELVET10
        console.log('7️⃣ Aplicando cupón de descuento VELVET10 en la bolsa...');
        await page.type('#cart-coupon-input', 'VELVET10');
        await page.click('#btn-apply-coupon');
        await new Promise(r => setTimeout(r, 600));

        console.log('📸 Captura 5: Bolsa de Compras reactiva con descuento...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_cart_drawer_discount.png') });

        // 8️⃣ Proceder al Checkout
        console.log('8️⃣ Abriendo Checkout confidencial...');
        await page.click('#btn-open-checkout');
        await page.waitForSelector('#checkout-modal', { visible: true });
        await new Promise(r => setTimeout(r, 400));

        // Llenar formulario de entrega discreta
        await page.type('#checkout-name', 'Elena Morales');
        await page.type('#checkout-phone', '+52 81 9876 5432');
        await page.type('#checkout-address', 'Av. Roble 660, Depto 12A');
        await page.type('#checkout-city', 'San Pedro Garza García');
        await page.type('#checkout-state', 'Nuevo León');
        await page.type('#checkout-notes', 'Caja neutra con sello ciego');

        console.log('📸 Captura 6: Formulario de Checkout Confidencial...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_checkout_form.png') });

        // Confirmar pedido
        console.log('9️⃣ Confirmando pedido seguro...');
        await page.click('#btn-submit-order');
        await page.waitForSelector('#checkout-feedback a', { visible: true, timeout: 8000 });
        await new Promise(r => setTimeout(r, 500));

        console.log('📸 Captura 7: Confirmación de Pedido con Concierge WhatsApp...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_order_confirmed.png') });

        // 🔟 Navegar y probar Suite Administrativa (admin.html)
        console.log('🔟 Navegando a Suite Ejecutiva (admin.html)...');
        await page.goto('http://localhost:8000/admin.html', { waitUntil: 'networkidle0' });

        console.log('📸 Captura 8: Pantalla de Login Suite Ejecutiva...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_admin_login.png') });

        // Clic rápido demo login
        await page.click('#btn-quick-demo');
        await page.waitForSelector('#admin-dashboard-suite', { visible: true, timeout: 5000 });
        await new Promise(r => setTimeout(r, 800));

        console.log('📸 Captura 9: Dashboard Resumen Ejecutivo con Métricas en Vivo...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09_admin_dashboard_overview.png') });

        // Ver pestaña Pedidos
        await page.click('button[data-view="view-orders"]');
        await new Promise(r => setTimeout(r, 600));

        console.log('📸 Captura 10: Control de Envíos y Pedidos Discretos...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10_admin_orders_list.png') });

        // Ver pestaña Catálogo de Productos
        await page.click('button[data-view="view-products"]');
        await new Promise(r => setTimeout(r, 600));

        console.log('📸 Captura 11: Catálogo de Productos en Administración...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '11_admin_products_crud.png') });

        console.log('\n🏆 PRUEBA EN NAVEGADOR COMPLETADA CON 100% DE ÉXITO.');
    } catch (err) {
        console.error('❌ Error durante la prueba en navegador:', err);
        process.exitCode = 1;
    } finally {
        await browser.close();
    }
};

runBrowserTest();

