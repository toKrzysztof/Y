import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getRandomPosts = async (baseUrl: string, limit: number, skip: number) => {
  const response = await axios.get(`${baseUrl}`);
  console.log(response.data);
  return response.data;
};
