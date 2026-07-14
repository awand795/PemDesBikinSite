<?php

namespace App\Enums;

enum LetterRequestStatus: string
{
    case Menunggu = 'menunggu';
    case Diproses = 'diproses';
    case Disetujui = 'disetujui';
    case Ditolak = 'ditolak';
    case Selesai = 'selesai';

    public function label(): string
    {
        return match ($this) {
            self::Menunggu => 'Menunggu',
            self::Diproses => 'Diproses',
            self::Disetujui => 'Disetujui',
            self::Ditolak => 'Ditolak',
            self::Selesai => 'Selesai',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Menunggu => 'yellow',
            self::Diproses => 'blue',
            self::Disetujui => 'green',
            self::Ditolak => 'red',
            self::Selesai => 'green',
        };
    }
}
