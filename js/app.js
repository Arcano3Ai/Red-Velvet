document.addEventListener('DOMContentLoaded', () => {
    
    const bgMusic = document.getElementById('bg-music');
    let hasStartedMusic = false;

    // Function to try playing music
    const playMusic = () => {
        if (bgMusic && !hasStartedMusic) {
            bgMusic.play().then(() => {
                hasStartedMusic = true;
            }).catch(e => console.log('Audio autoplay prevented by browser:', e));
        }
    };

    // 1. Age Gate Modal Logic
    const ageGate = document.getElementById('age-gate');
    const btnAdult = document.getElementById('btn-adult');
    
    // Check local storage
    if (!localStorage.getItem('redVelvetAgeVerified')) {
        ageGate.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
        ageGate.classList.remove('active');
        document.body.style.overflow = 'auto';
        // Try playing music immediately if verified (may be blocked by browser)
        playMusic();
    }

    btnAdult.addEventListener('click', () => {
        localStorage.setItem('redVelvetAgeVerified', 'true');
        ageGate.classList.remove('active');
        document.body.style.overflow = 'auto';
        playMusic();
    });

    // Start music on first interaction if they are already verified but browser blocked autoplay
    document.body.addEventListener('click', () => {
        if (localStorage.getItem('redVelvetAgeVerified') && !hasStartedMusic) {
            playMusic();
        }
    }, { once: false });

    // 2. Sticky Header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(navMenu) navMenu.classList.remove('active');
        });
    });

    // 4. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        btn.addEventListener('click', () => {
            // Close others
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current
            item.classList.toggle('active');
        });
    });

    // 5. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Add reveal class dynamically to some elements
    const cards = document.querySelectorAll('.experience-card, .profile-card, .elite-card, .timeline-step, .testimonial-card');
    cards.forEach((card, index) => {
        card.classList.add('reveal');
        card.style.transitionDelay = `${(index % 3) * 0.15}s`;
        revealObserver.observe(card);
    });

    // 6. Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
