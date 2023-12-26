import exprress from 'express';
import financialController from '../controllers/financialController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = exprress.Router();

router.get('/',authenticateToken, financialController.get);
router.get('/:id',authenticateToken, financialController.getId);
router.post('/', authenticateToken, financialController.create);
router.put('/:id', authenticateToken, financialController.update);
router.delete('/:id', authenticateToken, financialController.remove);

export default router;