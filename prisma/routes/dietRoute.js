import express from 'express';
import dietController from '../controllers/dietController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', dietController.get);
router.get('/:id', dietController.getId);
router.post('/', authenticateToken, dietController.create);
router.put('/:id', authenticateToken, dietController.update);
router.delete('/:id', authenticateToken, dietController.remove);

export default router;