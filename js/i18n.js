/**
 * RED VELVET — Motor de Internacionalización (i18n)
 * Idiomas soportados: Español (ES), English (EN), 한국어 (KO)
 * Estándar de traducción de ultra-lujo y cortesía ejecutiva
 */

const I18N_TRANSLATIONS = {
    es: {
        // Nav & Header
        'nav.home': 'Inicio',
        'nav.explore': 'Explorar',
        'nav.experiences': 'Experiencias',
        'nav.howItWorks': 'Cómo funciona',
        'nav.join': '👠 Únete',
        'nav.faq': 'Preguntas',
        'header.privateAccess': '🔑 Acceso Privado',
        'header.myAccount': '👤 Mi Cuenta',
        'header.myProfile': '💎 Mi Perfil',
        'header.adminSuite': '⚙️ Suite Admin',

        // Hero
        'hero.ageBadge': '18+ | Plataforma exclusiva para adultos',
        'hero.title': 'Descubre una experiencia<br>fuera de lo común.',
        'hero.subtitle': 'Conecta con acompañantes verificadas en un espacio privado, elegante y diseñado para adultos.',
        'hero.btnExplore': 'Explorar perfiles',
        'hero.btnLearn': 'Conocer RED VELVET',

        // Experiences
        'exp.title': 'Una nueva forma de conectar.',
        'exp.privacy.title': 'Privacidad',
        'exp.privacy.desc': 'Diseñamos cada detalle pensando en una experiencia discreta y segura.',
        'exp.exclusivity.title': 'Exclusividad',
        'exp.exclusivity.desc': 'Descubre perfiles cuidadosamente presentados en un entorno premium.',
        'exp.freedom.title': 'Libertad',
        'exp.freedom.desc': 'Tú decides cuándo, dónde y con quién conectar.',

        // Search
        'search.title': 'Encuentra tu experiencia ideal.',
        'search.city': 'Ciudad',
        'search.city.all': 'Todas las ciudades',
        'search.availability': 'Disponibilidad',
        'search.availability.all': 'Cualquier momento',
        'search.category': 'Categoría',
        'search.category.all': 'Todas',
        'search.age': 'Rango de edad',
        'search.age.all': 'Todos',
        'search.btn': 'Buscar',

        // Profiles
        'profiles.title': 'Perfiles Destacados',
        'profiles.tariff': 'Tarifa',
        'profiles.origin': 'Nac',
        'profiles.measurements': 'Medidas',
        'profiles.languages': 'Idiomas',
        'profiles.services': 'Servicios',
        'profiles.viewProfile': 'Ver perfil',

        // Elite Section
        'elite.badge': 'Membresía Exclusiva',
        'elite.title': 'RED VELVET ELITE',
        'elite.desc': 'Una dimensión reservada a experiencias de máxima distinción y viajes internacionales.',

        // How it works
        'how.title': 'Cómo funciona',
        'how.step1.title': 'Explora',
        'how.step1.desc': 'Descubre perfiles con verificación e información completa.',
        'how.step2.title': 'Conecta',
        'how.step2.desc': 'Comunícate por canales privados y seguros.',
        'how.step3.title': 'Disfruta',
        'how.step3.desc': 'Vive una experiencia diseñada a tu medida.',

        // Join models section
        'join.badge': 'Exclusivo para Acompañantes Independientes',
        'join.title': '¿Deseas Crear tu Perfil en RED VELVET?',
        'join.desc': 'Forma parte del catálogo más exclusivo y privado de México. Brindamos una plataforma de prestigio internacional, máxima protección de tu privacidad, clientes de alto poder adquisitivo rigurosamente filtrados y honorarios exclusivos desde $9,000 MXN por hora.',
        'join.perk1.title': 'Privacidad Total',
        'join.perk1.desc': 'Tus datos privados jamás son compartidos. Tú decides qué fotos mostrar y puedes resguardar tu identidad con antifaces o retoque.',
        'join.perk2.title': 'Tarifas $9,000+ MXN',
        'join.perk2.desc': 'Acceso directo a clientes que valoran la exclusividad, elegancia y trato de primer nivel sin regateos.',
        'join.perk3.title': 'Club con Acceso Exclusivo',
        'join.perk3.desc': 'Solo ingresan clientes con membresía activa o invitación previa validada por nuestra dirección.',
        'join.btnCta': '👠 Crear Mi Perfil / Postularme Ahora',
        'join.note': 'Verificación confidencial vía canal encriptado en menos de 2 horas.',

        // FAQ
        'faq.badge': 'CENTRO DE INFORMACIÓN & DUDAS',
        'faq.title': 'Preguntas Frecuentes',
        'faq.subtitle': 'Todo lo que necesitas conocer sobre membresías exclusivas, protocolos de máxima privacidad, tarifas estándar y postulación de acompañantes independientes.',
        'faq.cat1': 'Experiencia & Acceso Exclusivo',
        'faq.q1': '¿Qué es RED VELVET y cómo opera?',
        'faq.a1': 'RED VELVET es el club privado y directorio de ultra-lujo más distinguido de México. Operamos bajo un modelo exclusivo de difusión publicitaria y contacto directo entre acompañantes independientes de alto nivel y caballeros selectos, en un ambiente estrictamente seguro, privado y refinado.',
        'faq.q2': '¿Quién puede acceder a la plataforma?',
        'faq.a2': 'Nuestra plataforma está reservada única y estrictamente para personas mayores de 18 años. Para acceder al área privada y consultar datos de contacto directo de acompañantes Elite, se requiere contar con un código de invitación verificado o membresía activa del club.',
        'faq.q3': '¿Cómo se garantiza mi privacidad y anonimato?',
        'faq.a3': 'La discreción es nuestro pilar innegociable. No utilizamos rastreadores invasivos, no comercializamos datos con terceros y toda la comunicación se gestiona por canales encriptados punto a punto. Tu identidad permanece siempre protegida.',
        'faq.cat2': 'Perfiles, Tarifas & Postulación',
        'faq.q4': '¿Los perfiles son 100% reales y verificados?',
        'faq.a4': 'Sí, absolutamente. Cada perfil publicado cuenta con insignia dorada de verificación tras superar una estricta validación de identidad y autenticidad fotográfica, eliminando por completo perfiles falsos o intermediarios no autorizados.',
        'faq.q5': '¿Cuáles son las tarifas y políticas de exclusividad?',
        'faq.a5': 'Para garantizar el estándar de alta gama y el prestigio de nuestra comunidad, las tarifas sugeridas de los perfiles comienzan a partir de $9,000 MXN por hora, asegurando un trato recíproco de máximo respeto, puntualidad y excelencia.',
        'faq.q6': '¿Deseas postularte y crear tu perfil de modelo?',
        'faq.a6': 'Si eres mujer mayor de 18 años, independiente y cuentas con la distinción, elegancia y clase que caracteriza a RED VELVET, puedes enviar tu solicitud ahora mismo de forma confidencial:',
        'faq.btnOpenModel': '👠 Abrir Formulario de Creación de Perfil',

        // Footer
        'footer.notice': 'RED VELVET — Solo para adultos +18',
        'footer.createProfile': '👠 Crear Mi Perfil',
        'footer.terms': 'Términos y Condiciones',
        'footer.privacy': 'Política de Privacidad',
        'footer.security': 'Protocolo de Seguridad',
        'footer.contact': 'Contacto VIP',
        'footer.faq': 'Preguntas Frecuentes',
        'footer.suite': '⚙️ Suite Dirección'
    },

    en: {
        // Nav & Header
        'nav.home': 'Home',
        'nav.explore': 'Explore',
        'nav.experiences': 'Experiences',
        'nav.howItWorks': 'How It Works',
        'nav.join': '👠 Join Us',
        'nav.faq': 'FAQ',
        'header.privateAccess': '🔑 Private Access',
        'header.myAccount': '👤 My Account',
        'header.myProfile': '💎 My Profile',
        'header.adminSuite': '⚙️ Admin Suite',

        // Hero
        'hero.ageBadge': '18+ | Exclusive Adults-Only Platform',
        'hero.title': 'Discover an Extraordinary<br>Experience.',
        'hero.subtitle': 'Connect with verified high-class companions in an ultra-private, discreet, and refined sanctuary.',
        'hero.btnExplore': 'Explore Profiles',
        'hero.btnLearn': 'About RED VELVET',

        // Experiences
        'exp.title': 'A New Paradigm of Connection.',
        'exp.privacy.title': 'Absolute Privacy',
        'exp.privacy.desc': 'Every detail is meticulously engineered for flawless discretion and confidential security.',
        'exp.exclusivity.title': 'Exclusivity',
        'exp.exclusivity.desc': 'Curated high-profile companions presented in an unmatched luxury environment.',
        'exp.freedom.title': 'Total Freedom',
        'exp.freedom.desc': 'You decide when, where, and with whom to share your memorable time.',

        // Search
        'search.title': 'Find Your Ideal Experience.',
        'search.city': 'City',
        'search.city.all': 'All Cities',
        'search.availability': 'Availability',
        'search.availability.all': 'Any Time',
        'search.category': 'Category',
        'search.category.all': 'All Tiers',
        'search.age': 'Age Range',
        'search.age.all': 'All',
        'search.btn': 'Filter Profiles',

        // Profiles
        'profiles.title': 'Featured Companions',
        'profiles.tariff': 'Honorarium',
        'profiles.origin': 'Origin',
        'profiles.measurements': 'Stats',
        'profiles.languages': 'Languages',
        'profiles.services': 'Specialties',
        'profiles.viewProfile': 'View Profile',

        // Elite Section
        'elite.badge': 'Exclusive Membership',
        'elite.title': 'RED VELVET ELITE',
        'elite.desc': 'A dimension reserved exclusively for distinguished experiences, VIP galas, and world travel.',

        // How it works
        'how.title': 'How It Works',
        'how.step1.title': 'Explore',
        'how.step1.desc': 'Browse verified profiles with complete authenticity and elegance.',
        'how.step2.title': 'Connect',
        'how.step2.desc': 'Communicate through encrypted and confidential channels directly.',
        'how.step3.title': 'Indulge',
        'how.step3.desc': 'Enjoy an unhurried, bespoke encounter tailored to your desires.',

        // Join models section
        'join.badge': 'Exclusive for Independent Companions',
        'join.title': 'Would You Like to Create Your RED VELVET Profile?',
        'join.desc': 'Join Mexico’s premier high-end private directory. We provide an internationally prestigious platform, absolute identity confidentiality, rigorously vetted elite clientele, and exclusive starting rates from $9,000 MXN per hour.',
        'join.perk1.title': 'Total Discretion',
        'join.perk1.desc': 'Your private identity is never compromised. You choose what photos to showcase and can protect your anonymity.',
        'join.perk2.title': 'Rates from $9,000+ MXN',
        'join.perk2.desc': 'Direct connection with gentlemen who appreciate true luxury, refinement, and generous honorariums.',
        'join.perk3.title': 'Invitation-Only Club',
        'join.perk3.desc': 'Only gentlemen holding active verified memberships or verified invitation codes may enter.',
        'join.btnCta': '👠 Create My Profile / Apply Now',
        'join.note': 'Confidential review via encrypted channels in under 2 hours.',

        // FAQ
        'faq.badge': 'CONCIERGE & KNOWLEDGE BASE',
        'faq.title': 'Frequently Asked Questions',
        'faq.subtitle': 'Everything you need to know about exclusive memberships, privacy protocols, pricing standards, and companion applications.',
        'faq.cat1': 'Experience & Private Access',
        'faq.q1': 'What is RED VELVET and how does it operate?',
        'faq.a1': 'RED VELVET is Mexico’s most distinguished private club and luxury companion directory. We operate as an exclusive PR platform facilitating direct communication between self-governing high-class companions and discerning gentlemen.',
        'faq.q2': 'Who can access the platform?',
        'faq.a2': 'Access is strictly restricted to adults aged 18 and older. To view contact information and private portfolios of Elite models, an approved invitation code or active club membership is required.',
        'faq.q3': 'How is my privacy and anonymity safeguarded?',
        'faq.a3': 'Discretion is our uncompromised pillar. We utilize zero invasive trackers, never sell data, and process communication through end-to-end encrypted networks.',
        'faq.cat2': 'Profiles, Rates & Applications',
        'faq.q4': 'Are all profiles authentic and verified?',
        'faq.a4': 'Yes, without exception. Every published model holds a verified gold badge following biometric and photo authenticity vetting, completely eliminating fake profiles.',
        'faq.q5': 'What are the rates and exclusivity standards?',
        'faq.a5': 'To maintain ultra-luxury quality, companion rates start strictly at $9,000 MXN per hour, ensuring mutual respect, punctuality, and first-class treatment.',
        'faq.q6': 'Do you wish to apply as a companion model?',
        'faq.a6': 'If you are an independent woman aged 18+ with beauty, grace, and sophisticated elegance, you may submit your private application right now:',
        'faq.btnOpenModel': '👠 Open Model Application Form',

        // Footer
        'footer.notice': 'RED VELVET — Strictly for Adults 18+',
        'footer.createProfile': '👠 Create My Profile',
        'footer.terms': 'Terms & Conditions',
        'footer.privacy': 'Privacy Policy',
        'footer.security': 'Security Protocol',
        'footer.contact': 'VIP Concierge',
        'footer.faq': 'FAQ',
        'footer.suite': '⚙️ Executive Suite'
    },

    ko: {
        // Nav & Header
        'nav.home': '홈',
        'nav.explore': '프로필 탐색',
        'nav.experiences': '특별한 경험',
        'nav.howItWorks': '이용 안내',
        'nav.join': '👠 모델 지원',
        'nav.faq': '자주 묻는 질문',
        'header.privateAccess': '🔑 프라이빗 입장',
        'header.myAccount': '👤 내 계정',
        'header.myProfile': '💎 내 프로필',
        'header.adminSuite': '⚙️ 관리자 스위트',

        // Hero
        'hero.ageBadge': '18+ | 성인 전용 프라이빗 럭셔리 플랫폼',
        'hero.title': '일상에서 벗어난<br>최고의 경험을 만나보세요.',
        'hero.subtitle': '철저한 신원 인증을 거친 최고급 동반자와 안전하고 품격 있는 프라이빗 공간에서 만나보세요.',
        'hero.btnExplore': '프로필 둘러보기',
        'hero.btnLearn': '레드벨벳 소개',

        // Experiences
        'exp.title': '품격 있는 만남의 새로운 기준.',
        'exp.privacy.title': '완벽한 프라이버시',
        'exp.privacy.desc': '모든 디테일은 철저한 비밀 보장과 보안을 위해 정교하게 설계되었습니다.',
        'exp.exclusivity.title': '최상의 품격',
        'exp.exclusivity.desc': '엄선된 엘리트 프로필을 최고급 럭셔리 환경에서 경험하세요.',
        'exp.freedom.title': '완벽한 자유',
        'exp.freedom.desc': '원하는 시간, 장소, 사람과 함께 특별한 시간을 디자인하세요.',

        // Search
        'search.title': '당신에게 어울리는 경험을 찾아보세요.',
        'search.city': '도시',
        'search.city.all': '전체 도시',
        'search.availability': '이용 가능 시간',
        'search.availability.all': '언제든지',
        'search.category': '등급',
        'search.category.all': '전체 등급',
        'search.age': '연령대',
        'search.age.all': '전체',
        'search.btn': '검색하기',

        // Profiles
        'profiles.title': '추천 엄선 프로필',
        'profiles.tariff': '이용료',
        'profiles.origin': '국적',
        'profiles.measurements': '신체 사이즈',
        'profiles.languages': '구사 언어',
        'profiles.services': '전문 분야',
        'profiles.viewProfile': '프로필 상세 보기',

        // Elite Section
        'elite.badge': '초VIP 전용 멤버십',
        'elite.title': 'RED VELVET ELITE',
        'elite.desc': '최고의 품격과 글로벌 비즈니스 갈라, 럭셔리 여행을 위한 최상위 서비스.',

        // How it works
        'how.title': '이용 방법',
        'how.step1.title': '탐색',
        'how.step1.desc': '철저히 검증된 모델 프로필과 상세 정보를 확인하세요.',
        'how.step2.title': '연결',
        'how.step2.desc': '암호화된 안전한 전용 채널을 통해 바로 소통하세요.',
        'how.step3.title': '경험',
        'how.step3.desc': '당신만을 위해 맞춤 설계된 최상의 시간을 누려보세요.',

        // Join models section
        'join.badge': '독립 프리랜서 모델 전용',
        'join.title': 'RED VELVET의 모델로 등록하시겠습니까?',
        'join.desc': '멕시코 최고의 하이엔드 프라이빗 클럽의 일원이 되어보세요. 철저한 신원 보호, 엄격하게 검증된 최상위 고객층, 시간당 최소 9,000 MXN부터 시작하는 최고급 대우를 보장합니다.',
        'join.perk1.title': '완벽한 신원 보호',
        'join.perk1.desc': '개인정보는 절대 외부에 유출되지 않으며, 마스크 착용 또는 이미지 블러 처리로 익명성을 완벽히 보호할 수 있습니다.',
        'join.perk2.title': '시간당 9,000+ MXN 보장',
        'join.perk2.desc': '품격과 매너를 갖추고 아낌없이 대우하는 VIP 고객들과 직접 연결됩니다.',
        'join.perk3.title': '초대권 전용 클럽',
        'join.perk3.desc': '본부의 승인을 받은 유효한 초대 코드 또는 멤버십을 보유한 고객만 입장할 수 있습니다.',
        'join.btnCta': '👠 프로필 등록 / 지금 지원하기',
        'join.note': '비밀 보장 암호화 채널을 통해 2시간 이내 비공개 심사.',

        // FAQ
        'faq.badge': '안내 및 문의 센터',
        'faq.title': '자주 묻는 질문',
        'faq.subtitle': '프라이빗 멤버십, 개인정보 보호 규격, 표준 이용 요금 및 모델 지원에 관한 모든 정보입니다.',
        'faq.cat1': '멤버십 및 프라이빗 입장',
        'faq.q1': 'RED VELVET은 어떤 플랫폼인가요?',
        'faq.a1': 'RED VELVET은 멕시코 최고의 프라이빗 럭셔리 클럽이자 전용 디렉토리입니다. 독립 하이클래스 동반자와 엄선된 신사 고객 간의 안전하고 격조 높은 직접 소통을 중개합니다.',
        'faq.q2': '누가 플랫폼을 이용할 수 있나요?',
        'faq.a2': '만 18세 이상의 성인만 엄격히 이용 가능합니다. 비공개 연락처와 엘리트 프로필을 열람하려면 유효한 초대 코드 또는 클럽 멤버십이 필요합니다.',
        'faq.q3': '개인정보와 익명성은 어떻게 보호되나요?',
        'faq.a3': '철저한 비밀 유지는 저희의 타협할 수 없는 가치입니다. 추적기를 사용하지 않으며 제3자 데이터 제공 없이 모든 데이터는 종단간 암호화됩니다.',
        'faq.cat2': '프로필, 요금 및 모델 지원',
        'faq.q4': '프로필은 100% 실제 인물인가요?',
        'faq.a4': '네, 확실합니다. 모든 게시 프로필은 신분증 대조 및 실물 사진 검증을 거쳐 공식 골드 배지를 부여받으며 사칭이나 허위 프로필은 즉각 차단됩니다.',
        'faq.q5': '이용 요금 및 규정은 어떻게 되나요?',
        'faq.a5': '최상의 품격과 신뢰를 유지하기 위해 시간당 최소 요금은 9,000 MXN부터 시작하며, 상호 존중과 신사다운 매너를 엄격히 요구합니다.',
        'faq.q6': '모델로 지원하려면 어떻게 해야 하나요?',
        'faq.a6': '만 18세 이상 여성으로 세련미와 교양을 겸비하셨다면 지금 바로 비공개 신청서를 제출하실 수 있습니다:',
        'faq.btnOpenModel': '👠 모델 등록 신청서 열기',

        // Footer
        'footer.notice': 'RED VELVET — 성인 18세 이상 전용',
        'footer.createProfile': '👠 프로필 등록',
        'footer.terms': '이용약관',
        'footer.privacy': '개인정보 처리방침',
        'footer.security': '보안 프로토콜',
        'footer.contact': 'VIP 컨시어지',
        'footer.faq': '자주 묻는 질문',
        'footer.suite': '⚙️ 본부 관리자'
    }
};

