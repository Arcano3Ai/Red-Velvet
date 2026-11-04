// Catálogo de Expansión de Ultra-Lujo para RED VELVET (20 Productos Nuevos)
const additionalProducts = [
    // -------------------------------------------------------------
    // PLEASURE TECH (4 NUEVOS)
    // -------------------------------------------------------------
    {
        id: 'PROD-045',
        name: 'Estimulador de Punto G "Nova Curve Luxe"',
        slug: 'estimulador-punto-g-nova-curve-luxe',
        category: 'Pleasure Tech',
        subtitle: 'Curvatura anatómica de autor con silicona líquida y motor de resonancia profunda',
        price: 3650,
        compare_price: 4400,
        stock: 14,
        description: 'Nova Curve Luxe redefine la ergonomía del placer interno. Moldeado en silicona líquida ultra-flexible de densidad dual, transmite pulsaciones de baja frecuencia que resuenan en profundidad sin ruidos superficiales. Cuenta con estuche rígido de carga magnética USB-C con luz UV antibacteriana.',
        sensory_notes: 'Tacto: Silicona líquida sedosa de doble densidad. Acabado: Borde de oro rosa satinado. Sonido: < 32 dB.',
        specs_json: JSON.stringify({
            material: 'Silicona médica líquida biocompatible + ABS metalizado',
            motor: 'Motor dual de resonancia profunda de 12 patrones',
            bateria: 'Batería Li-ion con estuche de carga inductiva USB-C (hasta 2.5 horas)',
            sumergible: 'IPX8 (sumergible hasta 2 metros)',
            ruido: 'Susurro ultra-silencioso (< 32 dB)',
            garantia: '2 años de sustitución directa VIP'
        }),
        images_json: JSON.stringify([
            'https://images.unsplash.com/photo-1512290900672-1f41e570371a?auto=format&fit=crop&q=80&w=900',
            'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=900'
        ]),
        photo_main: 'https://images.unsplash.com/photo-1512290900672-1f41e570371a?auto=format&fit=crop&q=80&w=900',
        badge: 'Nuevo Lanzamiento',
        is_featured: 1,
        sort_order: 45
    },
    {
        id: 'PROD-046',
        name: 'Mini Wand de Bolsillo "Pocket Jewel"',
        slug: 'mini-wand-de-bolsillo-pocket-jewel',
        category: 'Pleasure Tech',
        subtitle: 'Potencia concentrada en tamaño compacto de viaje con cabezal basculante de 360°',
        price: 2890,
        compare_price: 3500,
        stock: 20,
        description: 'La legendaria potencia de una varita mágica concentrada en un formato de apenas 14 cm de longitud. Ideal para viajes o escapadas íntimas, su cabezal flexible de silicona quirúrgica se adapta a cualquier contorno corporal proporcionando vibraciones viscerales con control intuitivo.',
        sensory_notes: 'Tacto: Cabeza de silicona ultrasuave con mango de aluminio anodizado champagne. Sonido: < 34 dB.',
        specs_json: JSON.stringify({
            material: 'Silicona curada al platino y aleación de aluminio aeroespacial',
            motor: 'Micro-motor de alto torque con 8 velocidades y 6 ritmos',
            bateria: 'Carga rápida magnética (90 min de autonomía)',
            sumergible: 'IPX7 resistente a inmersión completa',
            ruido: '< 34 dB Whisper Quiet',
            garantia: '2 años oficial'
        }),
        images_json: JSON.stringify([
            'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=900'
        ]),
        photo_main: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=900',
        badge: 'Edición Viaje',
        is_featured: 1,
        sort_order: 46
    },
    {
        id: 'PROD-047',
        name: 'Vibrador de Aire Pulsado "Siren Pearl II"',
        slug: 'vibrador-aire-pulsado-siren-pearl-ii',
        category: 'Pleasure Tech',
        subtitle: 'Tecnología Pleasure Air con 14 niveles y sensor táctil inteligente de proximidad',
        price: 4150,
        compare_price: 5200,
        stock: 10,
        description: 'Siren Pearl II eleva la estimulación sin contacto a una experiencia de lujo absoluto. Su sensor inteligente activa las ondas de aire pulsado únicamente cuando entra en contacto con la piel, ahorrando batería y garantizando máxima discreción. Revestido en acabado perla brillante con detalles en oro de 24K.',
        sensory_notes: 'Tacto: Succión etérea y pulsaciones de aire suave. Acabado: Blanco perla nacarado con aro dorado.',
        specs_json: JSON.stringify({
            tecnologia: 'Pleasure Air sin contacto físico directo',
            sensor: 'Smart Touch: activación automática por proximidad',
            intensidades: '14 niveles progresivos desde brisa tenue hasta clímax profundo',
            bateria: 'Ion de litio USB magnético recargable',
            garantia: '2 años internacional'
        }),
        images_json: JSON.stringify([
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=900'
        ]),
        photo_main: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=900',
        badge: 'Best Seller VIP',
        is_featured: 1,
        sort_order: 47
    },
    {
        id: 'PROD-048',
        name: 'Set de Esferas Kegel Inteligentes "Velvet Balance"',
        slug: 'set-esferas-kegel-inteligentes-velvet-balance',
        category: 'Pleasure Tech',
        subtitle: 'Pesas pélvicas progresivas con biofeedback táctil y silicona hipoalergénica',
        price: 2450,
        compare_price: 2950,
        stock: 18,
        description: 'Diseñadas para el fortalecimiento del suelo pélvico y la amplificación de la sensibilidad íntima. Set de 3 esferas con pesos calibrados (35g, 60g y 85g) elaboradas con una esfera interna de acero inoxidable que genera micro-vibraciones cinéticas con el movimiento natural del cuerpo.',
        sensory_notes: 'Tacto: Silicona médica suave de tacto cálido. Sensación: Tonificación y placer pasivo.',
        specs_json: JSON.stringify({
            set: '3 esferas progresivas intercambiables (35g, 60g, 85g)',
            material: '100% silicona médica libre de ftalatos',
            diseno: 'Cordel de extracción reforzado de una sola pieza',
            higiene: 'Esterilizable y fácil de lavar'
        }),
        images_json: JSON.stringify([
            'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=900'
        ]),
        photo_main: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=900',
        badge: 'Bienestar Femenino',
        is_featured: 0,
        sort_order: 48
    },

    // -------------------------------------------------------------
    // FINE LINGERIE (4 NUEVOS)
    // -------------------------------------------------------------
    {
        id: 'PROD-049',
        name: 'Bata Kimono en Seda de Morera "Rêve Noir"',
        slug: 'bata-kimono-seda-morera-reve-noir',
        category: 'Fine Lingerie',
        subtitle: 'Seda 100% Mulberry de 22 momme con mangas amplias y cinto desmontable',
        price: 5200,
        compare_price: 6500,
        stock: 8,
        description: 'La máxima expresión del lujo nocturno. Confeccionada con seda pura de morera de grado 6A, esta bata kimono ofrece un drapeado celestial que se desliza por la piel con caricia fresca y liviana. Ribeteada artesanalmente en encaje floral negro mate.',
        sensory_notes: 'Tacto: Seda pura densa y fresca al primer contacto, cálida al cuerpo. Vista: Brillo natural satinado profundo.',
        specs_json: JSON.stringify({
            composicion: '100% Seda de Morera Mulberry 22 Momme Grado 6A',
            tallas: 'Corte amplio fluido disponible en S/M y L/XL',
            cuidados: 'Lavado a mano en frío con jabón neutro de seda',
            origen: 'Confección artesanal de alta costura'
        }),
        images_json: JSON.stringify([
            'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=900'
        ]),
        photo_main: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=900',
        badge: 'Haute Couture',
        is_featured: 1,
        sort_order: 49
    },
    {
        id: 'PROD-050',
        name: 'Corset Escultural de Terciopelo Esmeralda "Smaragd"',
        slug: 'corset-escultural-terciopelo-esmeralda-smaragd',
        category: 'Fine Lingerie',
        subtitle: 'Varillas de acero flexible con forro de satén y lazo cruzado en espalda',
        price: 4350,
        compare_price: 5100,
        stock: 12,
        description: 'Una pieza joya que combina el porte victoriano con la sensualidad contemporánea. Elaborado en terciopelo italiano color verde esmeralda con varillas interiores de acero en espiral que definen la cintura sin restringir la respiración ni el movimiento.',
        sensory_notes: 'Tacto: Pelo de terciopelo esmeralda de tacto suntuoso. Estructura: Firmeza anatómica que esculpe el torso.',
        specs_json: JSON.stringify({
            tejido: 'Terciopelo italiano de seda y algodón con forro de satén 100%',
            ballenas: '14 varillas de acero flexible alemanas',
            ajuste: 'Cierre busk frontal de latón y ojillos traseros reforzados'
        }),
        images_json: JSON.stringify([
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=900'
        ]),
        photo_main: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=900',
        badge: 'Edición Limitada',
        is_featured: 1,
        sort_order: 50
    },
    {
        id: 'PROD-051',
        name: 'Body de Encaje Francés y Tul Invisible "Illusion"',
        slug: 'body-encaje-frances-tul-invisible-illusion',
        category: 'Fine Lingerie',
        subtitle: 'Espalda descubierta en V profunda con detalles florales bordados a mano',
        price: 3200,
        compare_price: 3900,
        stock: 15,
        description: 'El arte de la transparencia refinada. Confeccionado en tul elástico invisible de origen francés con aplicaciones de encaje Calais-Caudry en el escote y la cadera. El corte tanga de cintura alta alarga visualmente las piernas y acentúa las curvas naturales.',
        sensory_notes: 'Tacto: Tul casi imperceptible y encaje delicado sin bordes rígidos.',
        specs_json: JSON.stringify({
            material: 'Encaje Calais-Caudry 65% poliamida, 35% elastano con tul suizo',
            cierre: 'Broche inferior de triple posición forrado en algodón',
            tallas: 'XS, S, M, L'
        }),
        images_json: JSON.stringify([
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=900'
        ]),
        photo_main: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=900',
        badge: 'Diseño Exclusivo',
        is_featured: 0,
        sort_order: 51
    },
    {
        id: 'PROD-052',
        name: 'Set de Liguero y Medias de Seda "Opéra Midnight"',
        slug: 'set-liguero-medias-seda-opera-midnight',
        category: 'Fine Lingerie',
        subtitle: 'Liguero ancho de 6 tiras metálicas doradas con medias con costura trasera francesa',
        price: 2150,
        compare_price: 2700,
        stock: 16,
        description: 'La quintaesencia del erotismo clásico parisino. Liguero estructurado con 6 correas ajustables equipadas con broches de metal bañado en oro y silicona antideslizante, acompañado por medias ultrafinas de 15 deniers con costura trasera vintage y talón reforzado en punta cubana.',
        sensory_notes: 'Tacto: Medias transparentes de caricia de seda con herrajes dorados fríos.',
        specs_json: JSON.stringify({
            liguero: '6 tirantes de sujeción reforzada con clips de latón chapado',
            medias: '15 DEN con puntera francesa y costura dorsal artesanal',
            color: 'Negro medianoche con destellos oro'
        }),
        images_json: JSON.stringify([
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=900'
        ]),
        photo_main: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=900',
        badge: 'Clásico Vintage',
        is_featured: 0,
        sort_order: 52
    },

    // -------------------------------------------------------------
    // SENSORY CARE (4 NUEVOS)
    // -------------------------------------------------------------
    {
        id: 'PROD-053',
        name: 'Elixir Corporal Luminoso con Oro de 24 Quilates',
        slug: 'elixir-corporal-luminoso-oro-24-quilates',
        category: 'Sensory Care',
        subtitle: 'Aceite seco perfumado con micro-escamas de oro puro y extracto de neroli y pachulí',
        price: 1980,
        compare_price: 2400,
        stock: 22,
        description: 'Un ritual de hidratación sublime para el cuerpo y los sentidos. Formulado con una base de 7 aceites botánicos preciosos (argán, camelia, jojoba, rosa mosqueta, almendra dulce, macadamia y avellana) suspendiendo partículas de oro de 24K que dejan la piel radiante, satinada y delicadamente perfumada sin sensación grasa.',
        sensory_notes: 'Aroma: Neroli blanco, jazmín nocturno y madera de cedro ahumado. Textura: Aceite seco de absorción instantánea con destellos de oro.',
        specs_json: JSON.stringify({
            volumen: '100 ml en frasco de vidrio pesado con dosificador',
            ingredientes: 'Aceites 100% orgánicos prensados en frío + Oro coloidal 24K',
            caracteristicas: 'No mancha sábanas de seda, no comedogénico'
        }),
        images_json: JSON.stringify([
            'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=900'
        ]),
        photo_main: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=900',
        badge: 'Oro Puro 24K',
        is_featured: 1,
        sort_order: 53
    },
    {
        id: 'PROD-054',
        name: 'Vela de Masaje Aromática "Higo Negro & Madera"',
        slug: 'vela-masaje-aromatica-higo-negro-madera',
        category: 'Sensory Care',
        subtitle: 'Cera de soya botánica de bajo punto de fusión enriquecida con manteca de karité',
        price: 1250,
        compare_price: 1600,
        stock: 25,
        description: 'Al encenderse, esta vela se transforma en un aceite tibio y reconfortante diseñado para verterse directamente sobre la piel a temperatura corporal agradable (38°C). La fragancia envolvente de higo negro maduro, hojas de tabaco y madera de sándalo crea una atmósfera de intimidad hipnótica.',
        sensory_notes: 'Aroma: Notas frutales oscuras, corteza de cedro y vainilla amaderada. Tacto: Aceite caliente aterciopelado.',
        specs_json: JSON.stringify({
            peso: '220 g con pico vertedor de cerámica negra mate',
            cera: '100% soya natural y cera de abeja pura con mecha de algodón egipcio',
            duracion: 'Hasta 45 horas de combustión / 12 masajes completos de cuerpo'
        }),
        images_json: JSON.stringify([
            'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=900'
        ]),
        photo_main: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=900',
        badge: 'Termoterapia',
        is_featured: 0,
        sort_order: 54
    },
    {
        id: 'PROD-055',
        name: 'Serum Íntimo Relajante "CBD Botanical Nectar"',
        slug: 'serum-intimo-relajante-cbd-botanical-nectar',
        category: 'Sensory Care',
        subtitle: '300 mg de CBD de amplio espectro con aceite de coco fraccionado y menta silvestre',
        price: 1650,
        compare_price: 2100,
        stock: 19,
        description: 'Desarrollado para disolver la tensión pélvica y potenciar la receptividad al tacto. El cannabidiol puro relaja la musculatura lisa mientras la micro-dosis de menta silvestre produce un contraste sutil de frío y calor que despierta las terminaciones nerviosas con extrema suavidad.',
        sensory_notes: 'Sensación: Cosquilleo estimulante con cálida relajación muscular. Base: Coco MCT puro sin químicos.',
        specs_json: JSON.stringify({
            concentracion: '300 mg de CBD extraído por CO2 supercrítico (0.0% THC)',
            volumen: '30 ml con pipeta cuentagotas de precisión',
            compatibilidad: 'Apto para uso cutáneo y genital externo'
        }),
        images_json: JSON.stringify([
            'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=900'
        ]),
        photo_main: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=900',
        badge: 'Botánica Terapéutica',
        is_featured: 0,
        sort_order: 55
    },
    {
        id: 'PROD-056',
        name: 'Bálsamo Voluminizador & Estimulante "Rose Nectar"',
        slug: 'balsamo-voluminizador-estimulante-rose-nectar',
        category: 'Sensory Care',
        subtitle: 'Extracto de rosa damascena y jengibre estimulante para mayor riego sanguíneo local',
        price: 1390,
        compare_price: 1750,
        stock: 24,
        description: 'Una emulsión densa que incrementa la sensibilidad del clítoris y zonas íntimas al contacto. La infusión de rosa de Damasco hidrata profundamente mientras los bio-activos de jengibre aumentan el flujo vascular localizado, provocando una agradable sensación de turgencia y calor.',
        sensory_notes: 'Aroma: Pétalos de rosa fresca con un toque chispeante de pimienta rosa. Textura: Bálsamo gel fundente.',
        specs_json: JSON.stringify({
            volumen: '50 ml en tarro de cristal violeta protector Miron Glass',
            ingredientes: '100% comestible y apto para sexo oral',
            ph: 'Balanceado 4.2 fisiológico'
        }),
        images_json: JSON.stringify([
            'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=900'
        ]),
        photo_main: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=900',
        badge: 'Comestible Gourmet',
        is_featured: 0,
        sort_order: 56
    },

    // -------------------------------------------------------------
    // COUPLES (4 NUEVOS)
    // -------------------------------------------------------------
    {
        id: 'PROD-057',
        name: 'Anillo Vibrador Dual Silky Eclipse',
        slug: 'anillo-vibrador-dual-silky-eclipse',
        category: 'Couples',
        subtitle: 'Doble estimulación simultánea durante el coito con control remoto inalámbrico',
        price: 2750,
        compare_price: 3300,
        stock: 16,
        description: 'Diseñado para compartirse íntimamente en pareja. Ajustado a la base masculina, proporciona una firmeza prolongada mientras su superficie estriada de silicona suave transmite vibraciones intensas al clítoris durante cada acercamiento. Incluye mando a distancia ergonómico con alcance de 12 metros.',
        sensory_notes: 'Tacto: Silicona flexible de alta elasticidad anatómica. Sonido: Motor silencioso < 36 dB.',
        specs_json: JSON.stringify({
            material: 'Silicona médica elástica adaptable a cualquier anatomía',
            control: 'Mando a distancia por radiofrecuencia (alcance 12 m)',
            patrones: '10 modos de vibración continua y pulsada',
            bateria: 'Recarga USB magnética dual'
        }),
        images_json: JSON.stringify([
            'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=900'
        ]),
        photo_main: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=900',
        badge: 'Juegos de Pareja',
        is_featured: 1,
        sort_order: 57
    },
    {
        id: 'PROD-058',
        name: 'Vibrador Ergonómico C-Shape "Amour Privé"',
        slug: 'vibrador-ergonomico-c-shape-amour-prive',
        category: 'Couples',
        subtitle: 'Diseño anatómico en U flexible para usar durante el acto sin manos',
        price: 3890,
        compare_price: 4600,
        stock: 11,
        description: 'El pináculo de la ingeniería del placer compartido. Su brazo interno estimula el punto G mientras el brazo externo descansa sobre el clítoris, permitiendo la penetración sin interferencias. Su núcleo maleable recuerda la forma exacta del cuerpo de la pareja.',
        sensory_notes: 'Tacto: Superficie de tacto piel aterciopelada que transmite calor corporal.',
        specs_json: JSON.stringify({
            motores: '2 motores independientes de alta potencia sincronizados',
            maleabilidad: 'Núcleo flexible con memoria de posición',
            resistencia: '100% impermeable IPX8'
        }),
        images_json: JSON.stringify([
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=900'
        ]),
        photo_main: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=900',
        badge: 'Innovación Parejas',
        is_featured: 1,
        sort_order: 58
    },
    {
        id: 'PROD-059',
        name: 'Cofre de Cartas Sensoriales "Nuit Secrète"',
        slug: 'cofre-cartas-sensoriales-nuit-secrete',
        category: 'Couples',
        subtitle: '54 cartas de intimidad progresiva en caja de madera laqueada y bordes dorados',
        price: 1450,
        compare_price: 1800,
        stock: 25,
        description: 'Una experiencia lúdica para profundizar la complicidad y el deseo. Divididas en 3 niveles de audacia (Conexión Emocional, Caricias Sensoriales y Éxtasis Físico), cada carta propone dinámicas elegantes redactadas por terapeutas de pareja y sexólogos de renombre.',
        sensory_notes: 'Tacto: Cartulina texturizada de 400g con bordes laminados en lámina de oro.',
        specs_json: JSON.stringify({
            contenido: '54 cartas en español/inglés + reloj de arena de 3 minutos',
            presentacion: 'Cofre rígido negro mate con cierre magnético y listón de seda'
        }),
        images_json: JSON.stringify([
            'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=900'
        ]),
        photo_main: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=900',
        badge: 'Conexión Emocional',
        is_featured: 0,
        sort_order: 59
    },
    {
        id: 'PROD-060',
        name: 'Antifaz Doble Faz en Terciopelo y Seda "Sensory Blind"',
        slug: 'antifaz-doble-faz-terciopelo-seda-sensory-blind',
        category: 'Couples',
        subtitle: 'Bloqueo 100% de luz para agudizar los sentidos táctiles y auditivos',
        price: 1190,
        compare_price: 1450,
        stock: 22,
        description: 'La privación visual despierta cada milímetro de la piel multiplicando la intensidad de cualquier caricia. Confeccionado con un exterior en suntuoso terciopelo carmesí y un interior forrado en seda de morera negra transpirable que acaricia los párpados sin presionarlos.',
        sensory_notes: 'Tacto: Almohadillado ultra-suave que descansa sobre el rostro con peso relajante.',
        specs_json: JSON.stringify({
            materiales: 'Terciopelo de algodón exterior + Seda Mulberry 22 momme interior',
            ajuste: 'Cinta elástica regulable forrada en seda para no enredar el cabello',
            dimensiones: '22 cm x 10 cm con puente nasal anti-filtración'
        }),
        images_json: JSON.stringify([
            'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=900'
        ]),
        photo_main: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=900',
        badge: 'Juego Sensorial',
        is_featured: 0,
        sort_order: 60
    },

    // -------------------------------------------------------------
    // SOFT FETISH (4 NUEVOS)
    // -------------------------------------------------------------
    {
        id: 'PROD-061',
        name: 'Látigo Flogger en Cuero Nappa "Velvet Whispers"',
        slug: 'latigo-flogger-cuero-nappa-velvet-whispers',
        category: 'Soft Fetish',
        subtitle: '50 tiras de cuero italiano extra suave con empuñadura tejida a mano',
        price: 2950,
        compare_price: 3600,
        stock: 13,
        description: 'Diseñado tanto para la exploración sensual como para el juego de impacto suave. Cada tira de piel de becerro italiana ha sido tratada artesanalmente para lograr una caída pesada pero una caricia sedosa que roza la piel como una pluma o un golpe sordo según la cadencia.',
        sensory_notes: 'Tacto: Piel nappa flexible y pesada. Sonido: Chasquido sordo aterciopelado.',
        specs_json: JSON.stringify({
            cuero: '100% piel de becerro italiana de curtición vegetal',
            longitud: '55 cm total (mango de 15 cm con muñequera de seguridad)',
            herrajes: 'Anillo de latón bañado en oro en la base'
        }),
        images_json: JSON.stringify([
            'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=900'
        ]),
        photo_main: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=900',
        badge: 'Artesanía Italiana',
        is_featured: 1,
        sort_order: 61
    },
    {
        id: 'PROD-062',
        name: 'Harness Corporal de Cuero y Cadenas "Kassiopeia"',
        slug: 'harness-corporal-cuero-cadenas-kassiopeia',
        category: 'Soft Fetish',
        subtitle: 'Diseño geométrico para pecho y cintura con eslabones bañados en oro de 24K',
        price: 3750,
        compare_price: 4500,
        stock: 12,
        description: 'Una pieza de alta joyería corporal que enmarca el escote y las costillas con precisión geométrica. Cuero vacuno de 1.8 mm de grosor con bordes pulidos a mano y cadenas ultraligeras inoxidables que tintinean con cada movimiento sensual.',
        sensory_notes: 'Tacto: Cuero firme con interior lijado de tacto aterciopelado. Frío metálico dorado al contacto inicial.',
        specs_json: JSON.stringify({
            correas: 'Cuero negro de curtición vegetal con 5 puntos de micro-ajuste',
            cadenas: 'Latón macizo galvanizado en oro de 24K anticorrosión',
            adaptabilidad: 'Totalmente regulable para contornos de 65 cm a 105 cm'
        }),
        images_json: JSON.stringify([
            'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=900'
        ]),
        photo_main: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=900',
        badge: 'Joyería Fetish',
        is_featured: 1,
        sort_order: 62
    },
    {
        id: 'PROD-063',
        name: 'Collar Choker de Terciopelo y Argolla O-Ring "Nocturne"',
        slug: 'collar-choker-terciopelo-argolla-o-ring-nocturne',
        category: 'Soft Fetish',
        subtitle: 'Terciopelo negro azabache de 4 cm de ancho con argolla central de oro pulido',
        price: 1850,
        compare_price: 2200,
        stock: 20,
        description: 'La sobriedad y la sumisión refinada se unen en esta pieza icónica. Forrado interiormente con cuero de cordero para máximo confort sobre el cuello, su argolla dorada de 30 mm permite acoplar cadenas o correas con mosquetón giratorio incluido.',
        sensory_notes: 'Tacto: Piel de cordero ultra-suave en contacto con la garganta, exterior en terciopelo profundo.',
        specs_json: JSON.stringify({
            ancho: '40 mm de presencia elegante',
            ajuste: 'Hebilla de rodillo posterior regulable de 30 cm a 42 cm',
            herrajes: 'Latón pulido a espejo resistente a la tracción'
        }),
        images_json: JSON.stringify([
            'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=900'
        ]),
        photo_main: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=900',
        badge: 'Elegancia Noir',
        is_featured: 0,
        sort_order: 63
    },
    {
        id: 'PROD-064',
        name: 'Máscara Veneciana de Cuero Filigranado "Masquerade"',
        slug: 'mascara-veneciana-cuero-filigranado-masquerade',
        category: 'Soft Fetish',
        subtitle: 'Cuero moldeado térmicamente con calados florales y lazos de satén',
        price: 2200,
        compare_price: 2800,
        stock: 14,
        description: 'Inspirada en el misterio de los bailes de máscaras venecianos del siglo XVIII. Esculpida en una sola pieza de cuero curtido al agua que se amolda con calidez a las facciones del rostro, ocultando la identidad mientras exalta la mirada.',
        sensory_notes: 'Tacto: Cuero rígido pero flexible que se adapta con el calor del rostro.',
        specs_json: JSON.stringify({
            tecnica: 'Corte por láser y moldeado manual sobre horma anatómica',
            sujecion: 'Cintas dobles de satén de seda negro azabache de 50 cm',
            peso: 'Apenas 65 g para portar cómodamente durante horas'
        }),
        images_json: JSON.stringify([
            'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80&w=900'
        ]),
        photo_main: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80&w=900',
        badge: 'Alta Venecia',
        is_featured: 0,
        sort_order: 64
    }
];

module.exports = { additionalProducts };

