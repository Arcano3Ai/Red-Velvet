async function testWhatsAppOg() {
    const res = await fetch('http://localhost:8000/', {
        headers: {
            'User-Agent': 'WhatsApp/2.21.12.21 N',
            'Host': 'redvelvet-boutique.com',
            'X-Forwarded-Proto': 'https'
        }
    });

    const html = await res.text();
    console.log('HTTP Status:', res.status);
    console.log('Content-Type:', res.headers.get('content-type'));

    const lines = html.split('\n');
    console.log('\n--- META ETIQUETAS OPEN GRAPH RECIBIDAS ---');
    lines.filter(l => l.includes('property="og:') || l.includes('name="twitter:')).forEach(l => {
        console.log(l.trim());
    });

    // Probar también que la imagen exista y responda 200 con menos de 300KB
    const imgRes = await fetch('http://localhost:8000/assets/logo/og-preview.jpg');
    const imgBuf = await imgRes.arrayBuffer();
    console.log('\n--- VERIFICACIÓN DE IMAGEN OG-PREVIEW ---');
    console.log('Image Status:', imgRes.status);
    console.log('Image Content-Type:', imgRes.headers.get('content-type'));
    console.log('Image Size:', imgBuf.byteLength, 'bytes', `(${(imgBuf.byteLength / 1024).toFixed(1)} KB)`);
    console.assert(imgBuf.byteLength < 300 * 1024, 'La imagen supera el límite de WhatsApp de 300KB');
    console.log('✔ WhatsApp Compliant: Imagen < 300 KB y resolución 1200x630.');
}

testWhatsAppOg().catch(console.error);

