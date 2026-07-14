import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { Menu, X, ChevronRight, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import ThemeToggle from '@/components/ui/ThemeToggle';

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
  const isHome = location.pathname === '/';

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
    <div className="min-h-screen flex flex-col" className="bg-page">
      {/* ===== Navbar ===== */}
      <nav
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/90 dark:bg-[#1c1917]/90 backdrop-blur-xl shadow-sm border-b border-[var(--color-border)]'
            : isHome ? 'bg-transparent' : 'bg-white dark:bg-[#1c1917] border-b border-[var(--color-border)]'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className={clsx(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
                scrolled || !isHome
                  ? 'bg-primary-600 shadow-sm'
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
                  scrolled || !isHome ? 'text-[var(--color-fg)]' : 'text-white'
                )}>
                  {profile?.nama_desa || 'Desa Kita'}
                </span>
                <span className={clsx(
                  'text-[10px] font-medium tracking-wider uppercase transition-colors duration-300',
                  scrolled || !isHome ? 'text-primary-600' : 'text-white/70'
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
                      ? scrolled || !isHome
                        ? 'text-primary-600 bg-primary-50 dark:bg-primary-600/10'
                        : 'text-white bg-white/15'
                      : scrolled || !isHome
                        ? 'text-[var(--color-fg-secondary)] hover:text-[var(--color-fg)] hover:bg-[var(--color-surface-hover)]'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="ml-2">
                <ThemeToggle />
              </div>
              <div className="ml-1 pl-2 border-l border-[var(--color-border)]">
                <Link
                  to="/admin/login"
                  className={clsx(
                    'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                    scrolled || !isHome
                      ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
                      : 'bg-white/15 backdrop-blur-sm text-white border border-white/30 hover:bg-white/25'
                  )}
                >
                  <ExternalLink className="w-4 h-4" />
                  Panel Admin
                </Link>
              </div>
            </div>

            {/* Mobile right section */}
            <div className="flex items-center gap-1 lg:hidden">
              <ThemeToggle />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={clsx(
                  'p-2 rounded-lg transition-colors',
                  scrolled || !isHome ? 'text-[var(--color-fg-secondary)] hover:bg-[var(--color-surface-hover)]' : 'text-white hover:bg-white/10'
                )}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
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
            scrolled || !isHome
              ? 'bg-white dark:bg-[#1c1917] border-[var(--color-border)]'
              : 'bg-[#1c1917]/90 backdrop-blur-xl border-white/10'
          )}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={clsx(
                  'block px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                  location.pathname === link.path
                    ? scrolled || !isHome
                      ? 'bg-primary-50 dark:bg-primary-600/10 text-primary-600'
                      : 'bg-white/15 text-white'
                    : scrolled || !isHome
                      ? 'text-[var(--color-fg-secondary)] hover:bg-[var(--color-surface-hover)]'
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
                  scrolled || !isHome
                    ? 'bg-primary-600 text-white shadow-sm'
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

      {/* ===== Footer ===== */}
      <footer className="relative bg-[#1c1917] dark:bg-black text-[#a8a29e] overflow-hidden border-t border-[#292524]">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{logoInitial}</span>
                </div>
                <span className="font-display font-bold text-white text-lg">
                  {profile?.nama_desa || 'Desa Kita'}
                </span>
              </Link>
              <p className="text-sm text-[#a8a29e] leading-relaxed">
                Sistem Informasi Desa untuk pelayanan publik yang lebih cepat, transparan, dan akuntabel.
              </p>
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
                    <Link to={item.to} className="text-sm text-[#a8a29e] hover:text-white transition-colors">
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
                    <Link to={item.to} className="text-sm text-[#a8a29e] hover:text-white transition-colors">
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
                  <span className="text-[#a8a29e]">{profile?.alamat_kantor || 'Kantor Desa'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-primary-500 shrink-0" />
                  <a href={`mailto:${profile?.email || 'info@desa.id'}`} className="text-[#a8a29e] hover:text-white transition-colors">
                    {profile?.email || 'info@desa.id'}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-primary-500 shrink-0" />
                  <a href={`tel:${profile?.telp || ''}`} className="text-[#a8a29e] hover:text-white transition-colors">
                    {profile?.telp || '(021) 12345678'}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#292524] flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-[#78716c]">
              &copy; {new Date().getFullYear()} {profile?.nama_desa || 'PemDesBikinSite'}
            </p>
            <p className="text-[#57534e]">
              Dibangun untuk pelayanan publik
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
