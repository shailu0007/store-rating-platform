import { userSchemas } from '../utils/validators.js';
import { success, error, paginated } from '../utils/response.js';
import { hashPassword } from '../utils/hash.js';
import UserModel from '../models/UserModel.js';


export const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, q = '', role } = req.query;
    const result = await UserModel.list({ page: Number(page), limit: Number(limit), q, role });
    return paginated(res, result.data, result.total, result.page, result.limit);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const { name, email, address, password, role } = req.body;

    const existing = await UserModel.findByEmail(email);
    if (existing) return error(res, 'Email already exists', 409);

    const hashed = await hashPassword(password);
    const user = await UserModel.create({ name, email, password: hashed, address, role });
    return success(res, { user }, 'User created', 201);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return error(res, 'Invalid id', 400);

    const requester = req.user;
    if (!requester) return error(res, 'Unauthorized', 401);

    if (requester.role !== 'SYSTEM_ADMIN' && requester.id !== id) {
      return error(res, 'Forbidden', 403);
    }

    const user = await UserModel.findById(id);
    if (!user) return error(res, 'User not found', 404);
    return success(res, { user }, 'User details', 200);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return error(res, 'Invalid id', 400);

    const requester = req.user;
    if (!requester) return error(res, 'Unauthorized', 401);

    if (requester.role !== 'SYSTEM_ADMIN' && requester.id !== id) {
      return error(res, 'Forbidden', 403);
    }

    if (req.body.role && requester.role !== 'SYSTEM_ADMIN') {
      delete req.body.role;
    }

    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }

    const updated = await UserModel.update(id, req.body);
    return success(res, { user: updated }, 'User updated', 200);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return error(res, 'Invalid id', 400);

    const ok = await UserModel.remove(id);
    return success(res, { removed: ok }, 'User deleted', 200);
  } catch (err) {
    next(err);
  }
};

export const getRatings = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const requester = req.user;
    if (!requester) return error(res, 'Unauthorized', 401);

    if (requester.role !== 'SYSTEM_ADMIN' && requester.id !== id) {
      return error(res, 'Forbidden', 403);
    }

    const { page = 1, limit = 20 } = req.query;
    const result = await UserModel.getRatings(id, { page: Number(page), limit: Number(limit) });
    return paginated(res, result.data, result.total, result.page, result.limit);
  } catch (err) {
    next(err);
  }
};
