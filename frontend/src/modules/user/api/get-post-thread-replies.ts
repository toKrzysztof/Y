import axios from 'axios';

export const getPostThreadReplies = async (
  baseUrl: string,
  limit: number,
  skip: number
) => {
  const response = await axios.get(`${baseUrl}?skip=${skip}&limit=${limit}`);
  return response.data;
};
