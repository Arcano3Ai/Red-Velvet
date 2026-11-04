const express = require('express');
const router = express.Router();
const { query } = require('../db/database');

// Base de conocimiento del servidor para Yessi Concierge
const SERVER_KNOWLEDGE = [
    {
        keywords: ['hola', 'buenas', 'saludos', 'yessi'],
        reply: '¡Hola! Soy Yessi, tu Concierge privada en RED VELVET. ¿En qué puedo orientarte hoy sobre nuestras piezas, envíos discretos o promociones?'
    },
    {
        keywords: ['empaque', 'discrecion', 'discreto', 'ciego', 'caja'],
        reply: 'Garantía 100% Ciega: Tu pedido viaja en cajas de cartón neutro liso, selladas y sin ningún logotipo ni mención de boutique erótica.'
    },
    {
        keywords: ['envio', 'costo', 'tiempo', 'gratis'],
        reply: 'Envío GRATIS en compras mayores a $1,500 MXN ($180 MXN en órdenes menores). Entrega express discreta en 24-48 horas a todo México.'
    },
    {
        keywords: ['cupon', 'descuento', 'codigo', 'promo'],
        reply: 'Cupones vigentes: VELVET10 (10% bienvenida), VELVET15 (15% The Velvet Circle) y VIP20 (20% en pedidos mayores a $2,500 MXN).'
    },
    {
        keywords: ['pareja', 'parejas', 'juntos'],
        reply: 'Para parejas recomendamos el vibrador Nexus Sync (estimulación en U durante la penetración), el anillo Apollo y la vela tibia Sensual Pour.'
    },
    {
        keywords: ['succionador', 'clitoris'],
        reply: 'Nuestro succionador estrella es el Aura Touch, con tecnología de aire pulsado sin fricción y silicona médica grado quirúrgico.'
    }
];

// Endpoint POST /api/concierge/chat
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ success: false, error: 'Mensaje requerido' });
        }

        const msgLower = message.toLowerCase();
        let matchedReply = null;

        for (const item of SERVER_KNOWLEDGE) {
            if (item.keywords.some(kw => msgLower.includes(kw))) {
                matchedReply = item.reply;
                break;
            }
        }

        if (!matchedReply) {
            matchedReply = 'Con gusto te asesoro. Puedes preguntarme sobre discreción de empaques, recomendaciones para parejas, succionadores o cupones de cortesía.';
        }

        // Buscar productos relacionados en la base de datos
        const relatedProducts = await query.all(
            `SELECT id, name, category, price, photo_main FROM products WHERE is_active = 1 AND (LOWER(name) LIKE ? OR LOWER(category) LIKE ?) LIMIT 3`,
            [`%${msgLower.slice(0, 15)}%`, `%${msgLower.slice(0, 15)}%`]
        );

        res.json({
            success: true,
            concierge: 'Yessi Concierge',
            reply: matchedReply,
            products: relatedProducts || []
        });
    } catch (err) {
        console.error('Error en /api/concierge/chat:', err);
        res.status(500).json({ success: false, error: 'Error interno de concierge' });
    }
});

module.exports = router;

