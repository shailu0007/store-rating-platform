import React, { useCallback, useMemo, useState } from 'react';
import axios from '../../config/axiosInstance';
import Table from '../../components/common/Table';
import { createColumnHelper } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import userApi from '../../api/userApi';

const colHelper = createColumnHelper();

const ManageStores = () => {
  const [total, setTotal] = useState(0);
  const [loadingFirst, setLoadingFirst] = useState(false);

  const columns = useMemo(() => [
    colHelper.accessor('id', { header: 'ID', cell: info => info.getValue() }),
    colHelper.accessor('name', { header: 'Name', cell: info => <div className="font-medium">{info.getValue()}</div> }),
    colHelper.accessor('email', { header: 'Email' }),
    colHelper.accessor('address', { header: 'Address', cell: info => <div className="max-w-xs truncate">{info.getValue()}</div> }),
    colHelper.accessor('category', { header: 'Category' }),
    colHelper.accessor('avg_rating', { header: 'Rating', cell: info => info.getValue() ?? '—' }),
    colHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link to={`/admin/store/${row.original.id}`} className="text-indigo-600 hover:underline">View</Link>
        </div>
      )
    })
  ], []);

  const fetchData = useCallback(async ({ pageIndex, pageSize, globalFilter }) => {
    setLoadingFirst(true);
    try {
      const res = await userApi.list({
        page: pageIndex + 1,
        limit: pageSize,
        q: globalFilter
      });
      const payload = res?.data ?? {};
      const rows = payload.data ?? payload.rows ?? [];
      const totalCount = payload.total ?? payload.totalCount ?? rows.length;
      setTotal(totalCount);
      return { rows, totalCount };
    } finally {
      setLoadingFirst(false);
    }
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Manage Stores</h1>

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

export default ManageStores;
