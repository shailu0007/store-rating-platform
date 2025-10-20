import React, { useCallback, useMemo, useState } from 'react';
import axios from '../../config/axiosInstance';
import Table from '../../components/common/Table';
import { createColumnHelper } from '@tanstack/react-table';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../../components/common/Loader';

const colHelper = createColumnHelper();

const ManageUsers = () => {
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const columns = useMemo(() => [
    colHelper.accessor('id', { header: 'ID' }),
    colHelper.accessor('name', { header: 'Name', cell: info => <div className="font-medium">{info.getValue()}</div> }),
    colHelper.accessor('email', { header: 'Email' }),
    colHelper.accessor('address', { header: 'Address', cell: info => <div className="max-w-xs truncate">{info.getValue()}</div> }),
    colHelper.accessor('role', { header: 'Role' }),
    colHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/admin/users/${row.original.id}`)}
            className="text-indigo-600 hover:underline"
          >
            View
          </button>
        </div>
      )
    })
  ], [navigate]);

  const fetchData = useCallback(async ({ pageIndex, pageSize, globalFilter }) => {
    try {
      const res = await axios.get('/api/users', {
        params: { page: pageIndex + 1, limit: pageSize, q: globalFilter }
      });
      const payload = res?.data ?? {};
      const rows = payload.data ?? payload.rows ?? [];
      const totalCount = payload.total ?? payload.totalCount ?? rows.length;
      setTotal(totalCount);
      return { rows, totalCount };
    } catch (err) {
      console.error('Failed to fetch users', err);
      return { rows: [], totalCount: 0 };
    }
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Manage Users</h1>
        <Link to="/admin/add-user" className="text-indigo-600 hover:underline">Add user</Link>
      </div>

      <Table columns={columns} data={[]} serverSide fetchData={fetchData} totalCount={total} initialPageSize={10} />
    </div>
  );
};

export default ManageUsers;
