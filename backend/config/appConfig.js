import dotenv from 'dotenv';
dotenv.config();

export const appConfig = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,

  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },

  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },

  security: {
    passwordSaltRounds: 10, 
  },
};
