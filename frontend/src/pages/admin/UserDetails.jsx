import React, { useEffect, useState } from 'react';
import axios from '../../config/axiosInstance';
import { useParams, Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import userApi from '../../api/userApi';

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const userRes = await userApi.get(id);
        setUser(userRes?.data ?? userRes);

        const ratingsRes = await userApi.getRatings(id, { page: 1, limit: 50 });
        const payload = ratingsRes?.data ?? {};
        setRatings(payload.data ?? payload.rows ?? payload);
      } catch (err) {
        console.error('Failed to load user details', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loader />;

  if (!user) return <div className="text-gray-600">User not found</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">User details</h1>
        <Link to="/admin/manage-users" className="text-indigo-600 hover:underline">Back to users</Link>
      </div>

      <div className="bg-white rounded-md shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Name</div>
            <div className="font-medium text-gray-800">{user.name}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Email</div>
            <div className="font-medium text-gray-800">{user.email}</div>
          </div>
          <div className="sm:col-span-2">
            <div className="text-sm text-gray-500">Address</div>
            <div className="text-gray-800">{user.address || '—'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Role</div>
            <div className="font-medium text-gray-800">{user.role}</div>
          </div>
          {user.role === 'STORE_OWNER' && (
            <div>
              <div className="text-sm text-gray-500">Average Rating</div>
              <div className="font-medium text-gray-800">{user.avgRating ?? '—'}</div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Submitted ratings</h2>
        {ratings.length === 0 ? (
          <div className="text-gray-500">No ratings found for this user.</div>
        ) : (
          <div className="space-y-3">
            {ratings.map((r) => (
              <div key={r.id} className="bg-white rounded-md shadow-sm p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{r.storeName ?? r.store?.name ?? 'Store'}</div>
                    <div className="text-xs text-gray-500">{r.created_at ? new Date(r.created_at).toLocaleString() : ''}</div>
                  </div>
                  <div className="text-yellow-500 font-semibold">{r.rating}</div>
                </div>
                {r.comment && <div className="mt-2 text-sm text-gray-700">{r.comment}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
