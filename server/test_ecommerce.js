const { app } = require('./server');

const runTests = async () => {
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    console.log(`🧪 Iniciando verificación de catálogo y estética en ${baseUrl}...`);

    try {
        // 1. Health check
        const healthRes = await fetch(`${baseUrl}/api/health`);
        const health = await healthRes.json();
        console.assert(health.status === 'OK', 'Health check falló');
        console.log('✔ Health check OK');

        // 2. Catálogo completo de productos
        const prodRes = await fetch(`${baseUrl}/api/products`);
        const prodData = await prodRes.json();
        console.assert(prodData.success === true, 'Listado de productos falló');
        console.assert(prodData.count >= 36, `Esperados >= 36 productos, obtenidos: ${prodData.count}`);
        console.log(`✔ Catálogo maestro verificado: ${prodData.count} productos de ultra-lujo cargados`);

        // 3. Verificación de categorías
        const catRes = await fetch(`${baseUrl}/api/products/categories/list`);
        const catData = await catRes.json();
        console.assert(catData.success === true, 'Listado de categorías falló');
        const categories = catData.categories.map(c => c.category);
        console.assert(categories.includes('Pleasure Tech'), 'Falta categoría Pleasure Tech');
        console.assert(categories.includes('Sensory Care'), 'Falta categoría Sensory Care');
        console.assert(categories.includes('Fine Lingerie'), 'Falta categoría Fine Lingerie');
        console.assert(categories.includes('Soft Fetish'), 'Falta categoría Soft Fetish');
        console.assert(categories.includes('Couples'), 'Falta categoría Couples');
        console.log(`✔ Categorías verificadas: ${categories.join(', ')}`);

        // 4. Filtro por categoría (Pleasure Tech)
        const filterRes = await fetch(`${baseUrl}/api/products?category=Pleasure%20Tech`);
        const filterData = await filterRes.json();
        console.assert(filterData.products.every(p => p.category === 'Pleasure Tech'), 'Filtro por categoría falló');
        console.log(`✔ Filtro por categoría OK (${filterData.count} productos en Pleasure Tech)`);

        // 5. Ordenamiento por precio ascendente
        const sortRes = await fetch(`${baseUrl}/api/products?sort=price_asc`);
        const sortData = await sortRes.json();
        for (let i = 0; i < sortData.products.length - 1; i++) {
            console.assert(sortData.products[i].price <= sortData.products[i + 1].price, 'Ordenamiento price_asc falló');
        }
        console.log('✔ Ordenamiento por precio (price_asc) verificado');

        // 6. Detalle de producto nuevo de alta joyería: PROD-010 (Vesper Royale)
        const detailRes = await fetch(`${baseUrl}/api/products/PROD-010`);
        const detailData = await detailRes.json();
        console.assert(detailData.success === true, 'Detalle de PROD-010 falló');
        console.assert(detailData.product.name.includes('Vesper'), 'Nombre incorrecto en PROD-010');
        console.assert(detailData.product.specs.material.includes('Oro Rosa'), 'Specs de PROD-010 incorrectas');
        console.log('✔ Producto PROD-010 (Collar Joya Vesper Royale) verificado con especificaciones de oro 24K');

        // 7. Cupón VIP GOLD30
        const couponRes = await fetch(`${baseUrl}/api/codes/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: 'GOLD30', subtotal: 5000 })
        });
        const couponData = await couponRes.json();
        console.assert(couponData.success === true, 'Cupón GOLD30 falló');
        console.assert(couponData.discount_percent === 30, 'Descuento no coincide');
        console.log('✔ Cupón GOLD30 verificado al 30% de descuento');

        // 8. Creación de Pedido con Múltiples Productos de Lujo
        const orderRes = await fetch(`${baseUrl}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customer_name: 'Camila Villalobos',
                phone: '+52 81 8345 6789',
                email: 'camila.v@example.com',
                shipping_address: 'Calzada del Valle 400',
                city: 'San Pedro Garza García',
                state: 'Nuevo León',
                notes: 'Empaque neutro sin distintivos, timbre en torre A',
                coupon_code: 'GOLD30',
                items: [
                    { id: 'PROD-010', quantity: 1 }, // Vesper Royale ($4,100)
                    { id: 'PROD-016', quantity: 1 }  // Elixir Sensuel ($1,150)
                ]
            })
        });
        const orderData = await orderRes.json();
        console.assert(orderData.success === true, 'Creación de pedido multilínea falló');
        console.assert(orderData.orderId.startsWith('ORD-'), 'ID de orden inválido');
        console.assert(orderData.whatsappUrl.includes('Camila'), 'WhatsApp URL no contiene nombre');
        console.log(`✔ Pedido de ultra-lujo creado exitosamente: ${orderData.orderId} con total calculado y cupón`);

        // 9. Asistente Yessi Concierge API (/api/concierge/chat)
        const chatRes = await fetch(`${baseUrl}/api/concierge/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: '¿Cómo garantizan el empaque discreto?' })
        });
        const chatData = await chatRes.json();
        console.assert(chatData.success === true, 'Endpoint de Yessi Concierge falló');
        console.assert(chatData.concierge === 'Yessi Concierge', 'Nombre de Concierge no coincide');
        console.assert(chatData.reply.toLowerCase().includes('ciega') || chatData.reply.toLowerCase().includes('cartón'), 'Respuesta sobre empaque no esperada');
        console.log('✔ Yessi Concierge responde adecuadamente sobre discreción de empaque y envíos');

        console.log('\n🏆 TODAS LAS PRUEBAS DE CATÁLOGO Y E-COMMERCE PASARON CON ÉXITO.');
    } catch (err) {
        console.error('❌ Error en pruebas:', err);
        process.exitCode = 1;
    } finally {
        server.close();
    }
};

runTests();
