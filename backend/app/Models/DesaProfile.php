<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DesaProfile extends Model
{
    protected $table = 'desa_profile';

    protected $fillable = [
        'nama_desa', 'kecamatan', 'kabupaten', 'provinsi', 'kode_pos',
        'alamat_kantor', 'nama_kepala_desa', 'telp', 'email', 'logo_path',
        'visi', 'misi', 'sejarah', 'luas_wilayah', 'jumlah_dusun',
        'koordinat_lat', 'koordinat_lng',
    ];

    protected function casts(): array
    {
        return [
            'luas_wilayah' => 'decimal:2',
        ];
    }
}
