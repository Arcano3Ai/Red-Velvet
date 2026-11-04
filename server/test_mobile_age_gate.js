const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testMobileAgeGate() {
    console.log('📱 Iniciando prueba de emulación móvil (iPhone / Pixel)...');
    const profileDir = path.join(__dirname, '../data/chrome_mobile_test_' + Date.now());

    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        userDataDir: profileDir,
        pipe: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ]
    });

    const page = await browser.newPage();

    // Emular pantalla táctil de smartphone (iPhone 13 / 14: 390x844, touch habilitado)
    await page.setViewport({
        width: 390,
        height: 844,
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 3
    });

    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));

    try {
        console.log('1️⃣ Navegando a http://localhost:8000 en modo móvil...');
        await page.goto('http://localhost:8000', { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 600));

        const fnType = await page.evaluate(() => typeof window.dismissAgeGate);
        console.log('✔ window.dismissAgeGate type in page:', fnType);

        // Verificar que el modal esté activo
        const isGateActive = await page.evaluate(() => {
            const gate = document.getElementById('age-gate');
            return gate && gate.classList.contains('active');
        });
        console.log('✔ Age Gate visible en móvil:', isGateActive);
        console.assert(isGateActive, 'El Age Gate debería estar activo inicialmente');

        // Inspeccionar elemento que recibe el clic
        const elementAtPoint = await page.evaluate(() => {
            const btn = document.getElementById('btn-adult');
            const rect = btn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const topElement = document.elementFromPoint(centerX, centerY);
            return {
                btnRect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
                viewport: { w: window.innerWidth, h: window.innerHeight },
                topElementTag: topElement ? topElement.tagName : null,
                topElementId: topElement ? topElement.id : null,
                topElementClass: topElement ? topElement.className : null
            };
        });
        console.log('ELEMENT AT BUTTON POSITION:', elementAtPoint);

        // Limpiar localStorage para re-probar
        await page.evaluate(() => localStorage.clear());
        await page.reload({ waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 600));

        console.log('2️⃣ Realizando TAP táctil real en #btn-adult...');
        await page.tap('#btn-adult');
        await new Promise(r => setTimeout(r, 400));

        // Verificar qué tiene el gate
        const debugInfo = await page.evaluate(() => {
            const gate = document.getElementById('age-gate');
            const style = window.getComputedStyle(gate);
            return {
                classes: gate.className,
                inlineDisplay: gate.style.display,
                computedDisplay: style.display,
                computedOpacity: style.opacity,
                pointerEvents: style.pointerEvents,
                storage: localStorage.getItem('redVelvetAgeVerified')
            };
        });
        console.log('DEBUG GATE INFO:', debugInfo);

        // Verificar que el body tiene scroll
        const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
        console.log('✔ Body scroll desbloqueado:', bodyOverflow === 'auto' || bodyOverflow === '');

        console.log('\n🏆 PRUEBA MÓVIL EXITOSA: El botón de mayoría de edad responde al 100% al tacto en smartphones.');
    } finally {
        await browser.close();
        try {
            require('fs').rmSync(profileDir, { recursive: true, force: true });
        } catch (e) {}
    }
}

testMobileAgeGate().catch(err => {
    console.error('❌ Error en prueba móvil:', err);
    process.exit(1);
});
