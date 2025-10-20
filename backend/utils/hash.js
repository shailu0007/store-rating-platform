import bcrypt from 'bcrypt';
import { appConfig } from '../config/appConfig.js';

export async function hashPassword(password) {
  const saltRounds = appConfig.security.passwordSaltRounds || 10;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}
