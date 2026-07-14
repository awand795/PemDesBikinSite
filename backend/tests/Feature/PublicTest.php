<?php

namespace Tests\Feature;

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
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PublicTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    // ============= Profile =============

    public function test_get_public_profile(): void
    {
        DesaProfile::create([
            'nama_desa' => 'Desa Test',
            'kecamatan' => 'Kec Test',
            'kabupaten' => 'Kab Test',
            'provinsi' => 'Prov Test',
        ]);

        $response = $this->getJson('/api/public/profile');

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['nama_desa', 'kecamatan', 'kabupaten', 'provinsi']]);
    }

    public function test_get_public_profile_returns_existing_profile(): void
    {
        DesaProfile::create([
            'nama_desa' => 'Desa Test',
            'kecamatan' => 'Kec Test',
            'kabupaten' => 'Kab Test',
            'provinsi' => 'Prov Test',
        ]);

        $response = $this->getJson('/api/public/profile');

        $response->assertStatus(200);
        $this->assertDatabaseHas('desa_profile', ['nama_desa' => 'Desa Test']);
    }

    // ============= Stats =============

    public function test_get_public_stats(): void
    {
        // Seed minimal data
        $user = User::factory()->create();
        $dusun = Dusun::create(['nama_dusun' => 'Dusun 1']);
        $family = Family::create([
            'no_kk' => '3201010101010001',
            'nama_kepala_keluarga' => 'Kepala',
            'alamat' => 'Alamat',
            'dusun_id' => $dusun->id,
        ]);
        Resident::create(['family_id' => $family->id, 'nik' => '3201010101010001', 'nama_lengkap' => 'Warga 1', 'jenis_kelamin' => 'L', 'is_active' => true]);
        Resident::create(['family_id' => $family->id, 'nik' => '3201010101010002', 'nama_lengkap' => 'Warga 2', 'jenis_kelamin' => 'P', 'is_active' => true]);
        News::create(['judul' => 'Berita', 'slug' => 'berita-1', 'konten' => 'Konten', 'author_id' => $user->id, 'status' => 'published', 'published_at' => now()]);

        $response = $this->getJson('/api/public/stats');

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['total_penduduk', 'total_kk', 'surat_selesai_bulan_ini', 'total_berita', 'total_pengaduan_selesai']]);

        $this->assertSame(2, $response->json('data.total_penduduk'));
        $this->assertSame(1, $response->json('data.total_berita'));
    }

    // ============= Letter Types =============

    public function test_get_letter_types(): void
    {
        LetterType::create(['kode' => 'SKTM', 'nama' => 'Surat Keterangan Tidak Mampu', 'is_active' => true]);
        LetterType::create(['kode' => 'SKD', 'nama' => 'Surat Keterangan Domisili', 'is_active' => true]);
        LetterType::create(['kode' => 'INACTIVE', 'nama' => 'Inactive Type', 'is_active' => false]);

        $response = $this->getJson('/api/public/letter-types');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    // ============= News =============

    public function test_get_published_news(): void
    {
        $user = User::factory()->create();
        News::create(['judul' => 'Berita 1', 'slug' => 'berita-1', 'konten' => 'Konten 1', 'author_id' => $user->id, 'status' => 'published', 'published_at' => now()]);
        News::create(['judul' => 'Berita 2', 'slug' => 'berita-2', 'konten' => 'Konten 2', 'author_id' => $user->id, 'status' => 'published', 'published_at' => now()]);
        News::create(['judul' => 'Draft', 'slug' => 'draft-1', 'konten' => 'Draft', 'author_id' => $user->id, 'status' => 'draft']);

        $response = $this->getJson('/api/public/news');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_get_news_detail_by_slug(): void
    {
        $user = User::factory()->create();
        $news = News::create([
            'judul' => 'Berita Detail',
            'slug' => 'berita-detail',
            'konten' => 'Konten detail berita',
            'author_id' => $user->id,
            'status' => 'published',
            'published_at' => now(),
        ]);

        $response = $this->getJson('/api/public/news/berita-detail');

        $response->assertStatus(200)
            ->assertJsonPath('data.judul', 'Berita Detail');
    }

    public function test_get_news_detail_increments_views(): void
    {
        $user = User::factory()->create();
        $news = News::create([
            'judul' => 'Berita Views',
            'slug' => 'berita-views',
            'konten' => 'Konten',
            'author_id' => $user->id,
            'status' => 'published',
            'published_at' => now(),
        ]);

        $this->getJson('/api/public/news/berita-views');

        $this->assertSame(1, $news->fresh()->views_count);
    }

    public function test_get_draft_news_by_slug_returns_404(): void
    {
        $user = User::factory()->create();
        News::create([
            'judul' => 'Draft News',
            'slug' => 'draft-news',
            'konten' => 'Draft',
            'author_id' => $user->id,
            'status' => 'draft',
        ]);

        $response = $this->getJson('/api/public/news/draft-news');

        $response->assertStatus(404);
    }

    public function test_get_nonexistent_news_returns_404(): void
    {
        $response = $this->getJson('/api/public/news/nonexistent');

        $response->assertStatus(404);
    }

    // ============= Announcements =============

    public function test_get_active_announcements(): void
    {
        Announcement::create(['judul' => 'Aktif 1', 'konten' => 'Konten 1', 'is_active' => true]);
        Announcement::create(['judul' => 'Aktif 2', 'konten' => 'Konten 2', 'is_active' => true]);
        Announcement::create(['judul' => 'Nonaktif', 'konten' => 'Konten 3', 'is_active' => false]);

        $response = $this->getJson('/api/public/announcements');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_get_announcements_excludes_expired(): void
    {
        Announcement::create(['judul' => 'Expired', 'konten' => 'Konten', 'is_active' => true, 'tanggal_selesai' => now()->subDay()]);

        $response = $this->getJson('/api/public/announcements');

        $response->assertStatus(200);
        $this->assertCount(0, $response->json('data'));
    }

    // ============= Gallery =============

    public function test_get_gallery(): void
    {
        Gallery::create(['judul' => 'Foto 1', 'foto_path' => 'path1.jpg', 'kategori' => 'Kegiatan']);
        Gallery::create(['judul' => 'Foto 2', 'foto_path' => 'path2.jpg', 'kategori' => 'Wisata']);

        $response = $this->getJson('/api/public/gallery');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    // ============= Letter Request Submission =============

    public function test_submit_letter_request(): void
    {
        $letterType = LetterType::create(['kode' => 'SKTM', 'nama' => 'SKTM', 'is_active' => true]);

        $response = $this->postJson('/api/public/letter-requests', [
            'letter_type_id' => $letterType->id,
            'nik' => '3201010101010001',
            'nama_pemohon' => 'Budi Santoso',
            'keperluan' => 'Untuk melamar kerja',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['data' => ['nomor_pengajuan', 'message']]);
    }

    public function test_submit_letter_request_validates_required_fields(): void
    {
        $response = $this->postJson('/api/public/letter-requests', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['letter_type_id', 'nik', 'nama_pemohon', 'keperluan']);
    }

    public function test_submit_letter_request_validates_letter_type_exists(): void
    {
        $response = $this->postJson('/api/public/letter-requests', [
            'letter_type_id' => 999,
            'nik' => '3201010101010001',
            'nama_pemohon' => 'Test',
            'keperluan' => 'Test',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['letter_type_id']);
    }

    // ============= Check Letter Request =============

    public function test_check_letter_request_found(): void
    {
        $letterType = LetterType::create(['kode' => 'SKTM', 'nama' => 'SKTM']);
        LetterRequest::create([
            'nomor_pengajuan' => '20260714-ABCDEF',
            'letter_type_id' => $letterType->id,
            'nama_pemohon' => 'Budi',
            'nik_pemohon' => '3201010101010001',
            'keperluan' => 'Test',
            'status' => 'menunggu',
            'tanggal_pengajuan' => now(),
        ]);

        $response = $this->getJson('/api/public/letter-requests/check?nomor_pengajuan=20260714-ABCDEF&nik=3201010101010001');

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['nomor_pengajuan', 'status', 'letter_type']]);
    }

    public function test_check_letter_request_not_found(): void
    {
        $response = $this->getJson('/api/public/letter-requests/check?nomor_pengajuan=NONEXISTENT&nik=3201010101010001');

        $response->assertStatus(404);
    }

    // ============= Complaint Submission =============

    public function test_submit_complaint(): void
    {
        $response = $this->postJson('/api/public/complaints', [
            'nama_pelapor' => 'Pelapor',
            'no_hp' => '08123456789',
            'kategori' => 'Infrastruktur',
            'isi_pengaduan' => 'Jalan desa rusak parah',
            'lokasi' => 'Dusun 1',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['data' => ['kode_tiket', 'message']]);
    }

    public function test_submit_complaint_with_anonymous_pelapor(): void
    {
        $response = $this->postJson('/api/public/complaints', [
            'kategori' => 'Kebersihan',
            'isi_pengaduan' => 'Sampah menumpuk',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['data' => ['kode_tiket', 'message']]);

        // Verify nama_pelapor defaults to 'Anonim' in database
        $this->assertDatabaseHas('complaints', [
            'nama_pelapor' => 'Anonim',
            'kategori' => 'Kebersihan',
        ]);
    }

    public function test_submit_complaint_validates_required_fields(): void
    {
        $response = $this->postJson('/api/public/complaints', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['kategori', 'isi_pengaduan']);
    }

    // ============= Check Complaint =============

    public function test_check_complaint_found(): void
    {
        Complaint::create([
            'kode_tiket' => 'ADP-20260714-TEST',
            'kategori' => 'Infrastruktur',
            'isi_pengaduan' => 'Test',
            'status' => 'baru',
        ]);

        $response = $this->getJson('/api/public/complaints/check?kode_tiket=ADP-20260714-TEST');

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['kode_tiket', 'status']]);
    }

    public function test_check_complaint_not_found(): void
    {
        $response = $this->getJson('/api/public/complaints/check?kode_tiket=NONEXISTENT');

        $response->assertStatus(404);
    }
}
