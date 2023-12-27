import express from 'express';
import blogController from '../controllers/blogController.js';


const router = express.Router();

router.get('/', blogController.get);
router.get('/:id', blogController.getId);
router.post('/', blogController.create);
router.put('/:id',  blogController.update);
router.delete('/:id',  blogController.remove);

export default router;