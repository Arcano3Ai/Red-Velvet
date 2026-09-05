const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const MODELS_UPLOADS_DIR = path.join(UPLOADS_DIR, 'models');
const APPS_UPLOADS_DIR = path.join(UPLOADS_DIR, 'applications');

[UPLOADS_DIR, MODELS_UPLOADS_DIR, APPS_UPLOADS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Almacenamiento temporal en memoria para procesar con sharp
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB máximo
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen (JPEG, PNG, WEBP, AVIF).'), false);
        }
    }
});

// Endpoint: Subir una o varias fotos
router.post('/', upload.array('photos', 6), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No se recibieron archivos de imagen válidos.' });
        }

        const folderType = req.body.targetFolder === 'models' ? 'models' : 'applications';
        const targetDir = folderType === 'models' ? MODELS_UPLOADS_DIR : APPS_UPLOADS_DIR;

        const uploadedUrls = [];

        for (const file of req.files) {
            const filename = `rv-${Date.now()}-${Math.round(Math.random() * 1e6)}.webp`;
            const filepath = path.join(targetDir, filename);

            // Optimización con Sharp: Máximo 1400px en su lado más largo, formato WebP a 82% calidad
            await sharp(file.buffer)
                .rotate() // Respeta orientación EXIF del smartphone
                .resize(1400, 1400, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .webp({ quality: 82 })
                .toFile(filepath);

            uploadedUrls.push(`/uploads/${folderType}/${filename}`);
        }

        res.json({
            success: true,
            urls: uploadedUrls,
            mainUrl: uploadedUrls[0]
        });
    } catch (err) {
        console.error('Error en upload:', err);
        res.status(500).json({ error: 'Error al procesar y optimizar la imagen subida.' });
    }
});

module.exports = router;
