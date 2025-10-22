import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import storeApi from '../../api/storeApi';

const StoreList = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

 const fetchData = async () => {
  try {
    const res = await storeApi.list({ page: 1, limit: 50, q: '' });
    console.log("API Response:", res);

    // ✅ Handle both possible shapes
    const data = res.data?.data ?? res?.data ?? res ?? [];
    const finalData = Array.isArray(data) ? data : [];

    setRows(finalData);
  } catch (err) {
    console.error("Failed to fetch stores", err);
    setRows([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Stores</h1>
      </div>

      {loading ? (
        <Loader />
      ) : rows.length === 0 ? (
        <div className="text-gray-500 text-center py-10">No stores found.</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border-b">Store</th>
                <th className="text-left px-4 py-2 border-b">Address</th>
                <th className="text-left px-4 py-2 border-b">Category</th>
                <th className="text-left px-4 py-2 border-b">Avg Rating</th>
                <th className="text-left px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
  {rows.map((store) => (
    <tr key={store.id} className="hover:bg-gray-50">
      <td className="px-4 py-2 border-b font-medium text-gray-800">
        {store.name}
      </td>
      <td className="px-4 py-2 border-b text-sm text-gray-600 max-w-xs truncate">
        {store.address}
      </td>
      <td className="px-4 py-2 border-b text-gray-700">
        {store.category || '—'}
      </td>
      <td className="px-4 py-2 border-b text-gray-700">
        {store.avg_rating && !isNaN(store.avg_rating)
          ? Number(store.avg_rating).toFixed(1)
          : '—'}
      </td>

      <td className="px-4 py-2 border-b">
        <Link
          to={`/stores/${store.id}`}
          className="text-indigo-600 hover:underline"
        >
          View
        </Link>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default StoreList;
