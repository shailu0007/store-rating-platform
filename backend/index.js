import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { appConfig } from './config/appConfig.js';
import pool from './db/mysql.js';

import  errorHandler  from './middlewares/errorMiddleware.js';
import authRoutes from './api/authRoutes.js';
import usersRoutes from './api/usersRoutes.js';
import storesRoutes from './api/storesRoutes.js';
import ratingsRoutes from './api/ratingsRoutes.js';

dotenv.config();

const app = express();

app.use(cors(appConfig.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try {
  const conn = await pool.getConnection();
  console.log('✅ MySQL connected successfully.');
  conn.release();
} catch (err) {
  console.error('❌ Database connection failed:', err.message);
}

app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'Server is running 🚀' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/stores', ratingsRoutes);

app.use(errorHandler);

app.listen(appConfig.port, () => {
  console.log(`Server running in ${appConfig.env} mode on port ${appConfig.port}`);
});
