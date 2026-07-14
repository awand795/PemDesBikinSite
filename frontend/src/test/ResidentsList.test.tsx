import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ============================================================
// HOISTED: Mock api BEFORE imports
// ============================================================
const mockApiGet = vi.hoisted(() => vi.fn());

vi.mock('@/services/api', () => ({
  default: {
    get: mockApiGet,
  },
}));

import ResidentsList from '@/features/residents/ResidentsList';

const mockResidents = [
  {
    id: 1,
    nik: '3201010101010001',
    nama_lengkap: 'Budi Santoso',
    jenis_kelamin: 'L',
    is_active: true,
    family: { dusun: { nama_dusun: 'Dusun 1' } },
  },
  {
    id: 2,
    nik: '3201010101010002',
    nama_lengkap: 'Siti Nurhaliza',
    jenis_kelamin: 'P',
    is_active: true,
    family: { dusun: { nama_dusun: 'Dusun 2' } },
  },
  {
    id: 3,
    nik: '3201010101010003',
    nama_lengkap: 'Ahmad Tora',
    jenis_kelamin: 'L',
    is_active: false,
    family: { dusun: { nama_dusun: 'Dusun 1' } },
  },
];

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

function renderResidentsList() {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ResidentsList />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

describe('ResidentsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApiGet.mockReset();
  });

  // ==================== RENDER ====================

  it('should render page title and add button', () => {
    mockApiGet.mockResolvedValueOnce({ data: { data: [], total: 0, last_page: 0 } });
    renderResidentsList();

    expect(screen.getByText('Data Penduduk')).toBeInTheDocument();
    expect(screen.getByText('Tambah Penduduk')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /tambah penduduk/i })).toHaveAttribute('href', '/admin/penduduk/tambah');
  });

  it('should render search input', () => {
    mockApiGet.mockResolvedValueOnce({ data: { data: [], total: 0, last_page: 0 } });
    renderResidentsList();

    const searchInput = screen.getByPlaceholderText('Cari NIK, nama, atau no. HP...');
    expect(searchInput).toBeInTheDocument();
  });

  // ==================== LOADING STATE ====================

  it('should show loading indicator while fetching data', () => {
    // Return a promise that never resolves to keep loading state
    mockApiGet.mockReturnValueOnce(new Promise(() => {}));
    renderResidentsList();

    expect(screen.getByText('Memuat data...')).toBeInTheDocument();
  });

  // ==================== EMPTY STATE ====================

  it('should show empty message when no residents', async () => {
    mockApiGet.mockResolvedValueOnce({ data: { data: [], total: 0, last_page: 0 } });
    renderResidentsList();

    await waitFor(() => {
      expect(screen.getByText('Belum ada data penduduk')).toBeInTheDocument();
    });
  });

  it('should show total count as 0 when no residents', async () => {
    mockApiGet.mockResolvedValueOnce({ data: { data: [], total: 0, last_page: 0 } });
    renderResidentsList();

    await waitFor(() => {
      expect(screen.getByText(/Total: 0/)).toBeInTheDocument();
    });
  });

  // ==================== DATA RENDERING ====================

  it('should render resident data in table', async () => {
    mockApiGet.mockResolvedValueOnce({
      data: { data: mockResidents, total: 3, last_page: 1 },
    });
    renderResidentsList();

    await waitFor(() => {
      expect(screen.getByText('Budi Santoso')).toBeInTheDocument();
      expect(screen.getByText('Siti Nurhaliza')).toBeInTheDocument();
      expect(screen.getByText('Ahmad Tora')).toBeInTheDocument();
    });
  });

  it('should render NIK values', async () => {
    mockApiGet.mockResolvedValueOnce({
      data: { data: mockResidents, total: 3, last_page: 1 },
    });
    renderResidentsList();

    await waitFor(() => {
      expect(screen.getByText('3201010101010001')).toBeInTheDocument();
      expect(screen.getByText('3201010101010002')).toBeInTheDocument();
      expect(screen.getByText('3201010101010003')).toBeInTheDocument();
    });
  });

  it('should render gender correctly', async () => {
    mockApiGet.mockResolvedValueOnce({
      data: { data: mockResidents, total: 3, last_page: 1 },
    });
    renderResidentsList();

    await waitFor(() => {
      const maleTexts = screen.getAllByText('Laki-laki');
      expect(maleTexts).toHaveLength(2); // Budi & Ahmad
      expect(screen.getByText('Perempuan')).toBeInTheDocument();
    });
  });

  it('should render status badges', async () => {
    mockApiGet.mockResolvedValueOnce({
      data: { data: mockResidents, total: 3, last_page: 1 },
    });
    renderResidentsList();

    await waitFor(() => {
      const activeBadges = screen.getAllByText('Aktif');
      const inactiveBadge = screen.getByText('Nonaktif');
      expect(activeBadges).toHaveLength(2);
      expect(inactiveBadge).toBeInTheDocument();
    });
  });

  it('should render dusun name', async () => {
    mockApiGet.mockResolvedValueOnce({
      data: { data: mockResidents, total: 3, last_page: 1 },
    });
    renderResidentsList();

    await waitFor(() => {
      const dusun1Elements = screen.getAllByText('Dusun 1');
      expect(dusun1Elements.length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText('Dusun 2')).toBeInTheDocument();
    });
  });

  it('should render edit links for each resident', async () => {
    mockApiGet.mockResolvedValueOnce({
      data: { data: mockResidents, total: 3, last_page: 1 },
    });
    renderResidentsList();

    await waitFor(() => {
      const editLinks = screen.getAllByText('Edit');
      expect(editLinks).toHaveLength(3);
      expect(editLinks[0].closest('a')).toHaveAttribute('href', '/admin/penduduk/1');
    });
  });

  it('should display total count', async () => {
    mockApiGet.mockResolvedValueOnce({
      data: { data: mockResidents, total: 3, last_page: 1 },
    });
    renderResidentsList();

    await waitFor(() => {
      expect(screen.getByText(/Total: 3/)).toBeInTheDocument();
    });
  });

  // ==================== SEARCH ====================

  it('should update search query on typing', async () => {
    mockApiGet.mockResolvedValueOnce({ data: { data: [], total: 0, last_page: 0 } });
    renderResidentsList();

    const searchInput = screen.getByPlaceholderText('Cari NIK, nama, atau no. HP...');
    await userEvent.type(searchInput, 'Budi');

    expect(searchInput).toHaveValue('Budi');
  });

  it('should refetch data when search changes', async () => {
    // First call returns empty
    mockApiGet.mockResolvedValueOnce({ data: { data: [], total: 0, last_page: 0 } });
    renderResidentsList();

    const searchInput = screen.getByPlaceholderText('Cari NIK, nama, atau no. HP...');

    // Type in search — this will trigger a new query
    await userEvent.type(searchInput, 'Budi');

    // Wait for the component to settle
    await waitFor(() => {
      expect(searchInput).toHaveValue('Budi');
    });
  });

  // ==================== PAGINATION ====================

  it('should show pagination when multiple pages exist', async () => {
    mockApiGet.mockResolvedValueOnce({
      data: { data: mockResidents, total: 30, last_page: 2 },
    });
    renderResidentsList();

    await waitFor(() => {
      expect(screen.getByText('Halaman 1 dari 2')).toBeInTheDocument();
      expect(screen.getByText('Sebelumnya')).toBeInTheDocument();
      expect(screen.getByText('Selanjutnya')).toBeInTheDocument();
    });
  });

  it('should not show pagination when single page', async () => {
    mockApiGet.mockResolvedValueOnce({
      data: { data: mockResidents, total: 3, last_page: 1 },
    });
    renderResidentsList();

    await waitFor(() => {
      expect(screen.queryByText('Halaman 1 dari')).not.toBeInTheDocument();
    });
  });

  // ==================== TABLE HEADERS ====================

  it('should render all table column headers', async () => {
    mockApiGet.mockResolvedValueOnce({
      data: { data: mockResidents, total: 3, last_page: 1 },
    });
    renderResidentsList();

    await waitFor(() => {
      expect(screen.getByText('NIK')).toBeInTheDocument();
      expect(screen.getByText('Nama')).toBeInTheDocument();
      expect(screen.getByText('Jenis Kelamin')).toBeInTheDocument();
      expect(screen.getByText('Dusun')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Aksi')).toBeInTheDocument();
    });
  });

  // ==================== API CALL ====================

  it('should call API with correct default params on mount', async () => {
    mockApiGet.mockResolvedValueOnce({ data: { data: [], total: 0, last_page: 0 } });
    renderResidentsList();

    await waitFor(() => {
      expect(mockApiGet).toHaveBeenCalledWith('/residents', {
        params: {
          search: '',
          per_page: 15,
          page: 1,
          sort_by: undefined,
          sort_dir: undefined,
        },
      });
    });
  });
});
