import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { RecordsController } from './records.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { env } from '../../config/env.js';

const router = Router();

// Ensure upload directory exists
if (!fs.existsSync(env.STORAGE_DIR)) {
  fs.mkdirSync(env.STORAGE_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, env.STORAGE_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `rec-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only PDF, JPG, PNG, and WebP are supported.'));
    }
  },
});

router.use(authenticate);

router.post('/upload', upload.single('file'), RecordsController.uploadRecord);
router.get('/', RecordsController.getRecords);
router.get('/:id', RecordsController.getRecordById);
router.get('/:id/download', RecordsController.downloadRecordFile);
router.post('/:id/explain', RecordsController.explainRecord);
router.delete('/:id', RecordsController.deleteRecord);

export default router;
