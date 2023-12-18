import exprress from 'express';
import financialController from '../controllers/financialController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = exprress.Router();

router.get('/', financialController.get);
router.get('/:id', financialController.getId);
router.post('/', authenticateToken, financialController.create);
router.put('/:id', authenticateToken, financialController.update);
router.delete('/:id', authenticateToken, financialController.remove);

export default router;