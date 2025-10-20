import pool from '../db/mysql.js'; 

const findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0] ?? null;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT id, name, email, address, role, created_at, password FROM users WHERE id = ? LIMIT 1', [id]);
  return rows[0] ?? null;
};

const create = async ({ name, email, password, address, role = 'NORMAL_USER' }) => {
  const [res] = await pool.query(
    'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
    [name, email, password, address, role]
  );
  return findById(res.insertId);
};

const update = async (id, payload = {}) => {
  const allowed = ['name', 'email', 'address', 'role', 'password'];
  const set = [];
  const values = [];
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      set.push(`${key} = ?`);
      values.push(payload[key]);
    }
  }
  if (set.length === 0) return findById(id);
  values.push(id);
  const sql = `UPDATE users SET ${set.join(', ')} WHERE id = ?`;
  await pool.query(sql, values);
  return findById(id);
};

const remove = async (id) => {
  const [res] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return res.affectedRows > 0;
};

const list = async ({ page = 1, limit = 10, q = '', role } = {}) => {
  const offset = (page - 1) * limit;
  const where = [];
  const params = [];

  if (q) {
    where.push('(name LIKE ? OR email LIKE ? OR address LIKE ?)');
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  if (role) {
    where.push('role = ?');
    params.push(role);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const [rows] = await pool.query(
    `SELECT id, name, email, address, role, created_at FROM users ${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(1) AS total FROM users ${whereSql}`,
    params
  );

  return { data: rows, total: total ?? rows.length, page, limit };
};

const changePassword = async (id, hashedPassword) => {
  const [res] = await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
  return res.affectedRows > 0;
};

const getRatings = async (userId, { page = 1, limit = 20 } = {}) => {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    `SELECT r.id, r.store_id AS storeId, r.rating, r.comment, r.created_at, s.name AS storeName, s.address AS storeAddress
     FROM ratings r
     JOIN stores s ON s.id = r.store_id
     WHERE r.user_id = ?
     ORDER BY r.created_at DESC
     LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    'SELECT COUNT(1) AS total FROM ratings WHERE user_id = ?',
    [userId]
  );

  return { data: rows, total: total ?? rows.length, page, limit };
};

export default {
  findByEmail,
  findById,
  create,
  update,
  remove,
  list,
  changePassword,
  getRatings,
};
