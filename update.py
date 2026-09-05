import re

html_file = 'index.html'
with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add OG tags
og_tags = '''    <title>RED VELVET | Premium Adult Experiences</title>
    <!-- Open Graph (WhatsApp) -->
    <meta property="og:title" content="RED VELVET | Premium Adult Experiences">
    <meta property="og:description" content="Descubre una experiencia premium, privada y exclusiva.">
    <meta property="og:image" content="https://arcano3ai.github.io/Red-Velvet/assets/logo/logooficial.jpeg">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://arcano3ai.github.io/Red-Velvet/">'''
content = content.replace('    <title>RED VELVET | Premium Adult Experiences</title>', og_tags)

# 2. Add Candidate Info
details_template = '''</p>
                            <div class="profile-details">
                                <p><strong>Tarifa:</strong> $2,500 MXN / hr</p>
                                <p><strong>Servicios:</strong> GFE, Masaje, Cenas, Eventos</p>
                            </div>'''
content = re.sub(r'</p>\s*<a href="#" class="btn btn-outline btn-full">Ver perfil</a>', details_template + '\n                            <a href="#" class="btn btn-outline btn-full">Ver perfil</a>', content)

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(content)

# 3. Append Mobile CSS
css_file = 'css/style.css'
mobile_css = '''

/* Mobile Optimization & Candidate Details */
.profile-details {
    margin-bottom: 1.5rem;
    font-size: 0.85rem;
    color: var(--text-muted);
}
.profile-details strong {
    color: var(--text-main);
}
.profile-details p {
    margin-bottom: 0.3rem;
}

@media (max-width: 900px) {
    .grid-3 {
        grid-template-columns: repeat(2, 1fr);
    }
    .footer-grid {
        grid-template-columns: 1fr 1fr;
    }
    .hero-headline {
        font-size: 3.5rem;
    }
    .search-bar {
        flex-direction: column;
        gap: 1rem;
    }
    .search-divider {
        width: 100%;
        height: 1px;
    }
}

@media (max-width: 600px) {
    .grid-3 {
        grid-template-columns: 1fr;
    }
    .footer-grid {
        grid-template-columns: 1fr;
    }
    .nav-menu {
        display: none;
    }
    .menu-toggle {
        display: flex;
    }
    .hero-headline {
        font-size: 2.5rem;
    }
    .age-gate-content {
        padding: 2rem;
    }
    .age-gate-content h1 {
        font-size: 1.8rem;
    }
    .hero-buttons {
        flex-direction: column;
    }
    .timeline {
        flex-direction: column;
        gap: 2rem;
    }
    .timeline-line {
        width: 2px;
        height: 40px;
        margin: 0 auto;
    }
    .companions-content {
        flex-direction: column;
        padding: 2rem;
    }
}
'''
with open(css_file, 'a', encoding='utf-8') as f:
    f.write(mobile_css)
print('Done updating HTML and CSS')
