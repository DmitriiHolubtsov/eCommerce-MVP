import express from 'express';
import { uploadFile, getFile } from '../controllers/fileController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/files/upload', authMiddleware, uploadFile);
router.get('/files/:filename', getFile);

export default router;
