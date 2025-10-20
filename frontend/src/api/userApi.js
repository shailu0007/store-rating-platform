import axios from '../config/axiosInstance';

const userApi = {
list: async ({ page = 1, limit = 10, q = '', role } = {}) => {
  const params = { page, limit, q };
  if (role) params.role = role;
  const res = await axios.get('/api/users', { params });
  return res.data;
},

  create: async (payload) => {
    const res = await axios.post('/api/users', payload);
    return res.data;
  },

  get: async (id) => {
    const res = await axios.get(`/api/users/${id}`);
    return res.data;
  },

  update: async (id, payload) => {
    const res = await axios.put(`/api/users/${id}`, payload);
    return res.data;
  },

  remove: async (id) => {
    const res = await axios.delete(`/api/users/${id}`);
    return res.data;
  },

  getRatings: async (id, { page = 1, limit = 20 } = {}) => {
    const res = await axios.get(`/api/users/${id}/ratings`, { params: { page, limit } });
    return res.data;
  }
};

export default userApi;
