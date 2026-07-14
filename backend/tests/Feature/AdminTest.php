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
use App\Services\LetterNumberService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    private User $admin;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();

        // Create permissions (like the seeder does)
        $permissionsByModule = [
            'residents' => ['view', 'create', 'edit', 'delete'],
            'families' => ['view', 'create', 'edit', 'delete'],
            'letters' => ['view', 'create', 'approve', 'reject', 'print'],
            'letter_types' => ['view', 'create', 'edit', 'delete'],
            'news' => ['view', 'create', 'edit', 'delete', 'publish'],
            'announcements' => ['view', 'create', 'edit', 'delete'],
            'complaints' => ['view', 'respond', 'delete'],
            'gallery' => ['view', 'create', 'delete'],
            'users' => ['view', 'create', 'edit', 'delete'],
            'settings' => ['view', 'edit'],
            'desa_profile' => ['view', 'edit'],
            'dashboard' => ['view'],
        ];

        foreach ($permissionsByModule as $module => $actions) {
            foreach ($actions as $action) {
                Permission::firstOrCreate(['name' => "{$module}.{$action}", 'guard_name' => 'web']);
            }
        }

        $role = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        $role->syncPermissions(Permission::all()->pluck('name')->toArray());

        $this->admin = User::factory()->create(['is_active' => true]);
        $this->admin->assignRole('Super Admin');

        $this->token = $this->admin->createToken('test')->plainTextToken;
    }

    protected function authHeaders(): array
    {
        return ['Authorization' => "Bearer {$this->token}"];
    }

    // ============= Dashboard =============

    public function test_get_dashboard_stats(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/dashboard/stats');

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['stats', 'demografi', 'surat_trend']]);
    }

    // ============= Dusun CRUD =============

    public function test_create_dusun(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/dusuns', [
                'nama_dusun' => 'Dusun Baru',
                'nama_kepala_dusun' => 'Pak Kadus',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.nama_dusun', 'Dusun Baru');
    }

    public function test_list_dusuns(): void
    {
        Dusun::create(['nama_dusun' => 'Dusun 1', 'nama_kepala_dusun' => 'Kadus 1']);
        Dusun::create(['nama_dusun' => 'Dusun 2', 'nama_kepala_dusun' => 'Kadus 2']);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/dusuns');

        $response->assertStatus(200);
    }

    public function test_update_dusun(): void
    {
        $dusun = Dusun::create(['nama_dusun' => 'Dusun Lama', 'nama_kepala_dusun' => 'Kadus Lama']);

        $response = $this->withHeaders($this->authHeaders())
            ->putJson("/api/dusuns/{$dusun->id}", [
                'nama_dusun' => 'Dusun Baru',
                'nama_kepala_dusun' => 'Kadus Baru',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.nama_dusun', 'Dusun Baru');
    }

    public function test_delete_dusun(): void
    {
        $dusun = Dusun::create(['nama_dusun' => 'Dusun Hapus']);

        $response = $this->withHeaders($this->authHeaders())
            ->deleteJson("/api/dusuns/{$dusun->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('dusuns', ['id' => $dusun->id]);
    }

    // ============= Resident CRUD =============

    public function test_create_resident(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/residents', [
                'nik' => '3201010101010001',
                'nama_lengkap' => 'Budi Santoso',
                'jenis_kelamin' => 'L',
                'tempat_lahir' => 'Jakarta',
                'tanggal_lahir' => '1990-01-15',
                'agama' => 'Islam',
                'pekerjaan' => 'Swasta',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.nama_lengkap', 'Budi Santoso');
    }

    public function test_create_resident_validates_unique_nik(): void
    {
        Resident::create([
            'nik' => '3201010101010001',
            'nama_lengkap' => 'Existing',
            'jenis_kelamin' => 'L',
        ]);

        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/residents', [
                'nik' => '3201010101010001',
                'nama_lengkap' => 'Duplicate',
                'jenis_kelamin' => 'P',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['nik']);
    }

    public function test_list_residents(): void
    {
        Resident::create(['nik' => '3201010101010001', 'nama_lengkap' => 'Warga 1', 'jenis_kelamin' => 'L']);
        Resident::create(['nik' => '3201010101010002', 'nama_lengkap' => 'Warga 2', 'jenis_kelamin' => 'P']);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/residents');

        $response->assertStatus(200);
        // Default pagination returns 15 per page
        $this->assertCount(2, $response->json('data'));
    }

    public function test_show_resident(): void
    {
        $resident = Resident::create(['nik' => '3201010101010001', 'nama_lengkap' => 'Test', 'jenis_kelamin' => 'L']);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson("/api/residents/{$resident->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.nama_lengkap', 'Test');
    }

    public function test_update_resident(): void
    {
        $resident = Resident::create(['nik' => '3201010101010001', 'nama_lengkap' => 'Lama', 'jenis_kelamin' => 'L']);

        $response = $this->withHeaders($this->authHeaders())
            ->putJson("/api/residents/{$resident->id}", [
                'nik' => '3201010101010001',
                'nama_lengkap' => 'Baru',
                'jenis_kelamin' => 'L',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.nama_lengkap', 'Baru');
    }

    public function test_delete_resident_deactivates(): void
    {
        $resident = Resident::create(['nik' => '3201010101010001', 'nama_lengkap' => 'Test', 'jenis_kelamin' => 'L', 'is_active' => true]);

        $response = $this->withHeaders($this->authHeaders())
            ->deleteJson("/api/residents/{$resident->id}");

        $response->assertStatus(200);
        $this->assertFalse($resident->fresh()->is_active);
    }

    // ============= Family CRUD =============

    public function test_create_family(): void
    {
        $dusun = Dusun::create(['nama_dusun' => 'Dusun 1']);

        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/families', [
                'no_kk' => '3201010101010001',
                'nama_kepala_keluarga' => 'Kepala Keluarga',
                'alamat' => 'Jl. Contoh No. 1',
                'dusun_id' => $dusun->id,
                'rt' => '001',
                'rw' => '002',
            ]);

        $response->assertStatus(201);
    }

    public function test_create_family_validates_unique_no_kk(): void
    {
        $dusun = Dusun::create(['nama_dusun' => 'Dusun 1']);
        Family::create(['no_kk' => '3201010101010001', 'nama_kepala_keluarga' => 'Test', 'alamat' => 'Alamat', 'dusun_id' => $dusun->id]);

        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/families', [
                'no_kk' => '3201010101010001',
                'nama_kepala_keluarga' => 'Duplicate',
                'alamat' => 'Alamat',
                'dusun_id' => $dusun->id,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['no_kk']);
    }

    public function test_list_families(): void
    {
        $dusun = Dusun::create(['nama_dusun' => 'Dusun 1']);
        Family::create(['no_kk' => '3201010101010001', 'nama_kepala_keluarga' => 'Kepala 1', 'alamat' => 'Alamat 1', 'dusun_id' => $dusun->id]);
        Family::create(['no_kk' => '3201010101010002', 'nama_kepala_keluarga' => 'Kepala 2', 'alamat' => 'Alamat 2', 'dusun_id' => $dusun->id]);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/families');

        $response->assertStatus(200);
    }

    // ============= News CRUD =============

    public function test_create_news(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/news', [
                'judul' => 'Berita Baru',
                'konten' => 'Konten berita baru',
                'kategori' => 'Kegiatan',
                'status' => 'published',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.judul', 'Berita Baru');
    }

    public function test_list_news(): void
    {
        News::create(['judul' => 'Berita 1', 'slug' => 'berita-1', 'konten' => 'Konten 1', 'author_id' => $this->admin->id, 'status' => 'published', 'published_at' => now()]);
        News::create(['judul' => 'Berita 2', 'slug' => 'berita-2', 'konten' => 'Konten 2', 'author_id' => $this->admin->id, 'status' => 'draft']);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/news');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_update_news(): void
    {
        $news = News::create(['judul' => 'Lama', 'slug' => 'lama', 'konten' => 'Konten lama', 'author_id' => $this->admin->id, 'status' => 'draft']);

        $response = $this->withHeaders($this->authHeaders())
            ->putJson("/api/news/{$news->id}", [
                'judul' => 'Baru',
                'konten' => 'Konten baru',
                'status' => 'published',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.judul', 'Baru');
    }

    public function test_delete_news(): void
    {
        $news = News::create(['judul' => 'Hapus', 'slug' => 'hapus', 'konten' => 'Konten', 'author_id' => $this->admin->id, 'status' => 'draft']);

        $response = $this->withHeaders($this->authHeaders())
            ->deleteJson("/api/news/{$news->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('news', ['id' => $news->id]);
    }

    // ============= Announcement CRUD =============

    public function test_create_announcement(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/announcements', [
                'judul' => 'Pengumuman Baru',
                'konten' => 'Isi pengumuman',
                'tanggal_mulai' => '2026-07-14',
                'tanggal_selesai' => '2026-07-21',
            ]);

        $response->assertStatus(201);
    }

    public function test_list_announcements_filtered(): void
    {
        Announcement::create(['judul' => 'Aktif', 'konten' => 'Konten', 'is_active' => true]);
        Announcement::create(['judul' => 'Nonaktif', 'konten' => 'Konten', 'is_active' => false]);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/announcements');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    // ============= Complaint =============

    public function test_list_complaints(): void
    {
        Complaint::create(['kode_tiket' => 'ADP-20260714-AAAA', 'kategori' => 'Infrastruktur', 'isi_pengaduan' => 'Test 1', 'status' => 'baru']);
        Complaint::create(['kode_tiket' => 'ADP-20260714-BBBB', 'kategori' => 'Kebersihan', 'isi_pengaduan' => 'Test 2', 'status' => 'diproses']);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/complaints');

        $response->assertStatus(200);
    }

    public function test_respond_to_complaint(): void
    {
        $complaint = Complaint::create(['kode_tiket' => 'ADP-20260714-CCCC', 'kategori' => 'Infrastruktur', 'isi_pengaduan' => 'Test', 'status' => 'baru']);

        $response = $this->withHeaders($this->authHeaders())
            ->patchJson("/api/complaints/{$complaint->id}/respond", [
                'tanggapan' => 'Sudah ditangani',
                'status' => 'selesai',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.status', 'selesai');
    }

    public function test_respond_to_complaint_validates(): void
    {
        $complaint = Complaint::create(['kode_tiket' => 'ADP-20260714-DDDD', 'kategori' => 'Infrastruktur', 'isi_pengaduan' => 'Test', 'status' => 'baru']);

        $response = $this->withHeaders($this->authHeaders())
            ->patchJson("/api/complaints/{$complaint->id}/respond", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['tanggapan', 'status']);
    }

    // ============= Letter Type CRUD =============

    public function test_create_letter_type(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/letter-types', [
                'kode' => 'NEW',
                'nama' => 'Surat Baru',
                'deskripsi' => 'Deskripsi',
                'persyaratan' => ['KTP', 'KK'],
                'estimasi_hari' => 3,
            ]);

        $response->assertStatus(201);
    }

    public function test_list_letter_types(): void
    {
        LetterType::create(['kode' => 'SKTM', 'nama' => 'SKTM']);
        LetterType::create(['kode' => 'SKD', 'nama' => 'SKD']);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/letter-types');

        $response->assertStatus(200);
    }

    // ============= Letter Request CRUD =============

    public function test_create_letter_request(): void
    {
        $letterType = LetterType::create(['kode' => 'SKTM', 'nama' => 'SKTM']);

        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/letter-requests', [
                'letter_type_id' => $letterType->id,
                'nik' => '3201010101010001',
                'nama_pemohon' => 'Pemohon',
                'keperluan' => 'Test',
            ]);

        $response->assertStatus(201);
    }

    public function test_approve_letter_request(): void
    {
        $letterType = LetterType::create(['kode' => 'SKTM', 'nama' => 'SKTM']);
        $letterRequest = LetterRequest::create([
            'nomor_pengajuan' => '20260714-APPRV1',
            'letter_type_id' => $letterType->id,
            'nama_pemohon' => 'Test',
            'nik_pemohon' => '3201010101010001',
            'keperluan' => 'Test',
            'status' => 'menunggu',
            'tanggal_pengajuan' => now(),
        ]);

        $response = $this->withHeaders($this->authHeaders())
            ->patchJson("/api/letter-requests/{$letterRequest->id}/approve");

        $response->assertStatus(200)
            ->assertJsonPath('data.status', 'disetujui');
    }

    public function test_reject_letter_request(): void
    {
        $letterType = LetterType::create(['kode' => 'SKTM', 'nama' => 'SKTM']);
        $letterRequest = LetterRequest::create([
            'nomor_pengajuan' => '20260714-REJCT1',
            'letter_type_id' => $letterType->id,
            'nama_pemohon' => 'Test',
            'nik_pemohon' => '3201010101010001',
            'keperluan' => 'Test',
            'status' => 'menunggu',
            'tanggal_pengajuan' => now(),
        ]);

        $response = $this->withHeaders($this->authHeaders())
            ->patchJson("/api/letter-requests/{$letterRequest->id}/reject", [
                'catatan_admin' => 'Data tidak lengkap',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.status', 'ditolak');
    }

    public function test_cannot_approve_already_processed_request(): void
    {
        $letterType = LetterType::create(['kode' => 'SKTM', 'nama' => 'SKTM']);
        $letterRequest = LetterRequest::create([
            'nomor_pengajuan' => '20260714-DONE01',
            'letter_type_id' => $letterType->id,
            'nama_pemohon' => 'Test',
            'nik_pemohon' => '3201010101010001',
            'keperluan' => 'Test',
            'status' => 'selesai',
            'tanggal_pengajuan' => now(),
        ]);

        $response = $this->withHeaders($this->authHeaders())
            ->patchJson("/api/letter-requests/{$letterRequest->id}/approve");

        $response->assertStatus(422);
    }

    // ============= Gallery =============

    public function test_list_galleries(): void
    {
        Gallery::create(['judul' => 'Foto 1', 'foto_path' => 'path1.jpg']);
        Gallery::create(['judul' => 'Foto 2', 'foto_path' => 'path2.jpg']);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/galleries');

        $response->assertStatus(200);
    }

    public function test_delete_gallery(): void
    {
        $gallery = Gallery::create(['judul' => 'Hapus', 'foto_path' => 'path.jpg']);

        $response = $this->withHeaders($this->authHeaders())
            ->deleteJson("/api/galleries/{$gallery->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('galleries', ['id' => $gallery->id]);
    }

    // ============= User Management =============

    public function test_list_users(): void
    {
        User::factory()->count(3)->create();

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/users');

        $response->assertStatus(200);
        // 3 created + 1 admin from setUp = 4
        $this->assertCount(4, $response->json('data'));
    }

    public function test_create_user(): void
    {
        $role = Role::firstOrCreate(['name' => 'Operator', 'guard_name' => 'web']);

        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/users', [
                'name' => 'User Baru',
                'email' => 'userbaru@desa.id',
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'role' => 'Operator',
            ]);

        $response->assertStatus(201);
    }

    // ============= Desa Profile =============

    public function test_update_desa_profile(): void
    {
        DesaProfile::create([
            'nama_desa' => 'Lama',
            'kecamatan' => 'Kec Lama',
            'kabupaten' => 'Kab Lama',
            'provinsi' => 'Prov Lama',
        ]);

        $response = $this->withHeaders($this->authHeaders())
            ->putJson('/api/desa-profile', [
                'nama_desa' => 'Baru',
                'kecamatan' => 'Kec Baru',
                'kabupaten' => 'Kab Baru',
                'provinsi' => 'Prov Baru',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.nama_desa', 'Baru');
    }

    // ============= Settings =============

    public function test_get_settings(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/settings');

        $response->assertStatus(200);
    }

    public function test_update_settings(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->putJson('/api/settings', [
                'settings' => [
                    'app_name' => 'Sistem Informasi Desa',
                    'footer_text' => '© 2026 Desa Maju',
                ],
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('settings', ['key' => 'app_name', 'value' => 'Sistem Informasi Desa']);
    }
}
