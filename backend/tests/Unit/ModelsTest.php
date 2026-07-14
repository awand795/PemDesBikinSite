<?php

namespace Tests\Unit;

use App\Models\ActivityLog;
use App\Models\Announcement;
use App\Models\Complaint;
use App\Models\DesaProfile;
use App\Models\Dusun;
use App\Models\Family;
use App\Models\Gallery;
use App\Models\LetterRequest;
use App\Models\LetterType;
use App\Models\News;
use App\Models\Resident;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModelsTest extends TestCase
{
    use RefreshDatabase;

    // ============= User =============

    public function test_user_has_fillable_attributes(): void
    {
        $user = User::factory()->create([
            'is_active' => true,
        ]);

        $this->assertNotNull($user->name);
        $this->assertNotNull($user->email);
        $this->assertTrue($user->is_active);
    }

    public function test_user_password_is_hashed(): void
    {
        $user = User::factory()->create(['password' => 'password']);

        $this->assertNotSame('password', $user->password);
        $this->assertTrue(\Illuminate\Support\Facades\Hash::check('password', $user->password));
    }

    public function test_user_casts(): void
    {
        $user = User::factory()->create([
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        $this->assertTrue($user->is_active);
        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $user->email_verified_at);
    }

    // ============= Resident =============

    public function test_resident_has_fillable_attributes(): void
    {
        $resident = Resident::create([
            'nik' => '3201010101010001',
            'nama_lengkap' => 'Budi Santoso',
            'jenis_kelamin' => 'L',
            'tempat_lahir' => 'Jakarta',
            'tanggal_lahir' => '1990-01-15',
        ]);

        $this->assertNotNull($resident->nik);
        $this->assertSame('Budi Santoso', $resident->nama_lengkap);
    }

    public function test_resident_tanggal_lahir_cast(): void
    {
        $resident = Resident::create([
            'nik' => '3201010101010002',
            'nama_lengkap' => 'Siti Nurhaliza',
            'jenis_kelamin' => 'P',
            'tanggal_lahir' => '1995-06-20',
        ]);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $resident->tanggal_lahir);
        $this->assertSame('1995-06-20', $resident->tanggal_lahir->format('Y-m-d'));
    }

    public function test_resident_is_active_cast(): void
    {
        $resident = Resident::create([
            'nik' => '3201010101010003',
            'nama_lengkap' => 'Active Resident',
            'jenis_kelamin' => 'L',
            'is_active' => true,
        ]);

        $this->assertIsBool($resident->is_active);
        $this->assertTrue($resident->is_active);
    }

    public function test_resident_get_umur_attribute(): void
    {
        $resident = Resident::create([
            'nik' => '3201010101010004',
            'nama_lengkap' => 'Age Test',
            'jenis_kelamin' => 'L',
            'tanggal_lahir' => now()->subYears(25),
        ]);

        $this->assertNotNull($resident->umur);
        $this->assertSame(25, $resident->umur);
    }

    public function test_resident_umur_null_when_no_tanggal_lahir(): void
    {
        $resident = Resident::create([
            'nik' => '3201010101010005',
            'nama_lengkap' => 'No DOB',
            'jenis_kelamin' => 'P',
        ]);

        $this->assertNull($resident->umur);
    }

    public function test_resident_belongs_to_family(): void
    {
        $dusun = Dusun::create(['nama_dusun' => 'Dusun 1']);
        $family = Family::create([
            'no_kk' => '3201010101010001',
            'nama_kepala_keluarga' => 'Kepala Keluarga',
            'alamat' => 'Alamat',
            'dusun_id' => $dusun->id,
        ]);
        $resident = Resident::create([
            'family_id' => $family->id,
            'nik' => '3201010101010006',
            'nama_lengkap' => 'Family Member',
            'jenis_kelamin' => 'L',
        ]);

        $this->assertInstanceOf(Family::class, $resident->family);
        $this->assertSame($family->id, $resident->family->id);
    }

    // ============= Family =============

    public function test_family_has_fillable_attributes(): void
    {
        $dusun = Dusun::create(['nama_dusun' => 'Dusun 2']);
        $family = Family::create([
            'no_kk' => '3201010101010002',
            'nama_kepala_keluarga' => 'Kepala Test',
            'alamat' => 'Jl. Contoh No. 1',
            'dusun_id' => $dusun->id,
            'rt' => '001',
            'rw' => '002',
        ]);

        $this->assertSame('3201010101010002', $family->no_kk);
        $this->assertSame('Kepala Test', $family->nama_kepala_keluarga);
    }

    public function test_family_belongs_to_dusun(): void
    {
        $dusun = Dusun::create(['nama_dusun' => 'Dusun 3']);
        $family = Family::create([
            'no_kk' => '3201010101010003',
            'nama_kepala_keluarga' => 'Kepala Test 2',
            'alamat' => 'Alamat Test',
            'dusun_id' => $dusun->id,
        ]);

        $this->assertInstanceOf(Dusun::class, $family->dusun);
        $this->assertSame($dusun->id, $family->dusun->id);
    }

    public function test_family_has_many_residents(): void
    {
        $dusun = Dusun::create(['nama_dusun' => 'Dusun 4']);
        $family = Family::create([
            'no_kk' => '3201010101010004',
            'nama_kepala_keluarga' => 'Kepala Test 3',
            'alamat' => 'Alamat Test',
            'dusun_id' => $dusun->id,
        ]);
        Resident::create(['family_id' => $family->id, 'nik' => '3201010101010007', 'nama_lengkap' => 'Anggota 1', 'jenis_kelamin' => 'L']);
        Resident::create(['family_id' => $family->id, 'nik' => '3201010101010008', 'nama_lengkap' => 'Anggota 2', 'jenis_kelamin' => 'P']);

        $this->assertCount(2, $family->residents);
    }

    // ============= Dusun =============

    public function test_dusun_has_fillable_attributes(): void
    {
        $dusun = Dusun::create([
            'nama_dusun' => 'Dusun Cinta',
            'nama_kepala_dusun' => 'Pak Kadus',
        ]);

        $this->assertSame('Dusun Cinta', $dusun->nama_dusun);
        $this->assertSame('Pak Kadus', $dusun->nama_kepala_dusun);
    }

    public function test_dusun_has_many_families(): void
    {
        $dusun = Dusun::create(['nama_dusun' => 'Dusun 5']);
        Family::create(['no_kk' => '3201010101010005', 'nama_kepala_keluarga' => 'Test', 'alamat' => 'Alamat', 'dusun_id' => $dusun->id]);
        Family::create(['no_kk' => '3201010101010006', 'nama_kepala_keluarga' => 'Test 2', 'alamat' => 'Alamat 2', 'dusun_id' => $dusun->id]);

        $this->assertCount(2, $dusun->families);
    }

    // ============= LetterType =============

    public function test_letter_type_has_fillable_attributes(): void
    {
        $letterType = LetterType::create([
            'kode' => 'SKTM',
            'nama' => 'Surat Keterangan Tidak Mampu',
            'deskripsi' => 'Untuk warga kurang mampu',
            'persyaratan' => ['KTP', 'KK'],
            'estimasi_hari' => 2,
        ]);

        $this->assertSame('SKTM', $letterType->kode);
        $this->assertIsArray($letterType->persyaratan);
        $this->assertCount(2, $letterType->persyaratan);
    }

    public function test_letter_type_is_active_default(): void
    {
        $letterType = LetterType::create([
            'kode' => 'SKD',
            'nama' => 'Surat Keterangan Domisili',
            'is_active' => true,
        ]);

        $this->assertTrue($letterType->is_active);
    }

    public function test_letter_type_has_many_requests(): void
    {
        $letterType = LetterType::create(['kode' => 'SKU', 'nama' => 'Surat Keterangan Usaha']);

        $this->assertCount(0, $letterType->letterRequests);
    }

    // ============= LetterRequest =============

    public function test_letter_request_has_fillable_attributes(): void
    {
        $letterType = LetterType::create(['kode' => 'SKTM', 'nama' => 'SKTM']);
        $letterRequest = LetterRequest::create([
            'nomor_pengajuan' => '20260714-ABC123',
            'letter_type_id' => $letterType->id,
            'nama_pemohon' => 'John Doe',
            'nik_pemohon' => '3201010101010001',
            'keperluan' => 'Untuk melamar kerja',
            'status' => 'menunggu',
            'tanggal_pengajuan' => now(),
        ]);

        $this->assertSame('John Doe', $letterRequest->nama_pemohon);
        $this->assertSame('menunggu', $letterRequest->status);
    }

    public function test_letter_request_data_tambahan_cast(): void
    {
        $letterType = LetterType::create(['kode' => 'SKTM', 'nama' => 'SKTM']);
        $letterRequest = LetterRequest::create([
            'nomor_pengajuan' => '20260714-DEF456',
            'letter_type_id' => $letterType->id,
            'nama_pemohon' => 'Jane Doe',
            'nik_pemohon' => '3201010101010002',
            'data_tambahan' => ['ayah' => 'Ayah Jane', 'ibu' => 'Ibu Jane'],
            'status' => 'menunggu',
            'tanggal_pengajuan' => now(),
        ]);

        $this->assertIsArray($letterRequest->data_tambahan);
        $this->assertSame('Ayah Jane', $letterRequest->data_tambahan['ayah']);
    }

    public function test_letter_request_belongs_to_letter_type(): void
    {
        $letterType = LetterType::create(['kode' => 'SKTM', 'nama' => 'SKTM']);
        $letterRequest = LetterRequest::create([
            'nomor_pengajuan' => '20260714-GHI789',
            'letter_type_id' => $letterType->id,
            'nama_pemohon' => 'Test',
            'nik_pemohon' => '3201010101010003',
            'status' => 'menunggu',
            'tanggal_pengajuan' => now(),
        ]);

        $this->assertInstanceOf(LetterType::class, $letterRequest->letterType);
        $this->assertSame($letterType->id, $letterRequest->letterType->id);
    }

    // ============= News =============

    public function test_news_has_fillable_attributes(): void
    {
        $user = User::factory()->create();
        $news = News::create([
            'judul' => 'Berita Desa',
            'slug' => 'berita-desa',
            'konten' => 'Konten berita desa',
            'author_id' => $user->id,
            'status' => 'draft',
        ]);

        $this->assertSame('Berita Desa', $news->judul);
        $this->assertSame('draft', $news->status);
    }

    public function test_news_belongs_to_author(): void
    {
        $user = User::factory()->create();
        $news = News::create([
            'judul' => 'Berita Author',
            'slug' => 'berita-author',
            'konten' => 'Konten',
            'author_id' => $user->id,
            'status' => 'published',
            'published_at' => now(),
        ]);

        $this->assertInstanceOf(User::class, $news->author);
        $this->assertSame($user->id, $news->author->id);
    }

    public function test_news_views_count_defaults_to_zero(): void
    {
        $user = User::factory()->create();
        $news = News::create([
            'judul' => 'Berita Views',
            'slug' => 'berita-views',
            'konten' => 'Konten',
            'author_id' => $user->id,
            'views_count' => 0,
        ]);

        $this->assertSame(0, $news->views_count);
    }

    public function test_news_published_at_cast(): void
    {
        $user = User::factory()->create();
        $now = now();
        $news = News::create([
            'judul' => 'Berita Published',
            'slug' => 'berita-published',
            'konten' => 'Konten',
            'author_id' => $user->id,
            'status' => 'published',
            'published_at' => $now,
        ]);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $news->published_at);
    }

    // ============= Announcement =============

    public function test_announcement_has_fillable_attributes(): void
    {
        $announcement = Announcement::create([
            'judul' => 'Pengumuman Penting',
            'konten' => 'Isi pengumuman',
            'tanggal_mulai' => '2026-07-14',
            'tanggal_selesai' => '2026-07-21',
            'is_active' => true,
        ]);

        $this->assertSame('Pengumuman Penting', $announcement->judul);
        $this->assertTrue($announcement->is_active);
    }

    public function test_announcement_date_casts(): void
    {
        $announcement = Announcement::create([
            'judul' => 'Pengumuman',
            'konten' => 'Konten',
            'tanggal_mulai' => '2026-07-14',
            'tanggal_selesai' => '2026-07-21',
        ]);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $announcement->tanggal_mulai);
        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $announcement->tanggal_selesai);
    }

    // ============= Complaint =============

    public function test_complaint_has_fillable_attributes(): void
    {
        $complaint = Complaint::create([
            'kode_tiket' => 'ADP-20260714-ABCD',
            'nama_pelapor' => 'Pelapor',
            'kategori' => 'Infrastruktur',
            'isi_pengaduan' => 'Jalan rusak',
            'status' => 'baru',
        ]);

        $this->assertSame('Pelapor', $complaint->nama_pelapor);
        $this->assertSame('baru', $complaint->status);
    }

    public function test_complaint_foto_cast(): void
    {
        $complaint = Complaint::create([
            'kode_tiket' => 'ADP-20260714-EFGH',
            'kategori' => 'Kebersihan',
            'isi_pengaduan' => 'Sampah menumpuk',
            'foto' => ['foto1.jpg', 'foto2.jpg'],
            'status' => 'baru',
        ]);

        $this->assertIsArray($complaint->foto);
        $this->assertCount(2, $complaint->foto);
    }

    // ============= Gallery =============

    public function test_gallery_has_fillable_attributes(): void
    {
        $gallery = Gallery::create([
            'judul' => 'Foto Kegiatan',
            'foto_path' => 'galleries/foto.jpg',
            'kategori' => 'Kegiatan',
            'tanggal' => '2026-07-14',
        ]);

        $this->assertSame('Foto Kegiatan', $gallery->judul);
        $this->assertSame('galleries/foto.jpg', $gallery->foto_path);
    }

    public function test_gallery_tanggal_cast(): void
    {
        $gallery = Gallery::create([
            'judul' => 'Test',
            'foto_path' => 'test.jpg',
            'tanggal' => '2026-07-14',
        ]);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $gallery->tanggal);
    }

    // ============= DesaProfile =============

    public function test_desa_profile_has_fillable_attributes(): void
    {
        $profile = DesaProfile::create([
            'nama_desa' => 'Desa Maju',
            'kecamatan' => 'Kecamatan Sejahtera',
            'kabupaten' => 'Kabupaten Bahagia',
            'provinsi' => 'Provinsi Sentosa',
        ]);

        $this->assertSame('Desa Maju', $profile->nama_desa);
        $this->assertSame('Kecamatan Sejahtera', $profile->kecamatan);
    }

    // ============= Setting =============

    public function test_setting_create_and_get_value(): void
    {
        Setting::setValue('app_name', 'Sistem Informasi Desa');

        $value = Setting::getValue('app_name');
        $this->assertSame('Sistem Informasi Desa', $value);
    }

    public function test_setting_update_value(): void
    {
        Setting::setValue('app_name', 'Old Name');
        Setting::setValue('app_name', 'New Name');

        $value = Setting::getValue('app_name');
        $this->assertSame('New Name', $value);
    }

    public function test_setting_get_default_when_not_found(): void
    {
        $value = Setting::getValue('nonexistent_key', 'default_value');
        $this->assertSame('default_value', $value);
    }

    public function test_setting_get_null_when_not_found_and_no_default(): void
    {
        $value = Setting::getValue('nonexistent_key');
        $this->assertNull($value);
    }

    // ============= ActivityLog =============

    public function test_activity_log_has_fillable_attributes(): void
    {
        $log = ActivityLog::create([
            'action' => 'test_action',
            'description' => 'Testing activity log',
        ]);

        $this->assertSame('test_action', $log->action);
        $this->assertSame('Testing activity log', $log->description);
    }

    public function test_activity_log_belongs_to_user(): void
    {
        $user = User::factory()->create();
        $log = ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'login',
            'description' => 'User login',
        ]);

        $this->assertInstanceOf(User::class, $log->user);
        $this->assertSame($user->id, $log->user->id);
    }

    public function test_activity_log_old_new_values_cast_to_array(): void
    {
        $log = ActivityLog::create([
            'action' => 'update',
            'description' => 'Updated data',
            'old_values' => ['name' => 'Old'],
            'new_values' => ['name' => 'New'],
        ]);

        $this->assertIsArray($log->old_values);
        $this->assertIsArray($log->new_values);
        $this->assertSame('Old', $log->old_values['name']);
        $this->assertSame('New', $log->new_values['name']);
    }
}
