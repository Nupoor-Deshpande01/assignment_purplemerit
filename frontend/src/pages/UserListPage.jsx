import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUsers } from '../hooks/useUsers';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../hooks/useAuth';
import { deleteUser } from '../api/users';

const UserListPage = () => {
  const { user: currentUser } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const { users, loading, error, totalPages, params, updateParams, refetch } = useUsers({
    page: 1, limit: 10
  });

  React.useEffect(() => {
    updateParams({ search: debouncedSearch, page: 1 });
  }, [debouncedSearch]);

  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
    updateParams({ role: e.target.value, page: 1 });
  };
  
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    updateParams({ isActive: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateParams({ page: newPage });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to softly delete this user account?')) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        alert(err.response?.data?.message || err.message || 'Error deleting user');
      }
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>User Database</h2>
        {currentUser.role === 'admin' && (
          <Link to="/users/new" className="theme-button" style={{ textDecoration: 'none' }}>
            + Create User
          </Link>
        )}
      </div>

      <div className="theme-card animate-entry visible" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', padding: '1rem' }}>
        <input 
          type="text" 
          placeholder="🔍 Search by name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '0.6rem', flex: 1, border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
        />
        
        <select value={roleFilter} onChange={handleRoleChange} style={{ padding: '0.6rem', border: '1px solid var(--border-subtle)', borderRadius: '8px', minWidth: '150px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
          <option value="">All Roles</option>
          <option value="admin">Admins</option>
          <option value="manager">Managers</option>
          <option value="user">Users</option>
        </select>
        
        <select value={statusFilter} onChange={handleStatusChange} style={{ padding: '0.6rem', border: '1px solid var(--border-subtle)', borderRadius: '8px', minWidth: '150px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
          <option value="">All Statuses</option>
          <option value="true">Active Only</option>
          <option value="false">Inactive Only</option>
        </select>
      </div>

      {error ? <div className="theme-card" style={{borderColor: '#dc3545', color: '#ff6b6b', padding: '1rem'}}>{error}</div> : loading ? <p className="animate-entry visible" style={{color: 'var(--text-secondary)'}}>Loading users...</p> : (
        <>
          <div className="theme-card animate-entry visible" style={{ overflowX: 'auto', marginBottom: '1.5rem', animationDelay: '0.1s' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--accent-purple-soft)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Name</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Email</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Role</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Status</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Created</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No users matched your criteria.</td></tr>
                ) : users.map((u, index) => (
                  <tr key={u._id} className="animate-entry visible" style={{ borderBottom: '1px solid var(--border-subtle)', animationDelay: `${0.1 + (index * 0.05)}s` }}>
                    <td style={{ padding: '1rem' }}>{u.name}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '1rem', textTransform: 'capitalize' }}>
                      <span style={{ fontWeight: u.role === 'admin' ? 'bold' : 'normal', color: u.role === 'admin' ? '#ff6b6b' : 'var(--text-primary)' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', background: u.isActive ? 'var(--accent-purple-soft)' : 'rgba(220, 53, 69, 0.15)', color: u.isActive ? 'var(--text-primary)' : '#ff6b6b', border: '1px solid var(--border-subtle)' }}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <Link to={`/users/${u._id}`} style={{ padding: '0.35rem 0.75rem', background: 'var(--border-subtle)', color: 'var(--text-primary)', textDecoration: 'none', borderRadius: '4px', fontSize: '0.85rem', transition: 'background 0.2s', ':hover': { background: 'var(--accent-purple-soft)' } }}>View</Link>
                      
                      {/* Conditional Render Rules */}
                      { (currentUser.role === 'admin' || (currentUser.role === 'manager' && u.role !== 'admin')) && (
                        <Link to={`/users/${u._id}?edit=true`} state={{ edit: true }} style={{ padding: '0.35rem 0.75rem', background: 'var(--accent-purple)', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '0.85rem' }}>Edit</Link>
                      )}
                      
                      { (currentUser.role === 'admin' && currentUser._id !== u._id) && (
                        <button onClick={() => handleDelete(u._id)} style={{ padding: '0.35rem 0.75rem', background: 'rgba(220, 53, 69, 0.2)', color: '#ff6b6b', border: '1px solid #dc3545', borderRadius: '4px', fontSize: '0.85rem', cursor: 'pointer' }}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="theme-card animate-entry visible" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', animationDelay: '0.3s' }}>
            <button 
              disabled={params.page === 1} 
              onClick={() => handlePageChange(params.page - 1)}
              style={{ padding: '0.5rem 1rem', border: '1px solid var(--border-subtle)', borderRadius: '4px', background: params.page === 1 ? 'rgba(255,255,255,0.05)' : 'var(--bg-primary)', color: params.page === 1 ? 'var(--text-secondary)' : 'var(--text-primary)', cursor: params.page === 1 ? 'not-allowed' : 'pointer' }}
            >
              &laquo; Previous
            </button>
            <span style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>Page {params.page || 1} of {Math.max(1, totalPages)}</span>
            <button 
              disabled={params.page === totalPages || totalPages === 0} 
              onClick={() => handlePageChange(params.page + 1)}
              style={{ padding: '0.5rem 1rem', border: '1px solid var(--border-subtle)', borderRadius: '4px', background: params.page === totalPages || totalPages === 0 ? 'rgba(255,255,255,0.05)' : 'var(--bg-primary)', color: params.page === totalPages || totalPages === 0 ? 'var(--text-secondary)' : 'var(--text-primary)', cursor: params.page === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer' }}
            >
              Next &raquo;
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserListPage;
