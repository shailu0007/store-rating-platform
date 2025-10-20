import axios from '../config/axiosInstance';

const authApi = {
  login: async ({ email, password }) => {
    const res = await axios.post('/api/auth/login', { email, password });
    return res.data;
  },

  register: async ({ name, email, address, password }) => {
    const res = await axios.post('/api/auth/register', { name, email, address, password });
    return res.data;
  },

  logout: async () => {
    const res = await axios.post('/api/auth/logout');
    return res.data;
  },

  me: async () => {
    const res = await axios.get('/api/auth/me');
    return res.data;
  },

  changePassword: async ({ currentPassword, newPassword }) => {
    const res = await axios.post('/api/auth/change-password', { currentPassword, newPassword });
    return res.data;
  }
};

export default authApi;
