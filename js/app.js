
// Función global de descarte de Age Gate a prueba de fallos táctiles en móvil
window.dismissAgeGate = function(e) {
    if (e) {
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    try {
        localStorage.setItem('redVelvetAgeVerified', 'true');
    } catch(err) {}

    const gate = document.getElementById('age-gate');
    if (gate) {
        gate.classList.remove('active');
        gate.style.setProperty('display', 'none', 'important');
        gate.style.setProperty('pointer-events', 'none', 'important');
        gate.style.setProperty('opacity', '0', 'important');
    }
    document.body.style.overflow = 'auto';
    if (typeof playMusic === 'function') {
        try { playMusic(); } catch(m) {}
    }
};

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. ESTADO GLOBAL DE PRODUCTOS Y CARRITO
    // ==========================================================================
    let allProducts = [];
    let currentCategory = 'all';
    let currentSearchTerm = '';
    let currentSort = 'featured';
    let appliedCoupon = null;

    // Catálogo maestro de reserva (Fallback de ultra-lujo por si la API tarda o está offline)
    const fallbackProducts = [
        {
                "id": "PROD-001",
                "name": "Succionador de Clítoris \"Aura Touch\"",
                "slug": "succionador-clitoris-aura-touch",
                "category": "Pleasure Tech",
                "subtitle": "Succionador de clítoris por aire pulsado con estimulación suave sin fricción",
                "price": 2890,
                "compare_price": 3450,
                "stock": 24,
                "description": "El succionador clásico con tecnología de aire pulsado y vacío suave. Estimula el clítoris mediante pulsaciones envolventes sin contacto directo ni fricción agresiva, permitiendo llegar al clímax con máxima suavidad y comodidad. Fabricado en silicona líquida médica biocompatible, sumergible y de tacto aterciopelado.",
                "sensory_notes": "Pulsaciones de aire cálido, vibración de base profunda, silicona ultrasuave e hipoalergénica.",
                "specs": {
                        "material": "Silicona médica ultrasuave biocompatible & ABS bañado en oro rosa",
                        "impermeabilidad": "IPX7 (100% sumergible hasta 1 metro de profundidad)",
                        "ruido": "< 38 dB (Tecnología Whisper-Quiet)",
                        "modos": "10 intensidades de pulsación de aire y 5 ritmos de vibración",
                        "bateria": "Batería de iones de litio recargable por pin magnético USB",
                        "autonomia": "Hasta 2 horas continuas con carga completa de 90 min",
                        "garantia": "2 años de garantía de reposición directa"
                },
                "photo_main": "https://images.unsplash.com/photo-1593527538338-86235520a070?auto=format&fit=crop&q=80&w=900",
                "badge": "Bestseller",
                "sort_order": 1
        },
        {
                "id": "PROD-002",
                "name": "Velvet Noir Dual Wand",
                "slug": "velvet-noir-dual-wand",
                "category": "Pleasure Tech",
                "subtitle": "Varita masajeadora flexible con doble motor sincrónico",
                "price": 3650,
                "compare_price": 4200,
                "stock": 18,
                "description": "La cúspide del masaje sensual y la relajación corporal. Diseñada con un cabezal pivotante de 360 grados y un núcleo ponderado que transmite ondas de baja frecuencia capaces de relajar tensiones musculares profundas o llevar el juego íntimo a su máxima intensidad.",
                "sensory_notes": "Equilibrio perfecto de peso ergonómico, cabezal acolchado ultraflexible, calor térmico sutil integrado de 38°C.",
                "specs": {
                        "material": "Silicona premium líquida de tacto afelpado",
                        "impermeabilidad": "IPX6 resistente a salpicaduras y ducha",
                        "ruido": "< 42 dB",
                        "modos": "10 programas de pulso y 5 niveles de fuerza",
                        "bateria": "Carga magnética rápida de 120 minutos",
                        "autonomia": "3 horas de funcionamiento ininterrumpido",
                        "garantia": "2 años"
                },
                "photo_main": "https://images.unsplash.com/photo-1594730366202-0c102627dec6?auto=format&fit=crop&q=80&w=900",
                "badge": "Edición Elite",
                "sort_order": 2
        },
        {
                "id": "PROD-010",
                "name": "Collar Joya Vibrador \"Vesper Royale\"",
                "slug": "collar-joya-vibrador-vesper-royale",
                "category": "Pleasure Tech",
                "subtitle": "Dije de alta joyería bañado en oro rosa de 24K con vibrador secreto ultra-silencioso",
                "price": 4100,
                "compare_price": 4800,
                "stock": 12,
                "description": "Una pieza de orfebrería exquisita creada para llevarse con total naturalidad en galas y eventos. Su silueta estilizada encierra un motor de micro-resonancia de 4 velocidades capaz de brindar placer discreto en cualquier momento o lugar sin despertar sospechas.",
                "sensory_notes": "Frío inicial del metal noble que se atempera con el calor de la piel, vibración focalizada con precisión milimétrica.",
                "specs": {
                        "material": "Acero inoxidable quirúrgico 316L con baño de Oro Rosa de 24K",
                        "cadena": "Cadena de eslabón veneciano de 65 cm con broche de seguridad",
                        "ruido": "< 30 dB (Completamente inaudible a más de 30 cm)",
                        "modos": "4 velocidades constantes y pulsátiles de toque intuitivo",
                        "bateria": "Recarga micro USB oculta en la base roscada hermética"
                },
                "photo_main": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=900",
                "badge": "Alta Joyería",
                "sort_order": 3
        },
        {
                "id": "PROD-011",
                "name": "Vibrador Conejo Rabbit Dual \"Onyx Eclipse\"",
                "slug": "vibrador-conejo-rabbit-onyx-eclipse",
                "category": "Pleasure Tech",
                "subtitle": "Vibrador anatómico de estimulación dual clítoris y punto G con función térmica",
                "price": 3490,
                "compare_price": 3950,
                "stock": 15,
                "description": "El icónico vibrador tipo conejo de doble estimulación clitoriana y vaginal. Cuenta con función de calentamiento suave a 39°C que emula el calor corporal natural y dos motores independientes con múltiples ritmos de vibración. Silicona médica ultrasuave y 100% sumergible.",
                "sensory_notes": "Calor reconfortante a 39°C, silicona suave de tacto sedoso y vibración dual sincronizada.",
                "specs": {
                        "material": "Silicona médica hipoalergénica de doble densidad",
                        "impermeabilidad": "IPX7 (100% sumergible)",
                        "terapia_termica": "Calentamiento automático a 39°C en 90 segundos",
                        "modos": "12 patrones combinados de estimulación dual",
                        "bateria": "Batería Li-ion con cargador magnético rápido"
                },
                "photo_main": "https://images.unsplash.com/photo-1645578735887-c1484e5b5f5f?auto=format&fit=crop&q=80&w=900",
                "badge": "Térmico 39°C",
                "sort_order": 4
        },
        {
                "id": "PROD-012",
                "name": "Siren Pearl Air-Pulse",
                "slug": "siren-pearl-air-pulse",
                "category": "Pleasure Tech",
                "subtitle": "Succionador de ondas de aire de micro-vacío con perla de vibración focalizada",
                "price": 2950,
                "compare_price": 3300,
                "stock": 20,
                "description": "El equilibrio supremo entre ondas de aire pulsadas y contacto físico suave. La membrana de silicona ultrafina genera ondas de vacío rítmicas que rodean el centro del placer sin frotación brusca, permitiendo múltiples clímax sin sobresensibilización.",
                "sensory_notes": "Sensación de succión cálida envolvente y palpitante, tacto sedoso y liviano en mano.",
                "specs": {
                        "material": "Silicona biocompatible de tacto pluma y policarbonato perlado",
                        "impermeabilidad": "IPX7 sumergible",
                        "ruido": "< 35 dB (Whisper-Quiet)",
                        "modos": "11 niveles de ondas pulsátiles",
                        "autonomia": "120 minutos de uso continuo"
                },
                "photo_main": "https://images.unsplash.com/photo-1645578735063-f48746f8c066?auto=format&fit=crop&q=80&w=900",
                "badge": "Tecnología de Aire",
                "sort_order": 5
        },
        {
                "id": "PROD-003",
                "name": "Sérum Íntimo Seda de Medianoche",
                "slug": "serum-intimo-seda-de-medianoche",
                "category": "Sensory Care",
                "subtitle": "Lubricante prémium a base de agua purificada con Ácido Hialurónico y Aloe Vera",
                "price": 790,
                "compare_price": 950,
                "stock": 50,
                "description": "Formulado en laboratorios dermatológicos de alta gama. Su base de agua purificada biocompatible hidrata y regenera los tejidos delicados, aportando un deslizamiento satinado natural y no pegajoso que nunca interfiere con preservativos ni silicona médica.",
                "sensory_notes": "Deslizamiento infinito, pH equilibrado 4.2, aroma sutil casi neutro con notas botánicas de flor de azahar.",
                "specs": {
                        "volumen": "100 ml con dispensador dosificador sin goteo",
                        "ingredientes": "Agua purificada, Ácido Hialurónico vegetal, Extracto de Aloe Barbadensis, Glicerina vegetal grado USP",
                        "compatibilidad": "100% seguro con látex, poliisopreno y silicona médica",
                        "certificaciones": "Cruelty-free, vegano, libre de parabenos, petroquímicos y perfumes artificiales"
                },
                "photo_main": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=900",
                "badge": "100% Biocompatible",
                "sort_order": 6
        },
        {
                "id": "PROD-004",
                "name": "Vela de Masaje Térmico Champagne & Higo Negro",
                "slug": "vela-masaje-termico-champagne-higo",
                "category": "Sensory Care",
                "subtitle": "Cera de soja botánica enriquecida con manteca de karité y aceite de jojoba",
                "price": 920,
                "compare_price": 1100,
                "stock": 35,
                "description": "Al encenderse, su llama suave funde lentamente una rica manteca caliente diseñada para derramarse directamente sobre la piel a una temperatura corporal perfecta (38°C). Nutre intensamente mientras aromatiza la alcoba con notas amaderadas y sensuales.",
                "sensory_notes": "Calor relajante inmediato, absorción sedosa sin sensación grasa, notas de higo maduro, vainilla bourbon y bergamota.",
                "specs": {
                        "contenido": "220 gramos (más de 30 aplicaciones completas)",
                        "temperatura_fusion": "Baja temperatura de fusión (38°C - no quema)",
                        "ingredientes": "Cera de soja 100% pura, manteca de karité orgánica, aceite de almendras dulces, esencia de higo negro",
                        "recipiente": "Cerámica esmaltada en negro mate con pico vertedor de precisión"
                },
                "photo_main": "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=900",
                "badge": "Experiencia Sensorial",
                "sort_order": 7
        },
        {
                "id": "PROD-016",
                "name": "Elixir Sensuel — Aceite de Masaje Botánico Relajante",
                "slug": "elixir-sensuel-aceite-masaje-botanico",
                "category": "Sensory Care",
                "subtitle": "Mezcla de aceites prensados en frío de argán, jojoba y jazmín silvestre",
                "price": 1150,
                "compare_price": 1350,
                "stock": 30,
                "description": "Un aceite seco de absorción progresiva que acaricia la piel con suavidad de terciopelo. Su mezcla aromática de sándalo blanco, jazmín sambac y notas de ámbar despierta los sentidos y favorece la relajación muscular profunda en masajes íntimos o en pareja.",
                "sensory_notes": "Acabado satinado sin rastro grasoso, tacto cálido en contacto con las manos, aroma envolvente y seductor.",
                "specs": {
                        "presentacion": "Botella de vidrio ámbar de 150 ml con gotero dosificador de precisión",
                        "ingredientes": "Aceite de Argán puro de Marruecos, Aceite de Jojoba dorado, Esencia de Jazmín Real, Vitamina E",
                        "beneficios": "Nutre la barrera cutánea, no tapa poros, 100% orgánico certificado"
                },
                "photo_main": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=900",
                "badge": "Orgánico Certificado",
                "sort_order": 8
        },
        {
                "id": "PROD-017",
                "name": "Bálsamo Sensorial \"Néctar Dual Fuego & Escarcha\"",
                "slug": "balsamo-sensorial-nectar-dual",
                "category": "Sensory Care",
                "subtitle": "Gel estimulante de zonas erógenas con efecto térmico progresivo",
                "price": 650,
                "compare_price": 780,
                "stock": 45,
                "description": "Unas gotas bastan para transformar cualquier roce en una corriente eléctrica placentera. Combina extractos botánicos de menta piperita y jengibre africano para crear una oscilación constante entre frío estimulante y calor envolvente.",
                "sensory_notes": "Sensación de cosquilleo magnético, mayor afluencia sanguínea y respuesta sensitiva intensificada.",
                "specs": {
                        "volumen": "50 ml en envase airless para máxima frescura",
                        "efecto": "Térmico alternado caliente / fresco durante 30-45 minutos",
                        "ingredientes": "Extracto de Spilanthes Acmella, mentol natural, jengibre, base glicerinada comestible"
                },
                "photo_main": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=900",
                "badge": "Efecto Dual",
                "sort_order": 9
        },
        {
                "id": "PROD-018",
                "name": "Sales de Baño Afrodisíacas \"Ritual de Afrodita\"",
                "slug": "sales-bano-afrodisiacas-ritual-afrodita",
                "category": "Sensory Care",
                "subtitle": "Cristales de sal del Himalaya con pétalos de rosa de Damasco y aceites puros",
                "price": 720,
                "compare_price": 880,
                "stock": 25,
                "description": "Diseñadas para convertir el preludio en un santuario sensorial. Ricas en 84 minerales esenciales, desintoxican el cuerpo mientras sus vapores aromáticos de rosa búlgara, pachulí y geranio relajan el sistema nervioso e inducen a la entrega total.",
                "sensory_notes": "Agua suave y sedosa al tacto, aroma floral dulce de fondo amaderado, relajación muscular inmediata.",
                "specs": {
                        "peso": "450 gramos (aprox. 8 baños completos)",
                        "ingredientes": "Sal rosa del Himalaya sin refinar, sales de Epsom grado farmacéutico, flores secas de rosas francesas"
                },
                "photo_main": "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=900",
                "badge": "Preludio Íntimo",
                "sort_order": 10
        },
        {
                "id": "PROD-005",
                "name": "Bodysuit Encaje Francés \"Crimson Allure\"",
                "slug": "bodysuit-crimson-allure",
                "category": "Fine Lingerie",
                "subtitle": "Lencería de alta costura con transparencias y encaje floral",
                "price": 2450,
                "compare_price": 2950,
                "stock": 16,
                "description": "Confeccionado artesanalmente con encaje Chantilly de motivos florales y tul elástico de tacto invisible. Escote halter pronunciado con herrajes bañados en oro que perfilan la silueta con una sensualidad elegante y misteriosa.",
                "sensory_notes": "Tejido extremadamente suave que no pica, costuras invisibles que abrazan la figura con soporte suave.",
                "specs": {
                        "tallas": "S (32B-34A), M (34B-36B), L (36C-38B)",
                        "material": "85% Poliamida reciclada de alta densidad, 15% Elastano de seda",
                        "cuidados": "Lavado a mano con jabón neutro, secado en plano",
                        "detalles": "Cierre inferior con broches de presión ocultos, tirantes regulables"
                },
                "photo_main": "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&q=80&w=900",
                "badge": "Alta Costura",
                "sort_order": 11
        },
        {
                "id": "PROD-006",
                "name": "Bata Kimono Seda y Terciopelo Red Velvet",
                "slug": "bata-kimono-seda-terciopelo",
                "category": "Fine Lingerie",
                "subtitle": "Bata fluida en satén de seda pesado con ribetes en terciopelo burdeos",
                "price": 3100,
                "compare_price": 3800,
                "stock": 12,
                "description": "La prenda insignia de la casa RED VELVET. Creada para el preludio perfecto, esta bata envuelve la piel con un brillo líquido sublime y mangas acampanadas inspiradas en el glamour clásico de los años 50.",
                "sensory_notes": "Caída pesada y fresca de la seda natural, ribetes aterciopelados cálidos en puños y solapas.",
                "specs": {
                        "corte": "Kimono holgado con cinturón desmontable a juego",
                        "tejido": "Satén de seda mulberry de 22 mommes y terciopelo italiano",
                        "longitud": "Hasta media pantorrilla (120 cm)",
                        "talla": "Talla única ajustable (apta para XS a XL)"
                },
                "photo_main": "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=900",
                "badge": "Exclusivo",
                "sort_order": 12
        },
        {
                "id": "PROD-013",
                "name": "Arnés Corporal Joya \"Aphrodite Gold\"",
                "slug": "arnes-corporal-joya-aphrodite-gold",
                "category": "Fine Lingerie",
                "subtitle": "Cadenas de latón bañadas en oro de 18K y bandas de terciopelo burdeos ajustable",
                "price": 2190,
                "compare_price": 2600,
                "stock": 14,
                "description": "Una fusión fascinante entre joyería y lencería fetichista de pasarela. Sus cadenas doradas caen sobre el pecho y enmarcan la cintura resaltando las curvas naturales con destellos luminosos sobre la piel desnuda.",
                "sensory_notes": "Contacto fresco del metal fino, movimiento fluido que tintinea suavemente al caminar.",
                "specs": {
                        "material": "Aleación hipoalergénica con triple baño de Oro de 18K libre de níquel",
                        "ajuste": "Cadenas extensibles en hombros, contorno bajo busto y cadera (apto para tallas XS a L)",
                        "estuche": "Caja joyera forrada en terciopelo negro con placa grabada"
                },
                "photo_main": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=900",
                "badge": "Joyería Corporal",
                "sort_order": 13
        },
        {
                "id": "PROD-014",
                "name": "Conjunto Bralette & Tanga \"Midnight Bloom\"",
                "slug": "conjunto-bralette-tanga-midnight-bloom",
                "category": "Fine Lingerie",
                "subtitle": "Satén de seda negra pura con bordados de encaje delicado",
                "price": 1980,
                "compare_price": 2400,
                "stock": 22,
                "description": "Pieza de diseño íntimo pensada para deslumbrar sin sacrificar confort. El bralette sin aros ofrece sujeción natural mediante bandas elásticas de seda, complementado por una tanga con laterales regulables en oro.",
                "sensory_notes": "Caricia sedosa continua, ligereza casi imperceptible que acompaña cada movimiento.",
                "specs": {
                        "composicion": "92% Seda Natural Mulberry, 8% Elastano",
                        "detalles": "Hebillas doradas resistentes al agua, forro de algodón puro en puente",
                        "tallas": "S (32A-34B), M (34C-36B), L (36C-38C)"
                },
                "photo_main": "https://images.unsplash.com/photo-1592398289517-d9437d109bc2?auto=format&fit=crop&q=80&w=900",
                "badge": "Seda Mulberry",
                "sort_order": 14
        },
        {
                "id": "PROD-007",
                "name": "Kit de Alcoba Velvet Bondage Chic",
                "slug": "kit-alcoba-velvet-bondage-chic",
                "category": "Soft Fetish",
                "subtitle": "Antifaz de seda acolchado, esposas forradas en terciopelo y pluma de caricia",
                "price": 1850,
                "compare_price": 2200,
                "stock": 22,
                "description": "Una invitación refinada a explorar la rendición del control y la privación sensorial. Las esposas con cierre magnético y forro de terciopelo protegen las muñecas con ternura, mientras el antifaz bloquea toda luz para agudizar los demás sentidos al 200%.",
                "sensory_notes": "Tacto esponjoso y seguro, privación visual total, cosquilleo estimulante con pluma de caricia natural.",
                "specs": {
                        "incluye": "1 Antifaz blackout de seda acolchada, 2 Esposas forradas con mosquetón metálico dorado, 1 Fusta de plumas suaves de 28cm",
                        "materiales": "Piel vegana estructurada, terciopelo ultrasuave, herrajes de aleación de zinc dorado pulido",
                        "ajuste": "Universal y regulable mediante hebillas seguras de apertura rápida"
                },
                "photo_main": "https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?auto=format&fit=crop&q=80&w=900",
                "badge": "Favorito en Pareja",
                "sort_order": 15
        },
        {
                "id": "PROD-019",
                "name": "Fusta de Cuero Trenzado \"Le Fouet Royale\"",
                "slug": "fusta-cuero-trenzado-le-fouet-royale",
                "category": "Soft Fetish",
                "subtitle": "Cuero genuino curtido vegetal con pompón de caricias y empuñadura en latón pulido",
                "price": 1450,
                "compare_price": 1750,
                "stock": 18,
                "description": "Una joya artesanal para juegos de dominación suave y estímulo cutáneo. Su látigo flexible de cuero flor transmite una palmada limpia sin dejar marcas agresivas, mientras su pompón opuesto acaricia con sutileza aristocrática.",
                "sensory_notes": "Chasquido seco y excitante en el aire, tacto firme y equilibrado en la mano con peso noble.",
                "specs": {
                        "longitud": "48 cm en total con empuñadura ergonómica de 14 cm",
                        "materiales": "Cuero curtido al vegetal libre de cromo, núcleo de fibra de vidrio elástica, latón dorado",
                        "doble_uso": "Extremo fusta de impacto suave y pompón de pluma suave"
                },
                "photo_main": "https://images.unsplash.com/photo-1542295669297-4d352b042bca?auto=format&fit=crop&q=80&w=900",
                "badge": "Hecho a Mano",
                "sort_order": 16
        },
        {
                "id": "PROD-020",
                "name": "Paleta Reversible Terciopelo & Cuero \"Velvet Whisper\"",
                "slug": "paleta-reversible-terciopelo-cuero",
                "category": "Soft Fetish",
                "subtitle": "Superficie dual con cara de terciopelo burdeos para caricias y cuero negro para impacto amortiguado",
                "price": 1100,
                "compare_price": 1350,
                "stock": 25,
                "description": "Elegante y no intimidante. Pensada para quienes se inician en el juego sensorial con total confianza. El lado aterciopelado calma y relaja, mientras el reverso en cuero firme despierta la adrenalina con un sonido apagado de gran carga erótica.",
                "sensory_notes": "Impacto suave con acolchado interior de espuma de alta memoria que amortigua el golpe.",
                "specs": {
                        "dimensiones": "32 cm x 6 cm",
                        "material": "Piel vegana reforzada, terciopelo de algodón, remaches de aleación dorada"
                },
                "photo_main": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=900",
                "badge": "Doble Sensación",
                "sort_order": 17
        },
        {
                "id": "PROD-008",
                "name": "Baraja de Intimidad & Retos Sensoriales \"Eros\"",
                "slug": "baraja-intimidad-retos-eros",
                "category": "Couples",
                "subtitle": "100 cartas con dinámicas de conexión emocional, conversación y juego erótico progresivo",
                "price": 680,
                "compare_price": 850,
                "stock": 40,
                "description": "Diseñada por terapeutas de pareja y sexólogos. Dividida en tres niveles de juego: Intimidad Emocional, Caricias y Tensión Erótica, y Retos de Placer Total. La herramienta definitiva para reavivar la llama y descubrir fantasías no expresadas.",
                "sensory_notes": "Cartas con tacto satinado mate y cantos dorados, caja rígida imantada de colección.",
                "specs": {
                        "cartas": "100 naipes de 350g con laminado tacto seda soft-touch",
                        "niveles": "Nivel 1: Conexión Profunda (30), Nivel 2: Sensualidad & Caricias (35), Nivel 3: Éxtasis & Pasión (35)",
                        "presentacion": "Estuche rígido con cierre magnético y grabado en oro metálico"
                },
                "photo_main": "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&q=80&w=900",
                "badge": "Juego de Pareja",
                "sort_order": 18
        },
        {
                "id": "PROD-009",
                "name": "Ring Vibrador Tántrico \"Apollo\"",
                "slug": "ring-vibrador-tantrico-apollo",
                "category": "Couples",
                "subtitle": "Anillo ergonómico de doble estimulación simultánea con control remoto Bluetooth",
                "price": 1980,
                "compare_price": 2400,
                "stock": 28,
                "description": "Diseñado para compartirse. Mientras prolonga la firmeza y resistencia masculina, su motor superior sincronizado acaricia el clítoris en cada encuentro íntimo. Puede controlarse de forma remota a través de smartphone o su elegante mando a distancia en forma de gota.",
                "sensory_notes": "Silicona extensible ultraelástica sin estrangulamiento, vibración sincronizada envolvente.",
                "specs": {
                        "material": "Silicona líquida elástica apta para cualquier anatomía",
                        "impermeabilidad": "IPX7 sumergible",
                        "conectividad": "Bluetooth 5.0 con alcance de hasta 10 metros y control por app a distancia",
                        "bateria": "USB magnético con 90 minutos de autonomía continua"
                },
                "photo_main": "https://images.unsplash.com/photo-1594730133212-3289de4786cf?auto=format&fit=crop&q=80&w=900",
                "badge": "Control Remoto",
                "sort_order": 19
        },
        {
                "id": "PROD-021",
                "name": "Set de Dados Eróticos Esculpidos \"Pleasure Roll\"",
                "slug": "dados-eroticos-pleasure-roll",
                "category": "Couples",
                "subtitle": "Dados metálicos de peso macizo en acabado oro rosa con grabados sensoriales en bajo relieve",
                "price": 590,
                "compare_price": 750,
                "stock": 35,
                "description": "Deja que el azar dicte la siguiente caricia. Dos dados de aleación pulida: uno indica la acción sensorial (Besar, Acariciar, Morder suave, Lamer, Calentar, Azotar suave) y el otro la zona del cuerpo.",
                "sensory_notes": "Peso sólido en la palma de la mano, esquinas suavizadas para un rodar fluido sobre sábanas de seda.",
                "specs": {
                        "contenido": "2 Dados metálicos de 20 mm cada uno",
                        "acabado": "Oro Rosa espejo electrochapado resistente al desgaste",
                        "presentacion": "Bolsa de terciopelo burdeos con jareta dorada"
                },
                "photo_main": "https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&q=80&w=900",
                "badge": "Juego Rápido",
                "sort_order": 20
        },
        {
                "id": "PROD-022",
                "name": "Kit Tántrico de Cristal Cuarzo Rosa \"Sanctuary\"",
                "slug": "kit-tantrico-cristal-cuarzo-rosa",
                "category": "Couples",
                "subtitle": "Vara masajeadora de cuarzo rosa natural pulida a mano y abanico de plumas de seda",
                "price": 2350,
                "compare_price": 2800,
                "stock": 16,
                "description": "Inspirado en los rituales orientales de despertar energético. El cuarzo rosa mineral 100% natural puede enfriarse en agua con hielo o calentarse en agua tibia para masajear puntos meridianos y zonas erógenas con una pureza espiritual y física insuperable.",
                "sensory_notes": "Retención térmica duradera de la piedra natural, energía sedosa y calmante sobre la piel.",
                "specs": {
                        "mineral": "Cuarzo Rosa Natural de Madagascar grado AAA pulido sin barnices químicos",
                        "longitud_vara": "18 cm con doble extremo redondeado anatómico",
                        "incluye": "Vara de cuarzo, pluma de seda blanca de avestruz, estuche acolchado y guía de masaje tántrico"
                },
                "photo_main": "https://images.unsplash.com/photo-1567982047351-76b6f93e38ee?auto=format&fit=crop&q=80&w=900",
                "badge": "Cuarzo Natural",
                "sort_order": 21
        },
        {
                "id": "PROD-023",
                "name": "Varita Masajeador Magic Wand \"Solstice\"",
                "slug": "varita-masajeador-magic-wand-solstice",
                "category": "Pleasure Tech",
                "subtitle": "Masajeador corporal y de zonas íntimas de alta potencia con cabezal flexible",
                "price": 3200,
                "compare_price": 3750,
                "stock": 18,
                "description": "El clásico masajeador tipo varita mágica (Magic Wand) reinventado con acabado en silicona líquida médica ultra suave. Diseñado para relajar la tensión muscular de cuello y espalda o brindar una potente estimulación íntima con vibración profunda y continua sin adormecer la mano.",
                "sensory_notes": "Cabezal amortiguado ultra-suave, agarre contorneado con balance de peso perfecto, emisión sonora reducida (<39 dB).",
                "specs": {
                        "material": "Silicona médica líquida y núcleo de aluminio cepillado",
                        "impermeabilidad": "IPX7 sumergible",
                        "ruido": "< 39 dB (Whisper-Quiet)",
                        "autonomia": "2.5 horas de uso continuo con carga rápida",
                        "garantia": "2 años de reposición directa"
                },
                "photo_main": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=900",
                "badge": "Edición Especial",
                "sort_order": 22
        },
        {
                "id": "PROD-024",
                "name": "Estimulador de Pareja \"Nexus Sync\"",
                "slug": "estimulador-pareja-nexus-sync",
                "category": "Pleasure Tech",
                "subtitle": "Dispositivo ergonómico manos libres con vibración sincrónica dual durante la penetración",
                "price": 3850,
                "compare_price": 4400,
                "stock": 15,
                "description": "Diseñado para compartirse. Su perfil en forma de U se adapta anatómicamente para estimular el punto G y el clítoris simultáneamente durante el coito, amplificando el placer de ambos amantes. Control inalámbrico discreto y compatible con app privada a larga distancia.",
                "sensory_notes": "Silicona flexible con memoria de forma, calor corporal receptivo, conexión íntima compartida.",
                "specs": {
                        "material": "Silicona biocompatible satinada grado quirúrgico",
                        "conectividad": "Bluetooth 5.2 cifrado & Control remoto discreto",
                        "impermeabilidad": "IPX7 100% resistente al agua",
                        "bateria": "Carga magnética USB hermética",
                        "ruido": "< 40 dB"
                },
                "photo_main": "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=900",
                "badge": "Juego en Pareja",
                "sort_order": 23
        },
        {
                "id": "PROD-025",
                "name": "Aceite Íntimo Botánico \"Botanical Aphrodisia\"",
                "slug": "aceite-intimo-botanico-aphrodisia",
                "category": "Sensory Care",
                "subtitle": "Infusión artesanal de Jojoba dorada, Rosa Damascena y Sándalo australiano",
                "price": 890,
                "compare_price": 1100,
                "stock": 40,
                "description": "Un néctar nutritivo prensado en frío para masajes sensoriales y estimulación corporal integral. Se absorbe con una lentitud voluptuosa, hidratando la piel y dejando un halo aromático embriagador que agudiza el deseo.",
                "sensory_notes": "Aroma amaderado floral misterioso, absorción sedosa no grasa, calor reconfortante al contacto prolongado.",
                "specs": {
                        "volumen": "120 ml con dispensador de cristal ámbar",
                        "ingredientes": "Aceite de Jojoba dorado orgánico, Rosa Damascena, Aceite de Sándalo, Vitamina E",
                        "origen": "100% natural, vegano y libre de químicos sintéticos"
                },
                "photo_main": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=900",
                "badge": "100% Orgánico",
                "sort_order": 24
        },
        {
                "id": "PROD-026",
                "name": "Mantequilla de Masaje Besable \"Dark Chocolate & Truffle\"",
                "slug": "mantequilla-masaje-chocolate-truffle",
                "category": "Sensory Care",
                "subtitle": "Bálsamo corporal comestible formulado con cacao orgánico de Tabasco y manteca de karité pura",
                "price": 680,
                "compare_price": 820,
                "stock": 35,
                "description": "Una delicia para los sentidos táctiles y gustativos. Se funde al instante con el calor de los dedos o de los labios, invitando a explorar cada rincón de la anatomía de tu amante con besos cálidos y caricias lentas.",
                "sensory_notes": "Textura rica aterciopelada, sabor a chocolate amargo gourmet sin azúcares refinados, no deja residuo pegajoso.",
                "specs": {
                        "peso_neto": "90 g en tarro de cristal violeta protector Miron",
                        "comestible": "100% grado alimentario de cultivo ecológico",
                        "seguridad": "Libre de gluten, lácteos, parabenos y conservadores artificiales"
                },
                "photo_main": "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=900",
                "badge": "Besable",
                "sort_order": 25
        },
        {
                "id": "PROD-027",
                "name": "Corset Estructurado en Satén Noir \"Étoile\"",
                "slug": "corset-saten-noir-etoile",
                "category": "Fine Lingerie",
                "subtitle": "Corsetería de alta costura con varillas de acero flexibles y copas en encaje chantilly",
                "price": 2950,
                "compare_price": 3600,
                "stock": 14,
                "description": "Esculpe una silueta reloj de arena irresistible. Confeccionado con satén de seda pesada y forro interior de algodón transpirable. Su espalda con ojalillos dorados y cinta de satén permite regular el ajuste con precisión milimétrica.",
                "sensory_notes": "Sujeción firme y sensual, tacto exterior frío y resbaladizo, realce natural del busto y cintura.",
                "specs": {
                        "materiales": "Satén de seda duquesa, encaje francés Chantilly, ballenas metálicas espirales",
                        "cierre": "Apertura frontal de broches planos de acero y lazada trasera de satén",
                        "tallas": "Ajustable de S a L mediante cordón posterior"
                },
                "photo_main": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=900",
                "badge": "Alta Costura",
                "sort_order": 26
        },
        {
                "id": "PROD-028",
                "name": "Arnés de Cuero Suave & Cadena de Oro \"Sovereign\"",
                "slug": "arnes-cuero-oro-sovereign",
                "category": "Soft Fetish",
                "subtitle": "Arnés de pecho y hombros en piel de napa con herrajes bañados en oro champagne",
                "price": 2200,
                "compare_price": 2650,
                "stock": 18,
                "description": "Una declaración de sensualidad y empoderamiento. Sus correas regulables de cuero suave se amoldan a las curvas del cuerpo sin marcar, complementadas por cadenas doradas extraíbles que caen con elegancia sobre el escote o la espalda.",
                "sensory_notes": "Aroma embriagador a cuero legítimo, suavidad interior de ante, brillo sutil de los herrajes pulidos.",
                "specs": {
                        "material": "Cuero de napa curtido vegetal y forro afelpado",
                        "herrajes": "Aleación pulida bañada en oro champagne antioxidante",
                        "regulable": "Ajuste milimétrico para tallas XS a XL"
                },
                "photo_main": "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=900",
                "badge": "Diseño Exclusivo",
                "sort_order": 27
        },
        {
                "id": "PROD-029",
                "name": "Vela de Cera a Baja Temperatura \"Sensual Pour\"",
                "slug": "vela-cera-baja-temperatura-sensual-pour",
                "category": "Couples",
                "subtitle": "Vela de masaje y juego sensorial que se derrite a 40°C para verter directamente sobre la piel",
                "price": 850,
                "compare_price": 1050,
                "stock": 30,
                "description": "Creada especialmente para el juego de goteo sensual y privación visual. Su mezcla de cera de soja refinada, cera de abejas y aceites botánicos se licúa a una temperatura tibia similar a un baño caliente, ofreciendo una sensación estimulante sin riesgo de quemaduras.",
                "sensory_notes": "Gotas tibias de calor instantáneo, fragancia a flor de vainilla bourbon y ámbar negro, hidratación profunda.",
                "specs": {
                        "temperatura_fusion": "40°C - 42°C (100% segura e inofensiva para la piel)",
                        "ingredientes": "Cera de soja no transgénica, manteca de karité, aceites esenciales puros",
                        "mecha": "Algodón orgánico sin plomo",
                        "duracion": "Hasta 40 horas de encendido"
                },
                "photo_main": "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&q=80&w=900",
                "badge": "Juego Térmico",
                "sort_order": 28
        },
        {
                "id": "PROD-030",
                "name": "Bala Vibradora de Bolsillo \"Mini Royale\"",
                "slug": "bala-vibradora-bolsillo-mini-royale",
                "category": "Pleasure Tech",
                "subtitle": "Vibrador bala ultra compacto recargable para estimulación clitoriana discreta",
                "price": 1450,
                "compare_price": 1750,
                "stock": 25,
                "description": "La clásica bala vibradora de precisión en tamaño labial. Acabado en aleación pulida champagne con punta de silicona líquida ultrasuave, 10 patrones de vibración silenciosa y sumergibilidad total IPX7 para llevar a cualquier escapada secreta.",
                "sensory_notes": "Punta suave de contacto preciso, vibraciones concentradas, acabado metálico frío que se atempera al contacto de la piel.",
                "specs": {
                        "material": "Aleación pulida hipoalergénica y silicona médica grado quirúrgico",
                        "impermeabilidad": "IPX7 100% sumergible",
                        "ruido": "< 35 dB (Ultra Silencioso)",
                        "modos": "10 patrones de vibración",
                        "bateria": "Recargable magnética USB (hasta 90 min de autonomía)"
                },
                "photo_main": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=900",
                "badge": "Ultra Discreto",
                "sort_order": 29
        },
        {
                "id": "PROD-031",
                "name": "Estimulador Prostático Anatómico \"Apex Pulse\"",
                "slug": "estimulador-prostatico-anatomico-apex-pulse",
                "category": "Pleasure Tech",
                "subtitle": "Masajeador ergonómico de punto P con base de seguridad y motor silencioso",
                "price": 2790,
                "compare_price": 3250,
                "stock": 16,
                "description": "Diseñado meticulosamente para adaptarse a la anatomía perineal y alcanzar el punto P con suave presión constante. Silicona líquida ultra flexible, motor profundo casi inaudible (<36 dB) y base ancha ergonómica para máxima tranquilidad.",
                "sensory_notes": "Presión anatómica envolvente, silicona flexible de doble densidad, vibración grave y profunda.",
                "specs": {
                        "material": "Silicona líquida biocompatible de tacto sedoso",
                        "impermeabilidad": "IPX7 sumergible",
                        "ruido": "< 36 dB (Whisper-Quiet)",
                        "modos": "8 modos de vibración progresiva",
                        "garantia": "2 años de reposición directa"
                },
                "photo_main": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=900",
                "badge": "Ergonomía Médica",
                "sort_order": 30
        },
        {
                "id": "PROD-032",
                "name": "Gel Íntimo Térmico Efecto Calor \"Warm Ember\"",
                "slug": "gel-intimo-termico-efecto-calor-warm-ember",
                "category": "Sensory Care",
                "subtitle": "Lubricante y gel estimulante con extracto de canela de Ceilán y miel botánica",
                "price": 590,
                "compare_price": 720,
                "stock": 40,
                "description": "Un toque tibio que despierta el flujo sanguíneo con un calor progresivo y reconfortante. Formulado a base de agua con ingredientes botánicos comestibles, compatible con preservativos y silicona médica.",
                "sensory_notes": "Calidez instantánea al contacto y soplo, aroma sutil especiado a canela dulce y vainilla, deslizamiento prolongado.",
                "specs": {
                        "volumen": "100 ml en frasco dosificador airless",
                        "base": "Agua purificada con glicerina vegetal grado alimenticio",
                        "seguridad": "Hipoalergénico, libre de parabenos y compatible con juguetes"
                },
                "photo_main": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=900",
                "badge": "Efecto Térmico",
                "sort_order": 31
        },
        {
                "id": "PROD-033",
                "name": "Bruma de Almohada & Alcoba \"Sombra de Jazmín\"",
                "slug": "bruma-almohada-alcoba-sombra-jazmin",
                "category": "Sensory Care",
                "subtitle": "Spray aromático ambiental con lavanda francesa, jazmín nocturno y flor de azahar",
                "price": 680,
                "compare_price": 850,
                "stock": 35,
                "description": "Crea la atmósfera propicia para el descanso íntimo y el relax sensorial. Rociada sobre sábanas y almohadas antes de un encuentro, calma la mente y despierta los sentidos a través de la aromaterapia de alta perfumería.",
                "sensory_notes": "Vapor fino y envolvente, notas florales calmantes de azahar y sándalo, sensación de santuario privado.",
                "specs": {
                        "presentacion": "Frasco de vidrio ámbar de 120 ml con atomizador fino",
                        "ingredientes": "Hidrolato puro de lavanda, aceites esenciales de jazmín real y bergamota",
                        "sin_manchas": "Fórmula que no mancha sábanas de seda ni algodón"
                },
                "photo_main": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=900",
                "badge": "Aromaterapia",
                "sort_order": 32
        },
        {
                "id": "PROD-034",
                "name": "Baby Doll de Seda & Encaje \"Petite Nuit\"",
                "slug": "baby-doll-seda-encaje-petite-nuit",
                "category": "Fine Lingerie",
                "subtitle": "Camisón corto fluido en satén elástico de seda con copas de encaje floral",
                "price": 1890,
                "compare_price": 2250,
                "stock": 20,
                "description": "La prenda más seductora para el final del día. Su caída libre estiliza la silueta con ligereza etérea, mientras sus tirantes ajustables y copas suaves acarician el busto con comodidad absoluta.",
                "sensory_notes": "Satén líquido que resbala suavemente sobre las curvas, encaje floral sin picor, tirantes dorados delicados.",
                "specs": {
                        "material": "92% Satén de seda elastizado y 8% encaje de Chantilly",
                        "tallas": "S, M, L, XL con tirantes regulables",
                        "incluye": "Baby doll y tanga de satén a juego"
                },
                "photo_main": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=900",
                "badge": "Seda & Encaje",
                "sort_order": 33
        },
        {
                "id": "PROD-035",
                "name": "Kimono Largo de Gasa Translúcida \"Velvet Mist\"",
                "slug": "kimono-largo-gasa-translucida-velvet-mist",
                "category": "Fine Lingerie",
                "subtitle": "Bata vaporosa de noche con ribete de satén negro y cinturón a juego",
                "price": 2650,
                "compare_price": 3100,
                "stock": 14,
                "description": "Una pieza teatral de sensualidad sutil. La gasa translúcida negra insinúa la piel con elegancia en cada movimiento, ideal para superponer sobre cualquier conjunto de lencería.",
                "sensory_notes": "Tejido ingrávido y translúcido que ondea con el aire, satén suave en puños y solapas, elegancia cinematográfica.",
                "specs": {
                        "material": "Chifón de gasa sedosa con ribetes en satén de seda pesada",
                        "largo": "Largo completo hasta los tobillos",
                        "ajuste": "Cinturón desmontable de satén con lazada ancha"
                },
                "photo_main": "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&q=80&w=900",
                "badge": "Diseño Exclusivo",
                "sort_order": 34
        },
        {
                "id": "PROD-036",
                "name": "Esposas de Terciopelo Suave & Cierre Rápido \"Velvet Bind\"",
                "slug": "esposas-terciopelo-suave-cierre-rapido-velvet-bind",
                "category": "Soft Fetish",
                "subtitle": "Muñequeras acolchadas forradas en felpa burdeos con mosquetón bañado en oro",
                "price": 1280,
                "compare_price": 1550,
                "stock": 22,
                "description": "Iniciación perfecta al juego de sumisión y entrega. Su forro de terciopelo ultra suave no marca ni raspa la piel, mientras su mosquetón dorado permite soltar las muñecas al instante con un solo movimiento de seguridad.",
                "sensory_notes": "Almohadillado afelpado de terciopelo burdeos, hebilla metálica fría pulida, sujeción firme sin pellizcos.",
                "specs": {
                        "interior": "Felpa acolchada de microfibra aterciopelada",
                        "exterior": "Cuero sintético texturizado vegano de alta resistencia",
                        "seguridad": "Mosquetón giratorio de liberación inmediata bañado en oro"
                },
                "photo_main": "https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?auto=format&fit=crop&q=80&w=900",
                "badge": "Cierre Rápido",
                "sort_order": 35
        },
        {
                "id": "PROD-037",
                "name": "Plumero Sensorial & Cosquillero de Cuello \"Caress Feather\"",
                "slug": "plumero-sensorial-cosquillero-caress-feather",
                "category": "Couples",
                "subtitle": "Varilla ergonómica de bambú negro con plumas naturales suaves para juegos tántricos",
                "price": 550,
                "compare_price": 690,
                "stock": 30,
                "description": "Un instrumento tántrico sutil para despertar terminaciones nerviosas dormidas a lo largo de la espalda, cuello y muslos antes del contacto piel con piel.",
                "sensory_notes": "Cosquilleo electrizante y sutil, tacto pluma hipersensible, mango largo de madera oscura pulida.",
                "specs": {
                        "plumas": "Plumas naturales tratadas e hipoalergénicas de avestruz suave",
                        "mango": "Madera de bambú lacada en negro con remates dorados",
                        "longitud": "Longitud total de 32 cm"
                },
                "photo_main": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=900",
                "badge": "Tacto Pluma",
                "sort_order": 36
        }
];

    // ==========================================================================
    // 2. AUDIO & VERIFICACIÓN DE EDAD (+18)
    // ==========================================================================
    const bgMusic = document.getElementById('bg-music');
    let hasStartedMusic = false;
    const playMusic = () => {
        if (bgMusic && !hasStartedMusic) {
            bgMusic.play().then(() => { hasStartedMusic = true; }).catch(() => {});
        }
    };

    const ageGate = document.getElementById('age-gate');
    const btnAdult = document.getElementById('btn-adult');

    if (!localStorage.getItem('redVelvetAgeVerified')) {
        if (ageGate) {
            ageGate.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    } else {
        if (ageGate) ageGate.classList.remove('active');
        document.body.style.overflow = 'auto';
        playMusic();
    }

    if (btnAdult) {
        ['click', 'touchend', 'pointerup'].forEach(evt => {
            btnAdult.addEventListener(evt, (e) => {
                if (evt === 'touchend') e.preventDefault();
                window.dismissAgeGate(e);
            }, { passive: false });
        });
    }

    // ==========================================================================
    // 3. CARRITO DE COMPRAS REACTIVO (LOCALSTORAGE & DRAWER)
    // ==========================================================================
    const getCart = () => {
        try {
            return JSON.parse(localStorage.getItem('redVelvetCart')) || [];
        } catch (e) {
            return [];
        }
    };

    const saveCart = (cart) => {
        localStorage.setItem('redVelvetCart', JSON.stringify(cart));
        updateCartBadge();
        renderCartDrawer();
    };

    const showToast = (message) => {
        const toast = document.getElementById('cart-toast');
        const msgEl = document.getElementById('toast-message');
        if (!toast) return;
        if (msgEl) msgEl.textContent = message;
        toast.classList.add('active');
        clearTimeout(window.__cartToastTimeout);
        window.__cartToastTimeout = setTimeout(() => {
            toast.classList.remove('active');
        }, 2600);
    };

    const updateCartBadge = () => {
        const cart = getCart();
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        const badge = document.getElementById('header-cart-badge');
        if (badge) {
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
        }
    };

    const addToCart = (productId, quantity = 1) => {
        const product = allProducts.find(p => p.id === productId) || fallbackProducts.find(p => p.id === productId);
        if (!product) return;

        const cart = getCart();
        const existingIndex = cart.findIndex(item => item.id === productId);

        if (existingIndex > -1) {
            cart[existingIndex].quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                category: product.category,
                price: Number(product.price),
                photo: product.photo_main,
                quantity: quantity
            });
        }

        saveCart(cart);
        showToast(`✨ Añadido: ${product.name}`);
        openCartDrawer();
    };

    const updateCartQuantity = (productId, delta) => {
        let cart = getCart();
        const item = cart.find(i => i.id === productId);
        if (!item) return;

        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
        saveCart(cart);
    };

    const removeCartItem = (productId) => {
        const cart = getCart().filter(i => i.id !== productId);
        saveCart(cart);
    };

    // Render del Drawer del Carrito
    const renderCartDrawer = () => {
        const cart = getCart();
        const container = document.getElementById('cart-items-container');
        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="cart-empty-message">
                    <div class="empty-icon">🛍️</div>
                    <p style="font-size: 1.1rem; color: #FFF; margin-bottom: 0.5rem;">Tu bolsa está vacía</p>
                    <p style="font-size: 0.85rem;">Explora nuestra selección exclusiva y añade tus piezas favoritas.</p>
                </div>
            `;
            document.getElementById('cart-subtotal').textContent = '$0 MXN';
            document.getElementById('cart-shipping-val').textContent = 'Calculando...';
            document.getElementById('cart-grand-total').textContent = '$0 MXN';
            const discRow = document.getElementById('cart-discount-row');
            if (discRow) discRow.style.display = 'none';
            return;
        }

        let subtotal = 0;
        container.innerHTML = cart.map(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            return `
                <div class="cart-item">
                    <img src="${item.photo}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toLocaleString()} MXN</div>
                        <div class="cart-item-controls">
                            <div class="qty-control-box">
                                <button type="button" class="qty-btn" onclick="window.updateCartQty('${item.id}', -1)">-</button>
                                <span class="qty-val">${item.quantity}</span>
                                <button type="button" class="qty-btn" onclick="window.updateCartQty('${item.id}', 1)">+</button>
                            </div>
                            <button type="button" class="cart-item-remove" onclick="window.removeCartItem('${item.id}')">Eliminar</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Cálculo de descuento si hay cupón aplicado
        let discount = 0;
        if (appliedCoupon) {
            if (appliedCoupon.discount_percent > 0) {
                discount = (subtotal * appliedCoupon.discount_percent) / 100;
            } else if (appliedCoupon.discount_amount > 0) {
                discount = Math.min(appliedCoupon.discount_amount, subtotal);
            }
        }

        const shipping = subtotal >= 1500 ? 0 : 180;
        const grandTotal = Math.max(0, subtotal - discount + shipping);

        document.getElementById('cart-subtotal').textContent = `$${subtotal.toLocaleString()} MXN`;
        const discRow = document.getElementById('cart-discount-row');
        if (discRow) {
            if (discount > 0) {
                discRow.style.display = 'flex';
                document.getElementById('cart-discount-val').textContent = `-$${discount.toLocaleString()} MXN`;
            } else {
                discRow.style.display = 'none';
            }
        }

        document.getElementById('cart-shipping-val').textContent = shipping === 0 ? 'GRATIS (Discreto)' : `$${shipping} MXN`;
        document.getElementById('cart-grand-total').textContent = `$${grandTotal.toLocaleString()} MXN`;

        // Barra de progreso de envío gratis interactiva
        const freeShippingText = document.getElementById('cart-free-shipping-text');
        const freeShippingFill = document.getElementById('cart-progress-bar-fill');
        if (freeShippingText && freeShippingFill) {
            const percent = Math.min(100, Math.round((subtotal / 1500) * 100));
            freeShippingFill.style.width = `${percent}%`;
            if (subtotal >= 1500) {
                freeShippingText.innerHTML = `✨ <strong>¡Envío Blindado GRATIS!</strong> Calificas para entrega confidencial sin costo.`;
            } else {
                const missing = 1500 - subtotal;
                freeShippingText.innerHTML = `Agrega <strong>$${missing.toLocaleString()} MXN</strong> para tu <strong>Envío Blindado GRATIS</strong>`;
            }
        }
    };

    // Funciones en window para handlers inline seguros
    window.updateCartQty = (id, delta) => updateCartQuantity(id, delta);
    window.removeCartItem = (id) => removeCartItem(id);
    window.addToCartDirect = (id, evt) => {
        addToCart(id, 1);
        if (evt && evt.currentTarget) {
            const btn = evt.currentTarget;
            const prev = btn.innerHTML;
            btn.classList.add('added-success');
            btn.innerHTML = '✓ Añadido a la Bolsa';
            setTimeout(() => {
                btn.classList.remove('added-success');
                btn.innerHTML = prev;
            }, 1200);
        }
    };

    // Controles de Apertura/Cierre del Carrito
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-drawer-overlay');
    const btnCartToggle = document.getElementById('btn-cart-toggle');
    const btnCartClose = document.getElementById('cart-drawer-close');

    const openCartDrawer = () => {
        if (!cartDrawer) return;
        renderCartDrawer();
        cartDrawer.classList.add('active');
        if (cartOverlay) cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeCartDrawer = () => {
        if (!cartDrawer) return;
        cartDrawer.classList.remove('active');
        if (cartOverlay) cartOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    if (btnCartToggle) btnCartToggle.addEventListener('click', openCartDrawer);
    if (btnCartClose) btnCartClose.addEventListener('click', closeCartDrawer);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

    // Verificación de Cupón
    const btnApplyCoupon = document.getElementById('btn-apply-coupon');
    const couponInput = document.getElementById('cart-coupon-input');
    const couponFeedback = document.getElementById('coupon-feedback');

    if (btnApplyCoupon && couponInput) {
        btnApplyCoupon.addEventListener('click', async () => {
            const code = couponInput.value.trim().toUpperCase();
            if (!code) return;

            const cart = getCart();
            const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

            try {
                const res = await fetch('/api/codes/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code, subtotal })
                });
                const data = await res.json();

                if (data.success && data.type === 'coupon') {
                    appliedCoupon = data;
                    if (couponFeedback) {
                        couponFeedback.style.color = '#4CAF50';
                        couponFeedback.style.display = 'block';
                        couponFeedback.textContent = `✓ Cupón ${data.code} aplicado (${data.discount_percent}% de descuento)`;
                    }
                    renderCartDrawer();
                } else {
                    appliedCoupon = null;
                    if (couponFeedback) {
                        couponFeedback.style.color = '#FF5555';
                        couponFeedback.style.display = 'block';
                        couponFeedback.textContent = data.error || 'Cupón inválido o expirado.';
                    }
                    renderCartDrawer();
                }
            } catch (err) {
                // Verificación offline de cupones predeterminados
                if (code === 'VELVET10') {
                    appliedCoupon = { code: 'VELVET10', discount_percent: 10 };
                    if (couponFeedback) {
                        couponFeedback.style.color = '#4CAF50';
                        couponFeedback.style.display = 'block';
                        couponFeedback.textContent = '✓ Cupón VELVET10 aplicado (10% de descuento)';
                    }
                } else if (code === 'VELVET15') {
                    appliedCoupon = { code: 'VELVET15', discount_percent: 15 };
                    if (couponFeedback) {
                        couponFeedback.style.color = '#4CAF50';
                        couponFeedback.style.display = 'block';
                        couponFeedback.textContent = '✓ Cupón VELVET15 aplicado (15% cortesía Velvet Circle)';
                    }
                } else {
                    if (couponFeedback) {
                        couponFeedback.style.color = '#FF5555';
                        couponFeedback.style.display = 'block';
                        couponFeedback.textContent = 'Cupón no reconocido.';
                    }
                }
                renderCartDrawer();
            }
        });
    }

    // ==========================================================================
    // 4. MODAL DE CHECKOUT & CONFIRMACIÓN DE PEDIDO DISCRETO
    // ==========================================================================
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutOverlay = document.getElementById('checkout-modal-overlay');
    const checkoutClose = document.getElementById('checkout-modal-close');
    const btnOpenCheckout = document.getElementById('btn-open-checkout');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutFeedback = document.getElementById('checkout-feedback');

    const openCheckoutModal = () => {
        const cart = getCart();
        if (cart.length === 0) {
            alert('Tu bolsa de compras está vacía.');
            return;
        }
        closeCartDrawer();
        if (checkoutModal) checkoutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeCheckoutModal = () => {
        if (checkoutModal) checkoutModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    if (btnOpenCheckout) btnOpenCheckout.addEventListener('click', openCheckoutModal);
    if (checkoutClose) checkoutClose.addEventListener('click', closeCheckoutModal);
    if (checkoutOverlay) checkoutOverlay.addEventListener('click', closeCheckoutModal);

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const cart = getCart();
            if (cart.length === 0) return;

            const customerName = document.getElementById('checkout-name').value.trim();
            const customerPhone = document.getElementById('checkout-phone').value.trim();
            const customerAddress = document.getElementById('checkout-address').value.trim();
            const customerCity = document.getElementById('checkout-city').value.trim();
            const customerState = document.getElementById('checkout-state').value.trim();
            const customerNotes = document.getElementById('checkout-notes').value.trim();

            const payload = {
                customer_name: customerName,
                phone: customerPhone,
                shipping_address: customerAddress,
                city: customerCity,
                state: customerState,
                notes: customerNotes,
                items: cart.map(i => ({ id: i.id, quantity: i.quantity })),
                coupon_code: appliedCoupon ? appliedCoupon.code : null
            };

            const submitBtn = document.getElementById('btn-submit-order');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = '🔒 Registrando Pedido Seguro...';
            }

            try {
                const res = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();

                if (data.success) {
                    // Vaciar carrito
                    localStorage.removeItem('redVelvetCart');
                    updateCartBadge();

                    checkoutForm.style.display = 'none';
                    if (checkoutFeedback) {
                        checkoutFeedback.style.display = 'block';
                        checkoutFeedback.innerHTML = `
                            <div style="font-size: 3rem; margin-bottom: 0.8rem;">💎</div>
                            <h3 style="font-family: var(--font-serif); font-size: 1.6rem; color: #D4AF37; margin-bottom: 0.5rem;">
                                ¡Pedido #${data.orderId} Confirmado!
                            </h3>
                            <p style="color: #FFF; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
                                Tu orden ha sido registrada con discreción absoluta. Empacaremos tus piezas en caja neutra con sello de seguridad.
                            </p>
                            <a href="${data.whatsappUrl}" target="_blank" class="btn btn-primary btn-block pulse-gold" style="display:inline-block; margin-bottom:1rem;">
                                💬 Abrir WhatsApp Concierge para Confirmar Envío
                            </a>
                            <button type="button" class="btn btn-outline btn-block" onclick="location.reload()">
                                Volver a la Tienda
                            </button>
                        `;
                    }
                } else {
                    alert(data.error || 'Error al procesar el pedido.');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = '✨ Confirmar Pedido & Abrir Concierge de WhatsApp';
                    }
                }
            } catch (err) {
                console.error('Error en checkout:', err);
                alert('No se pudo conectar con el servidor. Redirigiendo a Concierge WhatsApp...');
                // Fallback manual de WhatsApp
                const itemsSummary = cart.map(i => `• ${i.quantity}x ${i.name} ($${i.price})`).join('\n');
                const fallbackMsg = `Hola RED VELVET, deseo confirmar mi pedido:\n${itemsSummary}\nCliente: ${customerName}\nCiudad: ${customerCity}`;
                window.open(`https://wa.me/528112345678?text=${encodeURIComponent(fallbackMsg)}`, '_blank');
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }

    // ==========================================================================
    // 5. CARGA Y RENDERIZADO DEL CATÁLOGO DE PRODUCTOS
    // ==========================================================================
    const renderProductsGrid = (products) => {
        const grid = document.getElementById('products-grid');
        if (!grid) return;

        if (!products || products.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
                    <p style="font-size: 1.2rem; color: #FFF;">No encontramos piezas que coincidan con tu búsqueda.</p>
                    <p style="font-size: 0.9rem; margin-top: 0.5rem;">Intenta con otra categoría o término.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = products.map(product => {
            const hasDiscount = product.compare_price && product.compare_price > product.price;
            return `
                <div class="product-shop-card reveal active">
                    <div class="product-img-box" onclick="window.openProductDetailModal('${product.id}')" style="cursor: pointer;">
                        <img src="${product.photo_main}" alt="${product.name}" loading="lazy">
                        ${product.badge ? `<span class="product-badge-corner">${product.badge}</span>` : ''}
                        <button type="button" class="product-quick-view-btn" onclick="event.stopPropagation(); window.openProductDetailModal('${product.id}')">
                            🔍 Vista Rápida & Specs
                        </button>
                    </div>
                    <div class="product-info-box">
                        <span class="product-cat-name">${product.category}</span>
                        <h3 class="product-title" onclick="window.openProductDetailModal('${product.id}')" style="cursor: pointer;">${product.name}</h3>
                        <p class="product-subtitle-short">${product.subtitle || ''}</p>
                        <div class="product-price-row">
                            <span class="product-current-price">$${Number(product.price).toLocaleString()} MXN</span>
                            ${hasDiscount ? `<span class="product-compare-price">$${Number(product.compare_price).toLocaleString()} MXN</span>` : ''}
                        </div>
                        <div class="product-card-actions">
                            <button type="button" class="btn-add-to-bag" onclick="window.addToCartDirect('${product.id}', event)">
                                🛍️ Añadir a la Bolsa
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    };

    const filterAndRenderCatalog = () => {
        let filtered = [...allProducts];

        if (currentCategory !== 'all') {
            filtered = filtered.filter(p => p.category === currentCategory);
        }

        if (currentSearchTerm) {
            const term = currentSearchTerm.toLowerCase();
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(term) ||
                (p.subtitle && p.subtitle.toLowerCase().includes(term)) ||
                (p.description && p.description.toLowerCase().includes(term))
            );
        }

        if (currentSort === 'price_asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (currentSort === 'price_desc') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (currentSort === 'newest') {
            filtered.sort((a, b) => (b.sort_order || 0) - (a.sort_order || 0));
        }

        const countPill = document.getElementById('catalog-count-pill');
        if (countPill) {
            countPill.textContent = `Mostrando ${filtered.length} piezas exclusivas`;
        }

        renderProductsGrid(filtered);
    };

    window.filterCatalogByCategory = (cat) => {
        currentCategory = cat;
        document.querySelectorAll('.cat-pill').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === cat);
        });
        filterAndRenderCatalog();
        const catSec = document.getElementById('catalogo');
        if (catSec) catSec.scrollIntoView({ behavior: 'smooth' });
    };

    // Carga de productos desde el Backend
    const loadProducts = async () => {
        try {
            const res = await fetch('/api/products');
            if (!res.ok) throw new Error('API no disponible');
            const data = await res.json();
            if (data.success && Array.isArray(data.products) && data.products.length > 0) {
                allProducts = data.products;
            } else {
                allProducts = fallbackProducts;
            }
        } catch (err) {
            console.warn('Conectando catálogo local de reserva RED VELVET:', err);
            allProducts = fallbackProducts;
        }
        filterAndRenderCatalog();
        updateCartBadge();
    };

    // Eventos de Filtros y Búsqueda
    document.querySelectorAll('.cat-pill').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            filterAndRenderCatalog();
        });
    });

    const searchInput = document.getElementById('catalog-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.trim();
            filterAndRenderCatalog();
        });
    }

    const sortSelect = document.getElementById('catalog-sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            filterAndRenderCatalog();
        });
    }

    // ==========================================================================
    // 6. MODAL DETALLE DE PRODUCTO (SPECS TÉCNICAS & SENSORIALES)
    // ==========================================================================
    const detailModal = document.getElementById('product-detail-modal');
    const detailOverlay = document.getElementById('product-modal-overlay');
    const detailClose = document.getElementById('product-modal-close');
    const detailBody = document.getElementById('product-modal-body');

    window.openProductDetailModal = (productId) => {
        const product = allProducts.find(p => p.id === productId) || fallbackProducts.find(p => p.id === productId);
        if (!product || !detailBody) return;

        let specs = product.specs || {};
        if (typeof specs === 'string') {
            try { specs = JSON.parse(specs); } catch (e) { specs = {}; }
        }
        if ((!specs || Object.keys(specs).length === 0) && product.specs_json) {
            try { specs = JSON.parse(product.specs_json); } catch (e) { specs = {}; }
        }
        const specKeys = Object.keys(specs);

        detailBody.innerHTML = `
            <div>
                <img src="${product.photo_main}" alt="${product.name}" class="modal-product-img">
            </div>
            <div style="display:flex; flex-direction:column; max-height:72vh; overflow-y:auto; padding-right:0.6rem;">
                <span class="product-cat-name">${product.category}</span>
                <h2 style="font-family: var(--font-serif); font-size: 1.7rem; color: #FFF; margin: 0.2rem 0 0.4rem;">${product.name}</h2>
                <div class="product-price-row" style="margin-bottom: 0.8rem;">
                    <span class="product-current-price" style="font-size: 1.5rem;">$${Number(product.price).toLocaleString()} MXN</span>
                    ${product.compare_price ? `<span class="product-compare-price">$${Number(product.compare_price).toLocaleString()} MXN</span>` : ''}
                </div>
                <div style="margin-bottom: 1rem;">
                    <button type="button" class="btn btn-primary btn-block pulse-gold" onclick="window.addToCartDirect('${product.id}'); window.closeProductDetailModal();">
                        🛍️ Añadir a la Bolsa ($${Number(product.price).toLocaleString()} MXN)
                    </button>
                </div>
                <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.5; margin-bottom: 1rem;">
                    ${product.description}
                </p>
                ${product.sensory_notes ? `
                    <div style="background: rgba(212, 175, 55, 0.08); border-left: 3px solid #D4AF37; padding: 0.7rem 0.9rem; margin-bottom: 1rem; font-size: 0.82rem; color: #F5F5F0;">
                        ✨ <strong>Experiencia Sensorial:</strong> ${product.sensory_notes}
                    </div>
                ` : ''}

                ${specKeys.length > 0 ? `
                    <div class="modal-specs-list" style="margin-top:0.5rem;">
                        <div style="font-size: 0.82rem; font-weight: 600; color: #D4AF37; margin-bottom: 0.3rem;">Especificaciones de Lujo & Seguridad:</div>
                        ${specKeys.map(k => `
                            <div class="modal-spec-item">
                                <span class="spec-label">${k.charAt(0).toUpperCase() + k.slice(1)}:</span>
                                <span class="spec-value">${specs[k]}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        if (detailModal) detailModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeProductDetailModal = () => {
        if (detailModal) detailModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    if (detailClose) detailClose.addEventListener('click', window.closeProductDetailModal);
    if (detailOverlay) detailOverlay.addEventListener('click', window.closeProductDetailModal);

    // ==========================================================================
    // 7. CONTROLES COMUNES (HEADER, THEME, MENÚ, FAQ, SCROLL)
    // ==========================================================================
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 50);
    });

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => navMenu.classList.toggle('active'));
        document.querySelectorAll('.nav-menu a').forEach(link =>
            link.addEventListener('click', () => navMenu.classList.remove('active'))
        );
    }

    // FAQ Accordion
    document.querySelectorAll('.faq-item').forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const container = item.closest('.faq-accordion') || document;
                container.querySelectorAll('.faq-item').forEach(i => {
                    if (i !== item) i.classList.remove('active');
                });
                item.classList.toggle('active');
            });
        }
    });

    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const applyTheme = (theme) => {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            if (themeIcon) themeIcon.textContent = '☀️';
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (themeIcon) themeIcon.textContent = '🌙';
        }
        localStorage.setItem('redVelvetTheme', theme);
    };

    const savedTheme = localStorage.getItem('redVelvetTheme') || 'dark';
    applyTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            applyTheme(isLight ? 'dark' : 'light');
        });
    }

    // Scroll reveal
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Back to top
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => backToTopBtn.classList.toggle('visible', window.scrollY > 500));
        backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // Inicializar productos
    loadProducts();
});

