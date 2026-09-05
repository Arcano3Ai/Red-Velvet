const { query, initDatabase } = require('../db/database');

const seedData = async () => {
    await initDatabase();

    console.log('🔄 Sembrando datos iniciales en la base de datos...');

    // 1. Códigos predeterminados
    const codes = [
        { code: 'USER-777', role: 'Usuario', max_uses: 'Ilimitado', note: 'Acceso General Usuarios Invitados' },
        { code: 'ELITE-888', role: 'Cliente VIP', max_uses: 'Ilimitado', note: 'Acceso Miembros Membresía Diamante' },
        { code: 'ADMIN-999', role: 'Administrador', max_uses: 'Exclusivo', note: 'Token Maestro Dirección General' }
    ];

    for (const c of codes) {
        await query.run(`
            INSERT OR IGNORE INTO invitation_codes (code, role, max_uses, used_count, is_active, note)
            VALUES (?, ?, ?, 0, 1, ?)
        `, [c.code, c.role, c.max_uses, c.note]);
    }

    // 2. Modelos iniciales de catálogo
    const initialModels = [
        {
            id: 'MOD-01',
            alias: 'Valentina',
            age: 28,
            city: 'Monterrey - San Pedro',
            rate: '$9,000 MXN / hr',
            nationality: 'Brasileña',
            measurements: '90-60-90',
            languages: 'Español, Portugués, Inglés',
            services: 'Cenas de gala, Eventos ejecutivos, GFE',
            category: 'Premium',
            photo_main: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
            bio: 'Distinción y carisma internacional. Con presencia habitual en los eventos más exclusivos de San Pedro y CDMX.',
            is_elite: 0
        },
        {
            id: 'MOD-02',
            alias: 'Scarlett',
            age: 24,
            city: 'CDMX - Polanco',
            rate: '$15,000 MXN / hr',
            nationality: 'Mexicana',
            measurements: '92-62-92',
            languages: 'Español, Francés, Inglés',
            services: 'Viajes internacionales, Ópera, Cenas diplomáticas',
            category: 'Elite',
            photo_main: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
            bio: 'Alta costura y trato dulce de refinamiento inigualable. Bilingüe, perfecta para compromisos diplomáticos.',
            is_elite: 1
        },
        {
            id: 'MOD-03',
            alias: 'Camila',
            age: 23,
            city: 'Guadalajara - Andares',
            rate: '$9,000 MXN / hr',
            nationality: 'Colombiana',
            measurements: '88-59-90',
            languages: 'Español, Inglés',
            services: 'GFE, Escapadas de fin de semana, Cenas privadas',
            category: 'VIP',
            photo_main: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
            bio: 'Mirada cautivadora, silueta escultural y conversación sumamente enriquecedora.',
            is_elite: 0
        },
        {
            id: 'MOD-04',
            alias: 'Isabella',
            age: 26,
            city: 'CDMX - Santa Fe',
            rate: '$12,000 MXN / hr',
            nationality: 'Venezolana',
            measurements: '91-60-91',
            languages: 'Español, Italiano',
            services: 'Acompañamiento en yates, Eventos de golf, GFE',
            category: 'VIP',
            photo_main: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=800',
            bio: 'Experta en gastronomía y vinos selectos. Discreción absoluta y sofisticación.',
            is_elite: 0
        },
        {
            id: 'MOD-05',
            alias: 'Amelia',
            age: 27,
            city: 'Cancún - Zona Hotelera',
            rate: '$25,000 MXN / hr',
            nationality: 'Rusa',
            measurements: '93-61-93',
            languages: 'Ruso, Inglés, Español',
            services: 'Viajes en jet privado, Estancias de ultra-lujo, Premieres',
            category: 'Elite',
            photo_main: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800',
            bio: 'Nivel Diamante RED VELVET. Presencia en pasarelas europeas y eventos VIP de la Riviera Maya.',
            is_elite: 1
        }
    ];

    for (const m of initialModels) {
        await query.run(`
            INSERT OR REPLACE INTO models (
                id, alias, age, city, rate, nationality, measurements,
                languages, services, category, photo_main, gallery, bio, is_active, is_elite
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', ?, 1, ?)
        `, [
            m.id, m.alias, m.age, m.city, m.rate, m.nationality, m.measurements,
            m.languages, m.services, m.category, m.photo_main, m.bio, m.is_elite
        ]);
    }

    // 3. Postulaciones iniciales
    const initialApps = [
        {
            id: 'RV-849102',
            alias: 'Scarlett Rose',
            age: 24,
            city: 'CDMX - Polanco',
            rate: '$15,000 MXN / hr',
            whatsapp: '+52 55 4910 2819',
            nationality: 'Mexicana',
            measurements: '90-60-90 · 1.72m',
            photos: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
            about: 'Acompañante VIP de alta costura, bilingüe, disponible para cenas diplomáticas y viajes.',
            status: 'Pendiente'
        },
        {
            id: 'RV-719304',
            alias: 'Isabella Nicole',
            age: 26,
            city: 'Monterrey - San Pedro',
            rate: '$12,000 MXN / hr',
            whatsapp: '+52 81 7193 0482',
            nationality: 'Colombiana',
            measurements: '91-61-92 · 1.68m',
            photos: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=800',
            about: 'Modelo de pasarela, amante del arte y gastronomía gourmet. Absoluta discreción.',
            status: 'Pendiente'
        }
    ];

    for (const a of initialApps) {
        await query.run(`
            INSERT OR REPLACE INTO applications (
                id, alias, age, city, rate, whatsapp, nationality, measurements, photos, gallery, about, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', ?, ?)
        `, [
            a.id, a.alias, a.age, a.city, a.rate, a.whatsapp, a.nationality, a.measurements, a.photos, a.about, a.status
        ]);
    }

    console.log('✔ Datos iniciales sembrados con éxito.');
};

if (require.main === module) {
    seedData().then(() => process.exit(0)).catch(err => {
        console.error('Error al sembrar datos:', err);
        process.exit(1);
    });
}

module.exports = { seedData };
