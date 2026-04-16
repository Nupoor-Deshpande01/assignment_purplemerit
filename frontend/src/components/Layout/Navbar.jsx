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
    <nav style={{ padding: '1rem', background: '#333', color: 'white', display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
      
      {(user.role === 'admin' || user.role === 'manager') && (
        <Link to="/users" style={{ color: 'white', textDecoration: 'none' }}>Users</Link>
      )}
      
      <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profile</Link>
      
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span>Logged in as: <strong>{user.name}</strong> ({user.role})</span>
        <button onClick={handleLogout} style={{ padding: '0.5rem', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
