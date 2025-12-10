import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
const imagesDir = path.resolve(process.cwd(), 'uploads', 'images');

// Ensure destination exists at startup
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

const generateCuid = () => 'c' + crypto.randomBytes(16).toString('hex');

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, imagesDir);
    },
    filename: (_req, file, cb) => {
        const ext =
            path.extname(file.originalname) ||
            (file.mimetype.includes('/') ? `.${file.mimetype.split('/')[1]}` : '');
        cb(null, `${generateCuid()}${ext}`);
    }
});

export const uploadImages = multer({ storage });
