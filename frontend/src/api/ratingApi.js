import axios from '../config/axiosInstance';

const ratingApi = {
  submit: async (storeId, { rating, comment }) => {
    const res = await axios.post(`/api/stores/${storeId}/ratings`, { rating, comment });
    return res.data;
  },

  update: async (storeId, ratingId, { rating, comment }) => {
    const res = await axios.put(`/api/stores/${storeId}/ratings/${ratingId}`, { rating, comment });
    return res.data;
  },

  remove: async (storeId, ratingId) => {
    const res = await axios.delete(`/api/stores/${storeId}/ratings/${ratingId}`);
    return res.data;
  },

  getMyRating: async (storeId) => {
    const res = await axios.get(`/api/stores/${storeId}/ratings/me`);
    return res.data;
  }
};

export default ratingApi;
