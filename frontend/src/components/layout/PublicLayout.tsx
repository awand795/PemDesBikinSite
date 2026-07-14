import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { Menu, X, ChevronRight, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import clsx from 'clsx';

const navLinks = [
  { path: '/', label: 'Beranda' },
  { path: '/profil', label: 'Profil Desa' },
  { path: '/berita', label: 'Berita' },
  { path: '/galeri', label: 'Galeri' },
  { path: '/layanan-surat', label: 'Ajukan Surat' },
  { path: '/layanan-surat/status', label: 'Cek Status' },
  { path: '/pengaduan', label: 'Pengaduan' },
  { path: '/kontak', label: 'Kontak' },
];

export default function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const { data: profile } = useQuery({
    queryKey: ['public-profile'],
    queryFn: async () => {
      const { data } = await api.get('/public/profile');
      return data.data;
    },
    staleTime: 60000,
  });

  const logoInitial = profile?.nama_desa?.charAt(0)?.toUpperCase() || 'D';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* ===== Navbar ===== */}
      <nav
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass shadow-sm border-b border-slate-200/50'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className={clsx(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
                scrolled
                  ? 'bg-gradient-to-br from-primary-500 to-primary-700 shadow-md shadow-primary-500/20'
                  : 'bg-white/20 backdrop-blur-sm border border-white/30'
              )}>
                {profile?.logo_path ? (
                  <img src={profile.logo_path} alt="" className="w-6 h-6 object-contain" />
                ) : (
                  <span className="text-white font-bold text-lg">{logoInitial}</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className={clsx(
                  'font-display font-bold text-lg leading-tight transition-colors duration-300',
                  scrolled ? 'text-slate-900' : 'text-white'
                )}>
                  {profile?.nama_desa || 'Desa Kita'}
                </span>
                <span className={clsx(
                  'text-[10px] font-medium tracking-wider uppercase transition-colors duration-300',
                  scrolled ? 'text-primary-600' : 'text-white/70'
                )}>
                  {profile?.kecamatan ? `Kec. ${profile.kecamatan}` : 'Pemerintahan Desa'}
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={clsx(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    location.pathname === link.path
                      ? scrolled
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-white bg-white/15'
                      : scrolled
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="ml-3 pl-3 border-l border-slate-200/30">
                <Link
                  to="/admin/login"
                  className={clsx(
                    'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm',
                    scrolled
                      ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-md hover:shadow-primary-500/20 hover:-translate-y-0.5'
                      : 'bg-white/15 backdrop-blur-sm text-white border border-white/30 hover:bg-white/25'
                  )}
                >
                  <ExternalLink className="w-4 h-4" />
                  Panel Admin
                </Link>
              </div>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={clsx(
                'lg:hidden p-2 rounded-lg transition-colors',
                scrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-white hover:bg-white/10'
              )}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div
          className={clsx(
            'lg:hidden transition-all duration-300 overflow-hidden',
            mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className={clsx(
            'px-4 py-4 space-y-1 border-t',
            scrolled ? 'bg-white border-slate-200' : 'glass-dark border-white/10'
          )}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={clsx(
                  'block px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                  location.pathname === link.path
                    ? scrolled
                      ? 'bg-primary-50 text-primary-600'
                      : 'bg-white/15 text-white'
                    : scrolled
                      ? 'text-slate-600 hover:bg-slate-50'
                      : 'text-white/80 hover:bg-white/10'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                to="/admin/login"
                className={clsx(
                  'flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
                  scrolled
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md'
                    : 'bg-white/20 backdrop-blur-sm text-white border border-white/30'
                )}
              >
                <ExternalLink className="w-4 h-4" />
                Panel Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== Main Content ===== */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ===== Footer Premium ===== */}
      <footer className="relative bg-slate-900 text-slate-300 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                  <span className="text-white font-bold text-lg">{logoInitial}</span>
                </div>
                <div>
                  <span className="font-display font-bold text-white text-lg">
                    {profile?.nama_desa || 'Desa Kita'}
                  </span>
                </div>
              </Link>
              <p className="text-sm text-slate-400 leading-relaxed">
                Sistem Informasi Desa untuk pelayanan publik yang lebih cepat, transparan, dan akuntabel.
              </p>
              {/* Social placeholder */}
              <div className="flex gap-3 mt-5">
                {['facebook', 'instagram', 'youtube'].map((s) => (
                  <div
                    key={s}
                    className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-primary-600 flex items-center justify-center transition-colors duration-200 cursor-pointer"
                  >
                    <span className="text-xs text-slate-400 uppercase font-bold">{s.charAt(0)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-display font-semibold text-white mb-4">Layanan</h3>
              <ul className="space-y-2.5">
                {[
                  { label: 'Ajukan Surat', to: '/layanan-surat' },
                  { label: 'Cek Status Surat', to: '/layanan-surat/status' },
                  { label: 'Kirim Pengaduan', to: '/pengaduan' },
                  { label: 'Lihat Berita', to: '/berita' },
                  { label: 'Galeri Foto', to: '/galeri' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors group"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-primary-500 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Information */}
            <div>
              <h3 className="font-display font-semibold text-white mb-4">Informasi</h3>
              <ul className="space-y-2.5">
                {[
                  { label: 'Profil Desa', to: '/profil' },
                  { label: 'Berita Desa', to: '/berita' },
                  { label: 'Galeri', to: '/galeri' },
                  { label: 'Kontak', to: '/kontak' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors group"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-primary-500 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-display font-semibold text-white mb-4">Kontak</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                  <span className="text-slate-400">
                    {profile?.alamat_kantor || 'Kantor Desa'}
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-primary-500 shrink-0" />
                  <a href={`mailto:${profile?.email || 'info@desa.id'}`} className="text-slate-400 hover:text-white transition-colors">
                    {profile?.email || 'info@desa.id'}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-primary-500 shrink-0" />
                  <a href={`tel:${profile?.telp || ''}`} className="text-slate-400 hover:text-white transition-colors">
                    {profile?.telp || '(021) 12345678'}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-slate-500">
              &copy; {new Date().getFullYear()} {profile?.nama_desa || 'PemDesBikinSite'}. All rights reserved.
            </p>
            <p className="text-slate-600">
              Dibangun dengan ❤️ untuk pelayanan publik
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
