import { z } from 'zod';

export const residentSchema = z.object({
  nik: z.string().length(16, 'NIK harus 16 digit').regex(/^\d{16}$/, 'NIK harus berupa angka 16 digit'),
  nama_lengkap: z.string().min(1, 'Nama lengkap wajib diisi').max(255, 'Maksimal 255 karakter'),
  jenis_kelamin: z.enum(['L', 'P'], { message: 'Jenis kelamin wajib dipilih' }),
  tempat_lahir: z.string().max(255).optional().or(z.literal('')),
  tanggal_lahir: z.string().optional().or(z.literal('')),
  agama: z.string().max(50).optional().or(z.literal('')),
  pendidikan_terakhir: z.string().max(100).optional().or(z.literal('')),
  pekerjaan: z.string().max(100).optional().or(z.literal('')),
  status_perkawinan: z.string().max(50).optional().or(z.literal('')),
  no_hp: z.string().max(20).optional().or(z.literal('')),
  family_id: z.string().optional().or(z.literal('')),
});

export type ResidentFormData = z.infer<typeof residentSchema>;

export const familySchema = z.object({
  no_kk: z.string().min(1, 'No. KK wajib diisi').max(16, 'Maksimal 16 digit'),
  nama_kepala_keluarga: z.string().min(1, 'Nama kepala keluarga wajib diisi').max(255),
  dusun_id: z.string().min(1, 'Dusun wajib dipilih'),
  alamat: z.string().optional().or(z.literal('')),
  rt: z.string().max(3, 'Maksimal 3 karakter').optional().or(z.literal('')),
  rw: z.string().max(3, 'Maksimal 3 karakter').optional().or(z.literal('')),
  is_active: z.boolean().optional(),
});

export type FamilyFormData = z.infer<typeof familySchema>;

export const penggunaSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(255),
  email: z.string().email('Format email tidak valid').min(1, 'Email wajib diisi'),
  password: z.string().min(8, 'Minimal 8 karakter').optional().or(z.literal('')),
  password_confirmation: z.string().optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  role: z.string().min(1, 'Role wajib dipilih'),
  is_active: z.boolean().optional(),
}).refine((data) => {
  if (!data.password && !data.password_confirmation) return true;
  return data.password === data.password_confirmation;
}, {
  message: 'Konfirmasi password tidak cocok',
  path: ['password_confirmation'],
});

export type PenggunaFormData = z.infer<typeof penggunaSchema>;
