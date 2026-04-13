import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const ADMIN_CREDENTIALS = {
  email: 'admin@msrs.org',
  password: 'admin123'
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Check authentication on mount
    const storedAuth = localStorage.getItem('adminAuth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
      setUser({ email: ADMIN_CREDENTIALS.email });
    }
    setLoading(false); // Mark loading as complete
  }, []);

  const login = (email, password) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setUser({ email });
      localStorage.setItem('adminAuth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('adminAuth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}