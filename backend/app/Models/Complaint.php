<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Complaint extends Model
{
    protected $fillable = [
        'kode_tiket', 'nama_pelapor', 'no_hp', 'kategori',
        'isi_pengaduan', 'lokasi', 'foto', 'status',
        'tanggapan', 'ditangani_oleh',
    ];

    protected function casts(): array
    {
        return [
            'foto' => 'array',
        ];
    }

    public function ditanganiOleh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'ditangani_oleh');
    }
}
