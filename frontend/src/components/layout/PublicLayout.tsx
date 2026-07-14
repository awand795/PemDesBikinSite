import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';

const navLinks = [
  { path: '/', label: 'Beranda' },
  { path: '/profil', label: 'Profil Desa' },
  { path: '/berita', label: 'Berita' },
  { path: '/layanan-surat', label: 'Ajukan Surat' },
  { path: '/layanan-surat/status', label: 'Cek Status' },
  { path: '/pengaduan', label: 'Pengaduan' },
  { path: '/kontak', label: 'Kontak' },
];

export default function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PD</span>
              </div>
              <span className="font-bold text-xl text-gray-800">Desa Kita</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={clsx(
                    'text-sm font-medium transition-colors',
                    location.pathname === link.path
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/admin/login"
                className="ml-4 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                Panel Admin
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    'block px-3 py-2 rounded-lg text-sm font-medium',
                    location.pathname === link.path
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 text-center mt-2"
              >
                Panel Admin
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-3">Tentang Desa</h3>
              <p className="text-sm leading-relaxed">
                Sistem Informasi Desa untuk pelayanan publik yang lebih cepat,
                transparan, dan akuntabel.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Link Cepat</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/layanan-surat" className="hover:text-white transition-colors">Ajukan Surat</Link></li>
                <li><Link to="/layanan-surat/status" className="hover:text-white transition-colors">Cek Status Surat</Link></li>
                <li><Link to="/pengaduan" className="hover:text-white transition-colors">Kirim Pengaduan</Link></li>
                <li><Link to="/berita" className="hover:text-white transition-colors">Berita Desa</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Kontak</h3>
              <ul className="space-y-2 text-sm">
                <li>Kantor Desa</li>
                <li>Email: info@desa.id</li>
                <li>Telp: (021) 12345678</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} PemDesBikinSite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
