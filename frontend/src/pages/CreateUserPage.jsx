import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../api/users';

const CreateUserPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user', isActive: true });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    
    setLoading(true);
    setError('');
    try {
      await createUser(formData);
      alert('User successfully provisioned!');
      navigate('/users');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error occurred while creating user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="theme-card animate-entry visible" style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
      <h2 style={{marginTop: 0, color: 'var(--text-primary)'}}>Register Internal User</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Provision a new account into the system. An initial password is required.</p>
      
      {error && <div style={{ background: 'rgba(220, 53, 69, 0.1)', color: '#ff6b6b', padding: '1rem', marginBottom: '1.5rem', borderRadius: '4px', borderLeft: '4px solid #dc3545' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} className="animate-entry visible" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animationDelay: '0.1s' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Full Legal Name</label>
          <input type="text" name="name" required value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', boxSizing: 'border-box', border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}/>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Corporate Email</label>
          <input type="email" name="email" required value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', boxSizing: 'border-box', border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}/>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Temporary Password</label>
          <input type="password" name="password" required value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', boxSizing: 'border-box', border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} minLength="6"/>
          <small style={{color: 'var(--text-secondary)', opacity: 0.8}}>Minimum 6 characters long.</small>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Assigned Access Role</label>
          <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', boxSizing: 'border-box', border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <option value="user">Standard User</option>
            <option value="manager">Dept Manager</option>
            <option value="admin">System Admin</option>
          </select>
        </div>
        <div style={{ padding: '1.25rem', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', cursor: 'pointer', color: 'var(--text-primary)' }}>
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--accent-purple)' }} />
            Account Is Active and can log in immediately
          </label>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button type="submit" disabled={loading} className="theme-button" style={{ flex: 2, padding: '0.85rem', fontSize: '1rem' }}>
            {loading ? 'Processing...' : 'Create Record'}
          </button>
          <button type="button" onClick={() => navigate('/users')} style={{ flex: 1, padding: '0.85rem', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '999px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'all 0.2s', ':hover': { background: 'rgba(255,255,255,0.05)' } }}>
            Abort
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserPage;
