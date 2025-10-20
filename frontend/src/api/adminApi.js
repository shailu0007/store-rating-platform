import axios from '../config/axiosInstance';

const adminApi = {
  getStats: async () => {
    const res = await axios.get('/api/admin/stats');
    return res.data;
  },

  createUser: async (payload) => {
    const res = await axios.post('/api/users', payload);
    return res.data;
  },

  createStore: async (payload) => {
    const res = await axios.post('/api/stores', payload);
    return res.data;
  },

  listUsers: async ({ page = 1, limit = 10, q = '', role } = {}) => {
    const params = { page, limit, q };
    if (role) params.role = role;
    const res = await axios.get('/api/users', { params });
    return res.data;
  },

  listStores: async ({ page = 1, limit = 10, q = '', ownerId } = {}) => {
    const params = { page, limit, q };
    if (ownerId) params.ownerId = ownerId;
    const res = await axios.get('/api/stores', { params });
    return res.data;
  },

  deleteUser: async (id) => {
    const res = await axios.delete(`/api/users/${id}`);
    return res.data;
  },

  deleteStore: async (id) => {
    const res = await axios.delete(`/api/stores/${id}`);
    return res.data;
  }
};

export default adminApi;
