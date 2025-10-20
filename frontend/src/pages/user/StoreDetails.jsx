import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../config/axiosInstance';
import Loader from '../../components/common/Loader';
import RatingForm from '../../components/forms/RatingForm';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import storeApi from '../../api/storeApi';

const StoreDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { fetchStoreById, submitRating } = useStore();
  const [store, setStore] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [message, setMessage] = useState('');

  const loadStore = async () => {
    setLoading(true);
    try {
      if (typeof fetchStoreById === 'function') {
        const res = await fetchStoreById(id);
        const s = res?.data ?? res;
        setStore(s);
      } else {
        const res = await storeApi.get(id);
        setStore(res?.data ?? res);
      }

      if (currentUser) {
        try {
          const rres = await storeApi.getRatings(id, { userId: currentUser.id, page: 1, limit: 1 });
          const payload = rres?.data ?? {};
          const rows = payload.data ?? payload.rows ?? (Array.isArray(payload) ? payload : []);
          const my = rows.find(row => row.userId === currentUser.id || row.user?.id === currentUser.id) ?? null;
          setUserRating(my ? (my.rating ?? my.value) : null);
        } catch (err) {
          try {
            const alt = await storeApi.getRatings(id, { userId: currentUser.id, page: 1, limit: 1 });
            const altPayload = alt?.data ?? {};
            const altRows = altPayload.data ?? altPayload.rows ?? (Array.isArray(altPayload) ? altPayload : []);
            const my = altRows.find(r => (r.storeId?.toString() === id.toString()) || (r.store?.id?.toString() === id.toString()));
            setUserRating(my ? my.rating : null);
          } catch (e) {
            setUserRating(null);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load store', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStore();
  }, [id, currentUser]);

  const handleRatingSubmit = async ({ rating, comment }) => {
    if (!currentUser) {
      setMessage('Please login to submit a rating.');
      return;
    }
    setSubmittingRating(true);
    setMessage('');
    try {
      if (typeof submitRating === 'function') {
        await submitRating(id, { rating, comment });
      } else {
        await axios.post(`/api/stores/${id}/ratings`, { rating, comment });
      }
      setMessage('Rating submitted successfully!');
      setUserRating(rating);
      await loadStore();
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      console.error('Submit rating failed', err);
      const msg = err?.response?.data?.message || 'Failed to submit rating';
      setMessage(msg);
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) return <Loader />;

  if (!store) return <div className="text-gray-600">Store not found.</div>;

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{store.name}</h1>
          <div className="text-sm text-gray-600 mt-1">{store.address}</div>
          <div className="mt-2 inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded text-sm">{store.category}</div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-500">Average rating</div>
          <div className="text-2xl font-semibold">{store.avg_rating ?? store.averageRating ?? '—'}</div>
          {store.ratingCount && <div className="text-sm text-gray-500 mt-1">{store.ratingCount} ratings</div>}
        </div>
      </div>

      {message && <div className="mb-4 p-3 rounded bg-green-50 text-green-700">{message}</div>}

      <div className="bg-white rounded-md shadow-sm p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Your rating</h2>
        <RatingForm initialRating={userRating || 0} initialComment="" onSubmit={handleRatingSubmit} />
      </div>
    </div>
  );
};

export default StoreDetails;
