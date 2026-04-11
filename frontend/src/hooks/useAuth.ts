import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('job-tracker-token'));
  }, []);

  const saveToken = (value: string) => {
    localStorage.setItem('job-tracker-token', value);
    setToken(value);
  };

  const logout = () => {
    localStorage.removeItem('job-tracker-token');
    setToken(null);
  };

  return { token, saveToken, logout };
};
