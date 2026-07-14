<?php

namespace Database\Seeders;

use App\Models\LetterType;
use Illuminate\Database\Seeder;

class LetterTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            [
                'kode' => 'SKTM',
                'nama' => 'Surat Keterangan Tidak Mampu',
                'deskripsi' => 'Surat keterangan untuk warga kurang mampu',
                'template_konten' => 'Surat Keterangan Tidak Mampu',
                'persyaratan' => ['KTP', 'Kartu Keluarga'],
                'estimasi_hari' => 2,
            ],
            [
                'kode' => 'SKD',
                'nama' => 'Surat Keterangan Domisili',
                'deskripsi' => 'Surat keterangan tempat tinggal/domisili',
                'template_konten' => 'Surat Keterangan Domisili',
                'persyaratan' => ['KTP', 'Kartu Keluarga'],
                'estimasi_hari' => 1,
            ],
            [
                'kode' => 'SKU',
                'nama' => 'Surat Keterangan Usaha',
                'deskripsi' => 'Surat keterangan untuk warga yang memiliki usaha',
                'template_konten' => 'Surat Keterangan Usaha',
                'persyaratan' => ['KTP', 'Foto Usaha'],
                'estimasi_hari' => 2,
            ],
            [
                'kode' => 'SPKTP',
                'nama' => 'Surat Pengantar KTP',
                'deskripsi' => 'Surat pengantar untuk pembuatan KTP',
                'template_konten' => 'Surat Pengantar KTP',
                'persyaratan' => ['Kartu Keluarga', 'Akta Lahir'],
                'estimasi_hari' => 1,
            ],
            [
                'kode' => 'SPKK',
                'nama' => 'Surat Pengantar KK',
                'deskripsi' => 'Surat pengantar untuk pembuatan Kartu Keluarga',
                'template_konten' => 'Surat Pengantar KK',
                'persyaratan' => ['KTP', 'Akta Nikah'],
                'estimasi_hari' => 1,
            ],
            [
                'kode' => 'SKL',
                'nama' => 'Surat Keterangan Lahir',
                'deskripsi' => 'Surat keterangan kelahiran',
                'template_konten' => 'Surat Keterangan Lahir',
                'persyaratan' => ['KTP Orang Tua', 'Buku Nikah', 'Keterangan Bidan/Dokter'],
                'estimasi_hari' => 2,
            ],
            [
                'kode' => 'SKM',
                'nama' => 'Surat Keterangan Meninggal',
                'deskripsi' => 'Surat keterangan kematian',
                'template_konten' => 'Surat Keterangan Meninggal',
                'persyaratan' => ['KTP', 'KK', 'Keterangan Dokter/Saksi'],
                'estimasi_hari' => 1,
            ],
        ];

        foreach ($types as $type) {
            LetterType::firstOrCreate(
                ['kode' => $type['kode']],
                $type
            );
        }
    }
}
