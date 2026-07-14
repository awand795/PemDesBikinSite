<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('letter_requests', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_pengajuan', 20)->unique();
            $table->foreignId('letter_type_id')->constrained()->cascadeOnDelete();
            $table->foreignId('resident_id')->nullable()->constrained()->nullOnDelete();
            $table->string('nama_pemohon')->nullable();
            $table->string('nik_pemohon', 16)->nullable();
            $table->text('keperluan')->nullable();
            $table->json('data_tambahan')->nullable();
            $table->json('lampiran')->nullable();
            $table->enum('status', ['menunggu', 'diproses', 'disetujui', 'ditolak', 'selesai'])->default('menunggu');
            $table->text('catatan_admin')->nullable();
            $table->string('nomor_surat', 50)->nullable();
            $table->timestamp('tanggal_pengajuan')->useCurrent();
            $table->timestamp('tanggal_diproses')->nullable();
            $table->foreignId('diproses_oleh')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('letter_requests');
    }
};
