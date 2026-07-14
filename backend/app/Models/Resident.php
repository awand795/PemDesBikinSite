<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Resident extends Model
{
    protected $fillable = [
        'family_id', 'nik', 'nama_lengkap', 'jenis_kelamin',
        'tempat_lahir', 'tanggal_lahir', 'agama', 'pendidikan_terakhir',
        'pekerjaan', 'status_perkawinan', 'status_dalam_keluarga',
        'golongan_darah', 'kewarganegaraan', 'no_hp', 'foto_path', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_lahir' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function family(): BelongsTo
    {
        return $this->belongsTo(Family::class);
    }

    public function getUmurAttribute(): ?int
    {
        if (!$this->tanggal_lahir) {
            return null;
        }
        return $this->tanggal_lahir->age;
    }
}
