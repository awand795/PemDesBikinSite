import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/services/api';
import { ArrowLeft, Save, Shield, Eye, EyeOff } from 'lucide-react';

export default function PenggunaForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    role: '',
    is_active: true,
  });
  const [showPassword, setShowPassword] = useState(false);

  // Load user data for edit
  const { data: userData } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const { data } = await api.get(`/users/${id}`);
      return data.data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (userData) {
      setForm({
        name: userData.name || '',
        email: userData.email || '',
        password: '',
        password_confirmation: '',
        phone: userData.phone || '',
        role: userData.roles?.[0]?.name || '',
        is_active: userData.is_active ?? true,
      });
    }
  }, [userData]);

  // Load all available roles
  const { data: rolesData } = useQuery({
    queryKey: ['user-roles'],
    queryFn: async () => {
      const { data } = await api.get('/users/roles/list');
      return data.data as string[];
    },
  });

  const roles = rolesData || [];

  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post('/users', payload),
    onSuccess: () => navigate('/admin/pengguna'),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: any) => api.put(`/users/${id}`, payload),
    onSuccess: () => navigate('/admin/pengguna'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Record<string, any> = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      is_active: form.is_active,
      role: form.role,
    };

    // Only send password if it's filled in (for edit mode, password is optional)
    if (form.password) {
      payload.password = form.password;
      payload.password_confirmation = form.password_confirmation;
    }

    if (isEdit) {
      updateMutation.mutate(payload);
    } else {
      payload.password = form.password;
      createMutation.mutate(payload);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;
  const errorMsg = (error as any)?.response?.data?.errors;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/pengguna')} className="text-text-muted hover:text-text-secondary">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {isEdit ? 'Edit' : 'Tambah'} Pengguna
          </h1>
          <p className="text-text-secondary text-sm">
            {isEdit ? 'Ubah data dan role pengguna' : 'Buat akun baru untuk staf desa'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border p-6 space-y-5">
        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-1">Nama Lengkap *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              placeholder="Nama pengguna"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-1">Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              placeholder="email@desa.id"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">No. HP</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Role / Jabatan *
            </label>
            <select
              required
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              <option value="">Pilih role...</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div className="md:col-span-2 border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-text-primary mb-3">
              <Shield className="w-4 h-4 inline mr-1" />
              {isEdit ? 'Password (kosongkan jika tidak diubah)' : 'Password'}
            </p>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-text-primary mb-1">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required={!isEdit}
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Min. 8 karakter"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Konfirmasi Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              required={!isEdit}
              value={form.password_confirmation}
              onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              placeholder="Ulangi password"
            />
          </div>

          {/* Status */}
          <div className="md:col-span-2 flex items-center gap-3 pt-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-surface after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              <span className="ml-3 text-sm font-medium text-text-primary">Akun Aktif</span>
            </label>
          </div>
        </div>

        {/* Error Messages */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
              {Object.values(errorMsg).flat().map((msg: any, i: number) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        {error && !errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {(error as any)?.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.'}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/pengguna')}
            className="px-6 py-2.5 border border-border text-text-primary font-medium rounded-lg hover:bg-bg-subtle transition-colors"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
