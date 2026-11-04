/**
 * RED VELVET — YESSI CONCIERGE (Asistente Virtual & Concierge de Ultra-Lujo)
 * Atiende dudas sobre discreción, envíos, recomendaciones del catálogo, materiales y cupones.
 */

(function () {
    'use strict';

    // Base de conocimiento exhaustiva y experta de la boutique RED VELVET
    const YESSI_KNOWLEDGE = [
        {
            keywords: ['hola', 'buenas', 'buen dia', 'buenas tardes', 'buenas noches', 'saludos', 'oye', 'hey'],
            reply: '¡Hola! Es un placer saludarte. Soy **Yessi**, tu Concierge privada de **RED VELVET**. Estoy aquí para orientarte con total confidencialidad sobre nuestras piezas de bienestar íntimo, empaques discretos o códigos de cortesía. ¿En qué puedo consentirte hoy?',
            chips: ['📦 ¿Cómo es el empaque?', '🌹 Recomendación para parejas', '💎 Succionadores más vendidos', '🏷️ Cupones disponibles']
        },
        {
            keywords: ['empaque', 'discrecion', 'discreto', 'ciego', 'caja', 'repartidor', 'secreto', 'mensajeria', 'privacidad', 'paquete'],
            reply: '🔒 **Garantía de Discreción Absoluta:**\n\nTodos nuestros pedidos se despachan en **cajas lisas de cartón neutro selladas**, sin logotipos, marcas ni leyendas como "sex shop" o "erótico". Ni el repartidor ni nadie sabrá qué contiene el paquete.\n\nAdemás, tus cargos bancarios aparecen bajo una razón social genérica y confidencial.',
            chips: ['🚚 Tiempos y costos de envío', '💳 Métodos de pago', 'Ver catálogo']
        },
        {
            keywords: ['envio', 'costo', 'tiempo', 'tarda', 'gratis', 'mexico', 'entrega', 'domicilio', 'paqueteria'],
            reply: '🚚 **Políticas de Envío:**\n\n• **Envío GRATIS:** En todas las compras mayores a **$1,500 MXN**.\n• **Envío Express Discreto:** $180 MXN para órdenes menores.\n• **Tiempos de Entrega:** De 24 a 48 horas hábiles en ciudades principales de México (CDMX, Monterrey, Guadalajara, etc.). Se entrega en mano con guía rastreable confidencial.',
            chips: ['📦 ¿Cómo es el empaque?', '🏷️ Cupón de envío/descuento', 'Explorar piezas']
        },
        {
            keywords: ['pareja', 'parejas', 'juntos', 'novios', 'esposos', 'coito', 'penetracion', 'dos', 'ambos', 'juego'],
            reply: '🌹 **Nuestras mejores piezas para disfrutar en pareja:**\n\n1. **Vibrador de Pareja Nexus Sync** ($3,850 MXN): Manos libres en forma de U, estimula el clítoris y el punto G durante la penetración.\n2. **Anillo Vibrador Apollo** ($1,450 MXN): Silicona elástica que prolonga la firmeza y vibra contra el clítoris.\n3. **Vela de Cera a Baja Temperatura Sensual Pour** ($850 MXN): Se derrite a 40°C para verter tibio sobre la piel sin quemaduras.\n4. **Baraja de Intimidad Eros** ($680 MXN): Cartas con retos eróticos y preguntas profundas.',
            productIds: ['PROD-024', 'PROD-009', 'PROD-029', 'PROD-008'],
            chips: ['Ver Nexus Sync', 'Ver Anillo Apollo', 'Ver velas térmicas']
        },
        {
            keywords: ['succionador', 'clitoris', 'satisfyer', 'womanizer', 'ondas de aire', 'aire pulsado', 'vacio', 'succion'],
            reply: '✨ **Nuestros Succionadores Estrella de Aire Pulsado:**\n\n1. **Succionador de Clítoris Aura Touch** ($2,890 MXN): Nuestro Bestseller. Estimula mediante vacío suave y pulsaciones sin roce directo, logrando orgasmos intensos en minutos sin irritación.\n2. **Siren Pearl** ($2,950 MXN): Diseño compacto ultra-discreto, sumergible IPX7 y motor Whisper-Quiet silencioso (<35 dB).\n\nAmbos fabricados en silicona médica biocompatible grado quirúrgico.',
            productIds: ['PROD-001', 'PROD-012'],
            chips: ['Añadir Aura Touch', '¿Tienen garantía?', 'Ver catálogo completo']
        },
        {
            keywords: ['cupon', 'cupones', 'descuento', 'promocion', 'codigo', 'promo', 'rebaja', 'oferta'],
            reply: '🏷️ **Códigos de Cortesía Vigentes en RED VELVET:**\n\n• **VELVET10**: 10% de descuento de bienvenida en tu primera compra.\n• **VELVET15**: 15% de cortesía para miembros de The Velvet Circle.\n• **VIP20**: 20% de descuento automático en compras mayores a $2,500 MXN.\n\nPuedes aplicarlo directamente en tu Bolsa de Compras antes de pagar.',
            chips: ['🛍️ Abrir Bolsa de Compras', 'Ver catálogo con descuento']
        },
        {
            keywords: ['material', 'materiales', 'silicona', 'seguro', 'alergia', 'cuerpo', 'limpieza', 'agua', 'sumergible', 'ipx7'],
            reply: '🛡️ **Seguridad y Materiales de Grado Médico:**\n\n• **Silicona Líquida Pura:** 100% biocompatible, no porosa, hipoalergénica y libre de ftalatos, BPA o látex.\n• **Resistencia al Agua (IPX7):** Totalmente sumergibles hasta 1 metro de profundidad para disfrutarse en tina o ducha.\n• **Acoustic Whisper-Quiet:** Motores calibrados por debajo de 38 dB para máxima privacidad acústica.\n• **Limpieza:** Se lavan fácilmente con agua tibia y jabón neutro antibacteriano.',
            chips: ['Ver dispositivos seguros', '¿Tienen garantía?']
        },
        {
            keywords: ['garantia', 'defecto', 'falla', 'reemplazo', 'devolucion', 'soporte'],
            reply: '👑 **Garantía Directa RED VELVET:**\n\nTodos nuestros dispositivos de la colección *Pleasure Tech* cuentan con **2 años de garantía directa** contra defectos de fábrica o de motor.\n\nEn caso de cualquier inconveniente, nuestro concierge te envía un reemplazo nuevo de inmediato.',
            chips: ['Hablar por WhatsApp', 'Ver catálogo']
        },
        {
            keywords: ['pago', 'pagar', 'tarjeta', 'transferencia', 'oxxo', 'seguridad', 'banco'],
            reply: '💳 **Métodos de Pago 100% Protegidos:**\n\n• Tarjetas de Crédito y Débito (Visa, Mastercard, American Express).\n• Transferencia bancaria directa (SPEI).\n• Depósito en OXXO / Efectivo.\n• Cifrado SSL de 256 bits y leyenda bancaria confidencial y discreta.',
            chips: ['📦 Garantía de empaque', 'Ver catálogo']
        },
        {
            keywords: ['masaje', 'masajeador', 'varita', 'espalda', 'cuerpo', 'wand', 'potencia', 'fuerte'],
            reply: '💎 **Masajeadores Corporales y de Zonas Íntimas:**\n\n• **Varita Masajeador Magic Wand "Solstice"** ($3,200 MXN): Cabezal flexible de silicona aterciopelada y motor de alto torque para liberar contracturas o estimulación erógena intensa.\n• **Velvet Noir Dual Wand** ($3,650 MXN): Doble motor sincrónico con cabezal pivotante 360°.\n• **Vela Térmica Champagne & Higo** ($890 MXN): Se licúa en aceite tibio para verter en masajes sensuales.',
            productIds: ['PROD-023', 'PROD-002', 'PROD-004'],
            chips: ['Ver Varita Solstice', 'Ver aceites de masaje']
        },
        {
            keywords: ['aceite', 'lubricante', 'serum', 'crema', 'cosmetica', 'balsamo', 'sensory'],
            reply: '🌿 **Línea de Cosmética Sensorial & Cuidado Íntimo:**\n\n• **Sérum Íntimo Seda de Medianoche** ($950 MXN): Con ácido hialurónico hidratante y base de agua pura.\n• **Elixir Sensuel** ($1,150 MXN): Aceite botánico seco con argán y jazmín para masajes.\n• **Mantequilla de Masaje Besable** ($690 MXN): Chocolate negro y trufa comestible.\n• **Bálsamo Néctar Fuego & Escarcha** ($650 MXN): Efecto cosquilleo frío/calor.',
            productIds: ['PROD-003', 'PROD-016', 'PROD-026', 'PROD-017'],
            chips: ['Ver cosmética sensorial', '🏷️ Códigos de descuento']
        },
        {
            keywords: ['lenceria', 'ropa', 'bata', 'corset', 'bodysuit', 'tanga', 'seda', 'encaje'],
            reply: '👑 **Fine Lingerie — Alta Costura Íntima:**\n\n• **Bodysuit Crimson Allure** ($2,150 MXN): Encaje francés bordado y escote pronunciado.\n• **Bata Kimono Red Velvet** ($3,100 MXN): Satén de seda pesado y mangas de terciopelo.\n• **Corset Estructurado Étoile** ($2,850 MXN): Satén noir con ballenas de soporte elegante.',
            productIds: ['PROD-005', 'PROD-006', 'PROD-027'],
            chips: ['Ver lencería fina', 'Ver catálogo']
        },
        {
            keywords: ['whatsapp', 'humano', 'persona', 'hablar', 'asesora', 'contacto', 'telefono'],
            reply: '💬 Con mucho gusto. Si deseas atención humana 1 a 1 de forma completamente privada, puedes chatear directamente con nuestro equipo de Concierge en WhatsApp:\n\n👉 [**Abrir WhatsApp de Concierge (+52 81 1234 5678)**](https://wa.me/528112345678?text=Hola%20RED%20VELVET,%20deseo%20asesor%C3%ADa%20personalizada%20con%20Yessi)',
            chips: ['Seguir aquí con Yessi', '📦 Preguntar por empaque']
        }
    ];

    class YessiConcierge {
        constructor() {
            this.isOpen = false;
            this.history = [];
            this.catalog = [];
            this.init();
        }

        init() {
            this.injectHTML();
            this.bindEvents();
            this.loadCatalog();
        }

        loadCatalog() {
            if (window.redVelvetCatalog && Array.isArray(window.redVelvetCatalog)) {
                this.catalog = window.redVelvetCatalog;
            } else {
                fetch('/api/products')
                    .then(res => res.json())
                    .then(data => {
                        if (data && data.products) this.catalog = data.products;
                    })
                    .catch(() => {});
            }
        }

        injectHTML() {
            if (document.getElementById('yessi-widget-container')) return;

            const wrap = document.createElement('div');
            wrap.id = 'yessi-widget-container';
            wrap.innerHTML = `
                <!-- Botón Disparador Flotante -->
                <button type="button" id="yessi-launcher-btn" class="yessi-launcher" aria-label="Abrir asistente Yessi Concierge">
                    <span class="yessi-launcher-pulse"></span>
                    <span class="yessi-launcher-avatar">👩‍💼</span>
                    <span class="yessi-launcher-text">
                        <strong>Yessi Concierge</strong>
                        <small>● En línea · Confidencial</small>
                    </span>
                    <span class="yessi-unread-badge" id="yessi-unread-badge" style="display:none;">1</span>
                </button>

                <!-- Ventana de Chat Flotante -->
                <div id="yessi-chat-window" class="yessi-chat-window" aria-hidden="true">
                    <!-- Cabecera -->
                    <div class="yessi-chat-header">
                        <div class="yessi-header-info">
                            <div class="yessi-avatar-ring">
                                <span class="yessi-header-avatar">👩‍💼</span>
                                <span class="yessi-status-dot"></span>
                            </div>
                            <div class="yessi-header-titles">
                                <h4 class="yessi-header-name">Yessi Concierge</h4>
                                <span class="yessi-header-role">Asesora Privada · RED VELVET</span>
                            </div>
                        </div>
                        <div class="yessi-header-actions">
                            <button type="button" id="yessi-btn-close" class="yessi-btn-close" aria-label="Cerrar chat">&times;</button>
                        </div>
                    </div>

                    <!-- Aviso de Confidencialidad -->
                    <div class="yessi-privacy-banner">
                        🔒 Conversación cifrada de 256 bits · 100% privada y anónima
                    </div>

                    <!-- Mensajes -->
                    <div id="yessi-messages-body" class="yessi-messages-body">
                        <!-- Mensaje de bienvenida inicial -->
                    </div>

                    <!-- Sugerencias rápidas (Chips) -->
                    <div id="yessi-chips-container" class="yessi-chips-container"></div>

                    <!-- Input / Footer -->
                    <form id="yessi-chat-form" class="yessi-chat-form" onsubmit="event.preventDefault(); window.yessiSendUserMessage();">
                        <input type="text" id="yessi-user-input" class="yessi-user-input" placeholder="Pregúntame sobre envíos, piezas o cupones..." autocomplete="off">
                        <button type="submit" id="yessi-btn-send" class="yessi-btn-send" aria-label="Enviar mensaje">
                            ➤
                        </button>
                    </form>
                </div>
            `;
            document.body.appendChild(wrap);

            // Cargar bienvenida inicial
            this.renderWelcome();
        }

        bindEvents() {
            const launcher = document.getElementById('yessi-launcher-btn');
            const closeBtn = document.getElementById('yessi-btn-close');

            if (launcher) launcher.addEventListener('click', () => this.toggleChat());
            if (closeBtn) closeBtn.addEventListener('click', () => this.toggleChat(false));

            window.yessiSendUserMessage = () => this.handleSendMessage();
            window.yessiClickChip = (text) => this.handleChipClick(text);
        }

        toggleChat(forceState) {
            const win = document.getElementById('yessi-chat-window');
            const launcher = document.getElementById('yessi-launcher-btn');
            const badge = document.getElementById('yessi-unread-badge');

            this.isOpen = typeof forceState === 'boolean' ? forceState : !this.isOpen;

            if (this.isOpen) {
                win.classList.add('active');
                launcher.classList.add('chat-open');
                if (badge) badge.style.display = 'none';
                setTimeout(() => {
                    const input = document.getElementById('yessi-user-input');
                    if (input && window.innerWidth > 680) input.focus();
                    this.scrollToBottom();
                }, 200);
            } else {
                win.classList.remove('active');
                launcher.classList.remove('chat-open');
            }
        }

        renderWelcome() {
            const body = document.getElementById('yessi-messages-body');
            if (!body) return;

            body.innerHTML = `
                <div class="yessi-msg-row yessi-bot-row">
                    <div class="yessi-msg-bubble">
                        <p>¡Hola! Te doy la bienvenida a <strong>RED VELVET</strong>. Soy <strong>Yessi</strong>, tu concierge personal y asesora de bienestar íntimo.</p>
                        <p style="margin-top:0.4rem;">Estoy aquí para ayudarte a elegir la pieza perfecta, resolver dudas de discreción de tu empaque o brindarte códigos de cortesía exclusivos.</p>
                        <span class="yessi-msg-time">Ahora</span>
                    </div>
                </div>
            `;

            this.renderChips([
                '📦 ¿Cómo garantizan la discreción?',
                '🌹 Recomendación para parejas',
                '💎 Succionadores más vendidos',
                '🏷️ Cupones de descuento vigentes',
                '💬 Hablar por WhatsApp'
            ]);
        }

        renderChips(chips) {
            const container = document.getElementById('yessi-chips-container');
            if (!container) return;

            if (!chips || chips.length === 0) {
                container.innerHTML = '';
                return;
            }

            container.innerHTML = chips.map(c => `
                <button type="button" class="yessi-chip" onclick="window.yessiClickChip('${c.replace(/'/g, "\\'")}')">
                    ${c}
                </button>
            `).join('');
        }

        handleChipClick(text) {
            const input = document.getElementById('yessi-user-input');
            if (input) input.value = text;
            this.handleSendMessage();
        }

        handleSendMessage() {
            const input = document.getElementById('yessi-user-input');
            if (!input) return;

            const query = input.value.trim();
            if (!query) return;

            input.value = '';

            // Renderizar mensaje del usuario
            this.appendMessage('user', query);

            // Mostrar typing indicator
            this.showTypingIndicator();

            // Procesar respuesta con inteligencia contextual y catálogo
            setTimeout(() => {
                this.removeTypingIndicator();
                const response = this.computeAnswer(query);
                this.appendMessage('bot', response.reply, response.productIds);
                this.renderChips(response.chips || ['📦 ¿Cómo es el empaque?', '🌹 Juegos en pareja', '🏷️ Cupones']);
                this.scrollToBottom();
            }, 600);
        }

        computeAnswer(rawQuery) {
            const q = rawQuery.toLowerCase();

            // 1. Intentar matching con la base de conocimiento
            let bestMatch = null;
            let highestScore = 0;

            for (const item of YESSI_KNOWLEDGE) {
                let score = 0;
                for (const kw of item.keywords) {
                    if (q.includes(kw)) score += kw.length;
                }
                if (score > highestScore) {
                    highestScore = score;
                    bestMatch = item;
                }
            }

            if (bestMatch && highestScore > 0) {
                return bestMatch;
            }

            // 2. Búsqueda de productos específicos en catálogo si el usuario pregunta por un nombre
            if (this.catalog && this.catalog.length > 0) {
                const matchedProducts = this.catalog.filter(p => 
                    q.includes(p.name.toLowerCase()) || 
                    (p.category && q.includes(p.category.toLowerCase())) ||
                    (p.subtitle && q.includes(p.subtitle.toLowerCase()))
                );

                if (matchedProducts.length > 0) {
                    const topProds = matchedProducts.slice(0, 3);
                    return {
                        reply: `Encontré estas piezas de autor que coinciden perfectamente con tu búsqueda:\n\n${topProds.map(p => `• **${p.name}** ($${Number(p.price).toLocaleString()} MXN) — ${p.subtitle || p.category}`).join('\n')}\n\n¿Te gustaría ver especificaciones médicas o añadir alguna a tu bolsa de compras?`,
                        productIds: topProds.map(p => p.id),
                        chips: ['📦 ¿Cómo es el envío?', '🏷️ Aplicar cupón VELVET15', 'Ver catálogo completo']
                    };
                }
            }

            // 3. Respuesta cordial por defecto
            return {
                reply: `Entiendo perfectamente. Para esa consulta o solicitud especial sobre nuestras piezas, con gusto puedo recomendarte las más destacadas de nuestro catálogo o comunicarte directamente con nuestro Concierge por WhatsApp para una atención aún más personalizada.\n\n¿Te gustaría conocer nuestros succionadores estrella, kits de pareja o detalles sobre nuestro empaque neutro y confidencial?`,
                chips: [
                    '📦 Empaque y privacidad',
                    '💎 Succionadores estrella',
                    '🌹 Piezas para parejas',
                    '💬 WhatsApp Concierge'
                ]
            };
        }

        appendMessage(sender, text, productIds) {
            const body = document.getElementById('yessi-messages-body');
            if (!body) return;

            const row = document.createElement('div');
            row.className = `yessi-msg-row ${sender === 'user' ? 'yessi-user-row' : 'yessi-bot-row'}`;

            // Formatear markdown básico (* y **)
            let formattedText = text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br>');

            let productCardsHtml = '';
            if (productIds && productIds.length > 0) {
                const prods = (this.catalog || []).filter(p => productIds.includes(p.id));
                if (prods.length > 0) {
                    productCardsHtml = `
                        <div class="yessi-products-carousel">
                            ${prods.map(p => `
                                <div class="yessi-prod-card">
                                    <img src="${p.photo_main}" alt="${p.name}" class="yessi-prod-img" onclick="window.openProductDetailModal('${p.id}')">
                                    <div class="yessi-prod-info">
                                        <h5 class="yessi-prod-title">${p.name}</h5>
                                        <span class="yessi-prod-price">$${Number(p.price).toLocaleString()} MXN</span>
                                        <div class="yessi-prod-actions">
                                            <button type="button" class="yessi-btn-add" onclick="window.addToCartDirect('${p.id}', event)">
                                                🛍️ Añadir
                                            </button>
                                            <button type="button" class="yessi-btn-view" onclick="window.openProductDetailModal('${p.id}')">
                                                Ver
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `;
                }
            }

            const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            row.innerHTML = `
                <div class="yessi-msg-bubble">
                    <p>${formattedText}</p>
                    ${productCardsHtml}
                    <span class="yessi-msg-time">${timeNow}</span>
                </div>
            `;

            body.appendChild(row);
            this.scrollToBottom();
        }

        showTypingIndicator() {
            const body = document.getElementById('yessi-messages-body');
            if (!body) return;

            const ind = document.createElement('div');
            ind.id = 'yessi-typing-indicator';
            ind.className = 'yessi-msg-row yessi-bot-row';
            ind.innerHTML = `
                <div class="yessi-msg-bubble yessi-typing-bubble">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            `;
            body.appendChild(ind);
            this.scrollToBottom();
        }

        removeTypingIndicator() {
            const ind = document.getElementById('yessi-typing-indicator');
            if (ind) ind.remove();
        }

        scrollToBottom() {
            const body = document.getElementById('yessi-messages-body');
            if (body) {
                body.scrollTop = body.scrollHeight;
            }
        }
    }

    // Inicializar Yessi Concierge cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.yessiConcierge = new YessiConcierge();
        });
    } else {
        window.yessiConcierge = new YessiConcierge();
    }
})();
