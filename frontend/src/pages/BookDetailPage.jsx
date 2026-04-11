import { ArrowLeft, BookText, CalendarDays, Globe, Pen, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteBook, getBookById, updateBook } from '../api/books';
import BookFormModal from '../components/BookFormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';
import { isAdminUser } from '../utils/auth';

const formatLongDate = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const canManageBooks = isAdminUser();

  const fetchBook = async () => {
    if (!id) return;
    setLoading(true);

    try {
      const response = await getBookById(id);
      setBook(response);
      setError('');
    } catch {
      setError('No se pudo cargar el libro.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const handleEdit = async (payload) => {
    if (!book?.id) return;

    setSaving(true);
    try {
      const updated = await updateBook(book.id, payload);
      setBook(updated);
      setEditOpen(false);
      setError('');
    } catch {
      setError('No se pudo actualizar el libro.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!book?.id) return;

    setSaving(true);
    try {
      await deleteBook(book.id);
      navigate('/books');
    } catch {
      setError('No se pudo eliminar el libro.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-hero-grid text-slate-300">
        <Loader theme="dark" size="lg" label="Cargando detalles..." />
      </main>
    );
  }

  if (error || !book) {
    return (
      <main className="grid min-h-screen place-items-center bg-hero-grid px-4">
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-rose-300">
          <p>{error || 'Libro no encontrado.'}</p>
          <button
            onClick={() => navigate('/books')}
            className="mt-4 rounded-lg border border-white/20 px-4 py-2 text-slate-100"
          >
            Volver
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-hero-grid px-4 py-8 md:px-8">
      <section className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <button onClick={() => navigate('/books')} className="text-sm text-slate-300 hover:text-slate-100">
            <span className="inline-flex items-center gap-2">
              <ArrowLeft size={14} />
              Back to Books
            </span>
          </button>

          {canManageBooks && (
            <div className="flex gap-2">
              <button
                onClick={() => setEditOpen(true)}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm text-slate-100 hover:bg-white/10"
              >
                Edit
              </button>
              <button
                onClick={() => setConfirmOpen(true)}
                className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-400"
              >
                Delete
              </button>
            </div>
          )}
        </header>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside>
            <div className="overflow-hidden rounded-xl border border-white/10 bg-slatePanel">
              {book.coverImageUrl ? (
                <img src={book.coverImageUrl} alt={book.title} className="h-[360px] w-full object-cover" />
              ) : (
                <div className="h-[360px] w-full bg-[linear-gradient(135deg,#2a3e61_25%,#324a71_25%,#324a71_50%,#2a3e61_50%,#2a3e61_75%,#324a71_75%,#324a71_100%)] bg-[length:24px_24px]" />
              )}
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-slatePanel p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Availability</p>
              <p className={`mt-2 text-lg font-semibold ${book.isAvailable ? 'text-emerald-300' : 'text-rose-300'}`}>
                {book.isAvailable ? 'Available' : 'Not Available'}
              </p>
            </div>
          </aside>

          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electricSoft">{book.genre || 'General'}</p>
            <h1 className="mt-2 text-5xl font-bold tracking-tight text-white">{book.title}</h1>
            <p className="mt-2 text-3xl text-slate-300">by {book.author}</p>

            <article className="detail-card mt-7">
              <h2>
                <BookText size={18} />
                Synopsis
              </h2>
              <p>{book.description || 'No description available for this book.'}</p>
            </article>

            <article className="detail-card mt-6">
              <h2>
                <CalendarDays size={18} />
                Publishing Details
              </h2>

              <dl className="detail-grid">
                <div>
                  <dt>ISBN</dt>
                  <dd>{book.isbn || 'N/A'}</dd>
                </div>
                <div>
                  <dt>Publisher</dt>
                  <dd>{book.publisher || 'N/A'}</dd>
                </div>
                <div>
                  <dt>Publication Date</dt>
                  <dd>{formatLongDate(book.publicationDate)}</dd>
                </div>
                <div>
                  <dt>Pages</dt>
                  <dd>249</dd>
                </div>
                <div>
                  <dt>Language</dt>
                  <dd>English</dd>
                </div>
                <div>
                  <dt>Format</dt>
                  <dd>Hardcover</dd>
                </div>
              </dl>
            </article>

            <article className="detail-card mt-6">
              <h2>
                <Globe size={18} />
                System Metadata
              </h2>

              <dl className="detail-grid">
                <div>
                  <dt>Added By</dt>
                  <dd>Admin User</dd>
                </div>
                <div>
                  <dt>Record ID</dt>
                  <dd>{book.id}</dd>
                </div>
                <div>
                  <dt>Created</dt>
                  <dd>{formatLongDate(book.createdAt)}</dd>
                </div>
                <div>
                  <dt>Last Updated</dt>
                  <dd>{formatLongDate(book.updatedAt)}</dd>
                </div>
              </dl>
            </article>
          </section>
        </div>
      </section>

      {canManageBooks && (
        <>
          <BookFormModal
            open={editOpen}
            mode="edit"
            initialValues={book}
            onClose={() => setEditOpen(false)}
            onSubmit={handleEdit}
            loading={saving}
          />

          <ConfirmDialog
            open={confirmOpen}
            title="Delete book"
            message="This action cannot be undone. Do you want to continue?"
            onCancel={() => setConfirmOpen(false)}
            onConfirm={handleDelete}
            loading={saving}
          />
        </>
      )}
    </main>
  );
}
