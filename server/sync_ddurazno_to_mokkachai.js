const fs = require('fs');
const path = require('path');
const { query, initDatabase } = require('./db/database');

function mapToLuxuryCategory(ddCat, name) {
    const text = `${ddCat || ''} ${name || ''}`.toLowerCase();
    if (text.includes('lencer') || text.includes('babydoll') || text.includes('body')) {
        return 'Fine Lingerie';
    }
    if (
        text.includes('lubricante') ||
        text.includes('aceite') ||
        text.includes('potencia') ||
        text.includes('intensificador') ||
        text.includes('feromona') ||
        text.includes('crema') ||
        text.includes('retardante') ||
        text.includes('especiales') ||
        text.includes('semen') ||
        text.includes('vigor') ||
        text.includes('boss')
    ) {
        return 'Sensory Care';
    }
    if (
        text.includes('arnés') ||
        text.includes('arnes') ||
        text.includes('despedida') ||
        text.includes('dados') ||
        text.includes('fusta') ||
        text.includes('antifaz') ||
        text.includes('bondage')
    ) {
        return 'Soft Fetish';
    }
    if (text.includes('pareja') || text.includes('paquete pareja')) {
        return 'Couples';
    }
    // Default to Pleasure Tech (vibradores, dildos, anillos, anales, masturbadores, etc.)
    return 'Pleasure Tech';
}

function cleanSlug(name, id) {
    const base = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    return `${base || 'producto'}-${id}`;
}

function generateElegantSubtitle(p, category) {
    const name = p.name.toLowerCase();
    if (category === 'Fine Lingerie') {
        return 'Prenda íntima de alta costura, diseño sensual y caricia envolvente.';
    }
    if (category === 'Sensory Care') {
        if (name.includes('aceite')) return 'Fórmula botánica de textura sedosa y calidez progresiva para despertar cada poro.';
        if (name.includes('lubricante') || name.includes('semen')) return 'Hidratación pura y biocompatible para un deslizamiento sublime de larga duración.';
        if (name.includes('potencia') || name.includes('boss')) return 'Formulación vigorizante de extractos naturales para maximizar energía, resistencia y firmeza.';
        if (name.includes('feromona')) return 'Esencia cautivadora con acordes magnéticos para intensificar la atracción y la presencia.';
        return 'Elixir de cuidado íntimo formulado para intensificar la sensibilidad táctil.';
    }
    if (category === 'Soft Fetish') {
        return 'Herramienta de complicidad y exploración sensorial con acabados suaves al contacto.';
    }
    if (category === 'Couples') {
        return 'Set exclusivo curado para enriquecer la intimidad y sincronizar el deseo en pareja.';
    }
    // Pleasure Tech
    if (name.includes('anillo')) return 'Anillo ergonómico de soporte continuo para intensificar sensaciones y prolongar el clímax.';
    if (name.includes('plug') || name.includes('anal')) return 'Silueta suave y anatómica concebida para una exploración gradual y placentera.';
    if (name.includes('masturbador')) return 'Cámara sensorial de textura biomimética ultrarrealista y adaptación térmica natural.';
    if (name.includes('app')) return 'Tecnología inteligente con control inalámbrico a distancia para conexión sin fronteras.';
    if (name.includes('vibrador') || name.includes('bala') || name.includes('dildo')) {
        return 'Estimulación precisa de frecuencias silenciosas y tacto aterciopelado para placer sublime.';
    }
    return 'Dispositivo íntimo de ingeniería sensorial y tacto aterciopelado grado médico.';
}

