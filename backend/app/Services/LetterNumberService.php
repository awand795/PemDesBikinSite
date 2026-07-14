<?php

namespace App\Services;

use App\Models\LetterRequest;
use App\Models\LetterType;

class LetterNumberService
{
    /**
     * Generate nomor surat dengan format: nomor/kode-jenis/bulan-romawi/tahun
     * Contoh: 001/SKTM/IV/2026
     */
    public function generate(LetterType $letterType): string
    {
        $year = now()->format('Y');
        $romanMonth = $this->toRoman(now()->format('n'));

        $lastRequest = LetterRequest::where('letter_type_id', $letterType->id)
            ->whereYear('created_at', $year)
            ->whereNotNull('nomor_surat')
            ->orderBy('id', 'desc')
            ->first();

        $lastNumber = 0;
        if ($lastRequest && preg_match('/^(\d+)\//', $lastRequest->nomor_surat, $matches)) {
            $lastNumber = (int) $matches[1];
        }

        $newNumber = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);

        return sprintf('%s/%s/%s/%s', $newNumber, $letterType->kode, $romanMonth, $year);
    }

    /**
     * Generate nomor pengajuan unik: YYYYMMDD-XXXXXX (6 random chars)
     */
    public function generatePengajuanNumber(): string
    {
        $date = now()->format('Ymd');
        $random = strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 6));
        return $date . '-' . $random;
    }

    /**
     * Generate kode tiket pengaduan: ADP-YYYYMMDD-XXXX
     */
    public function generateTicketCode(): string
    {
        $date = now()->format('Ymd');
        $random = strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 4));
        return 'ADP-' . $date . '-' . $random;
    }

    private function toRoman(int $number): string
    {
        $map = [
            1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV', 5 => 'V',
            6 => 'VI', 7 => 'VII', 8 => 'VIII', 9 => 'IX', 10 => 'X',
            11 => 'XI', 12 => 'XII',
        ];
        return $map[$number] ?? (string) $number;
    }
}
