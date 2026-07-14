import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { LogIn, Building2, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data?.errors?.email?.[0] || 'Login gagal. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-slate-900">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-primary-600/20 to-transparent" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>

      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/20 mb-8">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            PemDes<span className="gradient-text">BikinSite</span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Panel administrasi untuk mengelola data penduduk, layanan surat, berita, pengaduan, dan informasi desa lainnya.
          </p>
          <div className="mt-10 space-y-4">
            {[
              'Kelola data penduduk dan keluarga',
              'Layanan surat online terintegrasi',
              'Manajemen berita dan pengumuman',
              'Sistem pengaduan masyarakat',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300">
                <div className="w-5 h-5 rounded-full bg-primary-500/20 border border-primary-500/40 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary-500" />
                </div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-10 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Website
          </Link>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
        {/* Mobile back button */}
        <Link
          to="/"
          className="absolute top-6 left-4 lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="w-full max-w-md animate-fade-in-up">
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-4 shadow-lg shadow-primary-500/20">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white">PemDesBikinSite</h1>
            <p className="text-slate-400 text-sm mt-1">Panel Admin Desa</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-lg font-display font-semibold text-white">Masuk</h2>
              <p className="text-sm text-slate-400 mt-1">Masuk ke panel administrasi desa</p>
            </div>

            {error && (
              <div className="bg-danger-500/10 border border-danger-500/20 text-danger-400 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-danger-500 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/50 transition-all"
                  placeholder="admin@desa.id"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/50 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all duration-200"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogIn className="w-5 h-5" />
                )}
                {isLoading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <Link
                to="/admin/forgot-password"
                className="text-sm text-slate-400 hover:text-primary-400 transition-colors"
              >
                Lupa password?
              </Link>
            </div>

            {import.meta.env.DEV && (
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-xs text-slate-500 text-center">
                  Demo: admin@desa.id / password
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
