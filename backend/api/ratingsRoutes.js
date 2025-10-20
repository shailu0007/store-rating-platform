import express from 'express';
import * as ratingController from '../controllers/ratingsController.js'
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRole } from '../middlewares/roleMiddleware.js';;

const ratingsRoutes = express.Router({ mergeParams: true });

ratingsRoutes.get('/:storeId/ratings', ratingController.listForStore);

ratingsRoutes.post('/:storeId/ratings', authenticate, ratingController.createOrUpdate);

ratingsRoutes.put('/:storeId/ratings/:ratingId', authenticate, ratingController.update);

ratingsRoutes.delete('/:storeId/ratings/:ratingId', authenticate, authorizeRole(['SYSTEM_ADMIN']), ratingController.remove);

export default ratingsRoutes;
