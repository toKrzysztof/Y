import { API_URL } from '@/config/env';
import axios from 'axios';

export const getOwnPosts = async (limit: number, offset: number) => {
  const post = await axios.get(
    `${API_URL}/user/post/own-post?offset=${offset}&limit=${limit}`
  );
  return post.data;
};
