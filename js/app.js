document.addEventListener('DOMContentLoaded', () => {

    const bgMusic = document.getElementById('bg-music');
    let hasStartedMusic = false;

    const playMusic = () => {
        if (bgMusic && !hasStartedMusic) {
            bgMusic.play().then(() => {
                hasStartedMusic = true;
            }).catch(() => {});
        }
    };

    // ============================================
    // 1. AGE GATE
    // ============================================
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
        btnAdult.addEventListener('click', () => {
            localStorage.setItem('redVelvetAgeVerified', 'true');
            if (ageGate) ageGate.classList.remove('active');
            document.body.style.overflow = 'auto';
            playMusic();
        });
    }

    document.body.addEventListener('click', () => {
        if (localStorage.getItem('redVelvetAgeVerified') && !hasStartedMusic) playMusic();
    });

    // ============================================
    // ============================================
    // 2. INVITE CODE MODAL
    // ============================================
    const DEFAULT_VALID_CODES = {
        'USER-777':  { role: 'Usuario',        label: '👤 Mi Cuenta' },
        'ELITE-888': { role: 'Cliente VIP',    label: '💎 Mi Perfil' },
        'ADMIN-999': { role: 'Administrador',   label: '⚙️ Suite Admin' }
    };

    const getDynamicValidCodes = () => {
        let codes = { ...DEFAULT_VALID_CODES };
        try {
            const custom = JSON.parse(localStorage.getItem('redVelvetCustomCodes'));
            if (Array.isArray(custom)) {
                custom.forEach(item => {
                    if (item.status === 'Activo' && item.code) {
                        let label = '👤 Mi Cuenta';
                        if (item.role === 'Cliente VIP') label = '💎 Mi Perfil';
                        if (item.role === 'Administrador') label = '⚙️ Suite Admin';
                        codes[item.code.toUpperCase()] = { role: item.role, label: label };
                    }
                });
            }
        } catch (e) {}
        return codes;
    };

    const inviteModal   = document.getElementById('invite-modal');
    const inviteOverlay = document.getElementById('invite-overlay');
    const inviteClose   = document.getElementById('invite-close');
    const btnAcceso     = document.getElementById('btn-acceso-privado');
    const codeInput     = document.getElementById('invite-code-input');
    const btnVerify     = document.getElementById('btn-verify-code');
    const errMsg        = document.getElementById('invite-error');
    const successMsg    = document.getElementById('invite-success');

    const openInviteModal = () => {
        if (!inviteModal) return;
        inviteModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => codeInput && codeInput.focus(), 300);
    };
    const closeInviteModal = () => {
        if (!inviteModal) return;
        inviteModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        if (codeInput) { codeInput.value = ''; codeInput.classList.remove('error', 'success'); }
        if (errMsg) errMsg.style.display = 'none';
        if (successMsg) successMsg.style.display = 'none';
    };

    if (btnAcceso) btnAcceso.addEventListener('click', openInviteModal);
    if (inviteOverlay) inviteOverlay.addEventListener('click', closeInviteModal);
    if (inviteClose) inviteClose.addEventListener('click', closeInviteModal);

    const verifyCode = async () => {
        if (!codeInput) return;
        const code = codeInput.value.trim().toUpperCase();
        if (errMsg) errMsg.style.display = 'none';
        if (successMsg) successMsg.style.display = 'none';
        codeInput.classList.remove('error', 'success');

        try {
            const resp = await fetch('/api/codes/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });
            const data = await resp.json();

            if (data.valid) {
                const session = { code, role: data.role, label: data.label };
                localStorage.setItem('redVelvetSession', JSON.stringify(session));
                codeInput.classList.add('success');
                if (successMsg) successMsg.style.display = 'block';

                if (data.isAdmin) {
                    sessionStorage.setItem('redVelvetAdminAuth', 'true');
                }

                setTimeout(() => {
                    closeInviteModal();
                    if (data.isAdmin) {
                        window.location.href = 'admin.html';
                    } else {
                        updateHeaderForSession(session);
                    }
                }, 1000);
            } else {
                codeInput.classList.add('error');
                if (errMsg) {
                    errMsg.textContent = data.error || 'Código de invitación no válido o revocado.';
                    errMsg.style.display = 'block';
                }
            }
        } catch (e) {
            // Fallback en caso de desconexión momentánea
            const activeCodes = getDynamicValidCodes();
            if (activeCodes[code]) {
                const session = activeCodes[code];
                localStorage.setItem('redVelvetSession', JSON.stringify({ code, ...session }));
                codeInput.classList.add('success');
                if (successMsg) successMsg.style.display = 'block';
                if (code === 'ADMIN-999' || session.role === 'Administrador') {
                    sessionStorage.setItem('redVelvetAdminAuth', 'true');
                }
                setTimeout(() => {
                    closeInviteModal();
                    if (code === 'ADMIN-999' || session.role === 'Administrador') {
                        window.location.href = 'admin.html';
                    } else {
                        updateHeaderForSession(session);
                    }
                }, 1000);
            } else {
                codeInput.classList.add('error');
                if (errMsg) errMsg.style.display = 'block';
            }
        }
    };

    if (btnVerify) btnVerify.addEventListener('click', verifyCode);
    if (codeInput) {
        codeInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') verifyCode();
        });
    }

    // Restore session from localStorage
    const savedSession = localStorage.getItem('redVelvetSession');
    if (savedSession) {
        try {
            updateHeaderForSession(JSON.parse(savedSession));
        } catch (e) {}
    }

    function updateHeaderForSession(session) {
        if (!btnAcceso) return;
        btnAcceso.textContent = session.label;
        btnAcceso.classList.add('user-menu-btn');
        btnAcceso.classList.remove('btn-primary', 'btn-sm');
        btnAcceso.removeEventListener('click', openInviteModal);
        btnAcceso.addEventListener('click', () => {
            if (session.role === 'Administrador') {
                window.location.href = 'admin.html';
                return;
            }
            alert(`Sesión activa en RED VELVET\nRol: ${session.role}\nPresiona OK para cerrar sesión.`);
            localStorage.removeItem('redVelvetSession');
            location.reload();
        });
    }

    // ============================================
    // 3. GENERIC MODAL CONTROLLER
    // ============================================
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Close all modals on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-backdrop.active, .invite-modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
            document.body.style.overflow = 'auto';
        }
    });

    // ============================================
    // 4. MODEL PROFILE CREATION MODAL & FORM (CON SUBIDA DE FOTOS DESDE DISPOSITIVO)
    // ============================================
    const modelModal = document.getElementById('model-modal');
    const btnOpenModel = document.getElementById('btn-open-model-modal');
    const modelClose = document.getElementById('model-modal-close');
    const modelOverlay = document.getElementById('model-modal-overlay');
    const formCreateProfile = document.getElementById('form-create-profile');
    const formSuccessBox = document.getElementById('model-form-success');
    const btnCloseSuccess = document.getElementById('btn-close-success');

    // Elementos para subida de fotos desde dispositivo
    const photoDropzone = document.getElementById('photo-dropzone');
    const photoInput = document.getElementById('model-photo-input');
    const photoPreviewGrid = document.getElementById('photo-preview-grid');
    const photoUploadHint = document.getElementById('photo-upload-hint');

    let modelUploadedPhotos = []; // Almacena las imágenes comprimidas en Base64

    // Función de compresión en Canvas para optimizar imágenes y garantizar persistencia
    const compressImage = (file, maxDimension = 900, quality = 0.8) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    let width = img.width;
                    let height = img.height;
                    if (width > height) {
                        if (width > maxDimension) {
                            height = Math.round((height * maxDimension) / width);
                            width = maxDimension;
                        }
                    } else {
                        if (height > maxDimension) {
                            width = Math.round((width * maxDimension) / height);
                            height = maxDimension;
                        }
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.onerror = () => resolve(event.target.result);
            };
        });
    };

    const renderPhotoPreviews = () => {
        if (!photoPreviewGrid) return;
        photoPreviewGrid.innerHTML = '';

        if (modelUploadedPhotos.length === 0) {
            photoPreviewGrid.style.display = 'none';
            return;
        }

        photoPreviewGrid.style.display = 'flex';
        modelUploadedPhotos.forEach((photoData, index) => {
            const item = document.createElement('div');
            item.className = 'photo-preview-item';
            item.innerHTML = `
                <img src="${photoData}" alt="Foto ${index + 1}">
                ${index === 0 ? '<span class="photo-badge-main">⭐ Principal</span>' : ''}
                <button type="button" class="btn-remove-preview-photo" data-index="${index}" title="Eliminar foto">✕</button>
            `;
            photoPreviewGrid.appendChild(item);
        });

        // Eventos para eliminar fotos individuales
        photoPreviewGrid.querySelectorAll('.btn-remove-preview-photo').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.index, 10);
                modelUploadedPhotos.splice(idx, 1);
                renderPhotoPreviews();
            });
        });
    };

    const handlePhotoFiles = async (files) => {
        if (!files || files.length === 0) return;
        const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
        if (validFiles.length === 0) {
            alert('Por favor selecciona archivos de imagen válidos (JPG, PNG, WEBP).');
            return;
        }

        for (const file of validFiles) {
            if (modelUploadedPhotos.length >= 6) {
                alert('Has alcanzado el límite máximo de 6 fotografías por postulación.');
                break;
            }
            try {
                const compressed = await compressImage(file);
                modelUploadedPhotos.push(compressed);
            } catch (err) {
                console.error('Error al procesar fotografía:', err);
            }
        }
        renderPhotoPreviews();
    };

    // Listeners del Dropzone
    if (photoDropzone && photoInput) {
        photoDropzone.addEventListener('click', () => photoInput.click());

        photoInput.addEventListener('change', (e) => {
            handlePhotoFiles(e.target.files);
            photoInput.value = ''; // Permite volver a seleccionar el mismo archivo si se desea
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            photoDropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                photoDropzone.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            photoDropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                photoDropzone.classList.remove('dragover');
            });
        });

        photoDropzone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            if (dt && dt.files) {
                handlePhotoFiles(dt.files);
            }
        });
    }

    const resetModelForm = () => {
        if (formCreateProfile) formCreateProfile.reset();
        modelUploadedPhotos = [];
        renderPhotoPreviews();
        if (formCreateProfile) formCreateProfile.style.display = 'flex';
        if (formSuccessBox) formSuccessBox.style.display = 'none';
    };

    // Trigger buttons for model modal
    if (btnOpenModel) btnOpenModel.addEventListener('click', () => openModal('model-modal'));
    document.querySelectorAll('.btn-open-model-trigger, .footer-highlight-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('model-modal');
        });
    });

    if (modelClose) modelClose.addEventListener('click', () => closeModal('model-modal'));
    if (modelOverlay) modelOverlay.addEventListener('click', () => closeModal('model-modal'));
    if (btnCloseSuccess) {
        btnCloseSuccess.addEventListener('click', () => {
            closeModal('model-modal');
            setTimeout(resetModelForm, 400);
        });
    }

    // Model form submission
    if (formCreateProfile) {
        formCreateProfile.addEventListener('submit', (e) => {
            e.preventDefault();

            const age = parseInt(document.getElementById('model-age').value, 10);
            if (isNaN(age) || age < 18) {
                alert('Atención: La plataforma RED VELVET está estrictamente restringida a mayores de 18 años.');
                return;
            }

            const alias = document.getElementById('model-alias').value.trim();
            const city = document.getElementById('model-city').value;
            const rate = document.getElementById('model-rate').value;
            const whatsapp = document.getElementById('model-whatsapp').value.trim();
            const nationality = document.getElementById('model-nationality').value.trim();
            const photosLink = document.getElementById('model-photos-link').value.trim();
            const about = document.getElementById('model-about').value.trim();

            // Validación: Debe haber subido foto desde dispositivo O ingresado un link
            if (modelUploadedPhotos.length === 0 && !photosLink) {
                alert('Por favor sube al menos una fotografía desde tu dispositivo o ingresa un enlace a tu portafolio.');
                if (photoDropzone) {
                    photoDropzone.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    photoDropzone.classList.add('dragover');
                    setTimeout(() => photoDropzone.classList.remove('dragover'), 1500);
                }
                return;
            }

            const mainPhoto = modelUploadedPhotos.length > 0 ? modelUploadedPhotos[0] : photosLink;
            let folio = 'RV-' + Math.floor(100000 + Math.random() * 900000);

            // Persistir en Servidor Backend & Base de Datos SQLite
            (async () => {
                try {
                    const resp = await fetch('/api/applications', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            alias,
                            age,
                            city,
                            rate,
                            whatsapp,
                            nationality,
                            photos: mainPhoto,
                            gallery: modelUploadedPhotos,
                            about
                        })
                    });
                    const resData = await resp.json();
                    if (resData.folio) folio = resData.folio;
                } catch (apiErr) {
                    console.warn('Fallback a almacenamiento local por red:', apiErr);
                }

                // Guardar también en localStorage como réplica de contingencia
                try {
                    const existing = JSON.parse(localStorage.getItem('redVelvetApplications')) || [];
                    existing.unshift({
                        id: folio,
                        alias: alias,
                        age: age,
                        city: city,
                        rate: rate,
                        whatsapp: whatsapp,
                        nationality: nationality,
                        photos: mainPhoto,
                        allPhotos: modelUploadedPhotos,
                        photosLink: photosLink,
                        about: about,
                        status: 'Pendiente',
                        date: 'Recién postulado'
                    });
                    localStorage.setItem('redVelvetApplications', JSON.stringify(existing));
                } catch (err) {}
            })();

            // Hide form and show luxury confirmation
            formCreateProfile.style.display = 'none';
            if (formSuccessBox) {
                formSuccessBox.innerHTML = `
                    <div class="feedback-icon">💎</div>
                    <h4 style="color:#D4AF37; margin-bottom:0.8rem;">¡Postulación Registrada Exitosamente!</h4>
                    <p style="color:#ddd; margin-bottom: 1rem;">
                        Estimada <strong>${alias}</strong>, tu ficha con Folio <strong>#${folio}</strong> ha sido recibida por la Dirección de RED VELVET bajo estricto protocolo de encriptación y confidencialidad.
                    </p>

                    ${mainPhoto ? `
                    <div style="display:flex; align-items:center; gap:14px; background:rgba(212,175,55,0.08); border:1px solid rgba(212,175,55,0.3); border-radius:8px; padding:10px 14px; margin-bottom:1.2rem; text-align:left;">
                        <img src="${mainPhoto}" alt="Foto subida" style="width:65px; height:65px; object-fit:cover; border-radius:6px; border:1px solid #D4AF37;">
                        <div>
                            <span style="color:#FFD700; font-size:0.8rem; font-weight:600; display:block;">📸 Fotografía cargada desde tu dispositivo</span>
                            <span style="color:#aaa; font-size:0.75rem;">${modelUploadedPhotos.length > 1 ? `+${modelUploadedPhotos.length - 1} fotos adicionales adjuntas` : 'Foto de perfil lista para validación biométrica'}</span>
                        </div>
                    </div>
                    ` : ''}

                    <div style="background:rgba(20,20,20,0.8); border:1px solid rgba(212,175,55,0.3); border-radius:6px; padding:1.2rem; text-align:left; font-size:0.88rem; color:#bbb; margin-bottom:1.5rem;">
                        <p style="margin:0 0 6px 0;"><strong style="color:#D4AF37;">Alias:</strong> ${alias} (${age} años · ${nationality})</p>
                        <p style="margin:0 0 6px 0;"><strong style="color:#D4AF37;">Ciudad:</strong> ${city}</p>
                        <p style="margin:0 0 6px 0;"><strong style="color:#D4AF37;">Tarifa Sugerida:</strong> ${rate}</p>
                        <p style="margin:0;"><strong style="color:#D4AF37;">Contacto:</strong> ${whatsapp}</p>
                    </div>
                    <p style="color:#aaa; font-size:0.9rem; line-height:1.5; margin-bottom:1.5rem;">
                        Un miembro de nuestro equipo de admisiones te contactará vía WhatsApp en un plazo menor a 2 horas para coordinar la verificación fotográfica y activación.
                    </p>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <a href="https://wa.me/5215500000000?text=Hola%20Dirección%20RED%20VELVET,%20acabo%20de%20postular%20mi%20perfil%20con%20Folio%20${folio}%20(Alias:%20${encodeURIComponent(alias)})" target="_blank" class="btn btn-primary btn-block">
                            📱 Contactar a Dirección Velvet por WhatsApp Ahora
                        </a>
                        <button class="btn btn-outline btn-block" id="btn-done-model-close">Cerrar Ventana</button>
                    </div>
                `;
                formSuccessBox.style.display = 'block';

                const btnDone = document.getElementById('btn-done-model-close');
                if (btnDone) {
                    btnDone.addEventListener('click', () => {
                        closeModal('model-modal');
                        setTimeout(resetModelForm, 400);
                    });
                }
            }
        });
    }

    // ============================================
    // 5. LEGAL MODALS (TÉRMINOS, PRIVACIDAD, SEGURIDAD)
    // ============================================
    // Global delegation for data-open-modal
    // ============================================
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-open-modal]');
        if (trigger) {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-open-modal');
            if (targetId) openModal(targetId);
        }
    });

    // Terms Modal
    const linkTerms = document.getElementById('link-open-terms');
    const termsClose = document.getElementById('terms-modal-close');
    const termsOverlay = document.getElementById('terms-modal-overlay');
    const btnAcceptTerms = document.getElementById('btn-accept-terms');

    if (linkTerms) linkTerms.addEventListener('click', (e) => { e.preventDefault(); openModal('terms-modal'); });
    if (termsClose) termsClose.addEventListener('click', () => closeModal('terms-modal'));
    if (termsOverlay) termsOverlay.addEventListener('click', () => closeModal('terms-modal'));
    if (btnAcceptTerms) btnAcceptTerms.addEventListener('click', () => closeModal('terms-modal'));

    // Privacy Modal
    const linkPrivacy = document.getElementById('link-open-privacy');
    const privacyClose = document.getElementById('privacy-modal-close');
    const privacyOverlay = document.getElementById('privacy-modal-overlay');
    const btnAcceptPrivacy = document.getElementById('btn-accept-privacy');

    if (linkPrivacy) linkPrivacy.addEventListener('click', (e) => { e.preventDefault(); openModal('privacy-modal'); });
    if (privacyClose) privacyClose.addEventListener('click', () => closeModal('privacy-modal'));
    if (privacyOverlay) privacyOverlay.addEventListener('click', () => closeModal('privacy-modal'));
    if (btnAcceptPrivacy) btnAcceptPrivacy.addEventListener('click', () => closeModal('privacy-modal'));

    // Security Modal
    const linkSecurity = document.getElementById('link-open-security');
    const securityClose = document.getElementById('security-modal-close');
    const securityOverlay = document.getElementById('security-modal-overlay');
    const btnAcceptSecurity = document.getElementById('btn-accept-security');

    if (linkSecurity) linkSecurity.addEventListener('click', (e) => { e.preventDefault(); openModal('security-modal'); });
    if (securityClose) securityClose.addEventListener('click', () => closeModal('security-modal'));
    if (securityOverlay) securityOverlay.addEventListener('click', () => closeModal('security-modal'));
    if (btnAcceptSecurity) btnAcceptSecurity.addEventListener('click', () => closeModal('security-modal'));

    // Open legal modals directly from inside the model application form
    document.querySelectorAll('.open-terms-from-form').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('terms-modal');
        });
    });
    document.querySelectorAll('.open-privacy-from-form').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('privacy-modal');
        });
    });

    // ============================================
    // 6. STICKY HEADER
    // ============================================
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ============================================
    // 7. MOBILE MENU
    // ============================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => navMenu.classList.toggle('active'));
        document.querySelectorAll('.nav-menu a').forEach(link =>
            link.addEventListener('click', () => navMenu.classList.remove('active'))
        );
    }

    // ============================================
    // 8. FAQ ACCORDION
    // ============================================
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

    // ============================================
    // 9. SCROLL REVEAL
    // ============================================
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    const cards = document.querySelectorAll('.experience-card, .profile-card, .elite-card, .timeline-step, .testimonial-card, .join-models-card');
    cards.forEach((card, i) => {
        card.classList.add('reveal');
        card.style.transitionDelay = `${(i % 3) * 0.15}s`;
        revealObserver.observe(card);
    });

    // ============================================
    // 10. BACK TO TOP
    // ============================================
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => backToTopBtn.classList.toggle('visible', window.scrollY > 500));
        backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ============================================
    // 11. MOTOR I18N & LANGUAGE SELECTOR
    // ============================================
    if (window.redVelvetI18n) {
        window.redVelvetI18n.init();
    }

    const langWrap = document.getElementById('lang-dropdown-wrap');
    const langBtn = document.getElementById('lang-btn');
    const langDropdown = document.getElementById('lang-dropdown');
    const currentFlag = document.getElementById('current-lang-flag');
    const currentLabel = document.getElementById('current-lang-label');

    const LANG_METADATA = {
        es: { flag: '🇲🇽', label: 'ES' },
        en: { flag: '🇺🇸', label: 'EN' },
        ko: { flag: '🇰🇷', label: 'KO' }
    };

    const updateLangUI = (lang) => {
        if (LANG_METADATA[lang]) {
            if (currentFlag) currentFlag.textContent = LANG_METADATA[lang].flag;
            if (currentLabel) currentLabel.textContent = LANG_METADATA[lang].label;
        }
        document.querySelectorAll('.lang-option-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    };

    // Set initial UI based on stored language
    const currentLang = localStorage.getItem('redVelvetLang') || 'es';
    updateLangUI(currentLang);

    if (langBtn && langWrap) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langWrap.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!langWrap.contains(e.target)) {
                langWrap.classList.remove('open');
            }
        });
    }

    document.querySelectorAll('.lang-option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetLang = btn.dataset.lang;
            if (targetLang && window.redVelvetI18n) {
                window.redVelvetI18n.setLanguage(targetLang);
                updateLangUI(targetLang);
            }
            if (langWrap) langWrap.classList.remove('open');
        });
    });

    // ============================================
    // 12. LUXURY THEME MANAGER (DARK / CHAMPAGNE SILK LIGHT)
    // ============================================
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');

    const applyTheme = (theme) => {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            if (themeIcon) themeIcon.textContent = '☀️';
            themeToggleBtn?.setAttribute('title', 'Modo Oscuro / Dark Mode');
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (themeIcon) themeIcon.textContent = '🌙';
            themeToggleBtn?.setAttribute('title', 'Modo Claro / Light Mode');
        }
        localStorage.setItem('redVelvetTheme', theme);
    };

    // Apply saved theme on load
    const savedTheme = localStorage.getItem('redVelvetTheme') || 'dark';
    applyTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            const newTheme = isLight ? 'dark' : 'light';
            applyTheme(newTheme);
        });
    }

    // ============================================
    // 13. CARGA DINÁMICA DE MODELOS DESDE API REST
    // ============================================
    const profilesGrid = document.querySelector('.profiles-grid');
    const searchBtn = document.querySelector('.search-btn');
    const searchCitySelect = document.querySelector('.search-field:nth-child(1) select');
    const searchCatSelect = document.querySelector('.search-field:nth-child(5) select');

    const renderModelCard = (model) => {
        let categoryClass = 'category-vip';
        if (model.category === 'Elite') categoryClass = 'category-elite';
        if (model.category === 'Premium') categoryClass = 'category-premium';

        return `
            <div class="profile-card reveal active">
                <div class="profile-img">
                    <img src="${model.photo_main}" alt="${model.alias}" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'">
                    <div class="profile-category ${categoryClass}">${model.category || 'VIP'}</div>
                    ${model.is_elite ? '<div class="badge-elite-corner" style="position:absolute; top:12px; left:12px; background:linear-gradient(135deg,#D4AF37,#800020); color:#fff; font-size:0.7rem; font-weight:700; padding:2px 8px; border-radius:3px;">💎 ELITE</div>' : ''}
                </div>
                <div class="profile-info">
                    <div class="profile-header">
                        <h3 class="profile-name">${model.alias}, ${model.age} <span class="verified-badge" title="Perfil verificado con distintivo de oro">✓</span></h3>
                    </div>
                    <p class="profile-location">${model.city}</p>
                    <div class="profile-details">
                        <div class="detail-item"><span class="label">Tarifa:</span> <span class="val">${model.rate}</span></div>
                        <div class="detail-item"><span class="label">Nac:</span> <span class="val">${model.nationality || 'Mexicana'}</span> | <span class="label">Medidas:</span> <span class="val">${model.measurements || '90-60-90'}</span></div>
                        <div class="detail-item"><span class="label">Idiomas:</span> <span class="val">${model.languages || 'Español, Inglés'}</span></div>
                        <div class="detail-item"><span class="label">Servicios:</span> <span class="val">${model.services || 'GFE, Cenas, Eventos VIP'}</span></div>
                    </div>
                    <a href="https://wa.me/5215500000000?text=Hola%20RED%20VELVET,%20deseo%20solicitar%20reserva%20o%20información%20sobre%20${encodeURIComponent(model.alias)}" target="_blank" class="btn btn-outline btn-full">Solicitar Experiencia</a>
                </div>
            </div>
        `;
    };

    const loadDynamicCatalog = async (city = '', category = '') => {
        if (!profilesGrid) return;

        try {
            let url = '/api/models';
            const params = new URLSearchParams();
            if (city && city !== 'Todas las ciudades' && city !== 'all') params.append('city', city);
            if (category && category !== 'Todas' && category !== 'all') params.append('category', category);
            if (params.toString()) url += `?${params.toString()}`;

            const res = await fetch(url);
            if (!res.ok) return;
            const models = await res.json();

            if (Array.isArray(models) && models.length > 0) {
                profilesGrid.innerHTML = models.map(m => renderModelCard(m)).join('');
            }
        } catch (err) {
            console.warn('Usando catálogo en caché:', err);
        }
    };

    // Cargar catálogo en vivo desde el servidor
    loadDynamicCatalog();

    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const city = searchCitySelect ? searchCitySelect.value : '';
            const cat = searchCatSelect ? searchCatSelect.value : '';
            loadDynamicCatalog(city, cat);
            const explorarSec = document.getElementById('explorar');
            if (explorarSec) explorarSec.scrollIntoView({ behavior: 'smooth' });
        });
    }
});