function generateElegantDescription(p, category, subtitle) {
    let raw = p.description || '';
    // Strip supplier texts
    raw = raw
        .replace(/Envío discreto a todo México; entrega el mismo día en Monterrey y Torreón\.?/gi, '')
        .replace(/Ddurazno/gi, 'Mokka Chai')
        .replace(/Cod\.\s*[A-Z0-9-]+/gi, '')
        .replace(/—\s*(?:Vibradores|Anillos|Anales|Lencería|Especiales|Dildos|Masturbadores|Lubricantes|Feromonas|Potencia Sexual|Accesorios y Despedidas)/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim();

    let elegantIntro = '';
    if (category === 'Pleasure Tech') {
        elegantIntro = `Diseñado bajo la filosofía de placer consciente y bienestar íntimo de Mokka Chai, este dispositivo conjuga ingeniería de precisión con materiales de la más alta pureza médica biocompatible. Su silueta anatómica y acabado soft-touch aterciopelado garantizan una respuesta táctil inmediata y segura, mientras sus patrones de estimulación operan bajo ingeniería de absorción acústica Whisper-Quiet.`;
    } else if (category === 'Sensory Care') {
        elegantIntro = `Creado como parte del ritual de autocuidado y conexión sensorial de Mokka Chai, esta fórmula dermocosmética equilibra pureza botánica y sedosidad absoluta. Su textura respeta el pH y manto hidrolipídico íntimo, potenciando la receptividad al tacto con una experiencia cálida, envolvente y placentera.`;
    } else if (category === 'Fine Lingerie') {
        elegantIntro = `Una pieza de lencería íntima que celebra las curvas, la belleza y la sofisticación. Confeccionada con telas de tacto sedoso, encajes elásticos y cortes ergonómicos que acarician la piel con delicadeza absoluta en momentos de intimidad especial.`;
    } else if (category === 'Couples') {
        elegantIntro = `Un ritual curado para parejas que buscan profundizar su intimidad y explorar nuevas dimensiones de placer compartido. Cada elemento ha sido seleccionado para despertar la complicidad y el disfrute mutuo.`;
    } else {
        elegantIntro = `Curado cuidadosamente para la colección íntima de Mokka Chai, esta pieza invita a la complicidad, la exploración de límites y la entrega a los sentidos con total seguridad, confort y elegancia.`;
    }

    const privacyParagraph = `🔒 Compromiso de Privacidad Absoluta Mokka Chai: Cada pedido se envía en empaque 100% ciego, neutro y confidencial, sin logotipos, marcas externas ni descripciones del contenido. Máxima discreción garantizada en toda la República Mexicana.`;

    const cleanRaw = raw.length > 25 && !raw.toLowerCase().includes('anillos de pene') ? `\n\n${raw}` : '';
    return `${subtitle}${cleanRaw}\n\n${elegantIntro}\n\n${privacyParagraph}`;
}

function determineSensoryNotes(p, category) {
    const name = p.name.toLowerCase();
    if (category === 'Sensory Care') {
        if (name.includes('caliente') || name.includes('fuego') || name.includes('termico')) {
            return 'Calidez termodinámica progresiva, aroma sutil afrodisíaco y deslizamiento sedoso sin sensación pegajosa.';
        }
        if (name.includes('potencia') || name.includes('boss')) {
            return 'Extractos botánicos bioactivos (Damiana, L-Arginina, Maca), vigorización sostenida y alta biodisponibilidad.';
        }
        return 'Textura fluida ultradeslizante, hidratación celular prolongada y pH balanceado biocompatible.';
    }
    if (category === 'Fine Lingerie') {
        return 'Satén líquido sedoso, encaje floral hipoalergénico y ajuste adaptable que no marca ni oprime.';
    }
    if (category === 'Soft Fetish') {
        return 'Tacto suave con forro afelpado, herrajes pulidos de tono dorado y bordes con costura de seguridad.';
    }
    // Pleasure Tech
    if (name.includes('metal') || name.includes('metálico')) {
        return 'Acabado en aleación metálica pulida espejo, retención térmica para juego de temperaturas y peso balanceado.';
    }
    return 'Silicona médica ultrasuave de tacto aterciopelado (Silky Touch), motor Whisper-Quiet <38dB y biocompatibilidad certificada.';
}

function determineBadge(price, category, name) {
    const n = name.toLowerCase();
    if (price >= 2000) return 'Mokka Chai Selección Oro';
    if (price >= 1000) return 'Boutique Preferente';
    if (n.includes('app') || n.includes('smart')) return 'Smart Tech App';
    if (n.includes('caliente') || n.includes('fuego')) return 'Efecto Térmico';
    if (category === 'Sensory Care') return 'Elixir Sensorial';
    if (category === 'Fine Lingerie') return 'Alta Costura';
    if (n.includes('plug') || n.includes('anal')) return 'Anatomía Ergonómica';
    return 'Colección Mokka Chai';
}

function getBestImages(p) {
    const pId = p.dduraznoId;
    const directMatches = (p.images || []).filter(img => 
        !img.includes('brand-icon') && 
        (img.includes(`/${pId}-`) || img.includes(`/${pId}.`))
    );

    let mainPhoto = p.jsonLd?.image || directMatches[0] || (p.images || []).find(img => !img.includes('brand-icon'));
    if (!mainPhoto && p.images && p.images.length > 0) mainPhoto = p.images[0];

    const allValid = [mainPhoto, ...directMatches, ...(p.images || [])]
        .filter((v, i, a) => v && !v.includes('brand-icon') && a.indexOf(v) === i);

    return {
        main: mainPhoto,
        gallery: allValid
    };
}

async function syncDduraznoToMokkaChai() {
    await initDatabase();
    console.log('✨ Iniciando sincronización de catálogo mayorista Ddurazno a Mokka Chai (+20% precio público)...');

    const rawPath = path.join(__dirname, 'ddurazno_scraped_raw.json');
    if (!fs.existsSync(rawPath)) {
        console.error('No se encontró server/ddurazno_scraped_raw.json');
        return;
    }

    const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
    console.log(`Cargados ${raw.length} productos brutos.`);

    // Desactivar productos previos de Erectus para dejar activo el inventario real del mayorista
    const deactRes = await query.run(`UPDATE products SET is_active = 0 WHERE id LIKE 'PROD-E-%'`);
    console.log(`✔ Productos anteriores de Erectus desactivados (is_active = 0) para priorizar el catálogo del mayorista actual.`);

    let inserted = 0;
    const processed = [];

    for (let i = 0; i < raw.length; i++) {
        const item = raw[i];
        const wholesalePrice = parseFloat(item.price) || 199;
        // Precio público con 20% más
        const retailPrice = Math.round(wholesalePrice * 1.20);
        // Compare price elegante (~25% sobre el precio de venta)
        const comparePrice = Math.round(retailPrice * 1.25);

        const category = mapToLuxuryCategory(item.category, item.name);
        const id = `PROD-MK-${item.dduraznoId}`;
        const slug = cleanSlug(item.name, item.dduraznoId);
        const subtitle = generateElegantSubtitle(item, category);
        const description = generateElegantDescription(item, category, subtitle);
        const sensoryNotes = determineSensoryNotes(item, category);
        const badge = determineBadge(retailPrice, category, item.name);
        const imgs = getBestImages(item);

        const specs = {
            marca: 'Mokka Chai Intimate Boutique',
            sku: item.sku || `MK-${item.dduraznoId}`,
            categoria_original: item.category,
            materiales: category === 'Fine Lingerie' 
                ? 'Encaje elástico floral & microfibra de seda biocompatible'
                : (item.name.toLowerCase().includes('metal') ? 'Aleación de zinc pulida hipoalergénica' : 'Silicona líquida médica grado quirúrgico & ABS'),
            acabado: 'Tacto aterciopelado Soft-Touch',
            empaque: '100% Ciego & Confidencial (Sin logos ni referencias externas)',
            envio: 'Discreto con guía privada a todo México',
            bioseguridad: 'Material 100% seguro para el cuerpo, libre de ftalatos y látex',
            garantia: 'Garantía de Satisfacción & Bioseguridad Mokka Chai',
            concierge: 'Asesoría Confidencial WhatsApp (+52 81 2191 2778)'
        };

        const isFeatured = retailPrice > 1200 || item.name.toLowerCase().includes('app') || i < 15 ? 1 : 0;

        await query.run(`
            INSERT OR REPLACE INTO products (
                id, name, slug, category, subtitle, price, compare_price,
                stock, description, sensory_notes, specs_json, images_json,
                photo_main, badge, is_featured, is_active, sort_order, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `, [
            id,
            item.name,
            slug,
            category,
            subtitle,
            retailPrice,
            comparePrice,
            24, // Stock inicial
            description,
            sensoryNotes,
            JSON.stringify(specs),
            JSON.stringify(imgs.gallery),
            imgs.main,
            badge,
            isFeatured,
            1, // is_active
            i + 1
        ]);

        inserted++;
        processed.push({
            id,
            name: item.name,
            category,
            wholesale: wholesalePrice,
            price_public: retailPrice,
            compare_price: comparePrice,
            photo_main: imgs.main,
            images_count: imgs.gallery.length
        });
    }

    console.log(`\n🎉 Sincronización exitosa: ${inserted} productos de Ddurazno importados a Mokka Chai con +20% sobre precio marcado.`);
    fs.writeFileSync('server/mokkachai_catalog_summary.json', JSON.stringify(processed, null, 2));

    // Verificar conteo activo en DB
    const activeRows = await query.all(`SELECT category, COUNT(*) as cnt FROM products WHERE is_active = 1 GROUP BY category`);
    console.log('\n📊 Inventario Activo en Boutique por Categoría:');
    activeRows.forEach(r => console.log(`  - ${r.category}: ${r.cnt} productos`));

    const totalActive = await query.get(`SELECT COUNT(*) as total FROM products WHERE is_active = 1`);
    console.log(`\n🏆 Total de productos activos en la boutique: ${totalActive.total}`);
}

syncDduraznoToMokkaChai().catch(console.error);
