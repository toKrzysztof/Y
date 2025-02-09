import { API_URL } from '@/config/env';
import axios from 'axios';

const checkAuthStatus = async () => {
  const authStatusResponse = await axios.get(`${API_URL}/auth/status`);

  return authStatusResponse.data.tokenValid === true;
};

export const userAuthenticatedGuard = async (to, from, next) => {
  const isAuthenticated = await checkAuthStatus();
  if (isAuthenticated) {
    next();
  } else {
    next({ path: '/' });
  }
};
