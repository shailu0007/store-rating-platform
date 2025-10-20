import express from 'express';
import * as userController from '../controllers/usersController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', authenticate, authorizeRole(['SYSTEM_ADMIN']), userController.list);
router.post('/', authenticate, authorizeRole(['SYSTEM_ADMIN']), userController.create);

router.get('/:id', authenticate, userController.getById);
router.put('/:id', authenticate, userController.update);
router.delete('/:id', authenticate, authorizeRole(['SYSTEM_ADMIN']), userController.remove);

router.get('/:id/ratings', authenticate, userController.getRatings);

export default router;
