import express from 'express';
import { getBranches } from '../controllers/novaPoshtaController';

const router = express.Router();

router.get('/nova-poshta/branches', getBranches);

export default router;
