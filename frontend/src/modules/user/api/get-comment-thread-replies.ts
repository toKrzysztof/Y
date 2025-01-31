import axios from 'axios';

export const getCommentThreadReplies = async (
  baseUrl: string,
  limit: number,
  skip: number
) => {
  const response = await axios.get(`${baseUrl}?skip=${skip}&limit=${limit}`);
  return response.data;
};
