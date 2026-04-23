import { Pencil, Trash2, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { deleteManagedUser, getManagedUsers, updateManagedUser } from '../api/auth';
import Loader from './Loader';

const formatDate = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('es-CO');
};

export default function UsersAdminModal({ open, onClose, theme = 'dark' }) {
  const isLight = theme === 'light';
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState('');
  const [emailDraft, setEmailDraft] = useState('');

  const currentEditingUser = useMemo(
    () => users.find((user) => user.id === editingId) || null,
    [users, editingId],
  );

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getManagedUsers();
      setUsers(response);
    } catch (requestError) {
      const message = requestError?.response?.data?.message || 'No se pudieron cargar los usuarios.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    loadUsers();
  }, [open]);

  const startEdit = (user) => {
    setEditingId(user.id);
    setEmailDraft(user.email);
    setError('');
  };

  const cancelEdit = () => {
    setEditingId('');
    setEmailDraft('');
  };

  const saveEdit = async () => {
    if (!editingId || !emailDraft.trim()) return;

    setSaving(true);
    setError('');
    try {
      const updated = await updateManagedUser(editingId, { email: emailDraft.trim() });
      setUsers((prev) => prev.map((user) => (user.id === editingId ? updated : user)));
      cancelEdit();
    } catch (requestError) {
      const message = requestError?.response?.data?.message || 'No se pudo actualizar el usuario.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (userId) => {
    setSaving(true);
    setError('');
    try {
      await deleteManagedUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      if (editingId === userId) {
        cancelEdit();
      }
    } catch (requestError) {
      const message = requestError?.response?.data?.message || 'No se pudo eliminar el usuario.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <section
        className={`w-full max-w-3xl rounded-2xl border p-5 shadow-2xl ${
          isLight ? 'border-slate-200 bg-white text-slate-800 shadow-slate-300/60' : 'border-white/10 bg-[#0c2348] text-slate-200 shadow-black/50'
        }`}
      >
        <header className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-electric/20 text-electric">
              <Users size={18} />
            </span>
            <div>
              <h2 className={`text-xl font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Gestionar usuarios</h2>
              <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Solo se muestran usuarios con rol user</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-white/20 text-slate-200 hover:bg-white/10'
            }`}
          >
            Cerrar
          </button>
        </header>

        {error && (
          <p className={`mb-4 rounded-lg border px-3 py-2 text-sm ${isLight ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-rose-500/30 bg-rose-500/10 text-rose-300'}`}>
            {error}
          </p>
        )}

        {loading ? (
          <div className={`grid min-h-[200px] place-items-center rounded-xl border ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-[#0a1c3e]'}`}>
            <Loader theme={theme} size="lg" label="Cargando usuarios..." />
          </div>
        ) : users.length === 0 ? (
          <div className={`rounded-xl border px-4 py-8 text-center ${isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-white/10 bg-[#0a1c3e] text-slate-300'}`}>
            No hay usuarios para gestionar.
          </div>
        ) : (
          <div className={`overflow-hidden rounded-xl border ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className={isLight ? 'bg-slate-50 text-slate-600' : 'bg-[#112a52] text-slate-300'}>
                  <tr>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Creado</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const isEditing = editingId === user.id;
                    return (
                      <tr key={user.id} className={isLight ? 'border-t border-slate-100' : 'border-t border-white/5'}>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              value={emailDraft}
                              onChange={(event) => setEmailDraft(event.target.value)}
                              className={`w-full rounded-md border px-3 py-1.5 text-sm ${
                                isLight ? 'border-slate-300 bg-white text-slate-700' : 'border-white/15 bg-[#0a1c3e] text-slate-100'
                              }`}
                            />
                          ) : (
                            <span>{user.email}</span>
                          )}
                        </td>
                        <td className={`px-4 py-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{formatDate(user.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={saveEdit}
                                  disabled={saving}
                                  className="rounded-md bg-electric px-3 py-1.5 text-xs font-medium text-white hover:bg-electricSoft disabled:opacity-60"
                                >
                                  Guardar
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  disabled={saving}
                                  className={`rounded-md border px-3 py-1.5 text-xs ${
                                    isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-white/20 text-slate-200 hover:bg-white/10'
                                  }`}
                                >
                                  Cancelar
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEdit(user)}
                                  disabled={saving || Boolean(currentEditingUser)}
                                  className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition ${
                                    isLight ? 'text-blue-600 hover:bg-blue-100' : 'text-electricSoft hover:bg-electric/20'
                                  } disabled:opacity-50`}
                                  title="Editar usuario"
                                >
                                  <Pencil size={15} />
                                </button>
                                <button
                                  onClick={() => deleteUser(user.id)}
                                  disabled={saving || Boolean(currentEditingUser)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-rose-400 transition hover:bg-rose-500/20 disabled:opacity-50"
                                  title="Eliminar usuario"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
