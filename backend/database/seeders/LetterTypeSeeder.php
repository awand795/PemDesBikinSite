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
                'template_konten' => 'Yang bertanda tangan di bawah ini, {{nama_kepala_desa}}, Kepala Desa {{nama_desa}}, menerangkan dengan sebenarnya bahwa:

Nama: {{nama}}
NIK: {{nik}}
Tempat, Tanggal Lahir: {{tempat_lahir}}, {{tanggal_lahir}}
Jenis Kelamin: {{jenis_kelamin}}
Pekerjaan: {{pekerjaan}}
Alamat: {{alamat}}

Benar adalah penduduk Desa {{nama_desa}} dan berdasarkan pengamatan serta keterangan yang ada, yang bersangkutan termasuk dalam golongan keluarga kurang mampu/tidak mampu.

Surat keterangan ini dibuat untuk {{keperluan}}.

Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.',
                'persyaratan' => ['Fotokopi KTP', 'Fotokopi Kartu Keluarga'],
                'estimasi_hari' => 2,
            ],
            [
                'kode' => 'SKD',
                'nama' => 'Surat Keterangan Domisili',
                'deskripsi' => 'Surat keterangan tempat tinggal/domisili',
                'template_konten' => 'Yang bertanda tangan di bawah ini, {{nama_kepala_desa}}, Kepala Desa {{nama_desa}}, menerangkan dengan sebenarnya bahwa:

Nama: {{nama}}
NIK: {{nik}}
Tempat, Tanggal Lahir: {{tempat_lahir}}, {{tanggal_lahir}}
Jenis Kelamin: {{jenis_kelamin}}
Pekerjaan: {{pekerjaan}}
Alamat: {{alamat}}

Benar yang bersangkutan berdomisili di wilayah Desa {{nama_desa}} sejak yang bersangkutan tinggal di alamat tersebut.

Surat keterangan domisili ini dibuat untuk {{keperluan}}.

Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.',
                'persyaratan' => ['Fotokopi KTP', 'Fotokopi Kartu Keluarga', 'Surat Pengantar RT/RW'],
                'estimasi_hari' => 1,
            ],
            [
                'kode' => 'SKU',
                'nama' => 'Surat Keterangan Usaha',
                'deskripsi' => 'Surat keterangan untuk warga yang memiliki usaha',
                'template_konten' => 'Yang bertanda tangan di bawah ini, {{nama_kepala_desa}}, Kepala Desa {{nama_desa}}, menerangkan dengan sebenarnya bahwa:

Nama: {{nama}}
NIK: {{nik}}
Tempat, Tanggal Lahir: {{tempat_lahir}}, {{tanggal_lahir}}
Jenis Kelamin: {{jenis_kelamin}}
Pekerjaan: {{pekerjaan}}
Alamat: {{alamat}}

Benar yang bersangkutan memiliki dan menjalankan usaha di wilayah Desa {{nama_desa}}.

Surat keterangan usaha ini dibuat untuk {{keperluan}}.

Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.',
                'persyaratan' => ['Fotokopi KTP', 'Fotokopi Kartu Keluarga', 'Foto Usaha'],
                'estimasi_hari' => 2,
            ],
            [
                'kode' => 'SPKTP',
                'nama' => 'Surat Pengantar KTP',
                'deskripsi' => 'Surat pengantar untuk pembuatan KTP',
                'template_konten' => 'Yang bertanda tangan di bawah ini, {{nama_kepala_desa}}, Kepala Desa {{nama_desa}}, menerangkan bahwa:

Nama: {{nama}}
NIK: {{nik}}
Tempat, Tanggal Lahir: {{tempat_lahir}}, {{tanggal_lahir}}
Jenis Kelamin: {{jenis_kelamin}}
Pekerjaan: {{pekerjaan}}
Alamat: {{alamat}}

Benar adalah penduduk Desa {{nama_desa}} dan yang bersangkutan belum memiliki KTP Elektronik atau KTP yang bersangkutan dalam proses pembuatan/perpanjangan.

Surat pengantar ini dibuat untuk {{keperluan}}.

Demikian surat pengantar ini diberikan untuk dapat digunakan dalam pengurusan pembuatan KTP.',
                'persyaratan' => ['Fotokopi Kartu Keluarga', 'Fotokopi Akta Lahir'],
                'estimasi_hari' => 1,
            ],
            [
                'kode' => 'SPKK',
                'nama' => 'Surat Pengantar KK',
                'deskripsi' => 'Surat pengantar untuk pembuatan Kartu Keluarga',
                'template_konten' => 'Yang bertanda tangan di bawah ini, {{nama_kepala_desa}}, Kepala Desa {{nama_desa}}, menerangkan bahwa:

Nama: {{nama}}
NIK: {{nik}}
Tempat, Tanggal Lahir: {{tempat_lahir}}, {{tanggal_lahir}}
Jenis Kelamin: {{jenis_kelamin}}
Pekerjaan: {{pekerjaan}}
Alamat: {{alamat}}

Benar adalah penduduk Desa {{nama_desa}} dan yang bersangkutan mengajukan pembuatan/perubahan Kartu Keluarga.

Surat pengantar ini dibuat untuk {{keperluan}}.

Demikian surat pengantar ini diberikan untuk dapat digunakan dalam pengurusan pembuatan Kartu Keluarga.',
                'persyaratan' => ['Fotokopi KTP', 'Fotokopi Akta Nikah', 'Fotokopi Akta Kelahiran Anak'],
                'estimasi_hari' => 1,
            ],
            [
                'kode' => 'SKL',
                'nama' => 'Surat Keterangan Lahir',
                'deskripsi' => 'Surat keterangan kelahiran',
                'template_konten' => 'Yang bertanda tangan di bawah ini, {{nama_kepala_desa}}, Kepala Desa {{nama_desa}}, menerangkan dengan sebenarnya bahwa:

Telah lahir seorang anak:
Nama: {{nama}}
Tempat Lahir: {{tempat_lahir}}
Tanggal Lahir: {{tanggal_lahir}}
Jenis Kelamin: {{jenis_kelamin}}

Anak tersebut adalah anak dari:
Ayah: {{data_tambahan.ayah ?? '-'}}
Ibu: {{data_tambahan.ibu ?? '-'}}

Bertempat tinggal di {{alamat}}, Desa {{nama_desa}}.

Surat keterangan lahir ini dibuat untuk {{keperluan}}.

Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.',
                'persyaratan' => ['Fotokopi KTP Orang Tua', 'Fotokopi Buku Nikah', 'Keterangan Bidan/Dokter'],
                'estimasi_hari' => 2,
            ],
            [
                'kode' => 'SKM',
                'nama' => 'Surat Keterangan Meninggal',
                'deskripsi' => 'Surat keterangan kematian',
                'template_konten' => 'Yang bertanda tangan di bawah ini, {{nama_kepala_desa}}, Kepala Desa {{nama_desa}}, menerangkan dengan sebenarnya bahwa:

Nama: {{nama}}
NIK: {{nik}}
Tempat, Tanggal Lahir: {{tempat_lahir}}, {{tanggal_lahir}}
Jenis Kelamin: {{jenis_kelamin}}
Pekerjaan: {{pekerjaan}}
Alamat: {{alamat}}

Benar telah meninggal dunia pada:
Tanggal: {{data_tambahan.tanggal_meninggal ?? '-'}}
Tempat: {{data_tambahan.tempat_meninggal ?? '-'}}
Penyebab: {{data_tambahan.penyebab ?? '-'}}

Surat keterangan meninggal ini dibuat untuk {{keperluan}}.

Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.',
                'persyaratan' => ['Fotokopi KTP', 'Fotokopi KK', 'Keterangan Dokter/Saksi'],
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
