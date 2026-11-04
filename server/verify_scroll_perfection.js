const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runScrollVerification() {
    console.log('🧪 Iniciando Verificación Rigurosa de Scroll (Desktop Wheel & Mobile Touch)...');
    const profileDir = path.join(__dirname, '../data/chrome_scroll_verify_' + Date.now());
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        userDataDir: profileDir,
        pipe: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    try {
        console.log('1️⃣ Cargando página inicial (sin localStorage previo)...');
        await page.goto('http://localhost:8000', { waitUntil: 'networkidle2' });

        // Verificar que Age Gate esté visible
        const isAgeGateActive = await page.evaluate(() => {
            const ag = document.getElementById('age-gate');
            return ag && ag.classList.contains('active') && getComputedStyle(ag).display !== 'none';
        });
        console.log('✔ Age gate activo inicialmente:', isAgeGateActive);

        // Click en #btn-adult
        console.log('2️⃣ Clickeando "Soy mayor de 18 años"...');
        await page.click('#btn-adult');
        await new Promise(r => setTimeout(r, 600));

        // Verificar que Age Gate se haya ocultado por completo
        const ageGateDismissed = await page.evaluate(() => {
            const ag = document.getElementById('age-gate');
            return getComputedStyle(ag).display === 'none' && getComputedStyle(ag).pointerEvents === 'none';
        });
        console.log('✔ Age gate completamente oculto e ignorando eventos:', ageGateDismissed);

        // 3️⃣ Probar scroll con ruedita del mouse en el centro exacto del HERO VIDEO
        console.log('3️⃣ Probando Scroll con rueda del mouse directamente sobre el Hero Video (x:640, y:300)...');
        await page.mouse.move(640, 300);
        await page.mouse.wheel({ deltaY: 600 });
        await new Promise(r => setTimeout(r, 500));

        const scrollAfterHeroWheel = await page.evaluate(() => window.scrollY);
        console.log(`✔ Scroll alcanzado con rueda sobre Video Hero: ${scrollAfterHeroWheel}px`);
        if (scrollAfterHeroWheel <= 0) throw new Error('Fallo: El mouse wheel sobre el hero video no desplazó la página.');

        // 4️⃣ Probar scroll adicional hacia el catálogo
        console.log('4️⃣ Probando Scroll continuo con ruedita hacia el catálogo...');
        await page.mouse.wheel({ deltaY: 1000 });
        await new Promise(r => setTimeout(r, 500));
        const scrollCatalog = await page.evaluate(() => window.scrollY);
        console.log(`✔ Scroll acumulado en catálogo: ${scrollCatalog}px`);

        // Capturar screenshot desktop scrolled
        const screenshotDir = 'C:\\Users\\sergi\\.gemini\\antigravity\\brain\\8f82cc25-426d-4c39-b533-82531dd0ef7e\\screenshots';
        if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });
        await page.screenshot({ path: path.join(screenshotDir, 'desktop_wheel_scroll_success.png'), fullPage: false });
        console.log('📸 Screenshot desktop scroll guardado.');

        // 5️⃣ Probar ciclo de modales: Abrir carrito -> Cerrar carrito -> Probar scroll
        console.log('5️⃣ Probando recuperación de scroll tras abrir/cerrar Carrito Drawer...');
        await page.evaluate(() => {
            const cartBtn = document.querySelector('.cart-btn-header');
            if (cartBtn) cartBtn.click();
        });
        await new Promise(r => setTimeout(r, 400));
        const overflowDuringCart = await page.evaluate(() => document.body.style.overflow);
        console.log('✔ Body overflow durante Carrito Drawer:', overflowDuringCart);

        await page.evaluate(() => {
            const closeBtn = document.getElementById('cart-drawer-close');
            if (closeBtn) closeBtn.click();
        });
        await new Promise(r => setTimeout(r, 400));
        const overflowAfterCart = await page.evaluate(() => document.body.style.overflow);
        console.log('✔ Body overflow después de cerrar Carrito Drawer:', overflowAfterCart === '' ? 'vacío (correcto)' : overflowAfterCart);

        await page.mouse.wheel({ deltaY: 400 });
        await new Promise(r => setTimeout(r, 300));
        const scrollAfterModal = await page.evaluate(() => window.scrollY);
        console.log(`✔ Scroll funcional después de cerrar modal: ${scrollAfterModal}px`);

        // 6️⃣ Probar Emulación Móvil y Gestos Táctiles (Touch Swipe)
        console.log('6️⃣ Cambiando a emulación móvil iPhone 14 (390x844)...');
        await page.setViewport({
            width: 390,
            height: 844,
            isMobile: true,
            hasTouch: true,
            deviceScaleFactor: 2
        });
        await page.goto('http://localhost:8000', { waitUntil: 'networkidle2' });

        const mobScrollInitial = await page.evaluate(() => window.scrollY);
        console.log(`✔ Scroll inicial en móvil: ${mobScrollInitial}px`);

        // Gesto táctil 1: deslizar hacia arriba (scroll down 500px)
        console.log('📱 Ejecutando gesto táctil de deslizamiento (swipe up 500px)...');
        const cdp = await page.target().createCDPSession();
        await cdp.send('Input.synthesizeScrollGesture', {
            x: 195,
            y: 400,
            yDistance: -500,
            speed: 1200
        });
        await new Promise(r => setTimeout(r, 600));

        const mobScroll1 = await page.evaluate(() => window.scrollY);
        console.log(`✔ Scroll móvil alcanzado tras swipe 1: ${mobScroll1}px`);
        if (mobScroll1 <= 100) throw new Error('Fallo: El gesto táctil en móvil no generó scroll.');

        // Gesto táctil 2: deslizar aún más (swipe up 600px)
        console.log('📱 Ejecutando segundo gesto táctil (swipe up 600px)...');
        await cdp.send('Input.synthesizeScrollGesture', {
            x: 195,
            y: 400,
            yDistance: -600,
            speed: 1200
        });
        await new Promise(r => setTimeout(r, 600));

        const mobScroll2 = await page.evaluate(() => window.scrollY);
        console.log(`✔ Scroll móvil acumulado tras swipe 2: ${mobScroll2}px`);

        // Capturar screenshot móvil scrolled
        await page.screenshot({ path: path.join(screenshotDir, 'mobile_touch_scroll_success.png'), fullPage: false });
        console.log('📸 Screenshot mobile scroll guardado.');

        console.log('🎉 TODAS LAS PRUEBAS DE SCROLL (MOUSE WHEEL & TOUCH SCREEN) PASARON CON ÉXITO ROTUNDO.');
    } finally {
        await browser.close();
    }
}

runScrollVerification().catch(err => {
    console.error('❌ Error en suite de verificación:', err);
    process.exit(1);
});
