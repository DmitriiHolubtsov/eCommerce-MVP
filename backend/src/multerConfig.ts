import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req: Express.Request, file: Express.Multer.File, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req: Express.Request, file: Express.Multer.File, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
