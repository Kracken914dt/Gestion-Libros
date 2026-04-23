import http from './http';

export const login = async (payload) => {
  const { data } = await http.post('/auth/login', payload);
  return data?.data;
};

export const register = async (payload) => {
  const { data } = await http.post('/auth/register', payload);
  return data?.data;
};

export const getManagedUsers = async () => {
  const { data } = await http.get('/auth/users');
  return data?.data || [];
};

export const updateManagedUser = async (id, payload) => {
  const { data } = await http.put(`/auth/users/${id}`, payload);
  return data?.data;
};

export const deleteManagedUser = async (id) => {
  const { data } = await http.delete(`/auth/users/${id}`);
  return data?.data;
};
