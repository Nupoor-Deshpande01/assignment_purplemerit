import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateUser } from '../api/users';
import { useToast } from '../context/ToastContext';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  
  const [formData, setFormData] = useState({ name: user.name, email: user.email, currentPassword: '', newPassword: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // We send payload data mappings if user changed standard metadata cleanly
    const payload = {
      name: formData.name,
      email: formData.email
    };
    
    // If they typed in newPassword protect the logic
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setLoading(false);
        return setError('Please enter your current password to set a new one.');
      }
      if (formData.newPassword.length < 6) {
         setLoading(false);
         return setError('New password must be at least 6 characters.');
      }
      payload.password = formData.newPassword;
    }

    try {
      const { data } = await updateUser(user._id, payload);
      const updatedData = data?.user || data;
      updateProfile(updatedData);
      setIsEditing(false);
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' })); // clear
      toast.success('Your profile identity was updated successfully!');
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Error updating profile';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="theme-card animate-entry visible" style={{ maxWidth: '650px', margin: '3rem auto', padding: '2.5rem', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem', gap: '1rem' }}>
        <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Personal Configuration</h2>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="theme-button">
            Edit Identity & Security
          </button>
        )}
      </div>

      {error && <div style={{ background: 'rgba(220, 53, 69, 0.1)', color: '#ff6b6b', padding: '1rem', marginBottom: '2rem', borderRadius: '8px', borderLeft: '4px solid #dc3545' }}>{error}</div>}

      {isEditing ? (
        <form onSubmit={handleSave} className="animate-entry visible" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animationDelay: '0.1s' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Identity Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '0.85rem', border: '1px solid var(--border-subtle)', borderRadius: '8px', boxSizing: 'border-box', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}/>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Corporate Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '0.85rem', border: '1px solid var(--border-subtle)', borderRadius: '8px', boxSizing: 'border-box', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}/>
          </div>
          
          <div style={{ background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>Change Password <span style={{fontWeight: 'normal', color: 'var(--text-secondary)', fontSize: '0.8rem'}}>(Optional)</span></h4>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Current Password</label>
              <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-subtle)', borderRadius: '6px', boxSizing: 'border-box', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} placeholder="Required for password change..."/>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>New Password</label>
              <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-subtle)', borderRadius: '6px', boxSizing: 'border-box', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} placeholder="Min. 6 characters..."/>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" disabled={loading} className="theme-button" style={{ flex: 1, padding: '0.85rem', fontSize: '1rem', minWidth: '150px' }}>
              {loading ? 'Processing...' : 'Confirm Edits'}
            </button>
            <button type="button" onClick={() => { setIsEditing(false); setError(''); }} style={{ flex: 1, padding: '0.85rem', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '999px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', minWidth: '150px', transition: 'all 0.2s', ':hover': { background: 'rgba(255,255,255,0.05)' } }}>
              Abort Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="animate-entry visible" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animationDelay: '0.1s' }}>
          <div style={{ background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ width: '70px', height: '70px', background: 'var(--accent-purple)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 'bold', boxShadow: '0 0 15px var(--accent-purple-glow)' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{user.name}</p>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{user.email}</p>
            </div>
          </div>
          
          <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Assigned Privilege Tier 🔒</p>
              <p style={{ margin: 0, fontSize: '1.25rem', textTransform: 'capitalize', fontWeight: 'bold', color: user.role === 'admin' ? '#ff6b6b' : 'var(--text-primary)' }}>{user.role}</p>
            </div>

            <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Account State</p>
            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ padding: '0.4rem 1rem', borderRadius: '16px', fontSize: '0.95rem', fontWeight: 'bold', background: user.isActive ? 'var(--accent-purple-soft)' : 'rgba(220, 53, 69, 0.15)', color: user.isActive ? 'var(--text-primary)' : '#ff6b6b', border: '1px solid var(--border-subtle)' }}>
                {user.isActive ? 'Active Framework Authorization' : 'Inactive Operations Hold'}
              </span>
            </div>
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '1.5rem', borderTop: '1px solid var(--border-subtle)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ marginTop: 0, fontSize: '1rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>System Audit Logs</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <p style={{margin: '0 0 0.25rem 0', color: 'var(--text-primary)', fontWeight: 'bold'}}>Creation timeline</p>
                <p style={{margin: 0}}>{new Date(user.createdAt).toLocaleString()}</p>
              </div>
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <p style={{margin: '0 0 0.25rem 0', color: 'var(--text-primary)', fontWeight: 'bold'}}>Last system update</p>
                <p style={{margin: 0}}>{new Date(user.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
