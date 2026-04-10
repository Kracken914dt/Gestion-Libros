import { Plus, Rows2, LayoutGrid, LogOut, Search, SunMoon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBook, deleteBook, getBooks, updateBook } from '../api/books';
import BookCard from '../components/BookCard';
import BookFormModal from '../components/BookFormModal';
import ConfirmDialog from '../components/ConfirmDialog';

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

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [activeBook, setActiveBook] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 9, totalPages: 1 });

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(timeout);
  }, [search]);

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
    localStorage.removeItem('book_app_auth');
    navigate('/login');
  };

  return (
    <main className="min-h-screen bg-hero-grid px-4 py-7 md:px-8">
      <section className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-100">Book Management</h1>
            <p className="mt-2 text-slate-300">Manage your book collection efficiently</p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#051633] p-1.5">
            <button className="action-pill bg-[#071938] text-slate-200">
              <Rows2 size={14} />
              Table
            </button>
            <button className="action-pill bg-electric text-white shadow-glow">
              <LayoutGrid size={14} />
              Cards
            </button>
            <button onClick={openCreateModal} className="action-pill bg-electric text-white">
              <Plus size={14} />
              Add Book
            </button>
            <button onClick={logout} className="icon-pill" title="Logout">
              <LogOut size={14} />
            </button>
            <button className="icon-pill" title="Theme">
              <SunMoon size={14} />
            </button>
          </div>
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <label>
            <span className="filter-label">Search</span>
            <div className="filter-box">
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
              className="filter-box h-[46px] appearance-none"
              value={genre || 'All Genres'}
              onChange={(event) => setGenre(event.target.value === 'All Genres' ? '' : event.target.value)}
            >
              {genres.map((genreOption) => (
                <option key={genreOption} value={genreOption} className="bg-slatePanel">
                  {genreOption}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="filter-label">Availability</span>
            <select
              className="filter-box h-[46px] appearance-none"
              value={availability}
              onChange={(event) => setAvailability(event.target.value)}
            >
              {availabilityOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-slatePanel">
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </section>

        {error && <p className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}

        {loading ? (
          <div className="grid min-h-[220px] place-items-center rounded-xl border border-white/5 bg-slatePanel">
            <p className="animate-pulse text-slate-300">Loading books...</p>
          </div>
        ) : (
          <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onView={(selected) => navigate(`/books/${selected.id}`)}
                onEdit={openEditModal}
                onDelete={setDeleteTarget}
              />
            ))}
          </section>
        )}

        {!loading && books.length === 0 && (
          <div className="mt-5 rounded-xl border border-white/10 bg-slatePanel/80 px-4 py-8 text-center text-slate-300">
            No hay libros con los filtros actuales.
          </div>
        )}

        <p className="mt-6 text-sm text-slate-400">{meta.total} libro(s) encontrados.</p>
      </section>

      <BookFormModal
        open={modalOpen}
        mode={modalMode}
        initialValues={activeBook}
        onClose={() => setModalOpen(false)}
        onSubmit={onSaveBook}
        loading={saving}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Eliminar libro"
        message={`Esta accion eliminara "${deleteTarget?.title || ''}" de forma permanente.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={onDeleteBook}
        loading={saving}
      />
    </main>
  );
}
