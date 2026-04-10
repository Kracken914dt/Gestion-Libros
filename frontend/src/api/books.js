import http from './http';

const normalizeBook = (book) => ({
  ...book,
  id: book.id || book._id,
});

export const getBooks = async (params) => {
  const { data } = await http.get('/books', { params });

  return {
    items: (data?.data || []).map(normalizeBook),
    meta: data?.meta || { total: 0, page: 1, limit: 9, totalPages: 1 },
  };
};

export const getBookById = async (id) => {
  const { data } = await http.get(`/books/${id}`);
  return normalizeBook(data.data);
};

export const createBook = async (payload) => {
  const { data } = await http.post('/books', payload);
  return normalizeBook(data.data);
};

export const updateBook = async (id, payload) => {
  const { data } = await http.put(`/books/${id}`, payload);
  return normalizeBook(data.data);
};

export const deleteBook = async (id) => {
  await http.delete(`/books/${id}`);
};
