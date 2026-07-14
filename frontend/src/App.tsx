import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import AdminLayout from '@/components/layout/AdminLayout';
import PublicLayout from '@/components/layout/PublicLayout';
import Dashboard from '@/features/dashboard/Dashboard';
import Login from '@/features/auth/Login';
import ForgotPassword from '@/features/auth/ForgotPassword';
import ResidentsList from '@/features/residents/ResidentsList';
import ResidentForm from '@/features/residents/ResidentForm';
import FamiliesList from '@/features/families/FamiliesList';
import FamilyForm from '@/features/families/FamilyForm';
import SuratList from '@/features/letters/SuratList';
import SuratDetail from '@/features/letters/SuratDetail';
import BeritaList from '@/features/news/BeritaList';
import BeritaForm from '@/features/news/BeritaForm';
import PengumumanList from '@/features/announcements/PengumumanList';
import PengaduanList from '@/features/complaints/PengaduanList';
import PenggunaList from '@/features/users/PenggunaList';
import PenggunaForm from '@/features/users/PenggunaForm';
import JenisSuratList from '@/features/letter-types/JenisSuratList';
import JenisSuratForm from '@/features/letter-types/JenisSuratForm';
import GaleriList from '@/features/gallery/GaleriList';
import Pengaturan from '@/features/settings/Pengaturan';

// Public Pages
import Beranda from '@/features/public/Beranda';
import ProfilDesa from '@/features/public/ProfilDesa';
import BeritaPublik from '@/features/public/BeritaPublik';
import BeritaDetail from '@/features/public/BeritaDetail';
import LayananSurat from '@/features/public/LayananSurat';
import CekStatusSurat from '@/features/public/CekStatusSurat';
import PengaduanPublik from '@/features/public/PengaduanPublik';
import Kontak from '@/features/public/Kontak';
import GaleriPublik from '@/features/public/GaleriPublik';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

function App() {
  const { fetchUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated, fetchUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Website */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Beranda />} />
            <Route path="/profil" element={<ProfilDesa />} />
            <Route path="/berita" element={<BeritaPublik />} />
            <Route path="/berita/:slug" element={<BeritaDetail />} />
            <Route path="/galeri" element={<GaleriPublik />} />
            <Route path="/layanan-surat" element={<LayananSurat />} />
            <Route path="/layanan-surat/status" element={<CekStatusSurat />} />
            <Route path="/pengaduan" element={<PengaduanPublik />} />
            <Route path="/kontak" element={<Kontak />} />
          </Route>

          {/* Admin Panel */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="penduduk" element={<ResidentsList />} />
            <Route path="penduduk/tambah" element={<ResidentForm />} />
            <Route path="penduduk/:id" element={<ResidentForm />} />
            <Route path="keluarga" element={<FamiliesList />} />
            <Route path="keluarga/tambah" element={<FamilyForm />} />
            <Route path="keluarga/:id" element={<FamilyForm />} />
            <Route path="surat/permohonan" element={<SuratList />} />
            <Route path="surat/permohonan/:id" element={<SuratDetail />} />
            <Route path="surat/jenis-surat" element={<JenisSuratList />} />
            <Route path="surat/jenis-surat/tambah" element={<JenisSuratForm />} />
            <Route path="surat/jenis-surat/:id" element={<JenisSuratForm />} />
            <Route path="berita" element={<BeritaList />} />
            <Route path="berita/tambah" element={<BeritaForm />} />
            <Route path="berita/:id" element={<BeritaForm />} />
            <Route path="pengumuman" element={<PengumumanList />} />
            <Route path="pengaduan" element={<PengaduanList />} />
            <Route path="galeri" element={<GaleriList />} />
            <Route path="pengguna" element={<PenggunaList />} />
            <Route path="pengguna/tambah" element={<PenggunaForm />} />
            <Route path="pengguna/:id" element={<PenggunaForm />} />
            <Route path="pengaturan" element={<Pengaturan />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
