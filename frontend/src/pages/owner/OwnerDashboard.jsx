// rating-app-frontend/src/pages/owner/OwnerDashboard.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../config/axiosInstance';
import Loader from '../../components/common/Loader';
import Table from '../../components/common/Table';
import { createColumnHelper } from '@tanstack/react-table';
import storeApi from '../../api/storeApi';

/**
 * OwnerDashboard
 * - Finds the store(s) owned by the logged-in user
 * - Shows basic store info (name, address, avg rating)
 * - Shows a table of users who submitted ratings for that store (server-side)
 *
 * API expectations:
 * GET /api/stores?ownerId=<ownerId> -> returns array of stores (or paginated shape)
 * GET /api/stores/:id/ratings?page=1&limit=10&q= -> returns { data: [], total }
 */

const colHelper = createColumnHelper();

const OwnerDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState(null);
  const [error, setError] = useState('');

useEffect(() => {
  if (!currentUser) return; // wait until user is actually loaded

  const loadOwnerStore = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await storeApi.list({ ownerId: currentUser.id, limit: 1 });

      const payload = res?.data ?? {};
      const rows = payload.data ?? payload.rows ?? (Array.isArray(payload) ? payload : []);
      const first = rows[0] ?? null;
      if (!first) setError('No store found for this owner yet.');
      setStore(first);
    } catch (err) {
      console.error('Failed to fetch owner store', err);
      setError(err?.response?.data?.message || 'Failed to load store');
    } finally {
      setLoading(false);
    }
  };

  loadOwnerStore();
}, [currentUser?.id]);


  const columns = useMemo(() => [
    colHelper.accessor('userName', { header: 'User', cell: info => info.getValue() || (info.row.original.user?.name ?? 'User') }),
    colHelper.accessor('userEmail', { header: 'Email', cell: info => info.getValue() || (info.row.original.user?.email ?? '') }),
    colHelper.accessor('rating', { header: 'Rating' }),
    colHelper.accessor('comment', { header: 'Comment', cell: info => <div className="max-w-md truncate">{info.getValue()}</div> }),
    colHelper.accessor('created_at', { header: 'Submitted', cell: info => info.getValue() ? new Date(info.getValue()).toLocaleString() : '' }),
  ], []);

  const fetchRatings = async ({ pageIndex, pageSize, globalFilter }) => {
    if (!store?.id) return { rows: [], totalCount: 0 };
    const res = await axios.get(`/api/stores/${store.id}/ratings`, {
      params: { page: pageIndex + 1, limit: pageSize, q: globalFilter }
    });
    const payload = res?.data ?? {};
    const rows = payload.data ?? payload.rows ?? payload;
    const totalCount = payload.total ?? payload.totalCount ?? rows.length;
    const normalized = rows.map(r => ({
      ...r,
      userName: r.user?.name ?? r.userName ?? r.user_name ?? r.userName,
      userEmail: r.user?.email ?? r.userEmail ?? r.user_email ?? r.userEmail
    }));
    return { rows: normalized, totalCount };
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Owner Dashboard</h1>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      {!store ? (
        <div className="text-gray-600">No store found for your account. Please ask an admin to assign a store to you or create one via admin panel.</div>
      ) : (
        <>
          <div className="bg-white rounded-md shadow-sm p-4 mb-6">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-sm text-gray-500">Store</div>
                <div className="text-lg font-medium text-gray-800">{store.name}</div>
                <div className="text-sm text-gray-600 mt-1">{store.address}</div>
                <div className="mt-2 inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded">{store.category}</div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500">Average rating</div>
                <div className="text-2xl font-semibold text-gray-800">{store.avg_rating ?? store.averageRating ?? '—'}</div>
                <div className="text-sm text-gray-500 mt-1">{store.ratingCount ? `${store.ratingCount} ratings` : ''}</div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Ratings for your store</h2>
            <Table
              columns={columns}
              data={[]}
              serverSide
              fetchData={fetchRatings}
              totalCount={0}
              initialPageSize={10}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default OwnerDashboard;
