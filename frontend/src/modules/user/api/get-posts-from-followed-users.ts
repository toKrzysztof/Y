import axios from 'axios';

export const getPostsFromFollowedUsers = async (
  baseUrl: string,
  limit: number,
  skip: number
) => {
  const response = await axios.get(`${baseUrl}?skip=${skip}&limit=${limit}`);
  console.log(response.data.content);

  return response.data;
};