// ==========================================================================
// THE VELVET CIRCLE: SUSCRIPCIÓN PRIVADA & CÓDIGO DE CORTESÍA
// ==========================================================================
window.subscribeVelvetCircle = function(event) {
    if (event) event.preventDefault();
    const input = document.getElementById('circle-email-input');
    const feedback = document.getElementById('circle-feedback');
    if (!input || !feedback) return;

    const email = input.value.trim();
    if (!email || !email.includes('@')) {
        feedback.style.display = 'block';
        feedback.style.background = 'rgba(217, 83, 79, 0.2)';
        feedback.style.border = '1px solid #D9534F';
        feedback.style.color = '#FFB4B0';
        feedback.innerHTML = '⚠️ Por favor ingresa un correo electrónico válido.';
        return;
    }

    // Feedback exitoso con código exclusivo de cortesía
    feedback.style.display = 'block';
    feedback.style.background = 'rgba(27, 77, 46, 0.35)';
    feedback.style.border = '1px solid #4CAF50';
    feedback.style.color = '#A8E6CF';
    feedback.innerHTML = '✓ <strong>¡Bienvenida/o al Círculo!</strong> Hemos reservado tu cortesía: usa el código <strong style="color:#D4AF37; letter-spacing:0.1em;">VELVET15</strong> en tu carrito para 15% OFF en tu primera orden.';

    input.value = '';
    
    // Si la función showToast existe, mostramos confirmación visual
    if (typeof window.showToast === 'function') {
        window.showToast('✨ Membresía activada: Código VELVET15 desbloqueado');
    }
};
