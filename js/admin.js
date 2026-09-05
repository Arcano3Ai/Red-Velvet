/**
 * RED VELVET — Suite Administrativa & Dashboard de Super Lujo
 * Lógica de Autenticación, Gestión de Postulaciones, Catálogo y Códigos VIP
 */

document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // 1. GESTIÓN DE SESIÓN & LOGIN
    // ============================================
    const loginWrapper     = document.getElementById('admin-login-screen');
    const dashboardLayout  = document.getElementById('admin-dashboard-suite');
    const formLogin        = document.getElementById('admin-login-form');
    const tokenInput       = document.getElementById('admin-token-input');
    const pinInput         = document.getElementById('admin-pin-input');
    const loginFeedback    = document.getElementById('login-feedback');
    const btnQuickDemo     = document.getElementById('btn-quick-demo');
    const btnLogout        = document.getElementById('btn-admin-logout');

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
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const token = tokenInput.value.trim().toUpperCase();
            const pin = pinInput.value.trim();

            loginFeedback.className = 'login-feedback';
            loginFeedback.style.display = 'none';

            // Credenciales válidas: Token ADMIN-999 o cualquier código de admin válido
            if ((token === 'ADMIN-999' || token === 'MASTER') && (pin === '9999' || pin === 'admin')) {
                loginFeedback.className = 'login-feedback success';
                loginFeedback.textContent = 'Autenticación exitosa. Descifrando suite...';
                loginFeedback.style.display = 'block';

                setTimeout(() => {
                    sessionStorage.setItem('redVelvetAdminAuth', 'true');
                    checkAuth();
                }, 900);
            } else {
                loginFeedback.className = 'login-feedback error';
                loginFeedback.textContent = 'Credenciales no autorizadas o PIN inválido.';
                loginFeedback.style.display = 'block';
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
            if (confirm('¿Deseas cerrar la Suite Administrativa de forma segura?')) {
                sessionStorage.removeItem('redVelvetAdminAuth');
                checkAuth();
            }
        });
    }

    // ============================================
    // 2. RELOJ EN VIVO & NAVEGACIÓN POR PESTAÑAS
    // ============================================
    const startLiveClock = () => {
        const clockEl = document.getElementById('system-clock');
        if (!clockEl) return;
        const update = () => {
            const now = new Date();
            clockEl.textContent = now.toLocaleDateString('es-MX', { 
                weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' 
            }).toUpperCase();
        };
        update();
        setInterval(update, 1000);
    };

    const setupTabs = () => {
        const tabBtns = document.querySelectorAll('.nav-tab-btn');
        const tabViews = document.querySelectorAll('.admin-tab-view');
        const topbarTitle = document.getElementById('current-view-title');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetViewId = btn.getAttribute('data-view');
                if (!targetViewId) return;

                tabBtns.forEach(b => b.classList.remove('active'));
                tabViews.forEach(v => v.classList.remove('active'));

                btn.classList.add('active');
                const targetView = document.getElementById(targetViewId);
                if (targetView) targetView.classList.add('active');

                const titleText = btn.querySelector('.tab-title-text');
                if (topbarTitle && titleText) {
                    topbarTitle.textContent = titleText.textContent;
                }
            });
        });
    };

    // ============================================
    // 3. GESTIÓN DE POSTULACIONES DE MODELOS
    // ============================================
    const initialApplications = [
        {
            id: 'RV-849102',
            alias: 'Scarlett',
            age: 24,
            city: 'CDMX - Polanco',
            rate: '$15,000 MXN/hr',
            whatsapp: '+52 55 4910 2819',
            nationality: 'Mexicana',
            photos: 'https://instagram.com/scarlett_exclusive',
            about: 'Acompañante VIP de alta costura, bilingüe, disponible para cenas diplomáticas y viajes internacionales.',
            status: 'Pendiente',
            date: 'Hace 45 min'
        },
        {
            id: 'RV-719304',
            alias: 'Isabella',
            age: 26,
            city: 'Monterrey - San Pedro',
            rate: '$12,000 MXN/hr',
            whatsapp: '+52 81 7193 0482',
            nationality: 'Colombiana',
            photos: 'https://instagram.com/isabella_luxury',
            about: 'Modelo de pasarela, amante del arte y gastronomía gourmet. Absoluta discreción garantizada.',
            status: 'Pendiente',
            date: 'Hace 2 horas'
        },
        {
            id: 'RV-391058',
            alias: 'Elena',
            age: 23,
            city: 'Guadalajara - Providencia',
            rate: '$9,000 MXN/hr',
            whatsapp: '+52 33 3910 5821',
            nationality: 'Española',
            photos: 'https://instagram.com/elena_velvet',
            about: 'Elegancia europea contemporánea, trato dulce, especializada en viajes y eventos de negocios.',
            status: 'Aprobada',
            date: 'Ayer'
        }
    ];

    const getApplications = () => {
        const stored = localStorage.getItem('redVelvetApplications');
        if (!stored) {
            localStorage.setItem('redVelvetApplications', JSON.stringify(initialApplications));
            return initialApplications;
        }
        try {
            return JSON.parse(stored);
        } catch (e) {
            return initialApplications;
        }
    };

    const saveApplications = (apps) => {
        localStorage.setItem('redVelvetApplications', JSON.stringify(apps));
        renderApplications();
        updateDashboardCounters();
    };

    const renderApplications = () => {
        const tableBody = document.getElementById('applications-table-body');
        if (!tableBody) return;

        const apps = getApplications();
        tableBody.innerHTML = '';

        if (apps.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color: #888;">No hay postulaciones registradas en este momento.</td></tr>`;
            return;
        }

        apps.forEach((app, index) => {
            const tr = document.createElement('tr');

            let badgeClass = 'badge-pending';
            if (app.status === 'Aprobada') badgeClass = 'badge-approved';
            if (app.status === 'Rechazada') badgeClass = 'badge-rejected';

            const isDataImage = app.photos && app.photos.startsWith('data:image');
            const isWebImage = app.photos && app.photos.startsWith('http') && app.photos.match(/\.(jpeg|jpg|png|webp|gif)/i);
            const photoSrc = isDataImage || isWebImage ? app.photos : null;

            tr.innerHTML = `
                <td><strong style="color:#D4AF37;">${app.id}</strong></td>
                <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                        ${photoSrc ? `
                            <img src="${photoSrc}" alt="${app.alias}" style="width:40px; height:40px; border-radius:50%; object-fit:cover; border:1.5px solid #D4AF37; box-shadow:0 0 8px rgba(212,175,55,0.3); cursor:pointer;" onclick="window.adminActions.viewPhoto('${photoSrc}')" title="Click para ver foto ampliada">
                        ` : `
                            <div style="width:40px; height:40px; border-radius:50%; background:#1c1c1c; border:1px solid rgba(212,175,55,0.3); display:flex; align-items:center; justify-content:center; color:#D4AF37; font-size:1.1rem;">👤</div>
                        `}
                        <div>
                            <strong>${app.alias}</strong> (${app.age} años)
                            <div style="font-size:0.75rem; color:#888;">${app.nationality || 'No especificada'} ${isDataImage ? '· <span style="color:#FFD700;">📸 Foto de Dispositivo</span>' : ''}</div>
                        </div>
                    </div>
                </td>
                <td>${app.city}</td>
                <td><span style="color:#D4AF37; font-weight:600;">${app.rate}</span></td>
                <td><span class="table-badge ${badgeClass}">${app.status}</span></td>
                <td style="font-size:0.8rem; color:#888;">${app.date || 'Reciente'}</td>
                <td>
                    <div class="action-btn-group">
                        ${app.status !== 'Aprobada' ? `
                            <button class="btn-action-sm approve" onclick="window.adminActions.approveApp(${index})" title="Aprobar y Asignar Distintivo">✓ Aprobar</button>
                        ` : `
                            <span style="color:#5cd87a; font-size:0.8rem; font-weight:600;">✓ En Catálogo</span>
                        `}
                        ${app.status !== 'Rechazada' ? `
                            <button class="btn-action-sm reject" onclick="window.adminActions.rejectApp(${index})" title="Rechazar">✕</button>
                        ` : ''}
                        ${photoSrc ? `
                            <button class="btn-action-sm gold" onclick="window.adminActions.viewPhoto('${photoSrc}')" title="Ver Fotografía">📷 Foto</button>
                        ` : (app.photos ? `
                            <a href="${app.photos}" target="_blank" class="btn-action-sm gold" title="Ver Enlace Externo">🔗 Book</a>
                        ` : '')}
                        <a href="https://wa.me/${(app.whatsapp || '').replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(app.alias)},%20te%20escribimos%20de%20la%20Dirección%20RED%20VELVET%20sobre%20tu%20postulación%20(Folio:%20${app.id})" target="_blank" class="btn-action-sm" style="background:#25D366; color:#000; font-weight:600;" title="Abrir WhatsApp">📱 WA</a>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    };

    // ============================================
    // 4. GENERADOR Y GESTOR DE CÓDIGOS VIP
    // ============================================
    const initialCodes = [
        { code: 'USER-777',  role: 'Usuario',      uses: 'Ilimitado', status: 'Activo', note: 'Acceso General Usuarios' },
        { code: 'ELITE-888', role: 'Cliente VIP',  uses: 'Ilimitado', status: 'Activo', note: 'Acceso Clientes Membresía Oro' },
        { code: 'ADMIN-999', role: 'Administrador', uses: 'Exclusivo', status: 'Activo', note: 'Token Maestro Dirección' }
    ];

    const getCodes = () => {
        const stored = localStorage.getItem('redVelvetCustomCodes');
        if (!stored) {
            localStorage.setItem('redVelvetCustomCodes', JSON.stringify(initialCodes));
            return initialCodes;
        }
        try {
            return JSON.parse(stored);
        } catch (e) {
            return initialCodes;
        }
    };

    const saveCodes = (codes) => {
        localStorage.setItem('redVelvetCustomCodes', JSON.stringify(codes));
        renderCodes();
        updateDashboardCounters();
    };

    const renderCodes = () => {
        const tableBody = document.getElementById('codes-table-body');
        if (!tableBody) return;

        const codes = getCodes();
        tableBody.innerHTML = '';

        codes.forEach((item, index) => {
            const tr = document.createElement('tr');
            const isActive = item.status === 'Activo';

            tr.innerHTML = `
                <td><code style="background:rgba(212,175,55,0.15); color:#D4AF37; padding:4px 8px; border-radius:4px; font-weight:700; font-size:0.95rem; border:1px solid rgba(212,175,55,0.3);">${item.code}</code></td>
                <td><strong>${item.role}</strong></td>
                <td>${item.uses}</td>
                <td><span class="table-badge ${isActive ? 'badge-approved' : 'badge-rejected'}">${item.status}</span></td>
                <td style="color:#888; font-size:0.85rem;">${item.note || 'Generado desde Suite'}</td>
                <td>
                    <div class="action-btn-group">
                        <button class="btn-action-sm gold" onclick="window.adminActions.copyCode('${item.code}')">📋 Copiar</button>
                        ${isActive ? `
                            <button class="btn-action-sm reject" onclick="window.adminActions.toggleCodeStatus(${index})">Desactivar</button>
                        ` : `
                            <button class="btn-action-sm approve" onclick="window.adminActions.toggleCodeStatus(${index})">Reactivar</button>
                        `}
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    };

    const setupCodeGenerator = () => {
        const btnGen = document.getElementById('btn-generate-code');
        const roleSelect = document.getElementById('gen-role-select');
        const prefixInput = document.getElementById('gen-prefix-input');

        if (btnGen) {
            btnGen.addEventListener('click', (e) => {
                e.preventDefault();
                const role = roleSelect.value;
                const prefix = (prefixInput.value.trim() || (role === 'Cliente VIP' ? 'VIP' : 'CODE')).toUpperCase();
                const randomPart = Math.floor(100 + Math.random() * 900);
                const newCode = `${prefix}-${randomPart}`;

                const codes = getCodes();
                codes.unshift({
                    code: newCode,
                    role: role,
                    uses: '10 usos',
                    status: 'Activo',
                    note: `Emitido el ${new Date().toLocaleDateString('es-MX')}`
                });

                saveCodes(codes);
                alert(`✨ Código generado con éxito:\n\nCódigo: ${newCode}\nRol: ${role}\n\nYa está activo y funcional en el portal.`);
                prefixInput.value = '';
            });
        }
    };

    // ============================================
    // 5. CATÁLOGO DE MODELOS ACTIVAS
    // ============================================
    const activeModels = [
        { name: 'Valentina', age: 28, city: 'Monterrey', rate: '$9,000 MXN/hr', tag: 'Premium', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800', active: true },
        { name: 'Sofía', age: 26, city: 'CDMX', rate: '$9,000 MXN/hr', tag: 'Elite', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800', active: true },
        { name: 'Camila', age: 24, city: 'Guadalajara', rate: '$12,000 MXN/hr', tag: 'VIP', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800', active: true },
        { name: 'Luciana', age: 25, city: 'Cancún', rate: '$12,000 MXN/hr', tag: 'Elite', img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=800', active: true },
        { name: 'Natasha', age: 27, city: 'CDMX', rate: '$15,000 MXN/hr', tag: 'VIP', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800', active: true },
        { name: 'Adriana', age: 32, city: 'Monterrey', rate: '$9,000 MXN/hr', tag: 'Premium', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800', active: true },
        { name: 'Dominique', age: 25, city: 'CDMX / Internacional', rate: '$18,000 MXN/hr', tag: 'Diamante', img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=800', active: true },
        { name: 'Giselle', age: 27, city: 'Monterrey / Cancún', rate: '$22,000 MXN/hr', tag: 'Diamante', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800', active: true }
    ];

    const renderCatalog = () => {
        const grid = document.getElementById('models-catalog-grid');
        if (!grid) return;
        grid.innerHTML = '';

        activeModels.forEach((model, index) => {
            const card = document.createElement('div');
            card.className = 'model-catalog-card';
            card.innerHTML = `
                <img src="${model.img}" alt="${model.name}" class="model-card-thumb">
                <div class="model-card-body">
                    <div class="model-card-title-row">
                        <h4>${model.name}, ${model.age}</h4>
                        <span class="table-badge badge-elite">${model.tag}</span>
                    </div>
                    <div class="model-card-rate">${model.rate}</div>
                    <div class="model-card-meta">
                        📍 ${model.city}<br>
                        Estado: <strong style="color:${model.active ? '#5cd87a' : '#ff6b7a'};">${model.active ? 'Visible en Plataforma' : 'Oculto / Pausado'}</strong>
                    </div>
                    <div class="model-card-actions">
                        <span style="font-size:0.8rem; color:#aaa;">Pausar / Activar:</span>
                        <label class="switch">
                            <input type="checkbox" ${model.active ? 'checked' : ''} onchange="window.adminActions.toggleModelActive(${index})">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    };

    // ============================================
    // 6. CONTADORES Y ACTUALIZACIÓN EN VIVO
    // ============================================
    const updateDashboardCounters = () => {
        const apps = getApplications();
        const pendingCount = apps.filter(a => a.status === 'Pendiente').length;

        const badgePendingSidebar = document.getElementById('sidebar-pending-badge');
        const metricPendingEl = document.getElementById('metric-pending-count');

        if (badgePendingSidebar) badgePendingSidebar.textContent = pendingCount;
        if (metricPendingEl) metricPendingEl.textContent = pendingCount;
    };

    // ============================================
    // 7. ACCIONES GLOBALES EXPUESTAS EN WINDOW
    // ============================================
    window.adminActions = {
        approveApp: (index) => {
            const apps = getApplications();
            if (apps[index]) {
                apps[index].status = 'Aprobada';
                saveApplications(apps);
                alert(`✨ Postulación de "${apps[index].alias}" aprobada. Se le ha otorgado distintivo dorado y activación.`);
            }
        },
        rejectApp: (index) => {
            const apps = getApplications();
            if (apps[index]) {
                if (confirm(`¿Rechazar la postulación de "${apps[index].alias}"?`)) {
                    apps[index].status = 'Rechazada';
                    saveApplications(apps);
                }
            }
        },
        copyCode: (code) => {
            navigator.clipboard.writeText(code).then(() => {
                alert(`Código "${code}" copiado al portapapeles.`);
            }).catch(() => {
                prompt('Copia este código de acceso:', code);
            });
        },
        toggleCodeStatus: (index) => {
            const codes = getCodes();
            if (codes[index]) {
                codes[index].status = codes[index].status === 'Activo' ? 'Revocado' : 'Activo';
                saveCodes(codes);
            }
        },
        toggleModelActive: (index) => {
            if (activeModels[index]) {
                activeModels[index].active = !activeModels[index].active;
                renderCatalog();
            }
        },
        viewPhoto: (src) => {
            if (!src) return;
            // Crear modal visor de foto flotante de super lujo
            const modalId = 'admin-photo-viewer-modal';
            let viewer = document.getElementById(modalId);
            if (!viewer) {
                viewer = document.createElement('div');
                viewer.id = modalId;
                viewer.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.92); z-index:99999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(15px); padding:20px;';
                viewer.innerHTML = `
                    <div style="position:relative; max-width:90vw; max-height:90vh; border:2px solid #D4AF37; border-radius:10px; overflow:hidden; box-shadow:0 0 40px rgba(212,175,55,0.4); background:#000;">
                        <button id="close-viewer-btn" style="position:absolute; top:12px; right:12px; background:rgba(0,0,0,0.7); border:1px solid #D4AF37; color:#FFD700; width:36px; height:36px; border-radius:50%; font-size:1.2rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:0.2s;">✕</button>
                        <img id="viewer-img" src="" alt="Fotografía Original de Postulación" style="max-width:85vw; max-height:85vh; object-fit:contain; display:block;">
                        <div style="padding:10px 16px; background:rgba(10,10,10,0.95); text-align:center; color:#FFD700; font-size:0.85rem; border-top:1px solid rgba(212,175,55,0.3);">
                            📸 Fotografía HD cargada directamente desde el dispositivo de la modelo
                        </div>
                    </div>
                `;
                document.body.appendChild(viewer);

                viewer.addEventListener('click', (e) => {
                    if (e.target === viewer || e.target.id === 'close-viewer-btn') {
                        viewer.style.display = 'none';
                    }
                });
            }
            const imgEl = viewer.querySelector('#viewer-img');
            if (imgEl) imgEl.src = src;
            viewer.style.display = 'flex';
        }
    };

    // Inicializar suite
    const initDashboard = () => {
        startLiveClock();
        setupTabs();
        renderApplications();
        renderCodes();
        setupCodeGenerator();
        renderCatalog();
        updateDashboardCounters();
    };

    // Arranque
    checkAuth();
});
