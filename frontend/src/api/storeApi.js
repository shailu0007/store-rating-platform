import axios from '../config/axiosInstance';

const storeApi = {
  list: async ({ page = 1, limit = 10, q = '', ownerId } = {}) => {
    const params = { page, limit, q };
    if (ownerId) params.ownerId = ownerId;
    const res = await axios.get('/api/stores', { params });
    return res.data;
  },

  create: async (payload) => {
    const res = await axios.post('/api/stores', payload);
    return res.data;
  },

  get: async (id) => {
    const res = await axios.get(`/api/stores/${id}`);
    return res.data;
  },

  update: async (id, payload) => {
    const res = await axios.put(`/api/stores/${id}`, payload);
    return res.data;
  },

  remove: async (id) => {
    const res = await axios.delete(`/api/stores/${id}`);
    return res.data;
  },

getRatings: async (storeId, { page = 1, limit = 10, q = '', userId } = {}) => {
  const params = { page, limit, q };
  if (userId) params.userId = userId; // ✅ add userId filter if provided
  const res = await axios.get(`/api/stores/${storeId}/ratings`, { params });
  return res.data;
},

};

export default storeApi;
