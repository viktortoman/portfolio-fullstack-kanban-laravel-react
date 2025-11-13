import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserOnLoad = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

          const response = await apiClient.get('/user');

          setUser(response.data.user);
          setToken(storedToken);

        } catch (error) {
          localStorage.removeItem('token');
          delete apiClient.defaults.headers.common['Authorization'];
          setUser(null);
          setToken(null);
        }
      }

      setIsLoading(false);
    };

    checkUserOnLoad();
  }, []);

  const login = async (email, password) => {
    const response = await apiClient.post('/login', { email, password });
    const { token, user } = response.data;

    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const register = async (name, email, password, password_confirmation) => {
    const response = await apiClient.post('/register', {
      name,
      email,
      password,
      password_confirmation,
    });

    const { token, user } = response.data;

    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = async () => {
    try {
      // 1. Try to call backend
      await apiClient.post('/logout');
    } catch (error) {
      console.error("Backend logout failed:", error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      delete apiClient.defaults.headers.common['Authorization'];
    }
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};