import { Plus, Rows2, LayoutGrid, LogOut, Search, Sun, Moon, Eye, Pencil, Trash2, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBook, deleteBook, getBooks, updateBook } from '../api/books';
import BookCard from '../components/BookCard';
import BookFormModal from '../components/BookFormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';
import UsersAdminModal from '../components/UsersAdminModal';
import { applyTheme, getInitialTheme } from '../utils/theme';
import { isAdminUser } from '../utils/auth';

const availabilityOptions = [
  { label: 'All', value: 'all' },
  { label: 'Available', value: 'true' },
  { label: 'Not Available', value: 'false' },
];

export default function BooksPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [availability, setAvailability] = useState('all');
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('book_view_mode') || 'cards');
  const [theme, setTheme] = useState(() => getInitialTheme());

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [activeBook, setActiveBook] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [usersModalOpen, setUsersModalOpen] = useState(false);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 9, totalPages: 1 });
  const canManageBooks = isAdminUser();

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    localStorage.setItem('book_view_mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const fetchBooks = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {
        page: 1,
        limit: 9,
      };

      if (debouncedSearch) params.search = debouncedSearch;
      if (genre) params.genre = genre;
      if (availability !== 'all') params.isAvailable = availability;

      const response = await getBooks(params);
      setBooks(response.items);
      setMeta(response.meta);
    } catch (requestError) {
      if (requestError?.response?.status === 401) {
        logout();
        return;
      }
      setError('No se pudieron cargar los libros.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [debouncedSearch, genre, availability]);

  const genres = useMemo(() => {
    const unique = new Set(books.map((book) => book.genre).filter(Boolean));
    return ['All Genres', ...Array.from(unique)];
  }, [books]);

  const openCreateModal = () => {
    setModalMode('create');
    setActiveBook(null);
    setModalOpen(true);
  };

  const openEditModal = (book) => {
    setModalMode('edit');
    setActiveBook(book);
    setModalOpen(true);
  };

  const onSaveBook = async (payload) => {
    setSaving(true);
    setError('');

    try {
      if (modalMode === 'edit' && activeBook?.id) {
        await updateBook(activeBook.id, payload);
      } else {
        await createBook(payload);
      }

      setModalOpen(false);
      await fetchBooks();
    } catch (requestError) {
      const message = requestError?.response?.data?.message || 'No se pudo guardar el libro.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const onDeleteBook = async () => {
    if (!deleteTarget?.id) return;

    setSaving(true);
    try {
      await deleteBook(deleteTarget.id);
      setDeleteTarget(null);
      await fetchBooks();
    } catch (requestError) {
      setError('No se pudo eliminar el libro.');
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('book_app_token');
    localStorage.removeItem('book_app_user');
    navigate('/login');
  };

  const pageTone =
    theme === 'light'
      ? 'bg-[linear-gradient(180deg,#f3f7ff_0%,#edf2fb_100%)] text-slate-900'
      : 'bg-hero-grid text-slate-100';

  const panelTone =
    theme === 'light'
      ? 'border-slate-200 bg-white/90 text-slate-800 shadow-lg shadow-slate-200/70'
      : 'border-white/10 bg-[#051633] text-slate-200';

  const filterTone =
    theme === 'light'
      ? 'border-slate-300 bg-white text-slate-700 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/15'
      : 'border-white/10 bg-[#071b38] text-slate-200 focus-within:border-electric/60 focus-within:ring-4 focus-within:ring-electric/20';

  return (
    <main className={`min-h-screen px-4 py-7 transition-colors md:px-8 ${pageTone}`}>
      <section className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className={`text-4xl font-semibold tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Book Management</h1>
            <p className={theme === 'light' ? 'mt-2 text-slate-600' : 'mt-2 text-slate-300'}>Manage your book collection efficiently</p>
          </div>

          <div className={`flex items-center gap-2 rounded-xl border p-1.5 ${panelTone}`}>
            <button
              className={`action-pill ${viewMode === 'table' ? 'bg-electric text-white shadow-glow' : theme === 'light' ? 'bg-slate-100 text-slate-700' : 'bg-[#071938] text-slate-200'}`}
              onClick={() => setViewMode('table')}
            >
              <Rows2 size={14} />
              Table
            </button>
            <button
              className={`action-pill ${viewMode === 'cards' ? 'bg-electric text-white shadow-glow' : theme === 'light' ? 'bg-slate-100 text-slate-700' : 'bg-[#071938] text-slate-200'}`}
              onClick={() => setViewMode('cards')}
            >
              <LayoutGrid size={14} />
              Cards
            </button>
            {canManageBooks && (
              <button onClick={openCreateModal} className="action-pill bg-electric text-white">
                <Plus size={14} />
                Add Book
              </button>
            )}
            {canManageBooks && (
              <button onClick={() => setUsersModalOpen(true)} className="action-pill bg-[#0f2a56] text-slate-100">
                <Users size={14} />
                Users
              </button>
            )}
            <button onClick={logout} className="icon-pill" title="Logout">
              <LogOut size={14} />
            </button>
            <button
              className="icon-pill"
              title="Theme"
              onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <label>
            <span className="filter-label">Search</span>
            <div className={`filter-box search-box h-[46px] transition-all ${filterTone}`}>
              <Search size={16} className="text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title or author..."
              />
            </div>
          </label>

          <label>
            <span className="filter-label">Genre</span>
            <select
              className={`filter-box h-[46px] appearance-none ${filterTone}`}
              value={genre || 'All Genres'}
              onChange={(event) => setGenre(event.target.value === 'All Genres' ? '' : event.target.value)}
            >
              {genres.map((genreOption) => (
                <option
                  key={genreOption}
                  value={genreOption}
                  className={theme === 'light' ? 'bg-white text-slate-700' : 'bg-slatePanel text-slate-100'}
                >
                  {genreOption}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="filter-label">Availability</span>
            <select
              className={`filter-box h-[46px] appearance-none ${filterTone}`}
              value={availability}
              onChange={(event) => setAvailability(event.target.value)}
            >
              {availabilityOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className={theme === 'light' ? 'bg-white text-slate-700' : 'bg-slatePanel text-slate-100'}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </section>

        {error && (
          <p
            className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
              theme === 'light'
                ? 'border-rose-300 bg-rose-50 text-rose-700'
                : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
            }`}
          >
            {error}
          </p>
        )}

        {loading ? (
          <div
            className={`grid min-h-[220px] place-items-center rounded-xl border ${
              theme === 'light' ? 'border-slate-200 bg-white' : 'border-white/5 bg-slatePanel'
            }`}
          >
            <Loader theme={theme} size="lg" label="Cargando libros..." />
          </div>
        ) : (
          viewMode === 'cards' ? (
            <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onView={(selected) => navigate(`/books/${selected.id}`)}
                  onEdit={canManageBooks ? openEditModal : undefined}
                  onDelete={canManageBooks ? setDeleteTarget : undefined}
                  canManage={canManageBooks}
                  theme={theme}
                />
              ))}
            </section>
          ) : (
            <section className={`overflow-hidden rounded-xl border ${theme === 'light' ? 'border-slate-200 bg-white' : 'border-white/10 bg-slatePanel'}`}>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className={theme === 'light' ? 'bg-slate-50 text-slate-600' : 'bg-[#0f2446] text-slate-300'}>
                    <tr>
                      <th className="px-4 py-3 text-left">Book</th>
                      <th className="px-4 py-3 text-left">Author</th>
                      <th className="px-4 py-3 text-left">Genre</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      {canManageBooks && <th className="px-4 py-3 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book.id} className={theme === 'light' ? 'border-t border-slate-100' : 'border-t border-white/5'}>
                        <td className="px-4 py-3 font-medium">{book.title}</td>
                        <td className="px-4 py-3">{book.author}</td>
                        <td className="px-4 py-3">{book.genre || 'General'}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                              book.isAvailable
                                ? theme === 'light'
                                  ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
                                  : 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-300/30'
                                : theme === 'light'
                                  ? 'bg-rose-100 text-rose-700 ring-1 ring-rose-200'
                                  : 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-300/30'
                            }`}
                          >
                            {book.isAvailable ? 'Available' : 'Not Available'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className={`flex items-center ${canManageBooks ? 'justify-end gap-2' : 'justify-end'}`}>
                            <button
                              className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition ${
                                theme === 'light' ? 'text-blue-600 hover:bg-blue-100' : 'text-electricSoft hover:bg-electric/20'
                              }`}
                              onClick={() => navigate(`/books/${book.id}`)}
                              aria-label="View book"
                            >
                              <Eye size={16} />
                            </button>
                            {canManageBooks && (
                              <>
                                <button
                                  className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition ${
                                    theme === 'light' ? 'text-blue-600 hover:bg-blue-100' : 'text-electricSoft hover:bg-electric/20'
                                  }`}
                                  onClick={() => openEditModal(book)}
                                  aria-label="Edit book"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-rose-400 transition hover:bg-rose-500/20"
                                  onClick={() => setDeleteTarget(book)}
                                  aria-label="Delete book"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )
        )}

        {!loading && books.length === 0 && (
          <div
            className={`mt-5 rounded-xl border px-4 py-8 text-center ${
              theme === 'light'
                ? 'border-slate-200 bg-white text-slate-600'
                : 'border-white/10 bg-slatePanel/80 text-slate-300'
            }`}
          >
            No hay libros con los filtros actuales.
          </div>
        )}

        <p className={`mt-6 text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
          {meta.total} libro(s) encontrados.
        </p>
      </section>

      {canManageBooks && (
        <>
          <BookFormModal
            open={modalOpen}
            mode={modalMode}
            initialValues={activeBook}
            onClose={() => setModalOpen(false)}
            onSubmit={onSaveBook}
            loading={saving}
            theme={theme}
          />

          <ConfirmDialog
            open={Boolean(deleteTarget)}
            title="Eliminar libro"
            message={`Esta accion eliminara "${deleteTarget?.title || ''}" de forma permanente.`}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={onDeleteBook}
            loading={saving}
            theme={theme}
          />

          <UsersAdminModal
            open={usersModalOpen}
            onClose={() => setUsersModalOpen(false)}
            theme={theme}
          />
        </>
      )}
    </main>
  );
}
