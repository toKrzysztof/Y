import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getPosts = async (baseUrl: string, limit: number, skip: number) => {
  const response = await axios.get(`${baseUrl}?limit=${limit}&skip=${skip}`);
  return response.data;
};
