import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '6rem 2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '5rem', margin: 0, color: '#dc3545' }}>404</h1>
      <h2 style={{ fontSize: '2rem', margin: '0.5rem 0 2rem' }}>Target Not Found</h2>
      <p style={{ color: '#6c757d', marginBottom: '2.5rem', fontSize: '1.2rem' }}>You requested a resource that does not map to any recognized application route.</p>
      <Link to="/dashboard" style={{ padding: '0.85rem 1.7rem', background: '#0d6efd', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
        Return to Safety
      </Link>
    </div>
  );
};

export default NotFoundPage;
