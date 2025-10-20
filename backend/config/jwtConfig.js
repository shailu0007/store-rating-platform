import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const jwtConfig = {
  SECRET: process.env.JWT_SECRET || 'mySuperSecretKey',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};

export function generateToken(payload) {
  return jwt.sign(payload, jwtConfig.SECRET, {
    expiresIn: jwtConfig.EXPIRES_IN,
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, jwtConfig.SECRET);
  } catch (err) {
    return null;
  }
}
