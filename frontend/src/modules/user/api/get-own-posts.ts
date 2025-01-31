import axios from 'axios';

export const getOwnPosts = async (
  baseFetchUrl: string,
  limit: number,
  skip: number
) => {
  const response = await axios.get(`${baseFetchUrl}?skip=${skip}&limit=${limit}`);

  return response.data;
};
