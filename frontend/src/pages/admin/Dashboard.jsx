import React, { useEffect, useState } from 'react';
import axios from '../../config/axiosInstance';
import Loader from '../../components/common/Loader';
import adminApi from '../../api/adminApi';

const statCard = (title, value) => (
  <div className="bg-white rounded-lg shadow-sm p-4 flex-1">
    <div className="text-sm text-gray-500">{title}</div>
    <div className="mt-2 text-2xl font-semibold text-gray-800">{value}</div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await adminApi.getStats;
        const data = res?.data ?? {};
        setStats({
          totalUsers: data.totalUsers ?? data.users ?? 0,
          totalStores: data.totalStores ?? data.stores ?? 0,
          totalRatings: data.totalRatings ?? data.ratings ?? 0
        });
      } catch (err) {
        console.error('Failed to fetch admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCard('Total users', stats.totalUsers)}
        {statCard('Total stores', stats.totalStores)}
        {statCard('Total ratings', stats.totalRatings)}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Quick actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="text-sm text-gray-600">Create a new user or admin</div>
            <div className="mt-3">
              <a href="/admin/add-user" className="text-indigo-600 hover:underline">Add user</a>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow-sm">
            <div className="text-sm text-gray-600">Manage stores</div>
            <div className="mt-3">
              <a href="/admin/manage-stores" className="text-indigo-600 hover:underline">Manage stores</a>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow-sm">
            <div className="text-sm text-gray-600">View users & details</div>
            <div className="mt-3">
              <a href="/admin/manage-users" className="text-indigo-600 hover:underline">Manage users</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
