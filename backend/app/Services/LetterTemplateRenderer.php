<?php

namespace App\Services;

use App\Models\DesaProfile;
use App\Models\LetterRequest;

class LetterTemplateRenderer
{
    /**
     * Render the template_konten by replacing placeholders with actual data.
     * Returns the rendered HTML body content (without kop surat wrapper).
     */
    public function render(LetterRequest $letterRequest, DesaProfile $desa): string
    {
        $letterType = $letterRequest->letterType;
        $template = $letterType?->template_konten;

        if (empty($template)) {
            return '';
        }

        $resident = $letterRequest->resident;

        $placeholders = [
            '{{nama}}' => $letterRequest->nama_pemohon,
            '{{nik}}' => $letterRequest->nik_pemohon,
            '{{alamat}}' => $resident?->alamat ?? ($letterRequest->data_tambahan['alamat'] ?? ''),
            '{{tempat_lahir}}' => $resident?->tempat_lahir ?? '',
            '{{tanggal_lahir}}' => $resident?->tanggal_lahir?->isoFormat('D MMMM Y') ?? '',
            '{{jenis_kelamin}}' => $resident?->jenis_kelamin === 'L' ? 'Laki-Laki' : ($resident?->jenis_kelamin === 'P' ? 'Perempuan' : ''),
            '{{pekerjaan}}' => $resident?->pekerjaan ?? '',
            '{{keperluan}}' => $letterRequest->keperluan,
            '{{tanggal_surat}}' => now()->isoFormat('D MMMM Y'),
            '{{nomor_surat}}' => $letterRequest->nomor_surat ?? $letterRequest->nomor_pengajuan,
            '{{nama_kepala_desa}}' => $desa->nama_kepala_desa ?? 'Kepala Desa',
            '{{nama_desa}}' => $desa->nama_desa ?? '',
        ];

        // Also replace additional data from data_tambahan
        $dataTambahan = $letterRequest->data_tambahan ?? [];
        foreach ($dataTambahan as $key => $value) {
            $placeholder = '{{' . $key . '}}';
            if (!isset($placeholders[$placeholder])) {
                $placeholders[$placeholder] = is_array($value) ? implode(', ', $value) : (string) $value;
            }
        }

        $rendered = str_replace(array_keys($placeholders), array_values($placeholders), $template);

        // Convert newlines to paragraphs for clean HTML rendering
        $rendered = nl2br(e($rendered));

        return $rendered;
    }

    /**
     * Wrap rendered content with full PDF HTML structure (kop surat, styles, etc.)
     */
    public function wrapWithSuratTemplate(string $bodyContent, LetterRequest $letterRequest, DesaProfile $desa): string
    {
        $kopSurat = view('pdf.surat', [
            'letter' => $letterRequest,
            'desa' => $desa,
        ])->render();

        // Extract just the body content area from the rendered blade
        // by replacing the judul + isi-surat section
        return view('pdf.surat', [
            'letter' => $letterRequest,
            'desa' => $desa,
            'dynamicContent' => $bodyContent,
        ])->render();
    }
}
