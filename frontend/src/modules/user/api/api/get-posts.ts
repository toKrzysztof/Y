import { API_URL } from '@/config/env';
import axios from 'axios';

export const getPosts = async (limit: number, offset: number) => {
  const post = await axios.get(
    `${API_URL}/user/post/folowee?offset=${offset}&limit=${limit}`
  );
  return post.data;
};
