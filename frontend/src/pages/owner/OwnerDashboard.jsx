// src/pages/owner/OwnerDashboard.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../config/axiosInstance';
import Loader from '../../components/common/Loader';
import Table from '../../components/common/Table';
import { createColumnHelper } from '@tanstack/react-table';
import storeApi from '../../api/storeApi';
import { Plus } from 'lucide-react';

const colHelper = createColumnHelper();

const OwnerDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState(null);
  const [error, setError] = useState('');

  // stable empty array for Table to avoid re-render loops
  const stableEmptyData = useMemo(() => [], []);

  useEffect(() => {
    if (!currentUser) return;

    let mounted = true;
    const loadOwnerStore = async () => {
      setLoading(true);
      setError('');
      try {
        // ask backend for stores filtered by ownerId
        const res = await storeApi.list({ ownerId: currentUser.id, limit: 1 });

        const payload = res?.data ?? res ?? {};
        const rows = payload.data ?? payload.rows ?? (Array.isArray(payload) ? payload : []);
        const first = rows[0] ?? null;
        if (!first) {
          if (mounted) setError('No store found for this owner yet.');
        }
        if (mounted) setStore(first);
      } catch (err) {
        console.error('Failed to fetch owner store', err);
        if (mounted) setError(err?.response?.data?.message || 'Failed to load store');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadOwnerStore();
    return () => { mounted = false; };
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
      userName: r.user?.name ?? r.userName ?? r.user_name,
      userEmail: r.user?.email ?? r.userEmail ?? r.user_email
    }));
    return { rows: normalized, totalCount };
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Owner Dashboard</h1>

        <div className="flex gap-2">
          <button
            onClick={() => navigate('/owner/add-store')}
            className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            <Plus size={16} /> Add Store
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      {!store ? (
        <div className="text-gray-600">
          No store found for your account. You can create one using the "Add Store" button above,
          or ask an admin to assign a store to you.
        </div>
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
              data={stableEmptyData}
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
