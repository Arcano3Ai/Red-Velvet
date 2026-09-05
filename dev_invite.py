import re

html_file = 'index.html'
with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace "Publicar perfil" header button with "Acceso Privado"
content = content.replace(
    '<a href="#publicar" class="btn btn-primary btn-sm">Publicar perfil</a>',
    '<button id="btn-acceso-privado" class="btn btn-primary btn-sm">🔑 Acceso Privado</button>'
)

# 2. Add invite modal right after <body>
invite_modal = '''
    <!-- Invite Code Modal -->
    <div id="invite-modal" class="invite-modal">
        <div class="invite-modal-overlay" id="invite-overlay"></div>
        <div class="invite-modal-content glass">
            <button class="invite-close" id="invite-close">✕</button>
            <div class="invite-logo-wrap">
                <img src="assets/logo/logooficial.jpeg" alt="RED VELVET" class="invite-logo">
            </div>
            <h2 class="invite-title">Acceso Exclusivo</h2>
            <p class="invite-subtitle">Esta red opera únicamente por invitación.<br>Digita el código que te fue entregado.</p>
            <div class="invite-form">
                <input type="text" id="invite-code-input" class="invite-input" placeholder="XXXX-000" maxlength="10" autocomplete="off" spellcheck="false">
                <button id="btn-verify-code" class="btn btn-primary invite-btn">Verificar Acceso</button>
            </div>
            <p class="invite-error" id="invite-error">Código inválido. Verifica tu invitación.</p>
            <p class="invite-success" id="invite-success">Acceso concedido. Bienvenido.</p>
            <p class="invite-footer">¿No tienes código? <a href="#">Solicitar invitación</a></p>
        </div>
    </div>

'''
content = content.replace('<body>\n', '<body>\n' + invite_modal)

# 3. Add 3 new profile cards
new_profiles = '''
                    <!-- Profile 7 -->
                    <div class="profile-card">
                        <div class="profile-img">
                            <img src="https://images.unsplash.com/photo-1488716820095-cbe80883c496?auto=format&fit=crop&q=80&w=800" alt="Luciana">
                            <div class="profile-category category-elite">Elite</div>
                        </div>
                        <div class="profile-info">
                            <div class="profile-header">
                                <h3>Luciana, 25 <span class="verified-badge" title="Perfil verificado">✓</span></h3>
                            </div>
                            <p class="profile-location">Cancún</p>
                            <div class="profile-details">
                                <p><strong>Nac:</strong> Venezolana | <strong>Medidas:</strong> 90-58-92</p>
                                <p><strong>Idiomas:</strong> Español, Inglés</p>
                                <p><strong>Tarifa:</strong> $3,500 MXN / hr</p>
                            </div>
                            <a href="#" class="btn btn-outline btn-full">Ver perfil</a>
                        </div>
                    </div>
                    <!-- Profile 8 -->
                    <div class="profile-card">
                        <div class="profile-img">
                            <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800" alt="Natasha">
                            <div class="profile-category category-vip">VIP</div>
                        </div>
                        <div class="profile-info">
                            <div class="profile-header">
                                <h3>Natasha, 27 <span class="verified-badge" title="Perfil verificado">✓</span></h3>
                            </div>
                            <p class="profile-location">CDMX</p>
                            <div class="profile-details">
                                <p><strong>Nac:</strong> Rusa | <strong>Medidas:</strong> 88-60-90</p>
                                <p><strong>Idiomas:</strong> Ruso, Inglés, Español</p>
                                <p><strong>Tarifa:</strong> $5,000 MXN / hr</p>
                            </div>
                            <a href="#" class="btn btn-outline btn-full">Ver perfil</a>
                        </div>
                    </div>
                    <!-- Profile 9 -->
                    <div class="profile-card">
                        <div class="profile-img">
                            <img src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=800" alt="Adriana">
                            <div class="profile-category category-premium">Premium</div>
                        </div>
                        <div class="profile-info">
                            <div class="profile-header">
                                <h3>Adriana, 32 <span class="verified-badge" title="Perfil verificado">✓</span></h3>
                            </div>
                            <p class="profile-location">Monterrey</p>
                            <div class="profile-details">
                                <p><strong>Nac:</strong> Argentina | <strong>Medidas:</strong> 91-62-93</p>
                                <p><strong>Idiomas:</strong> Español, Italiano</p>
                                <p><strong>Tarifa:</strong> $2,500 MXN / hr</p>
                            </div>
                            <a href="#" class="btn btn-outline btn-full">Ver perfil</a>
                        </div>
                    </div>
'''

# Insert before the closing of profiles-grid
content = content.replace(
    '                </div>\n            </div>\n        </section>\n\n        <!-- RED VELVET ELITE -->',
    new_profiles + '                </div>\n            </div>\n        </section>\n\n        <!-- RED VELVET ELITE -->'
)

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("HTML updated: invite modal + 3 new profiles")
