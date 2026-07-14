// ========== User & Auth ==========
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar_path?: string;
  is_active: boolean;
  roles: { name: string }[];
  permissions: { name: string }[];
  created_at: string;
  updated_at: string;
}

// ========== Master Data ==========
export interface Dusun {
  id: number;
  nama_dusun: string;
  nama_kepala_dusun?: string;
  families?: Family[];
}

export interface Family {
  id: number;
  no_kk: string;
  nama_kepala_keluarga: string;
  alamat: string;
  dusun_id?: number;
  dusun?: Dusun;
  rt?: string;
  rw?: string;
  kode_pos?: string;
  residents?: Resident[];
  created_at: string;
}

export interface Resident {
  id: number;
  family_id?: number;
  family?: Family;
  nik: string;
  nama_lengkap: string;
  jenis_kelamin: 'L' | 'P';
  tempat_lahir?: string;
  tanggal_lahir?: string;
  agama?: string;
  pendidikan_terakhir?: string;
  pekerjaan?: string;
  status_perkawinan?: string;
  status_dalam_keluarga?: string;
  golongan_darah?: string;
  kewarganegaraan?: string;
  no_hp?: string;
  foto_path?: string;
  is_active: boolean;
  created_at: string;
}

// ========== Letters ==========
export interface LetterType {
  id: number;
  kode: string;
  nama: string;
  deskripsi?: string;
  persyaratan?: string[];
  estimasi_hari?: number;
  is_active: boolean;
}

export type LetterStatus = 'menunggu' | 'diproses' | 'disetujui' | 'ditolak' | 'selesai';

export interface LetterRequest {
  id: number;
  nomor_pengajuan: string;
  letter_type_id: number;
  letter_type?: LetterType;
  resident_id?: number;
  resident?: Resident;
  nama_pemohon?: string;
  nik_pemohon?: string;
  keperluan?: string;
  data_tambahan?: Record<string, any>;
  lampiran?: string[];
  status: LetterStatus;
  catatan_admin?: string;
  nomor_surat?: string;
  tanggal_pengajuan: string;
  tanggal_diproses?: string;
  diproses_oleh?: number;
  diprosesOleh?: User;
}

// ========== News & Announcements ==========
export interface News {
  id: number;
  judul: string;
  slug: string;
  thumbnail_path?: string;
  konten: string;
  kategori?: string;
  status: 'draft' | 'published';
  published_at?: string;
  author_id: number;
  author?: User;
  views_count: number;
  created_at: string;
}

export interface Announcement {
  id: number;
  judul: string;
  konten: string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  is_active: boolean;
  created_at: string;
}

// ========== Complaints ==========
export type ComplaintStatus = 'baru' | 'diproses' | 'selesai' | 'ditolak';

export interface Complaint {
  id: number;
  kode_tiket: string;
  nama_pelapor?: string;
  no_hp?: string;
  kategori: string;
  isi_pengaduan: string;
  lokasi?: string;
  foto?: string[];
  status: ComplaintStatus;
  tanggapan?: string;
  ditangani_oleh?: number;
  ditanganiOleh?: User;
  created_at: string;
}

// ========== Desa Profile ==========
export interface DesaProfile {
  id: number;
  nama_desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kode_pos?: string;
  alamat_kantor?: string;
  nama_kepala_desa?: string;
  telp?: string;
  email?: string;
  logo_path?: string;
  visi?: string;
  misi?: string;
  sejarah?: string;
  luas_wilayah?: number;
  jumlah_dusun?: number;
  koordinat_lat?: string;
  koordinat_lng?: string;
}

// ========== Dashboard ==========
export interface DashboardStats {
  total_penduduk: number;
  total_kk: number;
  surat_bulan_ini: number;
  surat_menunggu: number;
  pengaduan_baru: number;
  berita_published: number;
}

export interface DemografiData {
  total: number;
  laki_laki: number;
  perempuan: number;
  per_dusun: Record<string, number>;
  pekerjaan: Record<string, number>;
}

export interface DashboardData {
  stats: DashboardStats;
  demografi: DemografiData;
  surat_trend: Record<string, number>;
}

// ========== API Pagination ==========
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}
