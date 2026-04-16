import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getUserById, updateUser } from '../api/users';
import { useAuth } from '../hooks/useAuth';

const UserDetailPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const initEditMode = searchParams.get('edit') === 'true';
  const { user: currentUser, updateProfile } = useAuth();
  
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(initEditMode);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUserById(id);
        const userData = data?.user || data;
        setUser(userData);
        setFormData({
          name: userData.name,
          email: userData.email,
          role: userData.role,
          isActive: userData.isActive
        });
      } catch (err) {
        setError('Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    const payload = { ...formData };
    
    if (currentUser.role === 'manager') {
      delete payload.role; 
    }

    try {
      const { data } = await updateUser(id, payload);
      const updatedData = data?.user || data;
      setUser(updatedData);
      setFormData({
        name: updatedData.name,
        email: updatedData.email,
        role: updatedData.role,
        isActive: updatedData.isActive
      });
      setIsEditing(false);
      
      if (currentUser._id === id) {
        updateProfile(updatedData);
      }

      alert('Record updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error updating user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{padding: '2rem'}}>Loading user detail module...</div>;
  if (!user) return <div style={{ color: '#842029', padding: '2rem' }}>{error || 'An error occurred fetching user mapping.'}</div>;

  const canEdit = currentUser.role === 'admin' || (currentUser.role === 'manager' && user.role !== 'admin');
  const isManager = currentUser.role === 'manager';

  return (
    <div className="theme-card animate-entry visible" style={{ maxWidth: '750px', margin: '2rem auto', overflow: 'hidden' }}>
      <div style={{ background: 'var(--accent-purple-soft)', padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>{isEditing ? 'Editing Profile Record' : 'Profile Details Mapping'}</h2>
        {!isEditing && canEdit && (
          <button onClick={() => setIsEditing(true)} className="theme-button">
            Enter Edit Mode
          </button>
        )}
      </div>

      <div style={{ padding: '2rem', background: 'transparent' }}>
        {error && <div style={{ background: 'rgba(220, 53, 69, 0.1)', color: '#ff6b6b', padding: '1rem', marginBottom: '1.5rem', borderRadius: '4px', borderLeft: '4px solid #dc3545' }}>{error}</div>}

        {isEditing ? (
          <form onSubmit={handleSave} className="animate-entry visible" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animationDelay: '0.1s' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-subtle)', borderRadius: '8px', boxSizing: 'border-box', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}/>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Email Identity</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-subtle)', borderRadius: '8px', boxSizing: 'border-box', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}/>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Access Role {isManager && <span style={{color: 'var(--border-subtle)', fontWeight: 'normal'}}>(Managers restricted from assigning roles)</span>}</label>
              <select name="role" value={formData.role} onChange={handleChange} disabled={isManager} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-subtle)', borderRadius: '8px', boxSizing: 'border-box', background: isManager ? 'var(--bg-primary)' : 'var(--bg-secondary)', color: isManager ? 'var(--text-secondary)' : 'var(--text-primary)', cursor: isManager ? 'not-allowed' : 'pointer', opacity: isManager ? 0.7 : 1 }}>
                <option value="user">User</option>
                <option value="manager">Manager</option>
                {currentUser.role === 'admin' && <option value="admin">Admin</option>}
              </select>
            </div>
            
            <div style={{ padding: '1.25rem', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', cursor: 'pointer', color: 'var(--text-primary)' }}>
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--accent-purple)' }} />
                Account Status Is Active
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" disabled={saving} className="theme-button" style={{ flex: 1, padding: '0.85rem 1.7rem', fontSize: '1rem' }}>
                {saving ? 'Processing changes...' : 'Save Profile Changes'}
              </button>
              <button type="button" onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '0.85rem 1.7rem', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '999px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'all 0.2s', ':hover': { background: 'rgba(255,255,255,0.05)' } }}>
                Revert Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="animate-entry visible" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', animationDelay: '0.1s' }}>
            <div style={{ background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Identity Configuration</h4>
              <p style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{user.name}</p>
              <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Email Binding</h4>
              <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--accent-purple)' }}>{user.email}</p>
            </div>

            <div style={{ background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Privilege Extent</h4>
              <p style={{ margin: '0 0 1rem 0', textTransform: 'capitalize', fontWeight: 'bold', color: user.role === 'admin' ? '#ff6b6b' : 'var(--text-primary)', fontSize: '1.1rem' }}>{user.role}</p>
              <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Operational Status</h4>
              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ padding: '0.4rem 0.8rem', borderRadius: '16px', fontSize: '0.95rem', fontWeight: 'bold', background: user.isActive ? 'var(--accent-purple-soft)' : 'rgba(220, 53, 69, 0.15)', color: user.isActive ? 'var(--text-primary)' : '#ff6b6b', border: '1px solid var(--border-subtle)' }}>
                  {user.isActive ? 'Active and Authorized' : 'Operationally Inactive'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="animate-entry visible" style={{ background: 'var(--bg-primary)', padding: '1.5rem', borderTop: '1px solid var(--border-subtle)', animationDelay: '0.2s' }}>
          <h3 style={{ marginTop: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>System Audit Trail Node</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
              <p style={{margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)', opacity: 0.8, textTransform: 'uppercase'}}>Genesis Record</p>
              <p style={{margin: '0 0 0.25rem 0', color: 'var(--text-primary)'}}>Actor: <strong style={{ color: 'var(--accent-purple)' }}>{user.createdBy?.name || 'System Auto-provisioned'}</strong></p>
              <p style={{margin: 0}}>Timeline: {new Date(user.createdAt).toLocaleString()}</p>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
              <p style={{margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)', opacity: 0.8, textTransform: 'uppercase'}}>Latest Mutation</p>
              <p style={{margin: '0 0 0.25rem 0', color: 'var(--text-primary)'}}>Actor: <strong style={{ color: 'var(--accent-purple)' }}>{user.updatedBy?.name || 'System / Self'}</strong></p>
              <p style={{margin: 0}}>Timeline: {new Date(user.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailPage;
