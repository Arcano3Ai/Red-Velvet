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
        ageGate.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        ageGate.classList.remove('active');
        document.body.style.overflow = 'auto';
        playMusic();
    }

    btnAdult.addEventListener('click', () => {
        localStorage.setItem('redVelvetAgeVerified', 'true');
        ageGate.classList.remove('active');
        document.body.style.overflow = 'auto';
        playMusic();
    });

    document.body.addEventListener('click', () => {
        if (localStorage.getItem('redVelvetAgeVerified') && !hasStartedMusic) playMusic();
    });

    // ============================================
    // 2. INVITE CODE MODAL
    // ============================================
    const VALID_CODES = {
        'USER-777':  { role: 'Usuario',        label: '👤 Mi Cuenta' },
        'ELITE-888': { role: 'Cliente',         label: '💎 Mi Perfil' },
        'ADMIN-999': { role: 'Administrador',   label: '⚙️ Dashboard' }
    };

    const inviteModal  = document.getElementById('invite-modal');
    const inviteOverlay = document.getElementById('invite-overlay');
    const inviteClose  = document.getElementById('invite-close');
    const btnAcceso    = document.getElementById('btn-acceso-privado');
    const codeInput    = document.getElementById('invite-code-input');
    const btnVerify    = document.getElementById('btn-verify-code');
    const errMsg       = document.getElementById('invite-error');
    const successMsg   = document.getElementById('invite-success');

    const openModal = () => {
        inviteModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => codeInput && codeInput.focus(), 300);
    };
    const closeModal = () => {
        inviteModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        if (codeInput) { codeInput.value = ''; codeInput.classList.remove('error', 'success'); }
        if (errMsg) errMsg.style.display = 'none';
        if (successMsg) successMsg.style.display = 'none';
    };

    if (btnAcceso) btnAcceso.addEventListener('click', openModal);
    if (inviteOverlay) inviteOverlay.addEventListener('click', closeModal);
    if (inviteClose) inviteClose.addEventListener('click', closeModal);

    const verifyCode = () => {
        const code = codeInput.value.trim().toUpperCase();
        errMsg.style.display = 'none';
        successMsg.style.display = 'none';
        codeInput.classList.remove('error', 'success');

        if (VALID_CODES[code]) {
            const session = VALID_CODES[code];
            localStorage.setItem('redVelvetSession', JSON.stringify({ code, ...session }));
            codeInput.classList.add('success');
            successMsg.style.display = 'block';
            setTimeout(() => {
                closeModal();
                updateHeaderForSession(session);
            }, 1500);
        } else {
            codeInput.classList.add('error');
            errMsg.style.display = 'block';
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
        // On click, show a small info
        btnAcceso.removeEventListener('click', openModal);
        btnAcceso.addEventListener('click', () => {
            alert(`Sesión activa\nRol: ${session.role}\nPresiona OK para cerrar sesión.`);
            localStorage.removeItem('redVelvetSession');
            location.reload();
        });
    }

    // ============================================
    // 3. STICKY HEADER
    // ============================================
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ============================================
    // 4. MOBILE MENU
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
    // 5. FAQ ACCORDION
    // ============================================
    document.querySelectorAll('.faq-item').forEach(item => {
        item.querySelector('.faq-question').addEventListener('click', () => {
            document.querySelectorAll('.faq-item').forEach(i => { if (i !== item) i.classList.remove('active'); });
            item.classList.toggle('active');
        });
    });

    // ============================================
    // 6. SCROLL REVEAL
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

    const cards = document.querySelectorAll('.experience-card, .profile-card, .elite-card, .timeline-step, .testimonial-card');
    cards.forEach((card, i) => {
        card.classList.add('reveal');
        card.style.transitionDelay = `${(i % 3) * 0.15}s`;
        revealObserver.observe(card);
    });

    // ============================================
    // 7. BACK TO TOP
    // ============================================
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => backToTopBtn.classList.toggle('visible', window.scrollY > 500));
        backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
});
