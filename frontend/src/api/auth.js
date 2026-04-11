import http from './http';

export const login = async (payload) => {
  const { data } = await http.post('/auth/login', payload);
  return data?.data;
};

export const register = async (payload) => {
  const { data } = await http.post('/auth/register', payload);
  return data?.data;
};
