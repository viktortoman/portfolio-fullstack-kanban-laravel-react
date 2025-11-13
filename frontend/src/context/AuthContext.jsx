import {createContext, useContext, useState, useEffect} from 'react';
import apiClient from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({children}) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      // If token is null (e.g., on logout), remove it
      localStorage.removeItem('token');
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }, [token]);


  const login = async (email, password) => {
    // Call the /api/v1/login endpoint we built
    const response = await apiClient.post('/login', {email, password});

    // Update our app-wide state
    setToken(response.data.token);
    setUser(response.data.user);
  };

  const register = async (name, email, password, password_confirmation) => {
    const response = await apiClient.post('/register', {
      name,
      email,
      password,
      password_confirmation,
    });

    setToken(response.data.token);
    setUser(response.data.user);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};