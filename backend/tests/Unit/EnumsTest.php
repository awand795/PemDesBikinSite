<?php

namespace Tests\Unit;

use App\Enums\ComplaintStatus;
use App\Enums\LetterRequestStatus;
use App\Enums\NewsStatus;
use PHPUnit\Framework\TestCase;

class EnumsTest extends TestCase
{
    // ============= ComplaintStatus =============

    public function test_complaint_status_labels(): void
    {
        $this->assertSame('Baru', ComplaintStatus::Baru->label());
        $this->assertSame('Diproses', ComplaintStatus::Diproses->label());
        $this->assertSame('Selesai', ComplaintStatus::Selesai->label());
        $this->assertSame('Ditolak', ComplaintStatus::Ditolak->label());
    }

    public function test_complaint_status_colors(): void
    {
        $this->assertSame('red', ComplaintStatus::Baru->color());
        $this->assertSame('blue', ComplaintStatus::Diproses->color());
        $this->assertSame('green', ComplaintStatus::Selesai->color());
        $this->assertSame('gray', ComplaintStatus::Ditolak->color());
    }

    public function test_complaint_status_values(): void
    {
        $this->assertSame('baru', ComplaintStatus::Baru->value);
        $this->assertSame('diproses', ComplaintStatus::Diproses->value);
        $this->assertSame('selesai', ComplaintStatus::Selesai->value);
        $this->assertSame('ditolak', ComplaintStatus::Ditolak->value);
    }

    // ============= LetterRequestStatus =============

    public function test_letter_request_status_labels(): void
    {
        $this->assertSame('Menunggu', LetterRequestStatus::Menunggu->label());
        $this->assertSame('Diproses', LetterRequestStatus::Diproses->label());
        $this->assertSame('Disetujui', LetterRequestStatus::Disetujui->label());
        $this->assertSame('Ditolak', LetterRequestStatus::Ditolak->label());
        $this->assertSame('Selesai', LetterRequestStatus::Selesai->label());
    }

    public function test_letter_request_status_colors(): void
    {
        $this->assertSame('yellow', LetterRequestStatus::Menunggu->color());
        $this->assertSame('blue', LetterRequestStatus::Diproses->color());
        $this->assertSame('green', LetterRequestStatus::Disetujui->color());
        $this->assertSame('red', LetterRequestStatus::Ditolak->color());
        $this->assertSame('green', LetterRequestStatus::Selesai->color());
    }

    public function test_letter_request_status_values(): void
    {
        $this->assertSame('menunggu', LetterRequestStatus::Menunggu->value);
        $this->assertSame('diproses', LetterRequestStatus::Diproses->value);
        $this->assertSame('disetujui', LetterRequestStatus::Disetujui->value);
        $this->assertSame('ditolak', LetterRequestStatus::Ditolak->value);
        $this->assertSame('selesai', LetterRequestStatus::Selesai->value);
    }

    // ============= NewsStatus =============

    public function test_news_status_labels(): void
    {
        $this->assertSame('Draft', NewsStatus::Draft->label());
        $this->assertSame('Published', NewsStatus::Published->label());
    }

    public function test_news_status_values(): void
    {
        $this->assertSame('draft', NewsStatus::Draft->value);
        $this->assertSame('published', NewsStatus::Published->value);
    }
}
