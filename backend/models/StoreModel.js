import pool from '../db/mysql.js';

const getById = async (id) => {
  const [rows] = await pool.query(
    `SELECT s.id, s.name, s.email, s.address, s.category, s.owner_id AS ownerId, s.created_at,
            COALESCE(avg_r.avg, 0) AS avg_rating, COALESCE(cnt.cnt, 0) AS rating_count
     FROM stores s
     LEFT JOIN (
       SELECT store_id, ROUND(AVG(rating),1) AS avg FROM ratings GROUP BY store_id
     ) AS avg_r ON avg_r.store_id = s.id
     LEFT JOIN (
       SELECT store_id, COUNT(1) AS cnt FROM ratings GROUP BY store_id
     ) AS cnt ON cnt.store_id = s.id
     WHERE s.id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] ?? null;
};

const create = async ({ name, email, address, category, owner_id = null }) => {
  const [res] = await pool.query(
    'INSERT INTO stores (name, email, address, category, owner_id) VALUES (?, ?, ?, ?, ?)',
    [name, email, address, category, owner_id]
  );
  return getById(res.insertId);
};

const update = async (id, payload = {}) => {
  const allowed = ['name', 'email', 'address', 'category', 'owner_id'];
  const set = [];
  const values = [];
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      set.push(`${key} = ?`);
      values.push(payload[key]);
    }
  }
  if (set.length === 0) return getById(id);
  values.push(id);
  const sql = `UPDATE stores SET ${set.join(', ')} WHERE id = ?`;
  await pool.query(sql, values);
  return getById(id);
};

const remove = async (id) => {
  const [res] = await pool.query('DELETE FROM stores WHERE id = ?', [id]);
  return res.affectedRows > 0;
};

const list = async ({ page = 1, limit = 10, q = '', ownerId } = {}) => {
  const offset = (page - 1) * limit;
  const where = [];
  const params = [];

  if (q) {
    where.push('(s.name LIKE ? OR s.address LIKE ? OR s.category LIKE ?)');
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  if (ownerId) {
    where.push('s.owner_id = ?');
    params.push(ownerId);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `SELECT s.id, s.name, s.email, s.address, s.category, s.owner_id AS ownerId,
            COALESCE(avg_r.avg, 0) AS avg_rating, COALESCE(cnt.cnt, 0) AS rating_count
     FROM stores s
     LEFT JOIN (
       SELECT store_id, ROUND(AVG(rating),1) AS avg FROM ratings GROUP BY store_id
     ) AS avg_r ON avg_r.store_id = s.id
     LEFT JOIN (
       SELECT store_id, COUNT(1) AS cnt FROM ratings GROUP BY store_id
     ) AS cnt ON cnt.store_id = s.id
     ${whereSql}
     ORDER BY s.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(1) AS total FROM stores s ${whereSql}`,
    params
  );

  return { data: rows, total: total ?? rows.length, page, limit };
};

const getRatings = async (storeId, { page = 1, limit = 10, q = '', userId } = {}) => {
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

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(1) AS total FROM ratings r ${whereSql}`,
    params
  );

  return { data: rows, total: total ?? rows.length, page, limit };
};

const getAggregate = async (storeId) => {
  const [[row]] = await pool.query(
    'SELECT ROUND(AVG(rating),1) AS avg_rating, COUNT(1) AS rating_count FROM ratings WHERE store_id = ?',
    [storeId]
  );
  return { avg_rating: row?.avg_rating ?? 0, rating_count: row?.rating_count ?? 0 };
};

export default {
  getById,
  create,
  update,
  remove,
  list,
  getRatings,
  getAggregate,
};
