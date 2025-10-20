import mysql from 'mysql2/promise';
import config from '../config/dbConfig.js';


const pool = mysql.createPool({
  host: config.db.DB_HOST,
  port: config.db.DB_PORT,
  user: config.db.DB_USER,
  password: config.db.DB_PASSWORD,
  database: config.db.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