class I18nManager {
    constructor() {
        this.currentLang = localStorage.getItem('redVelvetLang') || 'es';
    }

    init() {
        this.applyLanguage(this.currentLang);
        this.bindEvents();
    }

    setLanguage(lang) {
        if (!I18N_TRANSLATIONS[lang]) return;
        this.currentLang = lang;
        localStorage.setItem('redVelvetLang', lang);
        this.applyLanguage(lang);
    }

    applyLanguage(lang) {
        document.documentElement.lang = lang;
        const translations = I18N_TRANSLATIONS[lang];
        if (!translations) return;

        // Translate all elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[key];
                } else {
                    el.innerHTML = translations[key];
                }
            }
        });

        // Update language selector UI
        const flagEl = document.getElementById('current-lang-flag');
        const codeEl = document.getElementById('current-lang-code');
        const flags = { es: '🇲🇽', en: '🇺🇸', ko: '🇰🇷' };

        if (flagEl) flagEl.textContent = flags[lang] || '🇲🇽';
        if (codeEl) codeEl.textContent = lang.toUpperCase();

        document.querySelectorAll('.lang-option-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
    }

    bindEvents() {
        const langMenuBtn = document.getElementById('lang-menu-btn');
        const langDropdown = document.getElementById('lang-dropdown-menu');

        if (langMenuBtn && langDropdown) {
            langMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                langDropdown.classList.toggle('open');
            });

            document.addEventListener('click', (e) => {
                if (!langDropdown.contains(e.target) && e.target !== langMenuBtn) {
                    langDropdown.classList.remove('open');
                }
            });
        }

        document.querySelectorAll('.lang-option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang');
                if (lang) {
                    this.setLanguage(lang);
                    if (langDropdown) langDropdown.classList.remove('open');
                }
            });
        });
    }
}

// Export singleton instance
window.redVelvetI18n = new I18nManager();
