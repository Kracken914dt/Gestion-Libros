import { Eye, Pencil, Trash2 } from 'lucide-react';

const formatDate = (dateValue) => {
  if (!dateValue) return null;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('es-CO');
};

export default function BookCard({ book, onView, onEdit, onDelete, canManage = true, theme = 'dark' }) {
  const isLight = theme === 'light';

  return (
    <article
      className={`overflow-hidden rounded-xl border transition hover:-translate-y-0.5 ${
        isLight
          ? 'border-slate-200 bg-white shadow-lg shadow-slate-200/70 hover:border-blue-400/70'
          : 'border-white/5 bg-slatePanel shadow-lg shadow-black/20 hover:border-electric/40'
      }`}
    >
      <div className="flex min-h-[162px] gap-4 p-4">
        <div className={`h-[128px] w-[86px] overflow-hidden rounded-md ${isLight ? 'bg-slate-200/80' : 'bg-slate-700/50'}`}>
          {book.coverImageUrl ? (
            <img src={book.coverImageUrl} alt={book.title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-[linear-gradient(135deg,#2a3e61_25%,#324a71_25%,#324a71_50%,#2a3e61_50%,#2a3e61_75%,#324a71_75%,#324a71_100%)] bg-[length:24px_24px]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className={`truncate text-xl font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{book.title}</h3>
          <p className={`mt-1 truncate ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{book.author}</p>
          <p className={`mt-2 line-clamp-1 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{book.genre || 'General'}</p>
          <p className={`mt-1 text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{formatDate(book.publicationDate) || 'Sin fecha'}</p>

          <span
            className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
              book.isAvailable
                ? isLight
                  ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300'
                  : 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-300/30'
                : isLight
                  ? 'bg-rose-100 text-rose-700 ring-1 ring-rose-300'
                  : 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-300/30'
            }`}
          >
            {book.isAvailable ? 'Available' : 'Not Available'}
          </span>
        </div>
      </div>

      <div
        className={`flex items-center ${canManage ? 'justify-end gap-2' : 'justify-start'} border-t px-4 py-3 ${
          isLight ? 'border-slate-200 bg-slate-50' : 'border-white/5 bg-[#0f2446]'
        }`}
      >
        <button
          className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition ${
            isLight ? 'text-blue-600 hover:bg-blue-100' : 'text-electricSoft hover:bg-electric/20'
          }`}
          onClick={() => onView(book)}
          aria-label="View book"
        >
          <Eye size={16} />
        </button>
        {canManage && (
          <>
            <button
              className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition ${
                isLight ? 'text-blue-600 hover:bg-blue-100' : 'text-electricSoft hover:bg-electric/20'
              }`}
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
          </>
        )}
      </div>
    </article>
  );
}
