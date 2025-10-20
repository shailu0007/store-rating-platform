import { ratingSchemas } from '../utils/validators.js';
import { success, error, paginated } from '../utils/response.js';
import RatingModel from '../models/RatingModel.js';
import StoreModel from '../models/StoreModel.js';

export const listForStore = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    if (!storeId) return error(res, 'Invalid storeId', 400);

    const { page = 1, limit = 10, q = '', userId } = req.query;
    const result = await RatingModel.listForStore(storeId, { page: Number(page), limit: Number(limit), q, userId });
    return paginated(res, result.data, result.total, result.page, result.limit);
  } catch (err) {
    next(err);
  }
};

export const createOrUpdate = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    if (!storeId) return error(res, 'Invalid storeId', 400);

    const { error: vErr } = ratingSchemas.submit.validate(req.body);
    if (vErr) return error(res, vErr.details[0].message, 400);

    const userId = req.user?.id;
    if (!userId) return error(res, 'Not authenticated', 401);

    const store = await StoreModel.getById(storeId);
    if (!store) return error(res, 'Store not found', 404);

    const { rating, comment } = req.body;
    const created = await ratingModel.upsertByUserAndStore({ userId, storeId, rating, comment });

    const aggregate = await storeModel.getAggregate(storeId);

    return success(res, { rating: created, aggregate }, 'Rating submitted', 200);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    const ratingId = parseInt(req.params.ratingId, 10);
    if (!storeId || !ratingId) return error(res, 'Invalid parameters', 400);

    const { rating, comment } = req.body;
    if (rating !== undefined) {
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) return error(res, 'Invalid rating value', 400);
    }

    const existing = await ratingModel.findById(ratingId);
    if (!existing) return error(res, 'Rating not found', 404);
    if (existing.store_id !== storeId && existing.store_id !== existing.store_id) {
      return error(res, 'Rating does not belong to the store', 400);
    }

    const requester = req.user;
    if (!requester) return error(res, 'Unauthorized', 401);
    const isOwner = requester.id === existing.user_id;
    const isAdmin = requester.role === 'SYSTEM_ADMIN';
    if (!isOwner && !isAdmin) return error(res, 'Forbidden', 403);

    const updated = await ratingModel.update(ratingId, { rating, comment });
    const aggregate = await storeModel.getAggregate(storeId);

    return success(res, { rating: updated, aggregate }, 'Rating updated', 200);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    const ratingId = parseInt(req.params.ratingId, 10);
    if (!storeId || !ratingId) return error(res, 'Invalid parameters', 400);

    const existing = await ratingModel.findById(ratingId);
    if (!existing) return error(res, 'Rating not found', 404);

    const requester = req.user;
    if (!requester) return error(res, 'Unauthorized', 401);
    const isOwner = requester.id === existing.user_id;
    const isAdmin = requester.role === 'SYSTEM_ADMIN';
    if (!isOwner && !isAdmin) return error(res, 'Forbidden', 403);

    const ok = await ratingModel.remove(ratingId);
    const aggregate = await storeModel.getAggregate(storeId);
    return success(res, { removed: ok, aggregate }, 'Rating removed', 200);
  } catch (err) {
    next(err);
  }
};
