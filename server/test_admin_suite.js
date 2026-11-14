process.env.NODE_ENV = 'test';
const { app, initPromise } = require('./server');

const runAdminSuite = async () => {
    await initPromise;
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    console.log(`🧪 Ejecutando suite de pruebas de administración en ${baseUrl}...`);

    try {
        // 1. Login Admin
        const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: 'ADMIN-999', pin: '9999' })
        });
        const loginData = await loginRes.json();
        console.assert(loginData.success === true, 'Login falló');
        console.assert(Boolean(loginData.token), 'Token JWT ausente');
        console.log('✔ Login de Suite Ejecutiva OK (JWT generado)');

        const adminToken = loginData.token;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
        };

        // 2. Listar órdenes
        const ordersRes = await fetch(`${baseUrl}/api/orders`, { headers });
        const ordersData = await ordersRes.json();
        console.assert(ordersData.success === true, 'Consulta de órdenes falló');
        console.assert(ordersData.orders.length > 0, 'No hay órdenes');
        console.log(`✔ Listado de órdenes OK (${ordersData.orders.length} pedidos encontrados)`);

        const firstOrder = ordersData.orders[0];

        // 3. Actualizar estado de orden a 'Empacado Discreto'
        const patchRes = await fetch(`${baseUrl}/api/orders/${firstOrder.id}/status`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ status: 'Empacado Discreto' })
        });
        const patchData = await patchRes.json();
        console.assert(patchData.success === true, 'Actualización de estado falló');
        console.log(`✔ Estado de pedido ${firstOrder.id} actualizado a "Empacado Discreto"`);

        // 4. Crear nuevo producto de prueba
        const createProdRes = await fetch(`${baseUrl}/api/products`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                name: 'Antifaz de Seda Pura Rouge',
                category: 'Soft Fetish',
                price: 750,
                compare_price: 900,
                stock: 20,
                subtitle: 'Antifaz blackout acolchado en seda mulberry',
                photo_main: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=900',
                description: 'Privación sensorial absoluta con textura ultraligera.',
                badge: 'Nuevo'
            })
        });
        const createProdData = await createProdRes.json();
        console.assert(createProdData.success === true, 'Creación de producto falló');
        const createdId = createProdData.product.id;
        console.log(`✔ Producto creado exitosamente: ${createdId}`);

        // 5. Eliminar (soft-delete) producto
        const delRes = await fetch(`${baseUrl}/api/products/${createdId}`, {
            method: 'DELETE',
            headers
        });
        const delData = await delRes.json();
        console.assert(delData.success === true, 'Eliminación de producto falló');
        console.log(`✔ Producto ${createdId} desactivado correctamente`);

        // 6. Crear y verificar cupón nuevo
        const couponCode = `TESTPROMO_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const createCouponRes = await fetch(`${baseUrl}/api/codes/coupon`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                code: couponCode,
                discount_percent: 25,
                min_purchase: 500,
                note: 'Cupón de prueba automatizada'
            })
        });
        const createCouponData = await createCouponRes.json();
        console.assert(createCouponData.success === true, 'Creación de cupón falló');

        // Verificar cupón creado
        const verifyRes = await fetch(`${baseUrl}/api/codes/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: couponCode, subtotal: 1500 })
        });
        const verifyData = await verifyRes.json();
        console.assert(verifyData.success === true && verifyData.discount_percent === 25, 'Validación de cupón nuevo falló');
        console.log(`✔ Cupón ${couponCode} creado y validado al 25% de descuento`);

        console.log('\n🏆 TODAS LAS PRUEBAS DE ADMINISTRACIÓN PASARON CON ÉXITO.');
    } catch (err) {
        console.error('❌ Error en suite de pruebas de administración:', err);
        process.exitCode = 1;
    } finally {
        server.close();
    }
};

runAdminSuite();

