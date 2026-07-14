<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Family extends Model
{
    protected $fillable = [
        'no_kk', 'nama_kepala_keluarga', 'alamat',
        'dusun_id', 'rt', 'rw', 'kode_pos',
    ];

    public function dusun(): BelongsTo
    {
        return $this->belongsTo(Dusun::class);
    }

    public function residents(): HasMany
    {
        return $this->hasMany(Resident::class);
    }
}
