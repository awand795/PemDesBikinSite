<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LetterType extends Model
{
    protected $fillable = [
        'kode', 'nama', 'deskripsi', 'template_konten',
        'persyaratan', 'estimasi_hari', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'persyaratan' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function letterRequests(): HasMany
    {
        return $this->hasMany(LetterRequest::class);
    }
}
