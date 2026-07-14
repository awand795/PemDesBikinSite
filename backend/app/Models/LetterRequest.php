<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LetterRequest extends Model
{
    protected $fillable = [
        'nomor_pengajuan', 'letter_type_id', 'resident_id',
        'nama_pemohon', 'nik_pemohon', 'keperluan', 'data_tambahan',
        'lampiran', 'status', 'catatan_admin', 'nomor_surat',
        'tanggal_pengajuan', 'tanggal_diproses', 'diproses_oleh',
    ];

    protected function casts(): array
    {
        return [
            'data_tambahan' => 'array',
            'lampiran' => 'array',
            'tanggal_pengajuan' => 'datetime',
            'tanggal_diproses' => 'datetime',
        ];
    }

    public function letterType(): BelongsTo
    {
        return $this->belongsTo(LetterType::class);
    }

    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    public function diprosesOleh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'diproses_oleh');
    }
}
