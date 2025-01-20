import { API_URL } from '@/config/env';
import axios from 'axios';

export const getUsers = async (limit, offset) => {
  const users = await axios.get(
    `https://dummyjson.com/users?limit=${limit}&skip=${offset}`
  );

  return users.data.users;
};
