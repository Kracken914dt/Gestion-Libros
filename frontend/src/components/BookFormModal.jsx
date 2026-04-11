import { useEffect, useMemo, useState } from 'react';

const emptyForm = {
  title: '',
  author: '',
  coverImageUrl: '',
  description: '',
  publicationDate: '',
  genre: '',
  publisher: '',
  isbn: '',
  isAvailable: true,
};

const GENRE_OPTIONS = [
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Thriller',
  'Romance',
  'Science Fiction',
  'Fantasy',
  'Biography',
  'History',
  'Self-Help',
  'Business',
  'Technology',
  'Poetry',
  'Drama',
  'Horror',
  'Adventure',
  'Children',
  'Other',
];

export default function BookFormModal({ open, mode, initialValues, onClose, onSubmit, loading, theme = 'dark' }) {
  const isLight = theme === 'light';
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const title = useMemo(() => (mode === 'edit' ? 'Edit Book' : 'Add New Book'), [mode]);

  useEffect(() => {
    if (!open) return;

    if (initialValues) {
      setForm({
        title: initialValues.title || '',
        author: initialValues.author || '',
        coverImageUrl: initialValues.coverImageUrl || '',
        description: initialValues.description || '',
        publicationDate: initialValues.publicationDate
          ? new Date(initialValues.publicationDate).toISOString().slice(0, 10)
          : '',
        genre: initialValues.genre || '',
        publisher: initialValues.publisher || '',
        isbn: initialValues.isbn || '',
        isAvailable: Boolean(initialValues.isAvailable),
      });
      return;
    }

    setForm(emptyForm);
  }, [open, initialValues]);

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.title.trim() || !form.author.trim()) {
      setError('Title y Author son obligatorios.');
      return;
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      author: form.author.trim(),
      genre: form.genre.trim() || undefined,
      publisher: form.publisher.trim() || undefined,
      coverImageUrl: form.coverImageUrl.trim() || undefined,
      description: form.description.trim() || undefined,
      isbn: form.isbn.trim() || undefined,
      publicationDate: form.publicationDate || undefined,
    };

    await onSubmit(payload);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4">
      <div
        className={`mx-auto mt-10 w-full max-w-3xl rounded-2xl border p-6 shadow-2xl ${
          isLight ? 'border-slate-200 bg-white shadow-slate-300/60' : 'border-white/10 bg-[#0d2347] shadow-black/50'
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className={`text-2xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{title}</h3>
          <button
            onClick={onClose}
            className={`rounded-md border px-3 py-1 text-sm ${
              isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-white/20 text-slate-200 hover:bg-white/10'
            }`}
          >
            Close
          </button>
        </div>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="field">
            <span>Title *</span>
            <input name="title" value={form.title} onChange={onChange} required />
          </label>

          <label className="field">
            <span>Author *</span>
            <input name="author" value={form.author} onChange={onChange} required />
          </label>

          <label className="field md:col-span-2">
            <span>Cover image URL</span>
            <input name="coverImageUrl" value={form.coverImageUrl} onChange={onChange} placeholder="https://..." />
          </label>

          <label className="field md:col-span-2">
            <span>Description</span>
            <textarea name="description" value={form.description} onChange={onChange} rows={4} />
          </label>

          <label className="field">
            <span>Genre</span>
            <select name="genre" value={form.genre} onChange={onChange}>
              <option value="">Select genre...</option>
              {GENRE_OPTIONS.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Publication date</span>
            <input type="date" name="publicationDate" value={form.publicationDate} onChange={onChange} />
          </label>

          <label className="field">
            <span>Publisher</span>
            <input name="publisher" value={form.publisher} onChange={onChange} />
          </label>

          <label className="field">
            <span>ISBN</span>
            <input name="isbn" value={form.isbn} onChange={onChange} />
          </label>

          <label className={`flex items-center gap-2 text-sm md:col-span-2 ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
            <input
              type="checkbox"
              name="isAvailable"
              checked={form.isAvailable}
              onChange={onChange}
              className="h-4 w-4 rounded border-white/20 bg-transparent"
            />
            Available
          </label>

          {error && (
            <p className={`text-sm md:col-span-2 ${isLight ? 'text-rose-600' : 'text-rose-300'}`}>{error}</p>
          )}

          <div className="mt-2 flex justify-end gap-3 md:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className={`rounded-lg border px-4 py-2 text-sm ${
                isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-white/20 text-slate-200 hover:bg-white/10'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-electric px-5 py-2 text-sm font-medium text-white transition hover:bg-electricSoft disabled:opacity-60"
            >
              {loading ? 'Guardando...' : mode === 'edit' ? 'Save changes' : 'Create book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
