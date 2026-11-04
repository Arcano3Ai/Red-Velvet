const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function buildBoutiqueOg() {
    const inputPath = path.join(__dirname, '../assets/logo/logooficial.jpeg');
    const outputPath = path.join(__dirname, '../assets/logo/og-preview.jpg');

    // 1. Redimensionar el fondo original con el tacón y 'RED VELVET' a 1200x630
    const baseBuffer = await sharp(inputPath)
        .resize(1200, 630, { fit: 'cover', position: 'center' })
        .toBuffer();

    // 2. Parche SVG elegante para armonizar el subtítulo hacia Sex Shop / Boutique de Bienestar Íntimo
    const svgOverlay = Buffer.from(`
        <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="patchGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#0c0205" stop-opacity="1"/>
                    <stop offset="50%" stop-color="#0e0205" stop-opacity="0.99"/>
                    <stop offset="80%" stop-color="#140307" stop-opacity="0.95"/>
                    <stop offset="100%" stop-color="#160308" stop-opacity="0"/>
                </radialGradient>
            </defs>
            <ellipse cx="600" cy="520" rx="320" ry="70" fill="url(#patchGrad)" />
            <text x="600" y="500" 
                  font-family="'Playfair Display', Georgia, serif" 
                  font-size="25" 
                  font-weight="bold"
                  letter-spacing="5" 
                  fill="#D4AF37" 
                  text-anchor="middle">LUXURY EROTIC BOUTIQUE</text>
            <text x="600" y="534" 
                  font-family="'Inter', -apple-system, sans-serif" 
                  font-size="13" 
                  letter-spacing="4" 
                  fill="#C5A059" 
                  text-anchor="middle">DISPOSITIVOS DE AUTOR &amp; BIENESTAR ÍNTIMO</text>
        </svg>
    `);

    await sharp(baseBuffer)
        .composite([{ input: svgOverlay, top: 0, left: 0 }])
        .jpeg({ quality: 88, mozjpeg: true })
        .toFile(outputPath);

    const stats = fs.statSync(outputPath);
    console.log('✅ Banner Open Graph optimizado para WhatsApp creado exitosamente:', outputPath);
    console.log('📦 Tamaño:', stats.size, 'bytes (Óptimo: <300 KB)');
}

buildBoutiqueOg().catch(err => {
    console.error('Error generando OG image:', err);
    process.exit(1);
});
