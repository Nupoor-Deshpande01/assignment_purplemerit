import { useState, useEffect, useCallback } from 'react';
import { getUsers as apiGetUsers } from '../api/users';

export const useUsers = (initialParams = {}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [params, setParams] = useState(initialParams);

  const fetchUsers = useCallback(async (currentParams) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiGetUsers(currentParams);
      // Handles mongoose-paginate-v2 wrapped payload
      if (data?.docs) {
        setUsers(data.docs);
        setTotalPages(data.totalPages || 1);
      } else {
        setUsers(data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(params);
  }, [params, fetchUsers]);

  const updateParams = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  return { users, loading, error, totalPages, params, updateParams, refetch: () => fetchUsers(params) };
};
