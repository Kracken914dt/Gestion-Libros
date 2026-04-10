export default function ConfirmDialog({ open, title, message, onCancel, onConfirm, loading }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#10274e] p-6 shadow-2xl shadow-black/50">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-400 disabled:opacity-60"
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
