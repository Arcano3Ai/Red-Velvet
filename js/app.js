
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
            specs: {
                material: 'Silicona médica ultrasuave biocompatible & ABS bañado en oro rosa',
                impermeabilidad: 'IPX7 (100% sumergible hasta 1 metro de profundidad)',
                ruido: '< 38 dB (Tecnología Whisper-Quiet)',
                modos: '8 intensidades progresivas y 6 frecuencias acústicas',
                bateria: 'Batería de iones de litio recargable por pin magnético USB',
                autonomia: 'Hasta 2 horas continuas con carga completa de 90 min',
                garantia: '2 años de garantía de reposición directa'
            },
            photo_main: 'https://images.unsplash.com/photo-1593527538338-86235520a070?auto=format&fit=crop&q=80&w=900',
            badge: 'Bestseller'
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
            specs: {
                material: 'Silicona premium líquida de tacto afelpado',
                impermeabilidad: 'IPX6 resistente a salpicaduras y ducha',
                ruido: '< 42 dB',
                modos: '10 programas de pulso y 5 niveles de fuerza',
                bateria: 'Carga magnética rápida de 120 minutos',
                autonomia: '3 horas de funcionamiento ininterrumpido',
                garantia: '2 años'
            },
            photo_main: 'https://images.unsplash.com/photo-1594730366202-0c102627dec6?auto=format&fit=crop&q=80&w=900',
            badge: 'Edición Elite'
        },
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
            specs: {
                volumen: '100 ml con dispensador dosificador sin goteo',
                ingredientes: 'Agua purificada, Ácido Hialurónico vegetal, Extracto de Aloe Barbadensis, Glicerina vegetal grado USP',
                compatibilidad: '100% seguro con látex, poliisopreno y silicona médica',
                certificaciones: 'Cruelty-free, vegano, libre de parabenos, petroquímicos y perfumes artificiales'
            },
            photo_main: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=900',
            badge: '100% Biocompatible'
        },
        {
            id: 'PROD-004',
            name: 'Vela de Masaje Térmico Champagne & Higo',
            slug: 'vela-masaje-termico-champagne-higo',
            category: 'Sensory Care',
            subtitle: 'Cera de soja botánica enriquecida con manteca de karité y aceite de jojoba',
            price: 920,
            compare_price: 1100,
            stock: 35,
            description: 'Al encenderse, su llama suave funde lentamente una rica manteca caliente diseñada para derramarse directamente sobre la piel a una temperatura corporal perfecta (38°C). Nutre intensamente mientras aromatiza la alcoba con notas amaderadas y sensuales.',
            sensory_notes: 'Calor relajante inmediato, absorción sedosa sin sensación grasa, notas de higo maduro, vainilla bourbon y bergamota.',
            specs: {
                contenido: '220 gramos (más de 30 aplicaciones completas)',
                temperatura_fusion: 'Baja temperatura de fusión (38°C - no quema)',
                ingredientes: 'Cera de soja 100% pura, manteca de karité orgánica, aceite de almendras dulces, esencia de higo negro',
                recipiente: 'Cerámica esmaltada en negro mate con pico vertedor de precisión'
            },
            photo_main: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=900',
            badge: 'Experiencia Sensorial'
        },
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
            specs: {
                tallas: 'S (32B-34A), M (34B-36B), L (36C-38B)',
                material: '85% Poliamida reciclada de alta densidad, 15% Elastano de seda',
                cuidados: 'Lavado a mano con jabón neutro, secado en plano',
                detalles: 'Cierre inferior con broches de presión ocultos, tirantes regulables'
            },
            photo_main: 'https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&q=80&w=900',
            badge: 'Alta Costura'
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
            specs: {
                corte: 'Kimono holgado con cinturón desmontable a juego',
                tejido: 'Satén de seda mulberry de 22 mommes y terciopelo italiano',
                longitud: 'Hasta media pantorrilla (120 cm)',
                talla: 'Talla única ajustable (apta para XS a XL)'
            },
            photo_main: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=900',
            badge: 'Exclusivo'
        },
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
            specs: {
                incluye: '1 Antifaz blackout de seda acolchada, 2 Esposas forradas con mosquetón metálico dorado, 1 Fusta de plumas suaves de 28cm',
                materiales: 'Piel vegana estructurada, terciopelo ultrasuave, herrajes de aleación de zinc dorado pulido',
                ajuste: 'Universal y regulable mediante hebillas seguras de apertura rápida'
            },
            photo_main: 'https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?auto=format&fit=crop&q=80&w=900',
            badge: 'Favorito en Pareja'
        },
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
            specs: {
                cartas: '100 naipes de 350g con laminado tacto seda soft-touch',
                niveles: 'Nivel 1: Conexión Profunda (30), Nivel 2: Sensualidad & Caricias (35), Nivel 3: Éxtasis & Pasión (35)',
                presentacion: 'Estuche rígido con cierre magnético y grabado en oro metálico'
            },
            photo_main: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&q=80&w=900',
            badge: 'Juego de Pareja'
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
            specs: {
                material: 'Silicona líquida elástica apta para cualquier anatomía',
                impermeabilidad: 'IPX7 sumergible',
                conectividad: 'Bluetooth 5.0 con alcance de hasta 10 metros y control por app a distancia',
                bateria: 'USB magnético con 90 minutos de autonomía continua'
            },
            photo_main: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=900',
            badge: 'Control Remoto'
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
                    <div class="product-img-box">
                        <img src="${product.photo_main}" alt="${product.name}" loading="lazy">
                        ${product.badge ? `<span class="product-badge-corner">${product.badge}</span>` : ''}
                        <button type="button" class="product-quick-view-btn" onclick="window.openProductDetailModal('${product.id}')">
                            🔍 Vista Rápida & Specs
                        </button>
                    </div>
                    <div class="product-info-box">
                        <span class="product-cat-name">${product.category}</span>
                        <h3 class="product-title">${product.name}</h3>
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
