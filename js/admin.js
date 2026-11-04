/**
 * RED VELVET — Suite Ejecutiva & Control E-Commerce (Luxury Sex Shop Boutique)
 * Gestión completa de Órdenes, Catálogo, Cupones y Auditoría con SQLite y JWT
 */

document.addEventListener('DOMContentLoaded', () => {

    const authFetch = async (url, options = {}) => {
        const token = sessionStorage.getItem('redVelvetAdminToken');
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return fetch(url, { ...options, headers });
    };

    // ============================================
    // 1. SESIÓN & LOGIN
    // ============================================
    const loginWrapper    = document.getElementById('admin-login-screen');
    const dashboardLayout = document.getElementById('admin-dashboard-suite');
    const formLogin       = document.getElementById('admin-login-form');
    const tokenInput      = document.getElementById('admin-token-input');
    const pinInput        = document.getElementById('admin-pin-input');
    const loginFeedback   = document.getElementById('login-feedback');
    const btnQuickDemo    = document.getElementById('btn-quick-demo');
    const btnLogout       = document.getElementById('btn-admin-logout');

    const checkAuth = () => {
        const isAuth = sessionStorage.getItem('redVelvetAdminAuth') === 'true';
        if (isAuth) {
            if (loginWrapper) loginWrapper.style.display = 'none';
            if (dashboardLayout) dashboardLayout.style.display = 'flex';
            initDashboard();
        } else {
            if (loginWrapper) loginWrapper.style.display = 'flex';
            if (dashboardLayout) dashboardLayout.style.display = 'none';
        }
    };

    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = tokenInput.value.trim().toUpperCase();
            const pin = pinInput.value.trim();

            if (loginFeedback) {
                loginFeedback.className = 'login-feedback';
                loginFeedback.style.display = 'none';
            }

            try {
                const resp = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, pin })
                });
                const data = await resp.json();

                if (data.success) {
                    if (loginFeedback) {
                        loginFeedback.className = 'login-feedback success';
                        loginFeedback.textContent = 'Acceso concedido. Abriendo panel de control...';
                        loginFeedback.style.display = 'block';
                    }
                    sessionStorage.setItem('redVelvetAdminToken', data.token);
                    sessionStorage.setItem('redVelvetAdminAuth', 'true');
                    setTimeout(checkAuth, 600);
                } else {
                    if (loginFeedback) {
                        loginFeedback.className = 'login-feedback error';
                        loginFeedback.textContent = data.error || 'Credenciales administrativas inválidas.';
                        loginFeedback.style.display = 'block';
                    }
                }
            } catch (err) {
                if ((token === 'ADMIN-999' || token === 'MASTER') && (pin === '9999' || pin === 'admin')) {
                    sessionStorage.setItem('redVelvetAdminAuth', 'true');
                    checkAuth();
                } else {
                    if (loginFeedback) {
                        loginFeedback.className = 'login-feedback error';
                        loginFeedback.textContent = 'Error de conexión con el servidor.';
                        loginFeedback.style.display = 'block';
                    }
                }
            }
        });
    }

    if (btnQuickDemo) {
        btnQuickDemo.addEventListener('click', () => {
            tokenInput.value = 'ADMIN-999';
            pinInput.value = '9999';
            formLogin.dispatchEvent(new Event('submit'));
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('redVelvetAdminAuth');
            sessionStorage.removeItem('redVelvetAdminToken');
            checkAuth();
        });
    }

    // ============================================
    // 2. NAVEGACIÓN ENTRE PESTAÑAS & RELOJ
    // ============================================
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    const tabViews   = document.querySelectorAll('.admin-tab-view');
    const viewTitle  = document.getElementById('current-view-title');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabViews.forEach(v => v.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.dataset.view;
            const targetView = document.getElementById(targetId);
            if (targetView) targetView.classList.add('active');

            const titleText = btn.querySelector('.tab-title-text');
            if (viewTitle && titleText) viewTitle.textContent = titleText.textContent;

            // Recargar datos específicos
            if (targetId === 'view-orders') loadOrders();
            if (targetId === 'view-products') loadProducts();
            if (targetId === 'view-codes') loadCoupons();
            if (targetId === 'view-overview') loadOverviewMetrics();
        });
    });

    const updateClock = () => {
        const el = document.getElementById('system-clock');
        if (el) {
            const now = new Date();
            el.textContent = now.toLocaleDateString('es-MX', {
                weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            }).toUpperCase();
        }
    };
    setInterval(updateClock, 1000);
    updateClock();

    // ============================================
    // 3. ÓRDENES & PEDIDOS
    // ============================================
    const loadOrders = async () => {
        const tbody = document.getElementById('orders-table-body');
        if (!tbody) return;

        try {
            const res = await authFetch('/api/orders');
            const data = await res.json();

            if (data.success && Array.isArray(data.orders)) {
                // Actualizar badge de pendientes
                const pendingOrders = data.orders.filter(o => o.status === 'Pendiente' || o.status === 'Empacado Discreto');
                const badge = document.getElementById('sidebar-pending-badge');
                if (badge) badge.textContent = pendingOrders.length;
                const overPending = document.getElementById('overview-pending-val');
                if (overPending) overPending.textContent = pendingOrders.length;

                if (data.orders.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:#888;">No hay pedidos registrados en la plataforma.</td></tr>';
                    return;
                }

                tbody.innerHTML = data.orders.map(order => {
                    const itemsSummary = (order.items || []).map(i => `${i.quantity}x ${i.name}`).join(', ');
                    return `
                        <tr>
                            <td><strong style="color:#D4AF37;">${order.id}</strong><br><small style="color:#888;">${new Date(order.created_at).toLocaleDateString()}</small></td>
                            <td>
                                <strong>${order.customer_name}</strong><br>
                                <small style="color:#bbb;">${order.phone}</small>
                            </td>
                            <td>
                                <span style="font-size:0.85rem;">${order.city}, ${order.state || ''}</span><br>
                                <small style="color:#888;">${order.shipping_address}</small>
                            </td>
                            <td><span style="font-size:0.82rem; color:#ddd;">${itemsSummary || 'Sin detalles'}</span></td>
                            <td><strong style="color:#fff; font-size:1.05rem;">$${Number(order.total).toLocaleString()} MXN</strong></td>
                            <td>
                                <select onchange="window.updateOrderStatus('${order.id}', this.value)" style="background:#000; color:#D4AF37; border:1px solid rgba(212,175,55,0.4); padding:0.3rem 0.5rem; border-radius:3px; font-size:0.8rem;">
                                    <option value="Pendiente" ${order.status === 'Pendiente' ? 'selected' : ''}>⏳ Pendiente</option>
                                    <option value="Empacado Discreto" ${order.status === 'Empacado Discreto' ? 'selected' : ''}>📦 Empacado Discreto</option>
                                    <option value="En Camino" ${order.status === 'En Camino' ? 'selected' : ''}>🚚 En Camino</option>
                                    <option value="Entregado" ${order.status === 'Entregado' ? 'selected' : ''}>✓ Entregado</option>
                                    <option value="Cancelado" ${order.status === 'Cancelado' ? 'selected' : ''}>✕ Cancelado</option>
                                </select>
                            </td>
                            <td>
                                <a href="https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(order.customer_name)},%20te%20contactamos%20de%20RED%20VELVET%20respecto%20a%20tu%20pedido%20${order.id}" target="_blank" class="btn-action-sm gold" style="text-decoration:none; display:inline-block; font-size:0.75rem;">
                                    💬 Contactar
                                </a>
                            </td>
                        </tr>
                    `;
                }).join('');
            }
        } catch (err) {
            console.error('Error al cargar órdenes:', err);
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:#ff5555;">Error al consultar pedidos.</td></tr>';
        }
    };

    window.updateOrderStatus = async (orderId, newStatus) => {
        try {
            const res = await authFetch(`/api/orders/${orderId}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                loadOrders();
            } else {
                alert(data.error || 'Error al actualizar estado');
            }
        } catch (err) {
            alert('Error de conexión al actualizar estado del pedido.');
        }
    };

    window.loadOrders = loadOrders;

    // ============================================
    // 4. CATÁLOGO DE PRODUCTOS (CRUD)
    // ============================================
    let cachedProducts = [];

    const loadProducts = async () => {
        const tbody = document.getElementById('products-table-body');
        if (!tbody) return;

        try {
            const res = await authFetch('/api/products');
            const data = await res.json();

            if (data.success && Array.isArray(data.products)) {
                cachedProducts = data.products;
                const prodVal = document.getElementById('overview-products-val');
                if (prodVal) prodVal.textContent = data.products.length;

                if (data.products.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem;">Catálogo vacío. Añade tu primera pieza.</td></tr>';
                    return;
                }

                tbody.innerHTML = data.products.map(prod => `
                    <tr>
                        <td>
                            <img src="${prod.photo_main}" alt="${prod.name}" style="width:48px; height:48px; object-fit:cover; border-radius:4px; border:1px solid rgba(255,255,255,0.1);">
                        </td>
                        <td>
                            <strong>${prod.name}</strong><br>
                            <small style="color:#888;">${prod.id}</small>
                        </td>
                        <td><span style="color:#D4AF37; font-size:0.85rem;">${prod.category}</span></td>
                        <td><strong>$${Number(prod.price).toLocaleString()} MXN</strong></td>
                        <td><span style="color:${prod.stock > 5 ? '#5cd87a' : '#ff5555'}; font-weight:600;">${prod.stock} un.</span></td>
                        <td><span style="background:rgba(212,175,55,0.15); color:#D4AF37; padding:2px 8px; border-radius:3px; font-size:0.75rem;">${prod.badge || 'Estándar'}</span></td>
                        <td>
                            <div style="display:flex; gap:0.4rem;">
                                <button type="button" class="btn-action-sm gold" onclick="window.editProduct('${prod.id}')" style="font-size:0.75rem;">✏️</button>
                                <button type="button" class="btn-action-sm" onclick="window.deleteProduct('${prod.id}')" style="font-size:0.75rem; color:#ff5555;">🗑️</button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
        } catch (err) {
            console.error('Error al cargar productos:', err);
        }
    };

    window.loadProducts = loadProducts;

    // Modal Añadir / Editar Producto
    const prodModal = document.getElementById('product-admin-modal');
    const formSaveProd = document.getElementById('form-save-product');

    window.openAddProductModal = () => {
        if (!prodModal) return;
        document.getElementById('product-modal-title').textContent = '✨ Añadir Nuevo Producto a la Boutique';
        document.getElementById('prod-form-id').value = '';
        formSaveProd.reset();
        prodModal.style.display = 'flex';
    };

    window.closeAddProductModal = () => {
        if (prodModal) prodModal.style.display = 'none';
    };

    window.editProduct = (id) => {
        const prod = cachedProducts.find(p => p.id === id);
        if (!prod) return;

        document.getElementById('product-modal-title').textContent = `✏️ Editar Producto: ${prod.name}`;
        document.getElementById('prod-form-id').value = prod.id;
        document.getElementById('prod-name').value = prod.name;
        document.getElementById('prod-category').value = prod.category;
        document.getElementById('prod-price').value = prod.price;
        document.getElementById('prod-compare-price').value = prod.compare_price || '';
        document.getElementById('prod-stock').value = prod.stock;
        document.getElementById('prod-subtitle').value = prod.subtitle || '';
        document.getElementById('prod-photo').value = prod.photo_main;
        document.getElementById('prod-desc').value = prod.description || '';
        document.getElementById('prod-badge').value = prod.badge || '';

        prodModal.style.display = 'flex';
    };

    if (formSaveProd) {
        formSaveProd.addEventListener('submit', async (e) => {
            e.preventDefault();
            const editId = document.getElementById('prod-form-id').value;
            const payload = {
                name: document.getElementById('prod-name').value.trim(),
                category: document.getElementById('prod-category').value,
                price: Number(document.getElementById('prod-price').value),
                compare_price: Number(document.getElementById('prod-compare-price').value) || null,
                stock: Number(document.getElementById('prod-stock').value) || 10,
                subtitle: document.getElementById('prod-subtitle').value.trim(),
                photo_main: document.getElementById('prod-photo').value.trim(),
                description: document.getElementById('prod-desc').value.trim(),
                badge: document.getElementById('prod-badge').value.trim()
            };

            const url = editId ? `/api/products/${editId}` : '/api/products';
            const method = editId ? 'PUT' : 'POST';

            try {
                const res = await authFetch(url, {
                    method: method,
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (data.success) {
                    window.closeAddProductModal();
                    loadProducts();
                } else {
                    alert(data.error || 'Error al guardar producto');
                }
            } catch (err) {
                alert('Error al comunicar con el servidor.');
            }
        });
    }

    window.deleteProduct = async (id) => {
        if (!confirm(`¿Confirmas desactivar el producto ${id} del catálogo público?`)) return;
        try {
            const res = await authFetch(`/api/products/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                loadProducts();
            } else {
                alert(data.error || 'Error al desactivar producto');
            }
        } catch (err) {
            alert('Error al desactivar producto.');
        }
    };

    // ============================================
    // 5. CUPONES & PROMOCIONES
    // ============================================
    const loadCoupons = async () => {
        const tbody = document.getElementById('coupons-table-body');
        if (!tbody) return;

        try {
            const res = await authFetch('/api/codes');
            const data = await res.json();

            if (data.success && Array.isArray(data.coupons)) {
                const coupVal = document.getElementById('overview-coupons-val');
                if (coupVal) coupVal.textContent = data.coupons.length;

                if (data.coupons.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:1.5rem;">No hay cupones activos.</td></tr>';
                    return;
                }

                tbody.innerHTML = data.coupons.map(c => `
                    <tr>
                        <td><strong style="color:#D4AF37; font-size:1.05rem;">${c.code}</strong></td>
                        <td>${c.discount_percent > 0 ? `${c.discount_percent}%` : `$${c.discount_amount} MXN`}</td>
                        <td>$${Number(c.min_purchase).toLocaleString()} MXN</td>
                        <td>${c.used_count} / ${c.max_uses || '∞'}</td>
                        <td><span style="color:#888;">${c.note || 'General'}</span></td>
                        <td>
                            <button type="button" onclick="window.deleteCoupon('${c.code}')" class="btn-action-sm" style="color:#ff5555; font-size:0.75rem;">🗑️ Eliminar</button>
                        </td>
                    </tr>
                `).join('');
            }
        } catch (err) {
            console.error('Error al cargar cupones:', err);
        }
    };

    window.loadCoupons = loadCoupons;

    const formCoupon = document.getElementById('form-create-coupon');
    if (formCoupon) {
        formCoupon.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                code: document.getElementById('new-coupon-code').value.trim().toUpperCase(),
                discount_percent: Number(document.getElementById('new-coupon-percent').value),
                min_purchase: Number(document.getElementById('new-coupon-min').value) || 0,
                note: document.getElementById('new-coupon-note').value.trim()
            };

            try {
                const res = await authFetch('/api/codes/coupon', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (data.success) {
                    formCoupon.reset();
                    loadCoupons();
                } else {
                    alert(data.error || 'Error al crear cupón');
                }
            } catch (err) {
                alert('Error al registrar cupón.');
            }
        });
    }

    window.deleteCoupon = async (code) => {
        if (!confirm(`¿Eliminar cupón ${code}?`)) return;
        try {
            const res = await authFetch(`/api/codes/coupon/${code}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                loadCoupons();
            } else {
                alert(data.error || 'Error al eliminar');
            }
        } catch (err) {
            alert('Error de conexión.');
        }
    };

    // ============================================
    // 6. MÉTRICAS DEL RESUMEN EJECUTIVO
    // ============================================
    const loadOverviewMetrics = async () => {
        try {
            const [ordersRes, prodsRes, codesRes] = await Promise.all([
                authFetch('/api/orders'),
                authFetch('/api/products'),
                authFetch('/api/codes')
            ]);

            const ordersData = await ordersRes.json();
            const prodsData = await prodsRes.json();
            const codesData = await codesRes.json();

            if (ordersData.success && Array.isArray(ordersData.orders)) {
                const totalSales = ordersData.orders
                    .filter(o => o.status !== 'Cancelado')
                    .reduce((acc, o) => acc + (Number(o.total) || 0), 0);
                const salesEl = document.getElementById('overview-sales-val');
                if (salesEl) salesEl.innerHTML = `$${totalSales.toLocaleString()} <small style="font-size:1rem; color:#D4AF37;">MXN</small>`;

                const pending = ordersData.orders.filter(o => o.status === 'Pendiente' || o.status === 'Empacado Discreto').length;
                const pendEl = document.getElementById('overview-pending-val');
                if (pendEl) pendEl.textContent = pending;

                const badge = document.getElementById('sidebar-pending-badge');
                if (badge) badge.textContent = pending;
            }

            if (prodsData.success && Array.isArray(prodsData.products)) {
                const prodEl = document.getElementById('overview-products-val');
                if (prodEl) prodEl.textContent = prodsData.products.length;
            }

            if (codesData.success && Array.isArray(codesData.coupons)) {
                const coupEl = document.getElementById('overview-coupons-val');
                if (coupEl) coupEl.textContent = codesData.coupons.length;
            }
        } catch (err) {
            console.error('Error al actualizar métricas generales:', err);
        }
    };

    const initDashboard = () => {
        loadOverviewMetrics();
        loadOrders();
        loadProducts();
        loadCoupons();
    };

    checkAuth();
});
