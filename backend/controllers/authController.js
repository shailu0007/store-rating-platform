import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateToken, verifyToken } from '../config/jwtConfig.js';
import { userSchemas } from '../utils/validators.js';
import { success, error } from '../utils/response.js';
import UserModel from '../models/UserModel.js';

export const signup = async (req, res, next) => {
  try {
    const { error: vErr } = userSchemas.signup.validate(req.body);
    if (vErr) return error(res, vErr.details[0].message, 400);

    const { name, email, password, address } = req.body;
    const existing = await UserModel.findByEmail(email);
    if (existing) return error(res, 'Email already exists', 409);

    const hashed = await hashPassword(password);
    const user = await UserModel.create({ name, email, password: hashed, address, role: 'NORMAL_USER' });

    return success(res, { user }, 'User registered', 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { error: vErr } = userSchemas.login.validate(req.body);
    if (vErr) return error(res, vErr.details[0].message, 400);

    const { email, password } = req.body;
    const user = await UserModel.findByEmail(email);
    if (!user) return error(res, 'Invalid email or password', 401);

    const ok = await comparePassword(password, user.password);
    if (!ok) return error(res, 'Invalid email or password', 401);

    const token = generateToken({ id: user.id, role: user.role });
    const safeUser = { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role };

    return success(res, { user: safeUser, token }, 'Login successful', 200);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    return success(res, {}, 'Logged out', 200);
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return error(res, 'Not authenticated', 401);
    const user = await UserModel.findById(userId);
    if (!user) return error(res, 'User not found', 404);
    return success(res, { user }, 'Current user', 200);
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { error: vErr } = userSchemas.updatePassword.validate(req.body);
    if (vErr) return error(res, vErr.details[0].message, 400);

    const userId = req.user?.id;
    if (!userId) return error(res, 'Not authenticated', 401);

    const { currentPassword, newPassword } = req.body;
    const user = await UserModel.findById(userId);
    if (!user) return error(res, 'User not found', 404);

    const ok = await comparePassword(currentPassword, user.password);
    if (!ok) return error(res, 'Current password is incorrect', 400);

    const hashed = await hashPassword(newPassword);
    await UserModel.changePassword(userId, hashed);

    return success(res, {}, 'Password updated successfully', 200);
  } catch (err) {
    next(err);
  }
};
