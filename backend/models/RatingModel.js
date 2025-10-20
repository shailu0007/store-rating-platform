import pool from '../db/mysql.js';

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM ratings WHERE id = ? LIMIT 1', [id]);
  return rows[0] ?? null;
};

const findByUserAndStore = async (userId, storeId) => {
  const [rows] = await pool.query(
    'SELECT * FROM ratings WHERE user_id = ? AND store_id = ? LIMIT 1',
    [userId, storeId]
  );
  return rows[0] ?? null;
};

const create = async ({ userId, storeId, rating, comment = null }) => {
  const [res] = await pool.query(
    'INSERT INTO ratings (user_id, store_id, rating, comment) VALUES (?, ?, ?, ?)',
    [userId, storeId, rating, comment]
  );
  return findById(res.insertId);
};

const update = async (id, { rating, comment }) => {
  const fields = [];
  const params = [];
  if (rating !== undefined) {
    fields.push('rating = ?');
    params.push(rating);
  }
  if (comment !== undefined) {
    fields.push('comment = ?');
    params.push(comment);
  }
  if (fields.length === 0) return findById(id);
  params.push(id);
  await pool.query(`UPDATE ratings SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
};

const upsertByUserAndStore = async ({ userId, storeId, rating, comment = null }) => {
  const existing = await findByUserAndStore(userId, storeId);
  if (existing) {
    await pool.query('UPDATE ratings SET rating = ?, comment = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [rating, comment, existing.id]);
    return findById(existing.id);
  }
  return create({ userId, storeId, rating, comment });
};

const remove = async (id) => {
  const [res] = await pool.query('DELETE FROM ratings WHERE id = ?', [id]);
  return res.affectedRows > 0;
};

const listForStore = async (storeId, { page = 1, limit = 10, q = '', userId } = {}) => {
  const offset = (page - 1) * limit;
  const where = ['r.store_id = ?'];
  const params = [storeId];

  if (userId) {
    where.push('r.user_id = ?');
    params.push(userId);
  }
  if (q) {
    where.push('(u.name LIKE ? OR r.comment LIKE ?)');
    params.push(`%${q}%`, `%${q}%`);
  }
  const whereSql = `WHERE ${where.join(' AND ')}`;

  const [rows] = await pool.query(
    `SELECT r.id, r.user_id AS userId, r.rating, r.comment, r.created_at, u.name AS userName, u.email AS userEmail
     FROM ratings r
     JOIN users u ON u.id = r.user_id
     ${whereSql}
     ORDER BY r.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [[{ total }]] = await pool.query(`SELECT COUNT(1) AS total FROM ratings r ${whereSql}`, params);

  return { data: rows, total: total ?? rows.length, page, limit };
};

export default {
  findById,
  findByUserAndStore,
  create,
  update,
  upsertByUserAndStore,
  remove,
  listForStore,
};
