<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('desa_profile', function (Blueprint $table) {
            $table->id();
            $table->string('nama_desa');
            $table->string('kecamatan');
            $table->string('kabupaten');
            $table->string('provinsi');
            $table->string('kode_pos', 10)->nullable();
            $table->text('alamat_kantor')->nullable();
            $table->string('nama_kepala_desa')->nullable();
            $table->string('telp', 20)->nullable();
            $table->string('email')->nullable();
            $table->string('logo_path')->nullable();
            $table->text('visi')->nullable();
            $table->text('misi')->nullable();
            $table->text('sejarah')->nullable();
            $table->decimal('luas_wilayah', 10, 2)->nullable();
            $table->integer('jumlah_dusun')->default(0);
            $table->string('koordinat_lat', 20)->nullable();
            $table->string('koordinat_lng', 20)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('desa_profile');
    }
};
