import Loader from './Loader';

export default function ConfirmDialog({ open, title, message, onCancel, onConfirm, loading, theme = 'dark' }) {
  const isLight = theme === 'light';

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div
        className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
          isLight ? 'border-slate-200 bg-white shadow-slate-300/70' : 'border-white/10 bg-[#10274e] shadow-black/50'
        }`}
      >
        <h3 className={`text-xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{title}</h3>
        <p className={`mt-3 text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className={`rounded-lg border px-4 py-2 text-sm transition ${
              isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-white/20 text-slate-200 hover:bg-white/10'
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex min-w-[120px] items-center justify-center rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-400 disabled:opacity-60"
          >
            {loading ? <Loader inline size="sm" label="Eliminando..." theme="dark" className="text-white" /> : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
