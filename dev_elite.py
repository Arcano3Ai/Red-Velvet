import re

html_file = 'index.html'
with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Define the new Elite HTML structure
elite_section_regex = r'<!-- RED VELVET ELITE -->[\s\S]*?<!-- How it works -->'

new_elite_html = '''<!-- RED VELVET ELITE -->
        <section class="section elite-section">
            <div class="elite-bg-glow"></div>
            <div class="container">
                <div class="elite-header text-center">
                    <h2 class="elite-title">RED VELVET ELITE</h2>
                    <p class="elite-subtitle">El nivel más alto de exclusividad. Perfiles de talla internacional, disponibles únicamente bajo estricta reserva y verificación de membresía.</p>
                </div>
                <div class="grid-3 elite-grid">
                    <div class="elite-card">
                        <div class="elite-badge">💎 Nivel Diamante</div>
                        <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800" alt="Amelia">
                        <div class="elite-card-overlay">
                            <div class="elite-info-top">
                                <h3>Amelia</h3>
                                <span class="elite-loc">📍 CDMX - Polanco</span>
                            </div>
                            <div class="elite-details-premium">
                                <ul>
                                    <li><span>Nacionalidad:</span> Rusa</li>
                                    <li><span>Medidas:</span> 90-60-92</li>
                                    <li><span>Tarifa:</span> <span class="elite-price">$8,000 MXN / hr</span></li>
                                </ul>
                                <a href="#" class="btn btn-gold btn-full">Solicitar Reserva Privada</a>
                            </div>
                        </div>
                    </div>
                    <div class="elite-card">
                        <div class="elite-badge">💎 Nivel Diamante</div>
                        <img src="https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&q=80&w=800" alt="Julieta">
                        <div class="elite-card-overlay">
                            <div class="elite-info-top">
                                <h3>Julieta</h3>
                                <span class="elite-loc">📍 Monterrey - SPGG</span>
                            </div>
                            <div class="elite-details-premium">
                                <ul>
                                    <li><span>Nacionalidad:</span> Colombiana</li>
                                    <li><span>Medidas:</span> 92-62-95</li>
                                    <li><span>Tarifa:</span> <span class="elite-price">$7,500 MXN / hr</span></li>
                                </ul>
                                <a href="#" class="btn btn-gold btn-full">Solicitar Reserva Privada</a>
                            </div>
                        </div>
                    </div>
                    <div class="elite-card">
                        <div class="elite-badge">💎 Nivel Diamante</div>
                        <img src="https://images.unsplash.com/photo-1513207565459-d7f36bfa1222?auto=format&fit=crop&q=80&w=800" alt="Valeria">
                        <div class="elite-card-overlay">
                            <div class="elite-info-top">
                                <h3>Valeria</h3>
                                <span class="elite-loc">📍 Guadalajara - Andares</span>
                            </div>
                            <div class="elite-details-premium">
                                <ul>
                                    <li><span>Nacionalidad:</span> Brasileña</li>
                                    <li><span>Medidas:</span> 95-65-98</li>
                                    <li><span>Tarifa:</span> <span class="elite-price">$9,000 MXN / hr</span></li>
                                </ul>
                                <a href="#" class="btn btn-gold btn-full">Solicitar Reserva Privada</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center elite-action">
                    <a href="#" class="btn btn-outline btn-lg" style="color: #D4AF37; border-color: #D4AF37;">Aplicar para Membresía Elite</a>
                </div>
            </div>
        </section>

        <!-- How it works -->'''

content = re.sub(elite_section_regex, new_elite_html, content)

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(content)

# Now, append CSS for the Elite section
css_file = 'css/style.css'
elite_css = '''
/* --- Elite Section Overhaul --- */
.elite-section {
    position: relative;
    background: #020202;
    overflow: hidden;
    padding: 6rem 0;
}

.elite-bg-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    height: 60%;
    background: radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, rgba(0,0,0,0) 70%);
    z-index: 0;
    pointer-events: none;
}

.elite-section .container {
    position: relative;
    z-index: 1;
}

.elite-badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: rgba(0, 0, 0, 0.8);
    color: #D4AF37;
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    border: 1px solid #D4AF37;
    z-index: 2;
    border-radius: 2px;
    backdrop-filter: blur(5px);
}

.elite-card {
    height: 550px;
    border: 1px solid rgba(212, 175, 55, 0.2);
    border-radius: 4px;
}

.elite-card:hover {
    border: 1px solid rgba(212, 175, 55, 0.8);
    box-shadow: 0 15px 40px rgba(212, 175, 55, 0.15);
}

.elite-card-overlay {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 30%, transparent 100%);
    transform: translateY(0);
    opacity: 1; /* Keep it always visible but transition details */
    padding: 0;
}

.elite-info-top {
    padding: 2rem 2rem 1rem 2rem;
    transform: translateY(100px);
    transition: var(--transition);
}

.elite-card:hover .elite-info-top {
    transform: translateY(0);
}

.elite-info-top h3 {
    font-size: 2.2rem;
    color: #F5F5F0;
    margin-bottom: 0.5rem;
    font-family: var(--font-serif);
}

.elite-loc {
    color: #D4AF37;
    font-size: 0.9rem;
    letter-spacing: 1px;
}

.elite-details-premium {
    padding: 0 2rem 2rem 2rem;
    opacity: 0;
    transform: translateY(20px);
    transition: var(--transition);
    max-height: 0;
}

.elite-card:hover .elite-details-premium {
    opacity: 1;
    transform: translateY(0);
    max-height: 300px;
}

.elite-details-premium ul {
    margin-bottom: 1.5rem;
    border-top: 1px solid rgba(255,255,255,0.1);
    padding-top: 1rem;
}

.elite-details-premium li {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    color: var(--text-main);
}

.elite-details-premium li span:first-child {
    color: var(--text-muted);
}

.elite-price {
    color: #D4AF37 !important;
    font-weight: 600;
}

.btn-gold {
    background: transparent;
    color: #D4AF37;
    border: 1px solid #D4AF37;
}

.btn-gold:hover {
    background: #D4AF37;
    color: #000;
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
}
'''
with open(css_file, 'a', encoding='utf-8') as f:
    f.write(elite_css)

print("Elite section enhanced")
