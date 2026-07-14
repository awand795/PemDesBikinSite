<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Dusun extends Model
{
    protected $fillable = [
        'nama_dusun',
        'nama_kepala_dusun',
    ];

    public function families(): HasMany
    {
        return $this->hasMany(Family::class);
    }

    public function residents(): HasMany
    {
        return $this->hasManyThrough(Resident::class, Family::class);
    }
}
