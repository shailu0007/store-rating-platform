import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import axios from '../config/axiosInstance'; 
import storeApi from '../api/storeApi';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [stores, setStores] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);


  const fetchStores = useCallback(
    async ({ page: p = 1, limit = pageSize, q: search = '' } = {}) => {
      setLoading(true);
      try {
        const res = await axios.get('/api/stores', {
          params: { page: p, limit, q: search }
        });

        const payload = res?.data ?? {};
        const rows = payload.data ?? payload.rows ?? (Array.isArray(payload) ? payload : []);
        const count = payload.total ?? payload.totalCount ?? rows.length;

        setStores(rows);
        setTotal(count);
        setPage(p);
        setPageSize(limit);
        setQ(search);

        return { rows, total: count };
      } catch (err) {
        console.error('fetchStores error', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  const fetchStoreById = useCallback(async (id) => {
    if (!id) throw new Error('store id is required');
    const res = await storeApi.get(id);
    return res.data;
  }, []);

  const submitRating = useCallback(async (storeId, { rating, comment }) => {
    if (!storeId) throw new Error('storeId is required');
    const res = await storeApi.submitRating(storeId, { rating, comment });
    return res.data;
  }, []);

  const fetchRatingsForStore = useCallback(async (storeId, { page = 1, limit = 20 } = {}) => {
    if (!storeId) throw new Error('storeId is required');
    const res = await storeApi.getRatings(storeId, { page, limit });
    return res.data;
  }, []);

  const refresh = useCallback(() => fetchStores({ page, limit: pageSize, q }), [fetchStores, page, pageSize, q]);

  useEffect(() => {
    fetchStores({ page: 1, limit: pageSize, q: '' }).catch((e) => {
      console.warn('Initial store load failed', e);
    });
  }, []);

  return (
    <StoreContext.Provider
      value={{
        stores,
        total,
        page,
        pageSize,
        q,
        loading,
        setQ,
        setPage,
        setPageSize,
        fetchStores,
        fetchStoreById,
        submitRating,
        fetchRatingsForStore,
        refresh
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
