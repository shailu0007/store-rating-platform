import express from 'express';
import * as storeController from '../controllers/storesController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRole } from '../middlewares/roleMiddleware.js';

const storesRoutes = express.Router();

storesRoutes.get('/', storeController.list);
storesRoutes.post('/', authenticate, authorizeRole(['SYSTEM_ADMIN','STORE_OWNER']), storeController.create);

storesRoutes.get('/:id', storeController.getById);
storesRoutes.put('/:id', authenticate, storeController.update); // controller enforces owner/admin
storesRoutes.delete('/:id', authenticate, authorizeRole(['SYSTEM_ADMIN']), storeController.remove);

export default storesRoutes;
