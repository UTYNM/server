import express from 'express';
import activityController from '../controllers/activityController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', activityController.get);
router.get('/:id', activityController.getId);
router.post('/', authenticateToken, activityController.create);
router.put('/:id', authenticateToken, activityController.update);
router.delete('/:id', authenticateToken, activityController.remove);

export default router;