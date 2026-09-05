/**
 * RED VELVET — Suite Administrativa & Dashboard de Dirección Autónomo
 * Conexión completa a API RESTful con persistencia en SQLite y carga de fotos
 */

document.addEventListener('DOMContentLoaded', () => {

    // Helper para llamadas a la API autenticadas con JWT
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
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = tokenInput.value.trim().toUpperCase();
            const pin = pinInput.value.trim();

            loginFeedback.className = 'login-feedback';
            loginFeedback.style.display = 'none';

            try {
                const resp = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, pin })
                });
                const data = await resp.json();

                if (data.success) {
                    loginFeedback.className = 'login-feedback success';
                    loginFeedback.textContent = 'Autenticación exitosa. Descifrando suite ejecutiva...';
                    loginFeedback.style.display = 'block';

                    sessionStorage.setItem('redVelvetAdminToken', data.token);
                    sessionStorage.setItem('redVelvetAdminAuth', 'true');

                    setTimeout(() => checkAuth(), 800);
                } else {
                    loginFeedback.className = 'login-feedback error';
                    loginFeedback.textContent = data.error || 'Credenciales no autorizadas o PIN inválido.';
                    loginFeedback.style.display = 'block';
                }
            } catch (err) {
                // Fallback de contingencia si no hay red
                if ((token === 'ADMIN-999' || token === 'MASTER') && (pin === '9999' || pin === 'admin')) {
                    sessionStorage.setItem('redVelvetAdminAuth', 'true');
                    checkAuth();
                } else {
                    loginFeedback.className = 'login-feedback error';
                    loginFeedback.textContent = 'Error de conexión con el servidor.';
                    loginFeedback.style.display = 'block';
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
            if (confirm('¿Deseas cerrar la Suite Administrativa de forma segura?')) {
                sessionStorage.removeItem('redVelvetAdminAuth');
                sessionStorage.removeItem('redVelvetAdminToken');
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
    let cachedApplications = [];

    const loadApplications = async () => {
        try {
            const resp = await authFetch('/api/applications');
            if (resp.ok) {
                cachedApplications = await resp.json();
            } else {
                cachedApplications = JSON.parse(localStorage.getItem('redVelvetApplications')) || [];
            }
        } catch (e) {
            cachedApplications = JSON.parse(localStorage.getItem('redVelvetApplications')) || [];
        }
        renderApplications();
        updateDashboardCounters();
    };

    const renderApplications = () => {
        const tableBody = document.getElementById('applications-table-body');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        if (!cachedApplications || cachedApplications.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2.5rem; color: #888;">No hay postulaciones registradas en este momento.</td></tr>`;
            return;
        }

        cachedApplications.forEach((app) => {
            const tr = document.createElement('tr');

            let badgeClass = 'badge-pending';
            if (app.status === 'Aprobada') badgeClass = 'badge-approved';
            if (app.status === 'Rechazada') badgeClass = 'badge-rejected';

            const photoSrc = app.photos || null;

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
                            <div style="font-size:0.75rem; color:#888;">${app.nationality || 'Mexicana'}</div>
                        </div>
                    </div>
                </td>
                <td>${app.city}</td>
                <td><span style="color:#D4AF37; font-weight:600;">${app.rate}</span></td>
                <td><span class="table-badge ${badgeClass}">${app.status}</span></td>
                <td style="font-size:0.8rem; color:#888;">${app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Reciente'}</td>
                <td>
                    <div class="action-btn-group">
                        ${app.status !== 'Aprobada' ? `
                            <button class="btn-action-sm approve" onclick="window.adminActions.approveApp('${app.id}')" title="Aprobar y Publicar en Catálogo">✓ Aprobar</button>
                        ` : `
                            <span style="color:#5cd87a; font-size:0.8rem; font-weight:600;">✓ Publicada</span>
                        `}
                        ${app.status !== 'Rechazada' ? `
                            <button class="btn-action-sm reject" onclick="window.adminActions.rejectApp('${app.id}')" title="Rechazar">✕</button>
                        ` : ''}
                        ${photoSrc ? `
                            <button class="btn-action-sm gold" onclick="window.adminActions.viewPhoto('${photoSrc}')" title="Ver Fotografía">📷 Foto</button>
                        ` : ''}
                        <a href="https://wa.me/${(app.whatsapp || '').replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(app.alias)},%20te%20escribimos%20de%20la%20Dirección%20RED%20VELVET%20sobre%20tu%20postulación%20(Folio:%20${app.id})" target="_blank" class="btn-action-sm" style="background:#25D366; color:#000; font-weight:600;" title="Abrir WhatsApp">📱 WA</a>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    };

    // ============================================
    // 4. GESTIÓN DEL CATÁLOGO DE MODELOS ACTIVAS
    // ============================================
    let cachedModels = [];

    const loadModels = async () => {
        try {
            const resp = await authFetch('/api/models?includeInactive=true');
            if (resp.ok) {
                cachedModels = await resp.json();
            }
        } catch (e) {
            console.error('Error al cargar modelos:', e);
        }
        renderCatalog();
    };

    const renderCatalog = () => {
        const grid = document.getElementById('models-catalog-grid');
        if (!grid) return;

        grid.innerHTML = '';

        if (!cachedModels || cachedModels.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:3rem; color:#888;">No hay modelos en el catálogo. Usa el botón "➕ Crear Nueva Modelo" para publicar la primera.</div>`;
            return;
        }

        cachedModels.forEach((model) => {
            const card = document.createElement('div');
            card.className = 'admin-model-card';
            card.style.cssText = `
                background: rgba(18, 18, 18, 0.85);
                border: 1px solid ${model.is_active ? 'rgba(212, 175, 55, 0.4)' : 'rgba(255, 255, 255, 0.1)'};
                border-radius: 8px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 8px 25px rgba(0,0,0,0.5);
                opacity: ${model.is_active ? '1' : '0.6'};
                transition: all 0.3s ease;
            `;

            card.innerHTML = `
                <div style="position:relative; width:100%; height:220px; overflow:hidden;">
                    <img src="${model.photo_main}" alt="${model.alias}" style="width:100%; height:100%; object-fit:cover; cursor:pointer;" onclick="window.adminActions.viewPhoto('${model.photo_main}')">
                    <span style="position:absolute; top:10px; right:10px; background:${model.is_active ? '#25D366' : '#888'}; color:#000; font-size:0.7rem; font-weight:700; padding:2px 8px; border-radius:4px;">
                        ${model.is_active ? 'ACTIVA' : 'PAUSADA'}
                    </span>
                    ${model.is_elite ? `
                        <span style="position:absolute; top:10px; left:10px; background:linear-gradient(135deg,#D4AF37,#800020); color:#fff; font-size:0.7rem; font-weight:700; padding:2px 8px; border-radius:4px;">
                            💎 ELITE
                        </span>
                    ` : ''}
                </div>
                <div style="padding:1.2rem; flex:1; display:flex; flex-direction:column; justify-content:space-between;">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.4rem;">
                            <h4 style="color:#FFD700; font-size:1.1rem; margin:0;">${model.alias}, ${model.age}</h4>
                            <span style="color:#aaa; font-size:0.8rem;">${model.nationality || 'Mexicana'}</span>
                        </div>
                        <p style="color:#bbb; font-size:0.85rem; margin:0 0 0.5rem 0;">📍 ${model.city}</p>
                        <p style="color:#D4AF37; font-weight:600; font-size:0.95rem; margin:0 0 0.8rem 0;">💰 ${model.rate}</p>
                    </div>
                    <div style="display:flex; gap:8px; border-top:1px solid rgba(255,255,255,0.06); padding-top:0.8rem;">
                        <button class="btn-action-sm ${model.is_active ? '' : 'approve'}" onclick="window.adminActions.toggleModelStatus('${model.id}')" style="flex:1;">
                            ${model.is_active ? '⏸️ Pausar' : '▶️ Activar'}
                        </button>
                        <button class="btn-action-sm reject" onclick="window.adminActions.deleteModel('${model.id}', '${model.alias}')" title="Eliminar de catálogo">
                            🗑️
                        </button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    };

    // ============================================
    // 5. CÓDIGOS DE INVITACIÓN VIP
    // ============================================
    let cachedCodes = [];

    const loadCodes = async () => {
        try {
            const resp = await authFetch('/api/codes');
            if (resp.ok) {
                cachedCodes = await resp.json();
            }
        } catch (e) {
            console.error('Error al cargar códigos:', e);
        }
        renderCodes();
    };

    const renderCodes = () => {
        const tbody = document.getElementById('codes-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (!cachedCodes || cachedCodes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:#888;">No hay códigos generados.</td></tr>`;
            return;
        }

        cachedCodes.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong style="color:#D4AF37; font-family:monospace; font-size:0.95rem;">${item.code}</strong></td>
                <td><span style="color:#fff;">${item.role}</span></td>
                <td><span style="color:#aaa;">${item.used_count || 0} / ${item.max_uses}</span></td>
                <td><span class="table-badge ${item.is_active ? 'badge-approved' : 'badge-rejected'}">${item.is_active ? 'Activo' : 'Revocado'}</span></td>
                <td><small style="color:#888;">${item.note || 'Emisión VIP'}</small></td>
                <td>
                    <div class="action-btn-group">
                        <button class="btn-action-sm" onclick="window.adminActions.copyCode('${item.code}')" title="Copiar código">📋 Copiar</button>
                        <button class="btn-action-sm ${item.is_active ? 'reject' : 'approve'}" onclick="window.adminActions.toggleCodeStatus('${item.code}')">
                            ${item.is_active ? 'Revocar' : 'Reactivar'}
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    };

    // Emisión de nuevos códigos
    const btnGenerate = document.getElementById('btn-generate-code');
    if (btnGenerate) {
        btnGenerate.addEventListener('click', async () => {
            const role = document.getElementById('gen-role-select').value;
            const prefix = (document.getElementById('gen-prefix-input').value || 'VIP').trim().toUpperCase();
            const randomNum = Math.floor(100 + Math.random() * 900);
            const newCode = `${prefix}-${randomNum}`;

            try {
                const resp = await authFetch('/api/codes', {
                    method: 'POST',
                    body: JSON.stringify({
                        code: newCode,
                        role: role,
                        max_uses: 'Ilimitado',
                        note: `Emisión de ${role} por Dirección General`
                    })
                });
                const data = await resp.json();
                if (data.success) {
                    alert(`✨ Código emitido exitosamente:\n\nCódigo: ${newCode}\nRol: ${role}`);
                    loadCodes();
                } else {
                    alert(data.error || 'Error al emitir código.');
                }
            } catch (err) {
                alert('Error de conexión al emitir código.');
            }
        });
    }

    // ============================================
    // 6. MODAL CREAR NUEVA MODELO (SUBIDA DE FOTOS DESDE DISPOSITIVO)
    // ============================================
    const adminModelModal = document.getElementById('admin-model-modal');
    const btnOpenCreateModel = document.getElementById('btn-open-create-model');
    const adminModelClose = document.getElementById('admin-model-modal-close');
    const adminModelCancel = document.getElementById('adm-modal-cancel');
    const adminModelOverlay = document.getElementById('admin-model-modal-overlay');
    const formCreateModel = document.getElementById('admin-create-model-form');

    const admPhotoDropzone = document.getElementById('adm-photo-dropzone');
    const admPhotoFile = document.getElementById('adm-photo-file');
    const admPhotoPreview = document.getElementById('adm-photo-preview');
    let admSelectedFile = null;

    if (btnOpenCreateModel) {
        btnOpenCreateModel.addEventListener('click', () => {
            if (adminModelModal) adminModelModal.style.display = 'flex';
        });
    }

    const closeAdminModelModal = () => {
        if (adminModelModal) adminModelModal.style.display = 'none';
        if (formCreateModel) formCreateModel.reset();
        admSelectedFile = null;
        if (admPhotoPreview) admPhotoPreview.style.display = 'none';
    };

    if (adminModelClose) adminModelClose.addEventListener('click', closeAdminModelModal);
    if (adminModelCancel) adminModelCancel.addEventListener('click', closeAdminModelModal);
    if (adminModelOverlay) adminModelOverlay.addEventListener('click', closeAdminModelModal);

    // Selección de foto desde dispositivo
    if (admPhotoDropzone && admPhotoFile) {
        admPhotoDropzone.addEventListener('click', () => admPhotoFile.click());

        admPhotoFile.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                admSelectedFile = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (ev) => {
                    if (admPhotoPreview) {
                        admPhotoPreview.querySelector('img').src = ev.target.result;
                        admPhotoPreview.style.display = 'block';
                    }
                };
                reader.readAsDataURL(admSelectedFile);
            }
        });
    }

    // Guardar nueva modelo
    if (formCreateModel) {
        formCreateModel.addEventListener('submit', async (e) => {
            e.preventDefault();

            const alias = document.getElementById('adm-alias').value.trim();
            const age = parseInt(document.getElementById('adm-age').value, 10);
            const city = document.getElementById('adm-city').value;
            const rate = document.getElementById('adm-rate').value.trim();
            const category = document.getElementById('adm-category').value;
            const nationality = document.getElementById('adm-nationality').value.trim();
            const measurements = document.getElementById('adm-measurements').value.trim();
            const languages = document.getElementById('adm-languages').value.trim();
            const bio = document.getElementById('adm-bio').value.trim();
            const isElite = document.getElementById('adm-is-elite').checked;
            const photoUrlInput = document.getElementById('adm-photo-url').value.trim();

            let finalPhotoUrl = photoUrlInput;

            // Si subió archivo desde el dispositivo, cargarlo primero a /api/upload
            if (admSelectedFile) {
                const formData = new FormData();
                formData.append('photos', admSelectedFile);
                formData.append('targetFolder', 'models');

                try {
                    const upResp = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData
                    });
                    const upData = await upResp.json();
                    if (upData.mainUrl) {
                        finalPhotoUrl = upData.mainUrl;
                    }
                } catch (upErr) {
                    console.error('Error al subir imagen al servidor:', upErr);
                }
            }

            if (!finalPhotoUrl) {
                alert('Por favor selecciona una foto desde tu dispositivo o ingresa un enlace web de imagen.');
                return;
            }

            try {
                const resp = await authFetch('/api/models', {
                    method: 'POST',
                    body: JSON.stringify({
                        alias,
                        age,
                        city,
                        rate,
                        category,
                        nationality,
                        measurements,
                        languages,
                        services: 'GFE, Cenas, Acompañamiento VIP',
                        bio,
                        photo_main: finalPhotoUrl,
                        is_elite: isElite ? 1 : 0
                    })
                });
                const data = await resp.json();

                if (data.success) {
                    alert(`✨ Modelo "${alias}" creada y publicada con éxito en el catálogo público.`);
                    closeAdminModelModal();
                    loadModels();
                } else {
                    alert(data.error || 'Error al crear modelo.');
                }
            } catch (err) {
                alert('Error de conexión al registrar la modelo.');
            }
        });
    }

    // ============================================
    // 7. CONTADORES Y MÉTRICAS
    // ============================================
    const updateDashboardCounters = () => {
        const pendingCount = cachedApplications.filter(a => a.status === 'Pendiente').length;
        const badgePendingSidebar = document.getElementById('sidebar-pending-badge');
        const metricPendingEl = document.getElementById('metric-pending-count');

        if (badgePendingSidebar) badgePendingSidebar.textContent = pendingCount;
        if (metricPendingEl) metricPendingEl.textContent = pendingCount;
    };

    // ============================================
    // 8. ACCIONES EXPUESTAS EN WINDOW
    // ============================================
    window.adminActions = {
        approveApp: async (appId) => {
            if (!confirm(`¿Aprobar postulación #${appId} y publicarla inmediatamente en el catálogo oficial?`)) return;

            try {
                const resp = await authFetch(`/api/applications/${appId}/approve`, { method: 'PATCH' });
                const data = await resp.json();
                if (data.success) {
                    alert(`✨ Postulación aprobada. El perfil ya está publicado en el catálogo público.`);
                    loadApplications();
                    loadModels();
                } else {
                    alert(data.error || 'Error al aprobar.');
                }
            } catch (e) {
                alert('Error de conexión.');
            }
        },
        rejectApp: async (appId) => {
            if (!confirm(`¿Rechazar postulación #${appId}?`)) return;

            try {
                const resp = await authFetch(`/api/applications/${appId}/reject`, { method: 'PATCH' });
                const data = await resp.json();
                if (data.success) {
                    loadApplications();
                }
            } catch (e) {
                alert('Error de conexión.');
            }
        },
        toggleModelStatus: async (modelId) => {
            try {
                const resp = await authFetch(`/api/models/${modelId}/toggle`, { method: 'PATCH' });
                const data = await resp.json();
                if (data.success) {
                    loadModels();
                }
            } catch (e) {
                alert('Error al cambiar visibilidad.');
            }
        },
        deleteModel: async (modelId, alias) => {
            if (!confirm(`¿Eliminar definitivamente a "${alias}" del catálogo? Esta acción no se puede deshacer.`)) return;

            try {
                const resp = await authFetch(`/api/models/${modelId}`, { method: 'DELETE' });
                const data = await resp.json();
                if (data.success) {
                    alert(`Modelo eliminada con éxito.`);
                    loadModels();
                }
            } catch (e) {
                alert('Error al eliminar modelo.');
            }
        },
        copyCode: (code) => {
            navigator.clipboard.writeText(code).then(() => {
                alert(`Código "${code}" copiado al portapapeles.`);
            }).catch(() => {
                prompt('Copia este código de acceso:', code);
            });
        },
        toggleCodeStatus: async (code) => {
            try {
                const resp = await authFetch(`/api/codes/${code}/toggle`, { method: 'PATCH' });
                const data = await resp.json();
                if (data.success) {
                    loadCodes();
                }
            } catch (e) {
                alert('Error al cambiar estado del código.');
            }
        },
        viewPhoto: (src) => {
            if (!src) return;
            const modalId = 'admin-photo-viewer-modal';
            let viewer = document.getElementById(modalId);
            if (!viewer) {
                viewer = document.createElement('div');
                viewer.id = modalId;
                viewer.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.92); z-index:99999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(15px); padding:20px;';
                viewer.innerHTML = `
                    <div style="position:relative; max-width:90vw; max-height:90vh; border:2px solid #D4AF37; border-radius:10px; overflow:hidden; box-shadow:0 0 40px rgba(212,175,55,0.4); background:#000;">
                        <button id="close-viewer-btn" style="position:absolute; top:12px; right:12px; background:rgba(0,0,0,0.7); border:1px solid #D4AF37; color:#FFD700; width:36px; height:36px; border-radius:50%; font-size:1.2rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:0.2s;">✕</button>
                        <img id="viewer-img" src="" alt="Fotografía Original" style="max-width:85vw; max-height:85vh; object-fit:contain; display:block;">
                        <div style="padding:10px 16px; background:rgba(10,10,10,0.95); text-align:center; color:#FFD700; font-size:0.85rem; border-top:1px solid rgba(212,175,55,0.3);">
                            📸 Fotografía de Alta Definición — RED VELVET Executive Archive
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

    // ============================================
    // 9. INICIALIZACIÓN GENERAL DEL DASHBOARD
    // ============================================
    const initDashboard = () => {
        startLiveClock();
        setupTabs();
        loadApplications();
        loadModels();
        loadCodes();
    };

    checkAuth();
});
