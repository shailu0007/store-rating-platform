// controllers/storeController.js
import { storeSchemas } from '../utils/validators.js';
import { success, error, paginated } from '../utils/response.js';
import { isAdmin, isOwner } from '../utils/helpers.js';
import StoreModel from '../models/StoreModel.js';

export const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, q = '', ownerId } = req.query;
    const result = await StoreModel.list({ page: Number(page), limit: Number(limit), q, ownerId });
    return paginated(res, result.data, result.total, result.page, result.limit);
  } catch (err) {
    next(err);
  }
};


export const create = async (req, res, next) => {
  try {
    const { error: vErr } = storeSchemas.create.validate(req.body);
    if (vErr) return error(res, vErr.details[0].message, 400);

    const payload = req.body;
    const store = await storeModel.create(payload);
    return success(res, { store }, 'Store created', 201);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return error(res, 'Invalid id', 400);
    const store = await storeModel.getById(id);
    if (!store) return error(res, 'Store not found', 404);
    return success(res, { store }, 'Store details', 200);
  } catch (err) {
    next(err);
  }
};


export const update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return error(res, 'Invalid id', 400);

    const store = await storeModel.getById(id);
    if (!store) return error(res, 'Store not found', 404);

    const requester = req.user;
    if (!requester) return error(res, 'Unauthorized', 401);

    const allowedAdmin = requester.role === 'SYSTEM_ADMIN';
    const allowedOwner = requester.role === 'STORE_OWNER' && requester.id === store.ownerId;

    if (!allowedAdmin && !allowedOwner) return error(res, 'Forbidden', 403);

    const updated = await storeModel.update(id, req.body);
    return success(res, { store: updated }, 'Store updated', 200);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return error(res, 'Invalid id', 400);

    const ok = await storeModel.remove(id);
    return success(res, { removed: ok }, 'Store deleted', 200);
  } catch (err) {
    next(err);
  }
};
