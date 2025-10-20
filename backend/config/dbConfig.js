import dotenv from 'dotenv';
dotenv.config();

export default {
  db: {
    DB_HOST: process.env.DB_HOST || '127.0.0.1',
    DB_PORT: process.env.DB_PORT || '3306',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'store_ratings'
  },
  jwt: {
    SECRET: process.env.JWT_SECRET || 'dev-secret',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d'
  },
  server: {
    PORT: process.env.PORT || 5000
  }
};