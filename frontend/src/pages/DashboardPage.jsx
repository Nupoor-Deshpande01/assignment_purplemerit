import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUsers } from '../api/users';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const animateCounter = (el, target, duration = 1500) => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { 
        start = target; 
        clearInterval(timer); 
      }
      el.textContent = Math.floor(start) + (el.dataset.suffix || '');
    }, 16);
  };

  useEffect(() => {
    if (user.role === 'admin') {
      const fetchAdminStats = async () => {
        setLoading(true);
        try {
          const { data } = await getUsers({ limit: 1000 });
          const allUsers = data?.docs || data || [];
          setStats({
            total: allUsers.length,
            active: allUsers.filter(u => u.isActive).length,
            inactive: allUsers.filter(u => !u.isActive).length,
            admins: allUsers.filter(u => u.role === 'admin').length,
          });
        } catch (err) {
          setError('Failed to load statistics');
        } finally {
          setLoading(false);
        }
      };
      fetchAdminStats();
    }
  }, [user.role]);

  useEffect(() => {
    if (!stats && user.role === 'admin') return;
      
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.hasAttribute('data-counter')) {
            animateCounter(entry.target, +entry.target.dataset.target);
          }
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    });

    document.querySelectorAll('[data-counter], .animate-entry').forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, [stats, user.role]);

  return (
    <div className="radial-bg" style={{ minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <div className="animate-entry theme-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h1 style={{ margin: 0, fontSize: '2.5rem' }}>Welcome back, {user.name}!</h1>
          <div className="tags-container" style={{ marginTop: '1rem' }}>
             <span className="tag-chip">🟢 Verified Identity</span>
             <span className="tag-chip">Shielded Session</span>
             <span className="tag-chip">Role: {user.role.toUpperCase()}</span>
          </div>
        </div>

        {user.role === 'admin' && (
          <div className="animate-entry" style={{ animationDelay: '0.2s' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>System Overview</h2>
            {loading ? <p style={{color: 'var(--text-secondary)'}}>Loading system statistics...</p> : error ? <p style={{color: '#ff6b6b'}}>{error}</p> : stats && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="stat-card">
                  <h3 className="stat-label">Total Users</h3>
                  <div className="stat-number" data-counter data-target={stats.total}>0</div>
                </div>
                <div className="stat-card">
                  <h3 className="stat-label">Active Accounts</h3>
                  <div className="stat-number" data-counter data-target={stats.active}>0</div>
                </div>
                <div className="stat-card">
                  <h3 className="stat-label">Inactive Accounts</h3>
                  <div className="stat-number" data-counter data-target={stats.inactive}>0</div>
                </div>
                <div className="stat-card">
                  <h3 className="stat-label">Administrators</h3>
                  <div className="stat-number" data-counter data-target={stats.admins}>0</div>
                </div>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/users" className="theme-button" style={{ textDecoration: 'none' }}>
                Manage All Users
              </Link>
            </div>
          </div>
        )}

        {user.role === 'manager' && (
          <div className="animate-entry theme-card" style={{ padding: '2rem', marginTop: '2rem', animationDelay: '0.2s' }}>
            <h2>Manager Operations</h2>
            <p style={{ color: 'var(--text-secondary)' }}>You have access to oversee user operations and modify standard user records.</p>
            <div style={{ marginTop: '1.5rem' }}>
              <Link to="/users" className="theme-button" style={{ textDecoration: 'none', display: 'inline-block' }}>
                Open User Database
              </Link>
            </div>
          </div>
        )}

        {user.role === 'user' && (
          <div className="animate-entry theme-card" style={{ padding: '2rem', marginTop: '2rem', animationDelay: '0.2s' }}>
            <h2>Staff Portal</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Welcome to your personal portal. You can view and manage your custom profile.</p>
            <div style={{ marginTop: '1.5rem' }}>
              <Link to="/profile" className="theme-button" style={{ textDecoration: 'none', display: 'inline-block' }}>
                Go to Profile
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DashboardPage;
