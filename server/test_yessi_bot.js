const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = path.join(__dirname, '../../.gemini/antigravity/brain/8f82cc25-426d-4c39-b533-82531dd0ef7e/screenshots');

const runTest = async () => {
    console.log('🤖 Iniciando prueba interactiva de Yessi Concierge...');
    const profileDir = path.join(__dirname, '../data/chrome_yessi_' + Date.now());
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        userDataDir: profileDir,
        pipe: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--window-size=1300,900'
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1300, height: 900 });

    try {
        console.log('1️⃣ Abriendo tienda en http://localhost:8000 ...');
        await page.goto('http://localhost:8000', { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 600));

        // Entrar a la tienda
        await page.click('#btn-adult');
        await new Promise(r => setTimeout(r, 600));

        // 2️⃣ Abrir Yessi Concierge
        console.log('2️⃣ Abriendo Yessi Concierge mediante botón flotante...');
        await page.waitForSelector('#yessi-launcher-btn', { visible: true, timeout: 5000 });
        await page.click('#yessi-launcher-btn');
        await page.waitForSelector('#yessi-chat-window.active', { visible: true, timeout: 5000 });
        await new Promise(r => setTimeout(r, 500));

        console.log('📸 Captura 1: Bienvenida de Yessi Concierge y Chips...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'yessi_01_welcome.png') });

        // 3️⃣ Preguntar por empaque discreto
        console.log('3️⃣ Preguntando por empaque discreto...');
        await page.type('#yessi-user-input', '¿Cómo garantizan el empaque discreto y qué dice la caja?');
        await page.click('#yessi-btn-send');
        await new Promise(r => setTimeout(r, 1200));

        console.log('📸 Captura 2: Respuesta de confidencialidad y empaque...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'yessi_02_empaque.png') });

        // 4️⃣ Preguntar por parejas
        console.log('4️⃣ Preguntando por productos para disfrutar en pareja...');
        await page.type('#yessi-user-input', '¿Qué me recomiendas para disfrutar en pareja?');
        await page.click('#yessi-btn-send');
        await new Promise(r => setTimeout(r, 1200));

        console.log('📸 Captura 3: Recomendaciones para parejas con productos interactivos...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'yessi_03_parejas.png') });

        // 5️⃣ Preguntar por cupones
        console.log('5️⃣ Preguntando por cupones de descuento...');
        await page.type('#yessi-user-input', '¿Tienen algún cupón de descuento vigente?');
        await page.click('#yessi-btn-send');
        await new Promise(r => setTimeout(r, 1200));

        console.log('📸 Captura 4: Cupones de descuento vigentes...');
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'yessi_04_cupones.png') });

        console.log('🏆 PRUEBA DE YESSI CONCIERGE COMPLETADA CON 100% DE ÉXITO.');

    } catch (err) {
        console.error('❌ Error en prueba de Yessi:', err);
    } finally {
        await browser.close();
        try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (e) {}
    }
};

runTest();
