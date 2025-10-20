import { verifyToken } from '../config/jwtConfig.js';

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ message: 'Invalid token' });
  req.user = payload;
  next();
};
