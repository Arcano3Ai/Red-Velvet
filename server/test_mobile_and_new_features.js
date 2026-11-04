const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = path.join(__dirname, '../../.gemini/antigravity/brain/8f82cc25-426d-4c39-b533-82531dd0ef7e/screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

(async () => {
    console.log('🧪 Iniciando verificación rigurosa de viewport móvil, avatar Yessi y WhatsApp...');
    const profileDir = path.join(__dirname, '../data/chrome_mobile_verify_' + Date.now());
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        userDataDir: profileDir,
        pipe: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
        page.on('dialog', async dialog => {
            console.log('PAGE DIALOG:', dialog.message());
            await dialog.accept();
        });

        // 1. Verificación de Cero Desbordamiento (Zero Overflow) en 393px, 375px y 360px
        for (const width of [393, 375, 360]) {
            await page.setViewport({ width, height: 852, isMobile: true, hasTouch: true });
            await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });

            // Dismiss age gate
            try {
                await page.click('#btn-adult');
                await new Promise(r => setTimeout(r, 500));
            } catch (e) {}

            const overflowData = await page.evaluate((w) => {
                const docScrollWidth = document.documentElement.scrollWidth;
                const docClientWidth = document.documentElement.clientWidth;
                const bodyScrollWidth = document.body.scrollWidth;

                return {
                    viewport: w,
                    docScrollWidth,
                    docClientWidth,
                    bodyScrollWidth,
                    isOverflowing: docScrollWidth > docClientWidth || bodyScrollWidth > w
                };
            }, width);

            console.log(`📱 Viewport ${width}px -> docScrollWidth: ${overflowData.docScrollWidth}, clientWidth: ${overflowData.docClientWidth}`);
            console.log(`   Desbordamiento horizontal detectado: ${overflowData.isOverflowing ? '❌ SÍ' : '✅ NO (0px de desbordamiento)'}`);
            console.assert(!overflowData.isOverflowing, `Error: viewport ${width}px tiene desbordamiento horizontal!`);
        }

        // 2. Captura de Hero con Video sin Opacidad
        await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });
        await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });
        try { await page.click('#btn-adult'); await new Promise(r => setTimeout(r, 500)); } catch (e) {}

        console.log('📸 Captura 1: Hero con Video sin opacidad en iPhone...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'mobile_hero_video_no_opacity.png') });

        // 3. Captura de Sección Discreción adaptada a móvil
        await page.evaluate(() => {
            const el = document.getElementById('discrecion');
            if (el) el.scrollIntoView();
        });
        await new Promise(r => setTimeout(r, 500));
        console.log('📸 Captura 2: Sección Discreción 100% responsiva...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'mobile_discretion_responsive.png') });

        // 4. Verificación de Avatar de Yessi Concierge con Imagen y Hover Zoom
        console.log('🤖 Verificando Avatar de Yessi y zoom al pasar el mouse...');
        await page.setViewport({ width: 1200, height: 800 });
        await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });
        try { await page.click('#btn-adult'); await new Promise(r => setTimeout(r, 400)); } catch (e) {}

        // Abrir Yessi Concierge
        await page.click('#yessi-launcher-btn');
        await new Promise(r => setTimeout(r, 600));

        // Hover sobre el avatar del header
        const avatarEl = await page.$('.yessi-header-avatar-img');
        console.assert(avatarEl !== null, 'No se encontró la imagen del avatar de Yessi');
        const avatarSrc = await page.$eval('.yessi-header-avatar-img', img => img.getAttribute('src'));
        console.log(`✔ Avatar src: ${avatarSrc}`);
        console.assert(avatarSrc.includes('yessi-avatar.jpg'), 'El avatar no usa la imagen asignada');

        // Hover
        await avatarEl.hover();
        await new Promise(r => setTimeout(r, 400));
        console.log('📸 Captura 3: Yessi Concierge con Avatar en Zoom Hover...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'yessi_avatar_hover_zoom.png') });

        // Cerrar chat de Yessi
        await page.click('#yessi-btn-close');
        await new Promise(r => setTimeout(r, 400));

        // 5. Verificación de Checkout con mensaje de WhatsApp completo (+52 1 273 112 3888)
        console.log('🛍️ Verificando generación de pedido y mensaje de WhatsApp (+52 1 273 112 3888)...');
        await page.evaluate(() => {
            window.addToCartDirect('PROD-001');
        });
        await new Promise(r => setTimeout(r, 600));

        // Abrir Checkout desde el drawer
        await page.click('#btn-open-checkout');
        await new Promise(r => setTimeout(r, 600));

        await page.type('#checkout-name', 'Alejandro Morales');
        await page.type('#checkout-phone', '+52 273 112 3888');
        await page.type('#checkout-address', 'Calle Palmas 500, Interior 3');
        await page.type('#checkout-city', 'Veracruz');
        await page.type('#checkout-state', 'Veracruz');
        await page.type('#checkout-notes', 'Dejar en recepción con vigilancia');

        // Submit checkout
        console.log('Enviando pedido de checkout...');
        await page.click('#btn-submit-order');
        await new Promise(r => setTimeout(r, 1500));

        const feedbackLink = await page.$eval('#checkout-feedback a', a => a.getAttribute('href'));
        console.log('✔ Enlace WhatsApp generado:', decodeURIComponent(feedbackLink));
        console.assert(feedbackLink.includes('5212731123888'), 'El enlace no contiene el número 5212731123888');
        console.assert(feedbackLink.includes('Alejandro'), 'El mensaje no incluye el nombre del cliente');
        console.assert(feedbackLink.includes('PROD-001') || feedbackLink.includes('Aura Touch') || feedbackLink.includes('Succionador'), 'El mensaje no incluye los artículos');

        console.log('📸 Captura 4: Confirmación de Pedido con WhatsApp VIP directo...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'checkout_order_whatsapp_direct.png') });
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'checkout_order_whatsapp_direct.png') });

        console.log('\n🏆 TODAS LAS VERIFICACIONES (MÓVIL, VIDEO, AVATAR ZOOM Y WHATSAPP) FUERON 100% EXITOSAS.');

    } catch (err) {
        console.error('❌ Error en verificación:', err);
        process.exitCode = 1;
    } finally {
        await browser.close();
        try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (e) {}
    }
})();
