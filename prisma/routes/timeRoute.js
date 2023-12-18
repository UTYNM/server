import express from 'express';
import timeController from '../controllers/timeController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', timeController.get);
router.get('/:id', timeController.getId);
router.post('/', authenticateToken, timeController.create);
router.put('/:id', authenticateToken, timeController.update);
router.delete('/:id', authenticateToken, timeController.remove);

export default router;