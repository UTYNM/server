import express from 'express';
import blogController from '../controllers/blogController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', blogController.get);
router.get('/:id', blogController.getId);
router.post('/', authenticateToken, blogController.create);
router.put('/:id', authenticateToken, blogController.update);
router.delete('/:id', authenticateToken, blogController.remove);

export default router;