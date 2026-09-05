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

    const verifyCode = () => {
        if (!codeInput) return;
        const code = codeInput.value.trim().toUpperCase();
        if (errMsg) errMsg.style.display = 'none';
        if (successMsg) successMsg.style.display = 'none';
        codeInput.classList.remove('error', 'success');

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
    // 4. MODEL PROFILE CREATION MODAL & FORM
    // ============================================
    const modelModal = document.getElementById('model-modal');
    const btnOpenModel = document.getElementById('btn-open-model-modal');
    const modelClose = document.getElementById('model-modal-close');
    const modelOverlay = document.getElementById('model-modal-overlay');
    const formCreateProfile = document.getElementById('form-create-profile');
    const formSuccessBox = document.getElementById('model-form-success');
    const btnCloseSuccess = document.getElementById('btn-close-success');

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
            setTimeout(() => {
                if (formCreateProfile) {
                    formCreateProfile.reset();
                    formCreateProfile.style.display = 'flex';
                }
                if (formSuccessBox) formSuccessBox.style.display = 'none';
            }, 400);
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
            const photos = document.getElementById('model-photos-link').value.trim();
            const about = document.getElementById('model-about').value.trim();

            const folio = 'RV-' + Math.floor(100000 + Math.random() * 900000);

            // Persist into localStorage for Admin Suite
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
                    photos: photos,
                    about: about,
                    status: 'Pendiente',
                    date: 'Recién postulado'
                });
                localStorage.setItem('redVelvetApplications', JSON.stringify(existing));
            } catch (err) {}

            // Hide form and show luxury confirmation
            formCreateProfile.style.display = 'none';
            if (formSuccessBox) {
                formSuccessBox.innerHTML = `
                    <div class="feedback-icon">💎</div>
                    <h4 style="color:#D4AF37; margin-bottom:0.8rem;">¡Postulación Registrada Exitosamente!</h4>
                    <p style="color:#ddd; margin-bottom: 1rem;">
                        Estimada <strong>${alias}</strong>, tu ficha con Folio <strong>#${folio}</strong> ha sido recibida por la Dirección de RED VELVET bajo estricto protocolo de encriptación y confidencialidad.
                    </p>
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
                        setTimeout(() => {
                            formCreateProfile.reset();
                            formCreateProfile.style.display = 'flex';
                            formSuccessBox.style.display = 'none';
                        }, 400);
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
});
