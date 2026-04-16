import React, { createContext, useState, useContext, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = (msg, ms) => addToast(msg, 'success', ms);
  const error = (msg, ms) => addToast(msg, 'error', ms);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error }}>
      {children}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {toasts.map((toast) => (
          <div key={toast.id} style={{
            background: toast.type === 'error' ? '#dc3545' : toast.type === 'success' ? '#198754' : '#333',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '4px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            minWidth: '250px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'sans-serif',
            animation: 'slideIn 0.3s ease-out'
          }}>
            {toast.message}
            <button onClick={() => removeToast(toast.id)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', marginLeft: '1rem', fontSize: '1.2rem' }}>&times;</button>
          </div>
        ))}
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}</style>
      </div>
    </ToastContext.Provider>
  );
};
