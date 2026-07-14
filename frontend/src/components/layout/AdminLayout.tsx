import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import {
  LayoutDashboard, Users, UserCircle, FileText, Newspaper,
  Megaphone, MessageSquare, Image, Settings, LogOut, Menu,
  X, Home, Shield, FileStack, ChevronLeft, ExternalLink, Bell,
} from 'lucide-react';
import clsx from 'clsx';
import ThemeToggle from '@/components/ui/ThemeToggle';
import NotificationBell from '@/components/ui/NotificationBell';

function hasPermission(userPermissions: string[], required: string | string[]): boolean {
  if (!userPermissions || userPermissions.length === 0) return false;
  const needed = Array.isArray(required) ? required : [required];
  return needed.some((p) => userPermissions.includes(p));
}

interface MenuItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  permissions?: string | string[];
}

const menuGroups: { label: string; items: MenuItem[] }[] = [
  {
    label: 'Utama',
    items: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, permissions: 'dashboard.view' },
    ],
  },
  {
    label: 'Kependudukan',
    items: [
      { path: '/admin/penduduk', label: 'Data Penduduk', icon: Users, permissions: 'residents.view' },
      { path: '/admin/keluarga', label: 'Kartu Keluarga', icon: UserCircle, permissions: 'families.view' },
    ],
  },
  {
    label: 'Pelayanan',
    items: [
      { path: '/admin/surat/permohonan', label: 'Surat Menyurat', icon: FileText, permissions: 'letters.view' },
      { path: '/admin/surat/jenis-surat', label: 'Jenis Surat', icon: FileStack, permissions: 'letter_types.view' },
    ],
  },
  {
    label: 'Konten',
    items: [
      { path: '/admin/berita', label: 'Berita', icon: Newspaper, permissions: 'news.view' },
      { path: '/admin/pengumuman', label: 'Pengumuman', icon: Megaphone, permissions: 'announcements.view' },
      { path: '/admin/galeri', label: 'Galeri', icon: Image, permissions: 'gallery.view' },
    ],
  },
  {
    label: 'Lainnya',
    items: [
      { path: '/admin/pengaduan', label: 'Pengaduan', icon: MessageSquare, permissions: 'complaints.view' },
      { path: '/admin/pengguna', label: 'Pengguna', icon: Shield, permissions: 'users.view' },
      { path: '/admin/pengaturan', label: 'Pengaturan', icon: Settings, permissions: ['settings.view', 'desa_profile.view'] },
    ],
  },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const userPermissions = user?.permissions?.map((p: any) => typeof p === 'string' ? p : p.name) || [];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin/dashboard') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex bg-page">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ===== Sidebar ===== */}
      <aside
        className={clsx(
          'fixed lg:static inset-y-0 left-0 z-50 bg-[#1c1917] dark:bg-black flex flex-col transition-all duration-300 ease-in-out',
          collapsed ? 'w-16' : 'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className={clsx(
          'flex items-center border-b border-[#292524] h-16 lg:h-20 shrink-0',
          collapsed ? 'justify-center px-2' : 'justify-between px-5'
        )}>
          <Link to="/admin/dashboard" className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shrink-0">
              <Home className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-display font-bold text-white text-base">PemDes</span>
                <span className="text-[10px] text-[#a8a29e] tracking-wider uppercase">Administrator</span>
              </div>
            )}
          </Link>
          {!collapsed && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-[#a8a29e] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 space-y-1">
          {menuGroups.map((group) => {
            const visibleItems = group.items.filter((item) =>
              !item.permissions || hasPermission(userPermissions, item.permissions)
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.label} className="mb-4">
                {!collapsed && (
                  <p className="px-3 mb-1 text-[10px] font-semibold text-[#a8a29e] uppercase tracking-widest">
                    {group.label}
                  </p>
                )}
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={clsx(
                          'flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200',
                          collapsed ? 'justify-center px-0 py-2.5 mx-auto w-10' : 'px-3 py-2.5',
                          active
                            ? 'bg-primary-600/20 text-primary-400'
                            : 'text-[#a8a29e] hover:bg-[#292524] hover:text-white'
                        )}
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center h-10 border-t border-[#292524] text-[#a8a29e] hover:text-white hover:bg-[#292524]/30 transition-colors"
        >
          <ChevronLeft className={clsx('w-4 h-4 transition-transform duration-300', collapsed && 'rotate-180')} />
        </button>

        {/* User info */}
        <div className={clsx('border-t border-[#292524] p-3', collapsed && 'flex flex-col items-center')}>
          <div className={clsx('flex items-center gap-3', collapsed ? 'flex-col' : '')}>
            <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-[#a8a29e] truncate">{user?.roles?.[0]?.name || '-'}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <div className="flex gap-1 mt-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-[#a8a29e] hover:text-red-400 hover:bg-red-500/10 transition-colors w-full"
              >
                <LogOut className="w-3.5 h-3.5" />
                Keluar
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ===== Main Area ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ===== Top Header ===== */}
        <header
          className="sticky top-0 z-30 h-16 lg:h-20 flex items-center justify-between px-4 lg:px-8 bg-surface border-b border-border backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg transition-colors text-fg-secondary"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span
              className="hidden sm:block text-sm font-medium capitalize text-fg"
            >
              {location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-fg-secondary"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Lihat Website
            </Link>
            <NotificationBell />
          </div>
        </header>

        {/* ===== Page Content ===== */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="mx-auto max-w-7xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
