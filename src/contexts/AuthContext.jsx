
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

const getSession = () => {
  try {
    const session = localStorage.getItem('dental_session');
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
};

const setSession = (userData) => {
  localStorage.setItem('dental_session', JSON.stringify(userData));
};

const clearSession = () => {
  localStorage.removeItem('dental_session');
};

const initializeMockData = () => {
  if (!localStorage.getItem('dental_users')) {
    const users = [
      { id: '1', role: 'Admin', email: 'admin@entnt.in', password: 'admin123' },
      { id: '2', role: 'Patient', email: 'john@entnt.in', password: 'patient123', patientId: 'p1' }
    ];

    // Leave patients and appointments empty for ENTNT c
    localStorage.setItem('dental_users', JSON.stringify(users));
    localStorage.setItem('dental_patients', JSON.stringify([]));
    localStorage.setItem('dental_appointments', JSON.stringify([]));
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeMockData();
    const session = getSession();
    if (session) setCurrentUser(session);
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('dental_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setSession(user);
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    clearSession();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoading,
      login,
      logout,
      isAuthenticated: !!currentUser,
      isAdmin: currentUser?.role === 'Admin'
    }}>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
