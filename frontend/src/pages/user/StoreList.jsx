import React, { useCallback, useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import Table from '../../components/common/Table';
import axios from '../../config/axiosInstance';
import Loader from '../../components/common/Loader';
import storeApi from '../../api/storeApi';

const colHelper = createColumnHelper();

const StoreList = () => {
  const [total, setTotal] = useState(0);
  const [loadingFirst, setLoadingFirst] = useState(false);

  const columns = useMemo(() => [
    colHelper.accessor('name', {
      header: 'Store',
      cell: info => <div className="font-medium text-gray-800">{info.getValue()}</div>
    }),
    colHelper.accessor('address', {
      header: 'Address',
      cell: info => <div className="max-w-xs text-sm text-gray-600 truncate">{info.getValue()}</div>
    }),
    colHelper.accessor('category', { header: 'Category' }),
    colHelper.accessor('avg_rating', {
      header: 'Avg',
      cell: info => {
        const v = info.getValue();
        return v ? v.toFixed ? v.toFixed(1) : v : '—';
      }
    }),
    colHelper.display({
      id: 'userRating',
      header: 'Your Rating',
      cell: ({ row }) => {
        const r = row.original.userRating ?? row.original.user_rating ?? null;
        return r ? <div className="text-yellow-500 font-semibold">{r}</div> : <div className="text-sm text-gray-500">—</div>;
      }
    }),
    colHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link to={`/stores/${row.original.id}`} className="text-indigo-600 hover:underline">View</Link>
        </div>
      )
    })
  ], []);

  const fetchData = useCallback(async ({ pageIndex, pageSize, globalFilter }) => {
    setLoadingFirst(true);
    try {
      const res = await storeApi.list({ page: pageIndex + 1, limit: pageSize, q: globalFilter });
      const payload = res?.data ?? {};
      const rows = payload.data ?? payload.rows ?? (Array.isArray(payload) ? payload : []);
      const totalCount = payload.total ?? payload.totalCount ?? rows.length;
      const normalized = rows.map(r => ({
        ...r,
        avg_rating: r.avg_rating ?? r.averageRating ?? r.avgRating ?? r.rating
      }));
      setTotal(totalCount);
      return { rows: normalized, totalCount };
    } catch (err) {
      console.error('Failed to fetch stores', err);
      return { rows: [], totalCount: 0 };
    } finally {
      setLoadingFirst(false);
    }
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Stores</h1>
      </div>

      {loadingFirst ? <Loader /> : (
        <Table
          columns={columns}
          data={[]}
          serverSide
          fetchData={fetchData}
          totalCount={total}
          initialPageSize={10}
        />
      )}
    </div>
  );
};

export default StoreList;
