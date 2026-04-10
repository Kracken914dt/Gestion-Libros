import { Eye, Pencil, Trash2 } from 'lucide-react';

const formatDate = (dateValue) => {
  if (!dateValue) return null;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('es-CO');
};

export default function BookCard({ book, onView, onEdit, onDelete }) {
  return (
    <article className="overflow-hidden rounded-xl border border-white/5 bg-slatePanel shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-electric/40">
      <div className="flex min-h-[162px] gap-4 p-4">
        <div className="h-[128px] w-[86px] overflow-hidden rounded-md bg-slate-700/50">
          {book.coverImageUrl ? (
            <img src={book.coverImageUrl} alt={book.title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-[linear-gradient(135deg,#2a3e61_25%,#324a71_25%,#324a71_50%,#2a3e61_50%,#2a3e61_75%,#324a71_75%,#324a71_100%)] bg-[length:24px_24px]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-xl font-semibold text-slate-100">{book.title}</h3>
          <p className="mt-1 truncate text-slate-300">{book.author}</p>
          <p className="mt-2 line-clamp-1 text-sm text-slate-400">{book.genre || 'General'}</p>
          <p className="mt-1 text-sm text-slate-400">{formatDate(book.publicationDate) || 'Sin fecha'}</p>

          <span
            className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
              book.isAvailable
                ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-300/30'
                : 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-300/30'
            }`}
          >
            {book.isAvailable ? 'Available' : 'Not Available'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-white/5 bg-[#0f2446] px-4 py-3">
        <button
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-electricSoft transition hover:bg-electric/20"
          onClick={() => onView(book)}
          aria-label="View book"
        >
          <Eye size={16} />
        </button>
        <button
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-electricSoft transition hover:bg-electric/20"
          onClick={() => onEdit(book)}
          aria-label="Edit book"
        >
          <Pencil size={16} />
        </button>
        <button
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-rose-400 transition hover:bg-rose-500/20"
          onClick={() => onDelete(book)}
          aria-label="Delete book"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}
