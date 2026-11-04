/**
 * RED VELVET — Motor de Internacionalización (i18n) de Ultra-Lujo
 * Idiomas: Español (ES) / English (EN)
 * Diseñado con estándares de alta distinción, cortesía confidencial y precisión bilingüe.
 */

(function () {
    'use strict';

    const I18N_TRANSLATIONS = {
        es: {
            // Nav & Header
            'nav.home': 'Inicio',
            'nav.catalog': 'Catálogo',
            'nav.collections': 'Colecciones',
            'nav.discretion': 'Discreción & Envíos',
            'nav.faq': 'Preguntas',
            'header.bag': 'Bolsa',
            'header.langAria': 'Cambiar idioma',
            'header.bagAria': 'Ver bolsa de compras',

            // Age Gate
            'ageGate.title': 'RED VELVET BOUTIQUE',
            'ageGate.desc': 'Esta boutique erótica y plataforma de bienestar íntimo está destinada exclusivamente a mayores de 18 años.',
            'ageGate.btnYes': 'Soy mayor de 18 años',
            'ageGate.btnNo': 'Salir',

            // Hero Section
            'hero.ageBadge': '18+ | Boutique de Lujo & Bienestar Íntimo',
            'hero.headline': 'El Arte del Placer Elevado<br>a la Máxima Sofisticación.',
            'hero.subheadline': 'Dispositivos de autor con tecnología silenciosa, lencería de alta costura y cosmética sensorial premium. Empaque 100% ciego y confidencialidad absoluta.',
            'hero.btnExplore': 'Explorar Catálogo',
            'hero.btnDiscretion': 'Garantía de Discreción',
            'hero.badgeBlind': 'Empaque Ciego 100% Neutro',
            'hero.badgeWhisper': 'Whisper-Quiet < 38 dB',
            'hero.badgeSilicone': 'Silicona Quirúrgica Pura',
            'hero.badgeWarranty': '2 Años de Garantía Directa',

            // Pilares de Confidencialidad
            'trust.p1.title': 'Empaque 100% Ciego',
            'trust.p1.desc': 'Caja neutra, sin logotipos ni leyendas comprometedoras. Discreción total en tu puerta.',
            'trust.p2.title': 'Silicona Médica Biocompatible',
            'trust.p2.desc': 'Materiales puros de tacto aterciopelado, libres de ftalatos y certificados para el cuerpo.',
            'trust.p3.title': 'Silencio Whisper-Quiet',
            'trust.p3.desc': 'Motores ultra silenciosos calibrados por debajo de 38 dB para tu completa privacidad.',
            'trust.p4.title': 'Concierge Privado 24/7',
            'trust.p4.desc': 'Asesoría personalizada y seguimiento confidencial directo por WhatsApp.',

            // Colecciones
            'collections.badge': 'CURATORÍA EXCLUSIVA',
            'collections.title': 'Colecciones de Alta Gama',
            'collections.subtitle': 'Diseños creados para despertar las sensaciones más exquisitas y elevar el juego en solitario o en pareja.',
            'collections.c1.title': 'Pleasure Tech',
            'collections.c1.desc': 'Succionadores de clítoris por aire pulsado, vibradores clásicos y varitas de masaje.',
            'collections.c1.link': 'Ver Dispositivos →',
            'collections.c2.title': 'Sensory Care',
            'collections.c2.desc': 'Velas de masaje térmicas botánicas, elixires y lubricantes con ácido hialurónico.',
            'collections.c2.link': 'Ver Cosmética →',
            'collections.c3.title': 'Fine Lingerie',
            'collections.c3.desc': 'Bodysuits de encaje francés, satén de seda pesado y batas Red Velvet.',
            'collections.c3.link': 'Ver Lencería →',
            'collections.c4.title': 'Soft Fetish & Play',
            'collections.c4.desc': 'Antifaces blackout de seda, esposas forradas en terciopelo y juegos tántricos.',
            'collections.c4.link': 'Ver Accesorios →',

            // El Ritual de los Tres Tiempos
            'ritual.badge': 'FILOSOFÍA VELVET',
            'ritual.title': 'El Ritual de los Tres Tiempos',
            'ritual.subtitle': 'Una guía sensorial curada para transformar el placer cotidiano en una ceremonia de alta sofisticación.',
            'ritual.step1.step': 'FASE 01',
            'ritual.step1.title': 'La Preparación & Atmósfera',
            'ritual.step1.desc': 'Atenúa la luz, enciende una vela botánica de vertido tibio y permite que los aceites de orquídea negra y vainilla bourbon despierten cada poro con calor reconfortante.',
            'ritual.step1.tag': 'Sensory Care & Aromaterapia',
            'ritual.step2.step': 'FASE 02',
            'ritual.step2.title': 'La Estimulación Sensorial',
            'ritual.step2.desc': 'Experimenta succionadores de pulsación suave y vibradores en silicona médica biocompatible. Su motor silencioso (<38 dB) ofrece estimulación gradual y placentera con total discreción.',
            'ritual.step2.tag': 'Vibración & Succión Suave',
            'ritual.step3.step': 'FASE 03',
            'ritual.step3.title': 'El Clímax & Conexión',
            'ritual.step3.desc': 'Explora el tacto de satén pesado, la complicidad en pareja y la liberación de endorfinas. Un espacio privado donde la discreción y el placer soberano son la única regla.',
            'ritual.step3.tag': 'Fine Lingerie & Vínculo',

            // Catálogo Maestro
            'catalog.badge': 'TIENDA ONLINE',
            'catalog.title': 'Catálogo Maestro',
            'catalog.subtitle': 'Selecciona tus piezas de bienestar íntimo. Envío express confidencial a todo México.',
            'catalog.filter.all': '✨ Todos',
            'catalog.filter.pleasure': '💎 Pleasure Tech',
            'catalog.filter.sensory': '🌿 Cosmética Sensorial',
            'catalog.filter.lingerie': '👑 Lencería Fina',
            'catalog.filter.fetish': '🖤 Soft Fetish',
            'catalog.filter.couples': '🌹 Juegos en Pareja',
            'catalog.search.placeholder': 'Buscar por pieza, material o sensación...',
            'catalog.sort.featured': '✨ Destacados de Autor',
            'catalog.sort.priceAsc': 'Menor Precio',
            'catalog.sort.priceDesc': 'Mayor Exclusividad',
            'catalog.sort.newest': 'Lanzamientos Recientes',
            'catalog.status.count': 'Mostrando {count} piezas exclusivas',
            'catalog.status.shipping': '🔒 Empaque Ciego & Envíos 100% Confidenciales',
            'catalog.card.quickView': '🔍 Vista Rápida & Specs',
            'catalog.card.addToBag': '🛍️ Añadir a la Bolsa',
            'catalog.card.addedSuccess': '✓ Añadido a la Bolsa',
            'catalog.empty.title': 'No encontramos piezas que coincidan con tu búsqueda.',
            'catalog.empty.desc': 'Intenta con otra categoría o término.',

            // Garantía de Discreción
            
        'catalog.mood.label': 'Curaduría por Experiencia:',
        'discretion.sim.badge': 'DEMOSTRACIÓN INTERACTIVA',
        'discretion.sim.title': 'Protocolo de Empaque Blindado',
        'discretion.sim.subtitle': 'Selecciona una fase para inspeccionar el nivel de confidencialidad:',
        'discretion.sim.step1Label': 'Exterior Ciego',
        'discretion.sim.step2Label': 'Precinto de Seguridad',
        'discretion.sim.step3Label': 'Interior de Lujo',
        'discretion.badge': 'CONFIDENCIALIDAD TOTAL',
            'discretion.title': 'Tu Privacidad es Nuestro Mayor Compromiso',
            'discretion.desc': 'Entendemos que el placer es un territorio íntimo. Por eso, cada orden enviada por <strong>RED VELVET</strong> cuenta con el protocolo de blindaje más riguroso de la industria:',
            'discretion.point1': '📦 <strong>Caja de cartón kraft neutro sin logotipos</strong>, imágenes ni leyendas sobre juguetes o bienestar íntimo.',
            'discretion.point2': '📄 <strong>Remitente privado y neutral</strong> registrado como "Logística & Servicios RV".',
            'discretion.point3': '💳 <strong>Cargo bancario discreto</strong> sin menciones sugerentes en tus estados de cuenta.',
            'discretion.point4': '🚚 <strong>Entregas en mano o en sucursal ocurre</strong> con seguimiento privado por WhatsApp.',
            'discretion.seal.title': 'Sello de Seguridad Ciego',
            'discretion.seal.desc': 'Cinta de seguridad inviolable. Sabrás que tu paquete nunca ha sido abierto o manipulado desde que sale de nuestro almacén climatizado hasta que llega a tus manos.',

            // Preguntas Frecuentes (FAQ)
            'faq.badge': 'CENTRO DE AYUDA',
            'faq.title': 'Preguntas Frecuentes',
            'faq.subtitle': 'Respuestas claras sobre envíos discretos, materiales hipoalergénicos, garantías y compras seguras.',
            'faq.q1.question': '¿Cómo viene empaquetado mi pedido?',
            'faq.q1.answer': 'Todos los pedidos se despachan en empaque de cartón 100% liso y sellado, sin marcas, logotipos ni menciones de sex shop o bienestar íntimo. El mensajero no sabrá en ningún momento qué contiene el paquete.',
            'faq.q2.question': '¿Qué materiales utilizan en los dispositivos?',
            'faq.q2.answer': 'Únicamente trabajamos con silicona médica líquida biocompatible de grado quirúrgico, ABS libre de ftalatos y metales hipoalergénicos no porosos, garantizando total seguridad para la piel y mucosas delicadas.',
            'faq.q3.question': '¿Cuánto tarda el envío y cuánto cuesta?',
            'faq.q3.answer': 'El envío es <strong>GRATUITO</strong> en compras mayores a $1,500 MXN. Para órdenes menores, el costo de envío express discreto es de $180 MXN. El tiempo de entrega habitual es de 24 a 48 horas hábiles en ciudades principales.',
            'faq.q4.question': '¿Tienen garantía los productos?',
            'faq.q4.answer': 'Todos nuestros dispositivos de la colección Pleasure Tech cuentan con 2 años de garantía directa contra cualquier defecto de fábrica o motor, además de soporte concierge 24/7.',

            // Voces Confidenciales / Testimonios VIP
            'testimonials.badge': 'TESTIMONIOS VERIFICADOS',
            'testimonials.title': 'Voces Confidenciales',
            'testimonials.subtitle': 'Lo que nuestros clientes más exigentes opinan de la experiencia Red Velvet.',
            'testimonials.t1.quote': '«Pedí el estimulador Élysée y la vela de vertido tibio. La caja llegó completamente lisa y sin remitente comercial, perfecta para recibirla en el corporativo. La calidad de la silicona líquida no tiene comparación con nada del mercado convencional.»',
            'testimonials.t1.author': 'Camila R.',
            'testimonials.t1.meta': '✓ Miembro Verificado · CDMX',
            'testimonials.t2.quote': '«El nivel de silencio del motor en el Nexus Sync es absurdo; literalmente inaudible desde la habitación contigua. El concierge de WhatsApp respondió todas nuestras dudas antes de pagar con una delicadeza y elegancia total.»',
            'testimonials.t2.author': 'Mauricio & Sofía',
            'testimonials.t2.meta': '✓ Pareja VIP · San Pedro Garza García',
            'testimonials.t3.quote': '«La lencería Noir Midnight tiene un drapeado y un encaje francés digno de alta costura parisina. El empaque negro mate con listón de terciopelo hace que el unboxing sea una verdadera fantasía sensorial.»',
            'testimonials.t3.author': 'Valentina D.',
            'testimonials.t3.meta': '✓ Miembro Verificado · Guadalajara',

            // The Velvet Circle
            'circle.badge': 'CLUB PRIVADO DE BIENESTAR',
            'circle.title': 'The Velvet Circle',
            'circle.subtitle': 'Acceso preferencial a lanzamientos de autor, masterclasses íntimas y un código de <strong>15% de cortesía</strong> para tu primera orden confidencial.',
            'circle.inputPlaceholder': 'Tu correo electrónico privado...',
            'circle.btnJoin': 'Unirme al Círculo',
            'circle.privacyNotice': '🔒 Cero spam. Respeto estricto a tu privacidad con cifrado de 256 bits.',
            'circle.successMsg': '✨ ¡Bienvenido/a a The Velvet Circle! Revisa tu bandeja para activar tu 15% de cortesía.',

            // Drawer del Carrito / Bolsa de Compras
            'cart.headerTitle': '<span>🛍️</span> Tu Bolsa de Compras',
            'cart.emptyTitle': 'Tu bolsa está vacía',
            'cart.emptyDesc': 'Explora nuestra selección exclusiva y añade tus piezas favoritas.',
            'cart.freeShippingInitial': 'Agrega <strong>$1,500 MXN</strong> para tu <strong>Envío Blindado GRATIS</strong>',
            'cart.freeShippingProgress': 'Agrega <strong>${missing} MXN</strong> para tu <strong>Envío Blindado GRATIS</strong>',
            'cart.freeShippingQualified': '✨ <strong>¡Envío Blindado GRATIS!</strong> Calificas para entrega confidencial sin costo.',
            'cart.couponPlaceholder': 'CUPÓN (Ej. VELVET10)',
            'cart.btnApplyCoupon': 'Aplicar',
            'cart.subtotalLabel': 'Subtotal',
            'cart.discountLabel': 'Descuento',
            'cart.shippingLabel': 'Envío Discreto',
            'cart.totalLabel': 'Total Estimado',
            'cart.shippingCalculating': 'Calculando...',
            'cart.shippingFree': 'GRATIS (Discreto)',
            'cart.btnProceed': 'Continuar al Checkout Discreto →',
            'cart.itemRemove': 'Eliminar',
            'cart.toastAdded': 'Pieza añadida a tu bolsa de compras',

            // Formulario de Checkout Confidencial
            'checkout.badge': 'CHECKOUT CONFIDENCIAL',
            'checkout.title': 'Finalizar Pedido Discreto',
            'checkout.subtitle': 'Tus datos están protegidos bajo estricto secreto comercial y cifrado de seguridad.',
            'checkout.labelName': 'Nombre Completo o Alias *',
            'checkout.placeholderName': 'Ej. Roberto o Sofía',
            'checkout.labelPhone': 'WhatsApp / Teléfono *',
            'checkout.placeholderPhone': '+52 81 1234 5678',
            'checkout.labelAddress': 'Dirección de Entrega (Calle, Número, Depto) *',
            'checkout.placeholderAddress': 'Ej. Av. Vasconcelos 1400, Depto 4B',
            'checkout.labelCity': 'Ciudad *',
            'checkout.placeholderCity': 'Ej. Monterrey, CDMX, Guadalajara',
            'checkout.labelState': 'Estado *',
            'checkout.placeholderState': 'Ej. Nuevo León, CDMX, Jalisco',
            'checkout.labelNotes': 'Instrucciones Especiales de Entrega Discreta (Opcional)',
            'checkout.placeholderNotes': 'Ej. Dejar en caseta, no timbrar, entregar después de las 6pm',
            'checkout.guarantee': '🔒 <strong>Garantía de Entrega Ciega:</strong> La paquetería entregará una caja neutra con sello de seguridad. No se mencionará el nombre de ningún producto ni la palabra "sex shop".',
            'checkout.btnSubmit': '✨ Confirmar Pedido & Abrir Concierge de WhatsApp',

            // Footer
            'footer.notice': 'RED VELVET — Luxury Sex Shop & Intimate Wellness (+18)',
            'footer.catalog': 'Catálogo Completo',
            'footer.collections': 'Colecciones',
            'footer.discretion': 'Garantía de Discreción',
            'footer.faq': 'Preguntas Frecuentes',
            'footer.concierge': 'Concierge WhatsApp VIP',
            'footer.suite': '⚙️ Suite de Dirección',

            // Yessi Concierge
            'concierge.launcherStatus': '● En línea · Confidencial',
            'concierge.headerRole': 'Asesora Privada · RED VELVET',
            'concierge.privacyBanner': '🔒 Conversación cifrada de 256 bits · 100% privada y anónima',
            'concierge.inputPlaceholder': 'Pregúntame sobre envíos, piezas o cupones...',
            'concierge.welcomeMsg': '<p>¡Hola! Te doy la bienvenida a <strong>RED VELVET</strong>. Soy <strong>Yessi</strong>, tu concierge personal y asesora de bienestar íntimo.</p><p style="margin-top:0.4rem;">Estoy aquí para ayudarte a elegir la pieza perfecta, resolver dudas de discreción de tu empaque o brindarte códigos de cortesía exclusivos.</p><span class="yessi-msg-time">Ahora</span>',
            'concierge.chips': [
                '📦 ¿Cómo garantizan la discreción?',
                '🌹 Recomendación para parejas',
                '💎 Succionadores más vendidos',
                '🏷️ Cupones de descuento vigentes',
                '💬 Hablar por WhatsApp'
            ]
        },

        en: {
            // Nav & Header
            'nav.home': 'Home',
            'nav.catalog': 'Catalog',
            'nav.collections': 'Collections',
            'nav.discretion': 'Discretion & Shipping',
            'nav.faq': 'FAQ',
            'header.bag': 'Bag',
            'header.langAria': 'Change language',
            'header.bagAria': 'View shopping bag',

            // Age Gate
            'ageGate.title': 'RED VELVET BOUTIQUE',
            'ageGate.desc': 'This erotic boutique and intimate wellness sanctuary is strictly reserved for guests aged 18 and older.',
            'ageGate.btnYes': 'I am 18 years or older',
            'ageGate.btnNo': 'Exit',

            // Hero Section
            'hero.ageBadge': '18+ | Luxury Boutique & Intimate Wellness',
            'hero.headline': 'The Art of Pleasure Elevated<br>to the Utmost Sophistication.',
            'hero.subheadline': 'Designer intimate devices with whisper technology, haute couture lingerie, and sensory cosmetics. 100% blind packaging and absolute confidentiality.',
            'hero.btnExplore': 'Explore Catalog',
            'hero.btnDiscretion': 'Discretion Guarantee',
            'hero.badgeBlind': '100% Neutral Blind Packaging',
            'hero.badgeWhisper': 'Whisper-Quiet < 38 dB',
            'hero.badgeSilicone': 'Pure Surgical Silicone',
            'hero.badgeWarranty': '2-Year Direct Warranty',

            // Pilares de Confidencialidad
            'trust.p1.title': '100% Blind Packaging',
            'trust.p1.desc': 'Neutral box, without logos or revealing labels. Absolute discretion delivered to your door.',
            'trust.p2.title': 'Biocompatible Medical Silicone',
            'trust.p2.desc': 'Pure velvet-touch materials, phthalate-free and certified body-safe.',
            'trust.p3.title': 'Whisper-Quiet Silence',
            'trust.p3.desc': 'Ultra-quiet motors calibrated under 38 dB for your complete acoustic privacy.',
            'trust.p4.title': '24/7 Private Concierge',
            'trust.p4.desc': 'Bespoke advice and confidential order tracking directly via WhatsApp.',

            // Colecciones
            'collections.badge': 'EXCLUSIVE CURATION',
            'collections.title': 'High-End Collections',
            'collections.subtitle': 'Designs crafted to awaken the most exquisite sensations and elevate solo or couples play.',
            'collections.c1.title': 'Pleasure Tech',
            'collections.c1.desc': 'Pulsed-air clitoral stimulators, classic vibrators, and powerful massage wands.',
            'collections.c1.link': 'View Devices →',
            'collections.c2.title': 'Sensory Care',
            'collections.c2.desc': 'Botanical warm-pour massage candles, elixirs, and hyaluronic acid lubricants.',
            'collections.c2.link': 'View Cosmetics →',
            'collections.c3.title': 'Fine Lingerie',
            'collections.c3.desc': 'French embroidered lace bodysuits, heavy silk satin, and Red Velvet kimonos.',
            'collections.c3.link': 'View Lingerie →',
            'collections.c4.title': 'Soft Fetish & Play',
            'collections.c4.desc': 'Blackout silk blindfolds, velvet-lined cuffs, and seductive tantric games.',
            'collections.c4.link': 'View Accessories →',

            // El Ritual de los Tres Tiempos
            'ritual.badge': 'VELVET PHILOSOPHY',
            'ritual.title': 'The Three-Phase Ritual',
            'ritual.subtitle': 'A curated sensory guide to transform everyday pleasure into a ceremony of high sophistication.',
            'ritual.step1.step': 'PHASE 01',
            'ritual.step1.title': 'Atmosphere & Preparation',
            'ritual.step1.desc': 'Dim the lights, light a botanical warm-pour candle, and let black orchid and bourbon vanilla oils awaken every pore with soothing warmth.',
            'ritual.step1.tag': 'Sensory Care & Aromatherapy',
            'ritual.step2.step': 'PHASE 02',
            'ritual.step2.title': 'Sensory Stimulation',
            'ritual.step2.desc': 'Experience gentle air-pulsed stimulators and biocompatible medical-grade silicone vibrators. Their whisper motor (<38 dB) delivers gradual, blissful pleasure with total discretion.',
            'ritual.step2.tag': 'Vibration & Gentle Suction',
            'ritual.step3.step': 'PHASE 03',
            'ritual.step3.title': 'Climax & Intimacy',
            'ritual.step3.desc': 'Explore heavy silk sensations, partner complicity, and the rush of endorphins. A private sanctuary where discretion and sovereign pleasure are the only rule.',
            'ritual.step3.tag': 'Fine Lingerie & Connection',

            // Catálogo Maestro
            'catalog.badge': 'ONLINE BOUTIQUE',
            'catalog.title': 'Master Catalog',
            'catalog.subtitle': 'Select your intimate wellness pieces. Confidential express shipping across Mexico.',
            'catalog.filter.all': '✨ All Pieces',
            'catalog.filter.pleasure': '💎 Pleasure Tech',
            'catalog.filter.sensory': '🌿 Sensory Care',
            'catalog.filter.lingerie': '👑 Fine Lingerie',
            'catalog.filter.fetish': '🖤 Soft Fetish',
            'catalog.filter.couples': '🌹 Couples Play',
            'catalog.search.placeholder': 'Search by piece, material, or sensation...',
            'catalog.sort.featured': '✨ Featured Curations',
            'catalog.sort.priceAsc': 'Lowest Price',
            'catalog.sort.priceDesc': 'Highest Exclusivity',
            'catalog.sort.newest': 'New Arrivals',
            'catalog.status.count': 'Showing {count} exclusive pieces',
            'catalog.status.shipping': '🔒 Blind Packaging & 100% Confidential Shipping',
            'catalog.card.quickView': '🔍 Quick View & Specs',
            'catalog.card.addToBag': '🛍️ Add to Bag',
            'catalog.card.addedSuccess': '✓ Added to Bag',
            'catalog.empty.title': 'No pieces match your search criteria.',
            'catalog.empty.desc': 'Try another category or search term.',

            // Garantía de Discreción
            'discretion.badge': 'TOTAL CONFIDENTIALITY',
            'discretion.title': 'Your Privacy is Our Greatest Commitment',
            'discretion.desc': 'We understand pleasure is an intimate sanctuary. That is why every order dispatched by <strong>RED VELVET</strong> features the most rigorous shielding protocol in the industry:',
            'discretion.point1': '📦 <strong>Neutral kraft cardboard box with zero logos</strong>, images, or adult novelty mentions.',
            'discretion.point2': '📄 <strong>Private and neutral sender</strong> registered as "RV Logistics & Services".',
            'discretion.point3': '💳 <strong>Discreet bank billing</strong> with no suggestive descriptions on your account statements.',
            'discretion.point4': '🚚 <strong>Direct courier hand delivery or pickup</strong> with private WhatsApp tracking.',
            'discretion.seal.title': 'Tamper-Evident Blind Seal',
            'discretion.seal.desc': 'Tamper-evident security tape. Guaranteed unopened and untouched from our climate-controlled vault to your hands.',

            // Preguntas Frecuentes (FAQ)
            'faq.badge': 'HELP CONCIERGE',
            'faq.title': 'Frequently Asked Questions',
            'faq.subtitle': 'Clear answers regarding discreet shipping, hypoallergenic materials, warranties, and secure checkout.',
            'faq.q1.question': 'How will my order be packaged?',
            'faq.q1.answer': 'All orders are dispatched in completely smooth, sealed cardboard boxes with zero branding, logos, or adult novelty mentions. The courier will never know the contents of your parcel.',
            'faq.q2.question': 'What materials are used in the devices?',
            'faq.q2.answer': 'We exclusively craft with surgical biocompatible liquid silicone, phthalate-free ABS, and hypoallergenic non-porous metals, ensuring complete safety for delicate skin and body.',
            'faq.q3.question': 'How long does shipping take and what does it cost?',
            'faq.q3.answer': 'Shipping is <strong>FREE</strong> on orders over $1,500 MXN. For smaller orders, discreet express shipping is $180 MXN. Typical delivery time is 24 to 48 business hours to major cities.',
            'faq.q4.question': 'Do the products come with a warranty?',
            'faq.q4.answer': 'All our Pleasure Tech devices carry a 2-year direct warranty against factory defects or motor failure, backed by 24/7 concierge support.',

            // Voces Confidenciales / Testimonios VIP
            'testimonials.badge': 'VERIFIED TESTIMONIALS',
            'testimonials.title': 'Confidential Voices',
            'testimonials.subtitle': 'What our most discerning clients say about the Red Velvet experience.',
            'testimonials.t1.quote': '«I ordered the Élysée stimulator and the warm-pour candle. The box arrived completely neutral and without commercial sender labels, discreet enough for the office. The liquid silicone quality is unmatched.»',
            'testimonials.t1.author': 'Camila R.',
            'testimonials.t1.meta': '✓ Verified Member · Mexico City',
            'testimonials.t2.quote': '«The whisper-quiet motor on Nexus Sync is astonishing; virtually inaudible from the next room. The WhatsApp concierge addressed all our questions before checkout with immense delicacy and elegance.»',
            'testimonials.t2.author': 'Mauricio & Sofía',
            'testimonials.t2.meta': '✓ VIP Couple · San Pedro Garza García',
            'testimonials.t3.quote': '«The Noir Midnight lingerie has French lace and tailoring worthy of Parisian haute couture. The matte black packaging with velvet ribbon turned unboxing into a true sensory fantasy.»',
            'testimonials.t3.author': 'Valentina D.',
            'testimonials.t3.meta': '✓ Verified Member · Guadalajara',

            // The Velvet Circle
            'circle.badge': 'PRIVATE WELLNESS CLUB',
            'circle.title': 'The Velvet Circle',
            'circle.subtitle': 'Preferential access to designer releases, private masterclasses, and an exclusive <strong>15% welcome courtesy code</strong> for your first confidential order.',
            'circle.inputPlaceholder': 'Your private email address...',
            'circle.btnJoin': 'Join the Circle',
            'circle.privacyNotice': '🔒 Zero spam. Strict privacy protected by 256-bit encryption.',
            'circle.successMsg': '✨ Welcome to The Velvet Circle! Check your inbox to claim your 15% courtesy code.',

            // Drawer del Carrito / Bolsa de Compras
            'cart.headerTitle': '<span>🛍️</span> Your Shopping Bag',
            'cart.emptyTitle': 'Your bag is empty',
            'cart.emptyDesc': 'Explore our exclusive selection and add your favorite pieces.',
            'cart.freeShippingInitial': 'Add <strong>$1,500 MXN</strong> for <strong>FREE Blind Shipping</strong>',
            'cart.freeShippingProgress': 'Add <strong>${missing} MXN</strong> for <strong>FREE Blind Shipping</strong>',
            'cart.freeShippingQualified': '✨ <strong>FREE Blind Shipping!</strong> You qualify for complimentary confidential delivery.',
            'cart.couponPlaceholder': 'COUPON (e.g., VELVET10)',
            'cart.btnApplyCoupon': 'Apply',
            'cart.subtotalLabel': 'Subtotal',
            'cart.discountLabel': 'Discount',
            'cart.shippingLabel': 'Discreet Shipping',
            'cart.totalLabel': 'Estimated Total',
            'cart.shippingCalculating': 'Calculating...',
            'cart.shippingFree': 'FREE (Discreet)',
            'cart.btnProceed': 'Proceed to Discreet Checkout →',
            'cart.itemRemove': 'Remove',
            'cart.toastAdded': 'Piece added to your shopping bag',

            // Formulario de Checkout Confidencial
            'checkout.badge': 'CONFIDENTIAL CHECKOUT',
            'checkout.title': 'Complete Discreet Order',
            'checkout.subtitle': 'Your data is strictly guarded under trade secret protocols and security encryption.',
            'checkout.labelName': 'Full Name or Alias *',
            'checkout.placeholderName': 'e.g., Robert or Sophia',
            'checkout.labelPhone': 'WhatsApp / Phone *',
            'checkout.placeholderPhone': '+52 81 1234 5678',
            'checkout.labelAddress': 'Delivery Address (Street, Number, Apt) *',
            'checkout.placeholderAddress': 'e.g., 1400 Luxury Blvd, Apt 4B',
            'checkout.labelCity': 'City *',
            'checkout.placeholderCity': 'e.g., Monterrey, Mexico City, Guadalajara',
            'checkout.labelState': 'State / Province *',
            'checkout.placeholderState': 'e.g., Nuevo Leon, CDMX, Jalisco',
            'checkout.labelNotes': 'Special Discreet Delivery Instructions (Optional)',
            'checkout.placeholderNotes': 'e.g., Leave with front desk, do not ring bell, deliver after 6pm',
            'checkout.guarantee': '🔒 <strong>Blind Delivery Guarantee:</strong> The courier will deliver a neutral box with security seal. No product names or "sex shop" wording will ever be mentioned.',
            'checkout.btnSubmit': '✨ Confirm Order & Open WhatsApp Concierge',

            // Footer
            'footer.notice': 'RED VELVET — Luxury Sex Shop & Intimate Wellness (+18)',
            'footer.catalog': 'Complete Catalog',
            'footer.collections': 'Collections',
            'footer.discretion': 'Discretion Guarantee',
            'footer.faq': 'Frequently Asked Questions',
            'footer.concierge': 'VIP WhatsApp Concierge',
            'footer.suite': '⚙️ Executive Suite',

            // Yessi Concierge
            'concierge.launcherStatus': '● Online · Confidential',
            'concierge.headerRole': 'Private Advisor · RED VELVET',
            'concierge.privacyBanner': '🔒 256-bit encrypted conversation · 100% private & anonymous',
            'concierge.inputPlaceholder': 'Ask me about shipping, pieces, or courtesy codes...',
            'concierge.welcomeMsg': '<p>Hello! Welcome to <strong>RED VELVET</strong>. I am <strong>Yessi</strong>, your personal concierge and intimate wellness advisor.</p><p style="margin-top:0.4rem;">I am here to guide you with complete confidentiality on our luxury pieces, blind discreet packaging, or exclusive courtesy codes.</p><span class="yessi-msg-time">Now</span>',
            'concierge.chips': [
                '📦 How do you ensure discretion?',
                '🌹 Couples recommendations',
                '💎 Bestselling pleasure tech',
                '🏷️ Active discount codes',
                '💬 Chat via WhatsApp'
            ]
        }
    };

    /**
     * Gestor central de i18n
     */
    class I18nManager {
        constructor() {
            this.currentLang = 'es';
            this.translations = I18N_TRANSLATIONS;
            if (typeof window !== 'undefined') {
                try {
                    const saved = localStorage.getItem('redVelvetLang');
                    if (saved && (saved === 'es' || saved === 'en')) {
                        this.currentLang = saved;
                    }
                } catch (e) {
                    console.warn('[i18n] Error reading localStorage', e);
                }
            }
        }

        init() {
            this.applyLanguage(this.currentLang);
            this.bindEvents();
        }

        t(key, fallback = '') {
            const dict = this.translations[this.currentLang] || this.translations.es;
            return (dict && dict[key]) || (this.translations.es && this.translations.es[key]) || fallback;
        }

        getLanguage() {
            return this.currentLang;
        }

        setLanguage(lang) {
            if (lang !== 'es' && lang !== 'en') return;
            this.currentLang = lang;
            if (typeof localStorage !== 'undefined') {
                try {
                    localStorage.setItem('redVelvetLang', lang);
                } catch (e) {
                    console.warn('[i18n] Error saving to localStorage', e);
                }
            }
            this.applyLanguage(lang);
        }

        applyLanguage(lang) {
            if (typeof document === 'undefined') return;

            document.documentElement.lang = lang;
            const dict = this.translations[lang] || this.translations.es;

            // 1. Elementos con [data-i18n]
            const elements = document.querySelectorAll('[data-i18n]');
            elements.forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (dict[key]) {
                    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                        el.placeholder = dict[key];
                    } else {
                        el.innerHTML = dict[key];
                    }
                }
            });

            // 2. Elementos con [data-i18n-placeholder]
            const placeholderEls = document.querySelectorAll('[data-i18n-placeholder]');
            placeholderEls.forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                if (dict[key]) {
                    el.placeholder = dict[key];
                }
            });

            // 3. Fallbacks directos por selectores del DOM
            this.applyDomFallbackTranslations(dict);

            // 4. Actualizar estado visual del selector en Header
            this.updateHeaderSelectorUI(lang);

            // 5. Actualizar Yessi Concierge
            this.updateYessi(lang);

            // 6. Notificar a otros módulos vía CustomEvent
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('redVelvetLangChanged', {
                    detail: { lang, translations: dict }
                }));
            }
        }

        applyDomFallbackTranslations(dict) {
            // Header / Nav fallback
            const navLinks = document.querySelectorAll('.nav-menu ul li a');
            if (navLinks.length >= 5) {
                if (dict['nav.home']) navLinks[0].textContent = dict['nav.home'];
                if (dict['nav.catalog']) navLinks[1].textContent = dict['nav.catalog'];
                if (dict['nav.collections']) navLinks[2].textContent = dict['nav.collections'];
                if (dict['nav.discretion']) navLinks[3].textContent = dict['nav.discretion'];
                if (dict['nav.faq']) navLinks[4].textContent = dict['nav.faq'];
            }

            const cartLabel = document.querySelector('.cart-btn-header .cart-label');
            if (cartLabel && dict['header.bag']) cartLabel.textContent = dict['header.bag'];

            // Botones de acción en tarjetas de productos dinámicas si ya existen
            document.querySelectorAll('.product-quick-view-btn').forEach(btn => {
                btn.textContent = dict['catalog.card.quickView'];
            });
            document.querySelectorAll('.btn-add-to-bag').forEach(btn => {
                if (!btn.classList.contains('added-success')) {
                    btn.textContent = dict['catalog.card.addToBag'];
                }
            });

            // Catalog status count pill si ya está presente
            const countPill = document.getElementById('catalog-count-pill');
            if (countPill) {
                const match = countPill.textContent.match(/\d+/);
                const count = match ? match[0] : '36';
                countPill.textContent = (dict['catalog.status.count'] || '').replace('{count}', count);
            }

            // Totales de carrito si están en pantalla
            const subtotalLabel = document.querySelector('.cart-total-row:nth-child(1) span:first-child');
            if (subtotalLabel && dict['cart.subtotalLabel']) subtotalLabel.textContent = dict['cart.subtotalLabel'];

            const shippingLabel = document.querySelector('.cart-total-row:nth-child(3) span:first-child');
            if (shippingLabel && dict['cart.shippingLabel']) shippingLabel.textContent = dict['cart.shippingLabel'];

            const totalLabel = document.querySelector('.cart-total-row.grand-total span:first-child');
            if (totalLabel && dict['cart.totalLabel']) totalLabel.textContent = dict['cart.totalLabel'];

            const discountLabel = document.getElementById('cart-discount-label');
            if (discountLabel && dict['cart.discountLabel']) discountLabel.textContent = dict['cart.discountLabel'];

            const btnProceed = document.getElementById('btn-open-checkout');
            if (btnProceed && dict['cart.btnProceed']) btnProceed.textContent = dict['cart.btnProceed'];

            const btnApplyCoupon = document.getElementById('btn-apply-coupon');
            if (btnApplyCoupon && dict['cart.btnApplyCoupon']) btnApplyCoupon.textContent = dict['cart.btnApplyCoupon'];

            const couponInput = document.getElementById('cart-coupon-input');
            if (couponInput && dict['cart.couponPlaceholder']) couponInput.placeholder = dict['cart.couponPlaceholder'];
        }

        updateHeaderSelectorUI(lang) {
            const flagEl = document.getElementById('current-lang-flag');
            const labelEl = document.getElementById('current-lang-label') || document.getElementById('current-lang-code');
            const flags = { es: '🇲🇽', en: '🇺🇸' };
            const labels = { es: 'ES', en: 'EN' };

            if (flagEl) flagEl.textContent = flags[lang] || '🇲🇽';
            if (labelEl) labelEl.textContent = labels[lang] || 'ES';

            document.querySelectorAll('.lang-option-btn').forEach(btn => {
                const btnLang = btn.getAttribute('data-lang');
                if (btnLang === lang) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        updateYessi(lang) {
            const dict = this.translations[lang] || this.translations.es;

            // Launcher status
            const launcherStatus = document.querySelector('.yessi-launcher-text small');
            if (launcherStatus && dict['concierge.launcherStatus']) {
                launcherStatus.textContent = dict['concierge.launcherStatus'];
            }

            // Role in header
            const headerRole = document.querySelector('.yessi-header-role');
            if (headerRole && dict['concierge.headerRole']) {
                headerRole.textContent = dict['concierge.headerRole'];
            }

            // Privacy banner
            const privacyBanner = document.querySelector('.yessi-privacy-banner');
            if (privacyBanner && dict['concierge.privacyBanner']) {
                privacyBanner.textContent = dict['concierge.privacyBanner'];
            }

            // User input placeholder
            const userInput = document.getElementById('yessi-user-input');
            if (userInput && dict['concierge.inputPlaceholder']) {
                userInput.placeholder = dict['concierge.inputPlaceholder'];
            }

            // Si Yessi tiene sólo el mensaje de bienvenida y no ha iniciado conversación el usuario
            const msgBody = document.getElementById('yessi-messages-body');
            if (msgBody) {
                const bubbles = msgBody.querySelectorAll('.yessi-msg-row');
                // Si solo está la bienvenida inicial (1 mensaje del bot)
                if (bubbles.length <= 1) {
                    msgBody.innerHTML = `
                        <div class="yessi-msg-row yessi-bot-row">
                            <div class="yessi-msg-bubble">
                                ${dict['concierge.welcomeMsg']}
                            </div>
                        </div>
                    `;
                }
            }

            // Renderizar chips de sugerencia
            const chipsContainer = document.getElementById('yessi-chips-container');
            if (chipsContainer && dict['concierge.chips']) {
                chipsContainer.innerHTML = dict['concierge.chips'].map(c => `
                    <button type="button" class="yessi-chip" onclick="window.yessiClickChip('${c.replace(/'/g, "\\'")}')">
                        ${c}
                    </button>
                `).join('');
            }
        }

        bindEvents() {
            if (typeof document === 'undefined') return;

            const langBtn = document.getElementById('lang-btn') || document.getElementById('lang-menu-btn');
            const dropdownWrap = document.getElementById('lang-dropdown-wrap');
            const dropdown = document.getElementById('lang-dropdown') || document.getElementById('lang-dropdown-menu');

            if (langBtn && dropdownWrap) {
                langBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdownWrap.classList.toggle('open');
                });

                document.addEventListener('click', (e) => {
                    if (!dropdownWrap.contains(e.target)) {
                        dropdownWrap.classList.remove('open');
                    }
                });
            }

            document.querySelectorAll('.lang-option-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const lang = btn.getAttribute('data-lang');
                    if (lang) {
                        this.setLanguage(lang);
                        if (dropdownWrap) dropdownWrap.classList.remove('open');
                        if (dropdown) dropdown.classList.remove('open');
                    }
                });
            });
        }
    }

    // Instancia Singleton
    const instance = new I18nManager();

    if (typeof window !== 'undefined') {
        window.redVelvetI18n = instance;
        window.t = (key, fallback) => instance.t(key, fallback);

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => instance.init());
        } else {
            instance.init();
        }
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { I18nManager, I18N_TRANSLATIONS };
    }
})();
