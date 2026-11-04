const { query, initDatabase } = require('../db/database');

const seedData = async () => {
    await initDatabase();

    console.log('🔄 Sembrando catálogo maestro de RED VELVET (Luxury Sex Shop & Intimate Wellness)...');

    // 1. Cupones de descuento y bienvenida
    const initialCoupons = [
        { code: 'VELVET10', discount_percent: 10, discount_amount: 0, min_purchase: 500, max_uses: 1000, note: '10% de bienvenida para nuevos clientes' },
        { code: 'VIP20', discount_percent: 20, discount_amount: 0, min_purchase: 2500, max_uses: 500, note: '20% de descuento en pedidos mayores a $2,500 MXN' },
        { code: 'SECRET50', discount_percent: 15, discount_amount: 0, min_purchase: 1000, max_uses: 200, note: 'Código exclusivo membresía secreta' },
        { code: 'GOLD30', discount_percent: 30, discount_amount: 0, min_purchase: 4000, max_uses: 100, note: '30% descuento en pedidos Gold Suite' }
    ];

    for (const c of initialCoupons) {
        await query.run(`
            INSERT OR REPLACE INTO coupons (code, discount_percent, discount_amount, min_purchase, max_uses, used_count, is_active, note)
            VALUES (?, ?, ?, ?, ?, 0, 1, ?)
        `, [c.code, c.discount_percent, c.discount_amount, c.min_purchase, c.max_uses, c.note]);
    }

    // Retrocompatibilidad con códigos de invitación VIP
    const initialCodes = [
        { code: 'VELVET-VIP', role: 'Cliente VIP', max_uses: 'Ilimitado', note: 'Acceso Miembro Preferencial' },
        { code: 'ADMIN-999', role: 'Administrador', max_uses: 'Exclusivo', note: 'Token Maestro Dirección' }
    ];

    for (const c of initialCodes) {
        await query.run(`
            INSERT OR IGNORE INTO invitation_codes (code, role, max_uses, used_count, is_active, note)
            VALUES (?, ?, ?, 0, 1, ?)
        `, [c.code, c.role, c.max_uses, c.note]);
    }

    // 2. Catálogo Maestro de Productos (21 Piezas de Ultra-Lujo con Imágenes Exactas de Producto)
    const luxuryProducts = [
        // ==================== PLEASURE TECH ====================
        {
            id: 'PROD-001',
            name: 'Aura Sonic Touch',
            slug: 'aura-sonic-touch',
            category: 'Pleasure Tech',
            subtitle: 'Estimulador sónico clitoriano de ondas acústicas continuas',
            price: 2890,
            compare_price: 3450,
            stock: 24,
            description: 'Inspirado en la tecnología acústica de resonancia profunda. Aura Sonic Touch acaricia las terminaciones nerviosas sin contacto invasivo, creando una experiencia orgásmica gradual de plenitud absoluta. Acabado en silicona biocompatible ultrasuave y detalles en oro rosa.',
            sensory_notes: 'Tacto sedoso hipoalergénico, vibración profunda casi imperceptible al oído (<38 dB), sensación envolvente similar a la brisa cálida.',
            specs_json: JSON.stringify({
                material: 'Silicona médica ultrasuave biocompatible & ABS bañado en oro rosa',
                impermeabilidad: 'IPX7 (100% sumergible hasta 1 metro de profundidad)',
                ruido: '< 38 dB (Tecnología Whisper-Quiet)',
                modos: '8 intensidades progresivas y 6 frecuencias acústicas',
                bateria: 'Batería de iones de litio recargable por pin magnético USB',
                autonomia: 'Hasta 2 horas continuas con carga completa de 90 min',
                garantia: '2 años de garantía de reposición directa'
            }),
            images_json: JSON.stringify([
                'https://images.unsplash.com/photo-1593527538338-86235520a070?auto=format&fit=crop&q=80&w=900'
            ]),
            photo_main: 'https://images.unsplash.com/photo-1593527538338-86235520a070?auto=format&fit=crop&q=80&w=900',
            badge: 'Bestseller',
            is_featured: 1,
            sort_order: 1
        },
        {
            id: 'PROD-002',
            name: 'Velvet Noir Dual Wand',
            slug: 'velvet-noir-dual-wand',
            category: 'Pleasure Tech',
            subtitle: 'Varita masajeadora flexible con doble motor sincrónico',
            price: 3650,
            compare_price: 4200,
            stock: 18,
            description: 'La cúspide del masaje sensual y la relajación corporal. Diseñada con un cabezal pivotante de 360 grados y un núcleo ponderado que transmite ondas de baja frecuencia capaces de relajar tensiones musculares profundas o llevar el juego íntimo a su máxima intensidad.',
            sensory_notes: 'Equilibrio perfecto de peso ergonómico, cabezal acolchado ultraflexible, calor térmico sutil integrado de 38°C.',
            specs_json: JSON.stringify({
                material: 'Silicona premium líquida de tacto afelpado',
                impermeabilidad: 'IPX6 resistente a salpicaduras y ducha',
                ruido: '< 42 dB',
                modos: '10 programas de pulso y 5 niveles de fuerza',
                bateria: 'Carga magnética rápida de 120 minutos',
                autonomia: '3 horas de funcionamiento ininterrumpido',
                garantia: '2 años'
            }),
            images_json: JSON.stringify([
                'https://images.unsplash.com/photo-1594730366202-0c102627dec6?auto=format&fit=crop&q=80&w=900'
            ]),
            photo_main: 'https://images.unsplash.com/photo-1594730366202-0c102627dec6?auto=format&fit=crop&q=80&w=900',
            badge: 'Edición Elite',
            is_featured: 1,
            sort_order: 2
        },
        {
            id: 'PROD-010',
            name: 'Collar Joya Vibrador "Vesper Royale"',
            slug: 'collar-joya-vibrador-vesper-royale',
            category: 'Pleasure Tech',
            subtitle: 'Dije de alta joyería bañado en oro rosa de 24K con vibrador secreto ultra-silencioso',
            price: 4100,
            compare_price: 4800,
            stock: 12,
            description: 'Una pieza de orfebrería exquisita creada para llevarse con total naturalidad en galas y eventos. Su silueta estilizada encierra un motor de micro-resonancia de 4 velocidades capaz de brindar placer discreto en cualquier momento o lugar sin despertar sospechas.',
            sensory_notes: 'Frío inicial del metal noble que se atempera con el calor de la piel, vibración focalizada con precisión milimétrica.',
            specs_json: JSON.stringify({
                material: 'Acero inoxidable quirúrgico 316L con baño de Oro Rosa de 24K',
                cadena: 'Cadena de eslabón veneciano de 65 cm con broche de seguridad',
                ruido: '< 30 dB (Completamente inaudible a más de 30 cm)',
                modos: '4 velocidades constantes y pulsátiles de toque intuitivo',
                bateria: 'Recarga micro USB oculta en la base roscada hermética'
            }),
            images_json: JSON.stringify([
                'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=900'
            ]),
            photo_main: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=900',
            badge: 'Alta Joyería',
            is_featured: 1,
            sort_order: 3
        },
        {
            id: 'PROD-011',
            name: 'Onyx Eclipse G-Spot & Clitoral Wave',
            slug: 'onyx-eclipse-gspot-clitoral-wave',
            category: 'Pleasure Tech',
            subtitle: 'Estimulador anatómico con tecnología térmica de 39°C y doble motor sincrónico',
            price: 3490,
            compare_price: 3950,
            stock: 15,
            description: 'Diseño curvilíneo creado a partir de mapeos biométricos de precisión. Su cabezal curvado alcanza el punto G con presión sostenida mientras su brazo externo abraza el clítoris. Su sistema térmico emula la temperatura corporal para sensaciones hiperrealistas.',
            sensory_notes: 'Calor reconfortante de 39°C, tacto de terciopelo líquido, ondas de pulso sincronizadas que resuenan en todo el cuerpo.',
            specs_json: JSON.stringify({
                material: 'Silicona médica hipoalergénica de doble densidad',
                impermeabilidad: 'IPX7 (100% sumergible)',
                terapia_termica: 'Calentamiento automático a 39°C en 90 segundos',
                modos: '12 patrones combinados de estimulación dual',
                bateria: 'Batería Li-ion con cargador magnético rápido'
            }),
            images_json: JSON.stringify([
                'https://images.unsplash.com/photo-1645578735887-c1484e5b5f5f?auto=format&fit=crop&q=80&w=900'
            ]),
            photo_main: 'https://images.unsplash.com/photo-1645578735887-c1484e5b5f5f?auto=format&fit=crop&q=80&w=900',
            badge: 'Térmico 39°C',
            is_featured: 1,
            sort_order: 4
        },
        {
            id: 'PROD-012',
            name: 'Siren Pearl Air-Pulse',
            slug: 'siren-pearl-air-pulse',
            category: 'Pleasure Tech',
            subtitle: 'Succionador de ondas de aire de micro-vacío con perla de vibración focalizada',
            price: 2950,
            compare_price: 3300,
            stock: 20,
            description: 'El equilibrio supremo entre ondas de aire pulsadas y contacto físico suave. La membrana de silicona ultrafina genera ondas de vacío rítmicas que rodean el centro del placer sin frotación brusca, permitiendo múltiples clímax sin sobresensibilización.',
            sensory_notes: 'Sensación de succión cálida envolvente y palpitante, tacto sedoso y liviano en mano.',
            specs_json: JSON.stringify({
                material: 'Silicona biocompatible de tacto pluma y policarbonato perlado',
                impermeabilidad: 'IPX7 sumergible',
                ruido: '< 35 dB (Whisper-Quiet)',
                modos: '11 niveles de ondas pulsátiles',
                autonomia: '120 minutos de uso continuo'
            }),
            images_json: JSON.stringify([
                'https://images.unsplash.com/photo-1645578735063-f48746f8c066?auto=format&fit=crop&q=80&w=900'
            ]),
            photo_main: 'https://images.unsplash.com/photo-1645578735063-f48746f8c066?auto=format&fit=crop&q=80&w=900',
            badge: 'Tecnología de Aire',
            is_featured: 0,
            sort_order: 5
        },

        // ==================== SENSORY CARE ====================
        {
            id: 'PROD-003',
            name: 'Sérum Íntimo Seda de Medianoche',
            slug: 'serum-intimo-seda-de-medianoche',
            category: 'Sensory Care',
            subtitle: 'Lubricante prémium a base de agua purificada con Ácido Hialurónico y Aloe Vera',
            price: 790,
            compare_price: 950,
            stock: 50,
            description: 'Formulado en laboratorios dermatológicos de alta gama. Su base de agua purificada biocompatible hidrata y regenera los tejidos delicados, aportando un deslizamiento satinado natural y no pegajoso que nunca interfiere con preservativos ni silicona médica.',
            sensory_notes: 'Deslizamiento infinito, pH equilibrado 4.2, aroma sutil casi neutro con notas botánicas de flor de azahar.',
            specs_json: JSON.stringify({
                volumen: '100 ml con dispensador dosificador sin goteo',
                ingredientes: 'Agua purificada, Ácido Hialurónico vegetal, Extracto de Aloe Barbadensis, Glicerina vegetal grado USP',
                compatibilidad: '100% seguro con látex, poliisopreno y silicona médica',
                certificaciones: 'Cruelty-free, vegano, libre de parabenos, petroquímicos y perfumes artificiales'
            }),
            images_json: JSON.stringify([
                'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=900'
            ]),
            photo_main: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=900',
            badge: '100% Biocompatible',
            is_featured: 1,
            sort_order: 6
        },
        {
            id: 'PROD-004',
            name: 'Vela de Masaje Térmico Champagne & Higo Negro',
            slug: 'vela-masaje-termico-champagne-higo',
            category: 'Sensory Care',
            subtitle: 'Cera de soja botánica enriquecida con manteca de karité y aceite de jojoba',
            price: 920,
            compare_price: 1100,
            stock: 35,
            description: 'Al encenderse, su llama suave funde lentamente una rica manteca caliente diseñada para derramarse directamente sobre la piel a una temperatura corporal perfecta (38°C). Nutre intensamente mientras aromatiza la alcoba con notas amaderadas y sensuales.',
            sensory_notes: 'Calor relajante inmediato, absorción sedosa sin sensación grasa, notas de higo maduro, vainilla bourbon y bergamota.',
            specs_json: JSON.stringify({
                contenido: '220 gramos (más de 30 aplicaciones completas)',
                temperatura_fusion: 'Baja temperatura de fusión (38°C - no quema)',
                ingredientes: 'Cera de soja 100% pura, manteca de karité orgánica, aceite de almendras dulces, esencia de higo negro',
                recipiente: 'Cerámica esmaltada en negro mate con pico vertedor de precisión'
            }),
            images_json: JSON.stringify([
                'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=900'
            ]),
            photo_main: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=900',
            badge: 'Experiencia Sensorial',
            is_featured: 1,
            sort_order: 7
        },
        {
            id: 'PROD-016',
            name: 'Elixir Sensuel — Aceite de Masaje Botánico con Feromonas',
            slug: 'elixir-sensuel-aceite-masaje-botanico',
            category: 'Sensory Care',
            subtitle: 'Mezcla de aceites prensados en frío de argán, jojoba y jazmín silvestre',
            price: 1150,
            compare_price: 1350,
            stock: 30,
            description: 'Un aceite seco de absorción progresiva que acaricia la piel con suavidad de terciopelo. Su alquimia aromática de sándalo blanco, jazmín sambac y notas de ámbar despierta el deseo y favorece la relajación muscular profunda en masajes íntimos o tántricos.',
            sensory_notes: 'Acabado satinado sin rastro oleoso, tacto cálido en contacto con las manos, aroma hipnótico y seductor.',
            specs_json: JSON.stringify({
                presentacion: 'Botella de vidrio ámbar de 150 ml con gotero dosificador de precisión',
                ingredientes: 'Aceite de Argán puro de Marruecos, Aceite de Jojoba dorado, Esencia de Jazmín Real, Vitamina E',
                beneficios: 'Nutre la barrera cutánea, no tapa poros, 100% orgánico certificado'
            }),
            images_json: JSON.stringify([
                'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=900'
            ]),
            photo_main: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=900',
            badge: 'Orgánico Certificado',
            is_featured: 1,
            sort_order: 8
        },
        {
            id: 'PROD-017',
            name: 'Bálsamo Sensorial "Néctar Dual Fuego & Escarcha"',
            slug: 'balsamo-sensorial-nectar-dual',
            category: 'Sensory Care',
            subtitle: 'Gel estimulante de zonas erógenas con efecto térmico progresivo',
            price: 650,
            compare_price: 780,
            stock: 45,
            description: 'Unas gotas bastan para transformar cualquier roce en una corriente eléctrica placentera. Combina extractos botánicos de menta piperita y jengibre africano para crear una oscilación constante entre frío estimulante y calor envolvente.',
            sensory_notes: 'Sensación de cosquilleo magnético, mayor afluencia sanguínea y respuesta sensitiva intensificada.',
            specs_json: JSON.stringify({
                volumen: '50 ml en envase airless para máxima frescura',
                efecto: 'Térmico alternado caliente / fresco durante 30-45 minutos',
                ingredientes: 'Extracto de Spilanthes Acmella, mentol natural, jengibre, base glicerinada comestible'
            }),
            images_json: JSON.stringify([
                'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=900'
            ]),
            photo_main: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=900',
            badge: 'Efecto Dual',
            is_featured: 0,
            sort_order: 9
        },
        {
            id: 'PROD-018',
            name: 'Sales de Baño Afrodisíacas "Ritual de Afrodita"',
            slug: 'sales-bano-afrodisiacas-ritual-afrodita',
            category: 'Sensory Care',
            subtitle: 'Cristales de sal del Himalaya con pétalos de rosa de Damasco y aceites puros',
            price: 720,
            compare_price: 880,
            stock: 25,
            description: 'Diseñadas para convertir el preludio en un santuario sensorial. Ricas en 84 minerales esenciales, desintoxican el cuerpo mientras sus vapores aromáticos de rosa búlgara, pachulí y geranio relajan el sistema nervioso e inducen a la entrega total.',
            sensory_notes: 'Agua suave y sedosa al tacto, aroma floral dulce de fondo amaderado, relajación muscular inmediata.',
            specs_json: JSON.stringify({
                peso: '450 gramos (aprox. 8 baños completos)',
                ingredientes: 'Sal rosa del Himalaya sin refinar, sales de Epsom grado farmacéutico, flores secas de rosas francesas'
            }),
            images_json: JSON.stringify([
                'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=900'
            ]),
            photo_main: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=900',
            badge: 'Preludio Íntimo',
            is_featured: 0,
            sort_order: 10
        },

        // ==================== FINE LINGERIE ====================
        {
            id: 'PROD-005',
            name: 'Bodysuit Encaje Francés "Crimson Allure"',
            slug: 'bodysuit-crimson-allure',
            category: 'Fine Lingerie',
            subtitle: 'Lencería de alta costura con transparencias y encaje floral',
            price: 2450,
            compare_price: 2950,
            stock: 16,
            description: 'Confeccionado artesanalmente con encaje Chantilly de motivos florales y tul elástico de tacto invisible. Escote halter pronunciado con herrajes bañados en oro que perfilan la silueta con una sensualidad elegante y misteriosa.',
            sensory_notes: 'Tejido extremadamente suave que no pica, costuras invisibles que abrazan la figura con soporte suave.',
            specs_json: JSON.stringify({
                tallas: 'S (32B-34A), M (34B-36B), L (36C-38B)',
                material: '85% Poliamida reciclada de alta densidad, 15% Elastano de seda',
                cuidados: 'Lavado a mano con jabón neutro, secado en plano',
                detalles: 'Cierre inferior con broches de presión ocultos, tirantes regulables'
            }),
            images_json: JSON.stringify([
                'https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&q=80&w=900'
            ]),
            photo_main: 'https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&q=80&w=900',
            badge: 'Alta Costura',
            is_featured: 1,
            sort_order: 11
        },
        {
            id: 'PROD-006',
            name: 'Bata Kimono Seda y Terciopelo Red Velvet',
            slug: 'bata-kimono-seda-terciopelo',
            category: 'Fine Lingerie',
            subtitle: 'Bata fluida en satén de seda pesado con ribetes en terciopelo burdeos',
            price: 3100,
            compare_price: 3800,
            stock: 12,
            description: 'La prenda insignia de la casa RED VELVET. Creada para el preludio perfecto, esta bata envuelve la piel con un brillo líquido sublime y mangas acampanadas inspiradas en el glamour clásico de los años 50.',
            sensory_notes: 'Caída pesada y fresca de la seda natural, ribetes aterciopelados cálidos en puños y solapas.',
            specs_json: JSON.stringify({
                corte: 'Kimono holgado con cinturón desmontable a juego',
                tejido: 'Satén de seda mulberry de 22 mommes y terciopelo italiano',
                longitud: 'Hasta media pantorrilla (120 cm)',
                talla: 'Talla única ajustable (apta para XS a XL)'
            }),
            images_json: JSON.stringify([
                'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=900'
            ]),
            photo_main: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=900',
            badge: 'Exclusivo',
            is_featured: 1,
            sort_order: 12
        },
        {
            id: 'PROD-013',
            name: 'Arnés Corporal Joya "Aphrodite Gold"',
            slug: 'arnes-corporal-joya-aphrodite-gold',
            category: 'Fine Lingerie',
            subtitle: 'Cadenas de latón bañadas en oro de 18K y bandas de terciopelo burdeos ajustable',
            price: 2190,
            compare_price: 2600,
            stock: 14,
            description: 'Una fusión fascinante entre joyería y lencería fetichista de pasarela. Sus cadenas doradas caen sobre el pecho y enmarcan la cintura resaltando las curvas naturales con destellos luminosos sobre la piel desnuda.',
            sensory_notes: 'Contacto fresco del metal fino, movimiento fluido que tintinea suavemente al caminar.',
            specs_json: JSON.stringify({
                material: 'Aleación hipoalergénica con triple baño de Oro de 18K libre de níquel',
                ajuste: 'Cadenas extensibles en hombros, contorno bajo busto y cadera (apto para tallas XS a L)',
                estuche: 'Caja joyera forrada en terciopelo negro con placa grabada'
            }),
            images_json: JSON.stringify([
                'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=900'
            ]),
            photo_main: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=900',
            badge: 'Joyería Corporal',
            is_featured: 0,
            sort_order: 13
        },
        {
            id: 'PROD-014',
            name: 'Conjunto Bralette & Tanga "Midnight Bloom"',
            slug: 'conjunto-bralette-tanga-midnight-bloom',
            category: 'Fine Lingerie',
            subtitle: 'Satén de seda negra pura con bordados de encaje delicado',
            price: 1980,
            compare_price: 2400,
            stock: 22,
            description: 'Pieza de diseño íntimo pensada para deslumbrar sin sacrificar confort. El bralette sin aros ofrece sujeción natural mediante bandas elásticas de seda, complementado por una tanga con laterales regulables en oro.',
            sensory_notes: 'Caricia sedosa continua, ligereza casi imperceptible que acompaña cada movimiento.',
            specs_json: JSON.stringify({
                composicion: '92% Seda Natural Mulberry, 8% Elastano',
                detalles: 'Hebillas doradas resistentes al agua, forro de algodón puro en puente',
                tallas: 'S (32A-34B), M (34C-36B), L (36C-38C)'
            }),
            images_json: JSON.stringify([
                'https://images.unsplash.com/photo-1592398289517-d9437d109bc2?auto=format&fit=crop&q=80&w=900'
            ]),
            photo_main: 'https://images.unsplash.com/photo-1592398289517-d9437d109bc2?auto=format&fit=crop&q=80&w=900',
            badge: 'Seda Mulberry',
            is_featured: 0,
            sort_order: 14
        },

        // ==================== SOFT FETISH ====================
        {
            id: 'PROD-007',
            name: 'Kit de Alcoba Velvet Bondage Chic',
            slug: 'kit-alcoba-velvet-bondage-chic',
            category: 'Soft Fetish',
            subtitle: 'Antifaz de seda acolchado, esposas forradas en terciopelo y pluma de caricia',
            price: 1850,
            compare_price: 2200,
            stock: 22,
            description: 'Una invitación refinada a explorar la rendición del control y la privación sensorial. Las esposas con cierre magnético y forro de terciopelo protegen las muñecas con ternura, mientras el antifaz bloquea toda luz para agudizar los demás sentidos al 200%.',
            sensory_notes: 'Tacto esponjoso y seguro, privación visual total, cosquilleo estimulante con pluma de caricia natural.',
            specs_json: JSON.stringify({
                incluye: '1 Antifaz blackout de seda acolchada, 2 Esposas forradas con mosquetón metálico dorado, 1 Fusta de plumas suaves de 28cm',
                materiales: 'Piel vegana estructurada, terciopelo ultrasuave, herrajes de aleación de zinc dorado pulido',
                ajuste: 'Universal y regulable mediante hebillas seguras de apertura rápida'
            }),
            images_json: JSON.stringify([
                'https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?auto=format&fit=crop&q=80&w=900'
            ]),
            photo_main: 'https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?auto=format&fit=crop&q=80&w=900',
            badge: 'Favorito en Pareja',
            is_featured: 1,
            sort_order: 15
        },
        {
            id: 'PROD-019',
            name: 'Fusta de Cuero Trenzado "Le Fouet Royale"',
            slug: 'fusta-cuero-trenzado-le-fouet-royale',
            category: 'Soft Fetish',
            subtitle: 'Cuero genuino curtido vegetal con pompón de caricias y empuñadura en latón pulido',
            price: 1450,
            compare_price: 1750,
            stock: 18,
            description: 'Una joya artesanal para juegos de dominación suave y estímulo cutáneo. Su látigo flexible de cuero flor transmite una palmada limpia sin dejar marcas agresivas, mientras su pompón opuesto acaricia con sutileza aristocrática.',
            sensory_notes: 'Chasquido seco y excitante en el aire, tacto firme y equilibrado en la mano con peso noble.',
            specs_json: JSON.stringify({
                longitud: '48 cm en total con empuñadura ergonómica de 14 cm',
                materiales: 'Cuero curtido al vegetal libre de cromo, núcleo de fibra de vidrio elástica, latón dorado',
                doble_uso: 'Extremo fusta de impacto suave y pompón de pluma suave'
            }),
            images_json: JSON.stringify([
                'https://images.unsplash.com/photo-1542295669297-4d352b042bca?auto=format&fit=crop&q=80&w=900'
            ]),
            photo_main: 'https://images.unsplash.com/photo-1542295669297-4d352b042bca?auto=format&fit=crop&q=80&w=900',
            badge: 'Hecho a Mano',
            is_featured: 0,
            sort_order: 16
        },
        {
            id: 'PROD-020',
            name: 'Paleta Reversible Terciopelo & Cuero "Velvet Whisper"',
            slug: 'paleta-reversible-terciopelo-cuero',
            category: 'Soft Fetish',
            subtitle: 'Superficie dual con cara de terciopelo burdeos para caricias y cuero negro para impacto amortiguado',
            price: 1100,
            compare_price: 1350,
            stock: 25,
            description: 'Elegante y no intimidante. Pensada para quienes se inician en el juego sensorial con total confianza. El lado aterciopelado calma y relaja, mientras el reverso en cuero firme despierta la adrenalina con un sonido apagado de gran carga erótica.',
            sensory_notes: 'Impacto suave con acolchado interior de espuma de alta memoria que amortigua el golpe.',
            specs_json: JSON.stringify({
                dimensiones: '32 cm x 6 cm',
                material: 'Piel vegana reforzada, terciopelo de algodón, remaches de aleación dorada'
            }),
            images_json: JSON.stringify([
                'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=900'
            ]),
            photo_main: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=900',
            badge: 'Doble Sensación',
            is_featured: 0,
            sort_order: 17
        },

        // ==================== COUPLES & GAMES ====================
        {
            id: 'PROD-008',
            name: 'Baraja de Intimidad & Retos Sensoriales "Eros"',
            slug: 'baraja-intimidad-retos-eros',
            category: 'Couples',
            subtitle: '100 cartas con dinámicas de conexión emocional, conversación y juego erótico progresivo',
            price: 680,
            compare_price: 850,
            stock: 40,
            description: 'Diseñada por terapeutas de pareja y sexólogos. Dividida en tres niveles de juego: Intimidad Emocional, Caricias y Tensión Erótica, y Retos de Placer Total. La herramienta definitiva para reavivar la llama y descubrir fantasías no expresadas.',
            sensory_notes: 'Cartas con tacto satinado mate y cantos dorados, caja rígida imantada de colección.',
            specs_json: JSON.stringify({
                cartas: '100 naipes de 350g con laminado tacto seda soft-touch',
                niveles: 'Nivel 1: Conexión Profunda (30), Nivel 2: Sensualidad & Caricias (35), Nivel 3: Éxtasis & Pasión (35)',
                presentacion: 'Estuche rígido con cierre magnético y grabado en oro metálico'
            }),
            images_json: JSON.stringify([
                'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&q=80&w=900'
            ]),
            photo_main: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&q=80&w=900',
            badge: 'Juego de Pareja',
            is_featured: 1,
            sort_order: 18
        },
        {
            id: 'PROD-009',
            name: 'Ring Vibrador Tántrico "Apollo"',
            slug: 'ring-vibrador-tantrico-apollo',
            category: 'Couples',
            subtitle: 'Anillo ergonómico de doble estimulación simultánea con control remoto Bluetooth',
            price: 1980,
            compare_price: 2400,
            stock: 28,
            description: 'Diseñado para compartirse. Mientras prolonga la firmeza y resistencia masculina, su motor superior sincronizado acaricia el clítoris en cada encuentro íntimo. Puede controlarse de forma remota a través de smartphone o su elegante mando a distancia en forma de gota.',
            sensory_notes: 'Silicona extensible ultraelástica sin estrangulamiento, vibración sincronizada envolvente.',
            specs_json: JSON.stringify({
                material: 'Silicona líquida elástica apta para cualquier anatomía',
                impermeabilidad: 'IPX7 sumergible',
                conectividad: 'Bluetooth 5.0 con alcance de hasta 10 metros y control por app a distancia',
                bateria: 'USB magnético con 90 minutos de autonomía continua'
            }),
            images_json: JSON.stringify([
                'https://images.unsplash.com/photo-1594730133212-3289de4786cf?auto=format&fit=crop&q=80&w=900'
            ]),
            photo_main: 'https://images.unsplash.com/photo-1594730133212-3289de4786cf?auto=format&fit=crop&q=80&w=900',
            badge: 'Control Remoto',
            is_featured: 1,
            sort_order: 19
        },
        {
            id: 'PROD-021',
            name: 'Set de Dados Eróticos Esculpidos "Pleasure Roll"',
            slug: 'dados-eroticos-pleasure-roll',
            category: 'Couples',
            subtitle: 'Dados metálicos de peso macizo en acabado oro rosa con grabados sensoriales en bajo relieve',
            price: 590,
            compare_price: 750,
            stock: 35,
            description: 'Deja que el azar dicte la siguiente caricia. Dos dados de aleación pulida: uno indica la acción sensorial (Besar, Acariciar, Morder suave, Lamer, Calentar, Azotar suave) y el otro la zona del cuerpo.',
            sensory_notes: 'Peso sólido en la palma de la mano, esquinas suavizadas para un rodar fluido sobre sábanas de seda.',
            specs_json: JSON.stringify({
                contenido: '2 Dados metálicos de 20 mm cada uno',
                acabado: 'Oro Rosa espejo electrochapado resistente al desgaste',
                presentacion: 'Bolsa de terciopelo burdeos con jareta dorada'
            }),
            images_json: JSON.stringify([
                'https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&q=80&w=900'
            ]),
            photo_main: 'https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&q=80&w=900',
            badge: 'Juego Rápido',
            is_featured: 0,
            sort_order: 20
        },
        {
            id: 'PROD-022',
            name: 'Kit Tántrico de Cristal Cuarzo Rosa "Sanctuary"',
            slug: 'kit-tantrico-cristal-cuarzo-rosa',
            category: 'Couples',
            subtitle: 'Vara masajeadora de cuarzo rosa natural pulida a mano y abanico de plumas de seda',
            price: 2350,
            compare_price: 2800,
            stock: 16,
            description: 'Inspirado en los rituales orientales de despertar energético. El cuarzo rosa mineral 100% natural puede enfriarse en agua con hielo o calentarse en agua tibia para masajear puntos meridianos y zonas erógenas con una pureza espiritual y física insuperable.',
            sensory_notes: 'Retención térmica duradera de la piedra natural, energía sedosa y calmante sobre la piel.',
            specs_json: JSON.stringify({
                mineral: 'Cuarzo Rosa Natural de Madagascar grado AAA pulido sin barnices químicos',
                longitud_vara: '18 cm con doble extremo redondeado anatómico',
                incluye: 'Vara de cuarzo, pluma de seda blanca de avestruz, estuche acolchado y guía de masaje tántrico'
            }),
            images_json: JSON.stringify([
                'https://images.unsplash.com/photo-1567982047351-76b6f93e38ee?auto=format&fit=crop&q=80&w=900'
            ]),
            photo_main: 'https://images.unsplash.com/photo-1567982047351-76b6f93e38ee?auto=format&fit=crop&q=80&w=900',
            badge: 'Cuarzo Natural',
            is_featured: 1,
            sort_order: 21
        }
    ];

    for (const p of luxuryProducts) {
        await query.run(`
            INSERT OR REPLACE INTO products (
                id, name, slug, category, subtitle, price, compare_price, stock, 
                description, sensory_notes, specs_json, images_json, photo_main, 
                badge, is_featured, is_active, sort_order
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        `, [
            p.id, p.name, p.slug, p.category, p.subtitle, p.price, p.compare_price, p.stock,
            p.description, p.sensory_notes, p.specs_json, p.images_json, p.photo_main,
            p.badge, p.is_featured, p.sort_order
        ]);
    }

    console.log(`✅ Catálogo maestro sembrado con éxito: ${luxuryProducts.length} productos con fotos 100% emparejadas.`);
};

if (require.main === module) {
    seedData()
        .then(() => process.exit(0))
        .catch(err => {
            console.error('❌ Error en seed:', err);
            process.exit(1);
        });
}

module.exports = { seedData };
