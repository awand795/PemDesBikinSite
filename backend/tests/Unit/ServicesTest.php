<?php

namespace Tests\Unit;

use App\Models\Complaint;
use App\Models\Dusun;
use App\Models\Family;
use App\Models\LetterRequest;
use App\Models\LetterType;
use App\Models\News;
use App\Models\Resident;
use App\Models\User;
use App\Services\ActivityLoggerService;
use App\Services\DashboardService;
use App\Services\LetterNumberService;
use App\Services\LetterTemplateRenderer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServicesTest extends TestCase
{
    use RefreshDatabase;

    // ============= LetterNumberService =============

    public function test_letter_number_service_generates_format(): void
    {
        $service = new LetterNumberService();
        $letterType = LetterType::create(['kode' => 'SKTM', 'nama' => 'SKTM']);

        $nomor = $service->generate($letterType);

        // Format: 001/SKTM/IV/2026
        $this->assertStringContainsString('/SKTM/', $nomor);
        $this->assertStringContainsString('/' . now()->format('Y'), $nomor);
        $this->assertMatchesRegularExpression('/^\d{3}\/[A-Z]+\/[A-Z]+\/\d{4}$/', $nomor);
    }

    public function test_letter_number_service_increments(): void
    {
        $service = new LetterNumberService();
        $letterType = LetterType::create(['kode' => 'SKTM', 'nama' => 'SKTM']);

        $user = User::factory()->create();

        $letterRequest = LetterRequest::create([
            'nomor_pengajuan' => '20260714-TEST01',
            'letter_type_id' => $letterType->id,
            'nama_pemohon' => 'Test 1',
            'nik_pemohon' => '3201010101010001',
            'nomor_surat' => '001/SKTM/IV/2026',
            'status' => 'disetujui',
            'tanggal_pengajuan' => now(),
        ]);

        $nomor2 = $service->generate($letterType);

        $this->assertStringStartsWith('002/', $nomor2);
    }

    public function test_generate_pengajuan_number(): void
    {
        $service = new LetterNumberService();

        $nomor = $service->generatePengajuanNumber();

        $this->assertMatchesRegularExpression('/^\d{8}-[A-Z0-9]{6}$/', $nomor);
        $this->assertStringStartsWith(now()->format('Ymd'), $nomor);
    }

    public function test_generate_ticket_code(): void
    {
        $service = new LetterNumberService();

        $code = $service->generateTicketCode();

        $this->assertStringStartsWith('ADP-', $code);
        $this->assertMatchesRegularExpression('/^ADP-\d{8}-[A-Z0-9]{4}$/', $code);
    }

    // ============= ActivityLoggerService =============

    public function test_activity_logger_logs_action(): void
    {
        $service = new ActivityLoggerService();
        $user = User::factory()->create();

        $this->actingAs($user);

        // Test without subject
        $service->log('test_action', description: 'Testing log');

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $user->id,
            'action' => 'test_action',
            'description' => 'Testing log',
        ]);
    }

    public function test_activity_logger_logs_with_subject(): void
    {
        $service = new ActivityLoggerService();
        $user = User::factory()->create();

        $this->actingAs($user);

        $resident = Resident::create([
            'nik' => '3201010101010001',
            'nama_lengkap' => 'Test Subject',
            'jenis_kelamin' => 'L',
        ]);

        $service->log('created', $resident, 'Created resident', null, ['nik' => '3201010101010001']);

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $user->id,
            'action' => 'created',
            'model_type' => Resident::class,
            'model_id' => $resident->id,
            'description' => 'Created resident',
        ]);
    }

    // ============= DashboardService =============

    public function test_dashboard_stats_returns_zero_when_empty(): void
    {
        $service = new DashboardService();
        $stats = $service->getStats();

        $this->assertSame(0, $stats['total_penduduk']);
        $this->assertSame(0, $stats['total_kk']);
        $this->assertSame(0, $stats['surat_bulan_ini']);
        $this->assertSame(0, $stats['surat_menunggu']);
        $this->assertSame(0, $stats['pengaduan_baru']);
        $this->assertSame(0, $stats['berita_published']);
    }

    public function test_dashboard_stats_with_data(): void
    {
        // Seed data
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
        Resident::create(['family_id' => $family->id, 'nik' => '3201010101010003', 'nama_lengkap' => 'Warga 3', 'jenis_kelamin' => 'L', 'is_active' => false]);

        $letterType = LetterType::create(['kode' => 'SKTM', 'nama' => 'SKTM']);

        $service = new DashboardService();
        $stats = $service->getStats();

        $this->assertSame(2, $stats['total_penduduk']);
        $this->assertSame(1, $stats['total_kk']);
        $this->assertSame(0, $stats['surat_bulan_ini']);
    }

    public function test_dashboard_demografi(): void
    {
        $service = new DashboardService();

        $dusun = Dusun::create(['nama_dusun' => 'Dusun Indah']);
        $family = Family::create([
            'no_kk' => '3201010101010002',
            'nama_kepala_keluarga' => 'Kepala',
            'alamat' => 'Alamat',
            'dusun_id' => $dusun->id,
        ]);
        Resident::create(['family_id' => $family->id, 'nik' => '3201010101010004', 'nama_lengkap' => 'Laki 1', 'jenis_kelamin' => 'L', 'is_active' => true]);
        Resident::create(['family_id' => $family->id, 'nik' => '3201010101010005', 'nama_lengkap' => 'Perempuan 1', 'jenis_kelamin' => 'P', 'is_active' => true]);

        $demografi = $service->getDemografi();

        $this->assertSame(2, $demografi['total']);
        $this->assertSame(1, $demografi['laki_laki']);
        $this->assertSame(1, $demografi['perempuan']);
    }

    public function test_dashboard_surat_trend_returns_six_months(): void
    {
        $service = new DashboardService();
        $trend = $service->getSuratTrend();

        $this->assertCount(6, $trend);
    }

    // ============= LetterTemplateRenderer =============

    public function test_template_renderer_returns_empty_for_no_template(): void
    {
        $renderer = new LetterTemplateRenderer();

        $letterType = LetterType::create(['kode' => 'SKTM', 'nama' => 'SKTM', 'template_konten' => null]);
        $resident = Resident::create(['nik' => '3201010101010001', 'nama_lengkap' => 'Test', 'jenis_kelamin' => 'L']);
        $letterRequest = LetterRequest::create([
            'nomor_pengajuan' => '20260714-TEST01',
            'letter_type_id' => $letterType->id,
            'resident_id' => $resident->id,
            'nama_pemohon' => 'Test User',
            'nik_pemohon' => '3201010101010001',
            'status' => 'menunggu',
            'tanggal_pengajuan' => now(),
        ]);

        $desa = \App\Models\DesaProfile::create([
            'nama_desa' => 'Desa Test',
            'kecamatan' => 'Kec Test',
            'kabupaten' => 'Kab Test',
            'provinsi' => 'Prov Test',
        ]);

        $result = $renderer->render($letterRequest, $desa);
        $this->assertEmpty($result);
    }

    public function test_template_renderer_replaces_placeholders(): void
    {
        $renderer = new LetterTemplateRenderer();

        $letterType = LetterType::create([
            'kode' => 'SKTM',
            'nama' => 'SKTM',
            'template_konten' => 'Nama: {{nama}}, NIK: {{nik}}, Keperluan: {{keperluan}}',
        ]);
        $resident = Resident::create([
            'nik' => '3201010101010001',
            'nama_lengkap' => 'Test Residen',
            'jenis_kelamin' => 'L',
            'tempat_lahir' => 'Jakarta',
            'tanggal_lahir' => '1990-01-15',
            'pekerjaan' => 'Swasta',
        ]);
        $letterRequest = LetterRequest::create([
            'nomor_pengajuan' => '20260714-TEST02',
            'letter_type_id' => $letterType->id,
            'resident_id' => $resident->id,
            'nama_pemohon' => 'Budi Santoso',
            'nik_pemohon' => '3201010101010001',
            'keperluan' => 'Melamar kerja',
            'status' => 'menunggu',
            'tanggal_pengajuan' => now(),
        ]);

        $desa = \App\Models\DesaProfile::create([
            'nama_desa' => 'Desa Maju',
            'kecamatan' => 'Kec Sejahtera',
            'kabupaten' => 'Kab Bahagia',
            'provinsi' => 'Prov Sentosa',
            'nama_kepala_desa' => 'Pak Lurah',
        ]);

        $result = $renderer->render($letterRequest, $desa);

        $this->assertStringContainsString('Budi Santoso', $result);
        $this->assertStringContainsString('3201010101010001', $result);
        $this->assertStringContainsString('Melamar kerja', $result);
    }

    public function test_template_renderer_replaces_kepala_desa(): void
    {
        $renderer = new LetterTemplateRenderer();

        $letterType = LetterType::create([
            'kode' => 'SKTM',
            'nama' => 'SKTM',
            'template_konten' => 'Kepala Desa: {{nama_kepala_desa}}, Desa: {{nama_desa}}',
        ]);
        $resident = Resident::create(['nik' => '3201010101010001', 'nama_lengkap' => 'Test', 'jenis_kelamin' => 'L']);
        $letterRequest = LetterRequest::create([
            'nomor_pengajuan' => '20260714-TEST03',
            'letter_type_id' => $letterType->id,
            'resident_id' => $resident->id,
            'nama_pemohon' => 'Test',
            'nik_pemohon' => '3201010101010001',
            'status' => 'menunggu',
            'tanggal_pengajuan' => now(),
        ]);

        $desa = \App\Models\DesaProfile::create([
            'nama_desa' => 'Desa Test',
            'nama_kepala_desa' => 'Bapak Kades',
            'kecamatan' => 'Kec',
            'kabupaten' => 'Kab',
            'provinsi' => 'Prov',
        ]);

        $result = $renderer->render($letterRequest, $desa);

        $this->assertStringContainsString('Bapak Kades', $result);
        $this->assertStringContainsString('Desa Test', $result);
    }
}
