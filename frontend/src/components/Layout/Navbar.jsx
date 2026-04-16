import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="animate-entry visible" style={{ 
      padding: '0.8rem 2rem', 
      background: 'rgba(15, 12, 28, 0.8)', 
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
      color: 'var(--text-primary)', 
      display: 'flex', 
      gap: '2rem', 
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    }}>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/dashboard" style={{ 
          color: 'var(--text-primary)', 
          textDecoration: 'none', 
          fontWeight: 'bold',
          transition: 'color 0.2s',
          fontSize: '0.95rem'
        }} className="nav-link-hover">Dashboard</Link>
        
        {(user.role === 'admin' || user.role === 'manager') && (
          <Link to="/users" style={{ 
            color: 'var(--text-primary)', 
            textDecoration: 'none', 
            fontWeight: 'bold',
            transition: 'color 0.2s',
            fontSize: '0.95rem'
          }} className="nav-link-hover">Users</Link>
        )}
        
        <Link to="/profile" style={{ 
          color: 'var(--text-primary)', 
          textDecoration: 'none', 
          fontWeight: 'bold',
          transition: 'color 0.2s',
          fontSize: '0.95rem'
        }} className="nav-link-hover">Profile</Link>
      </div>
      
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)', padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
          Logged in as: <strong style={{ color: 'var(--accent-purple)' }}>{user.name}</strong> 
          <span style={{ marginLeft: '0.5rem', opacity: 0.7, fontSize: '0.75rem', textTransform: 'uppercase' }}>[{user.role}]</span>
        </div>
        <button onClick={handleLogout} className="theme-button" style={{ 
          padding: '0.4rem 1.2rem', 
          fontSize: '0.85rem',
          minWidth: 'auto'
        }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
