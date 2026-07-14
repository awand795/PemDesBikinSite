<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            margin: 0;
            padding: 40px;
        }
        .kop-surat {
            text-align: center;
            border-bottom: 3px solid #000;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .kop-surat .nama-desa {
            font-size: 18pt;
            font-weight: bold;
            text-transform: uppercase;
        }
        .kop-surat .alamat {
            font-size: 10pt;
        }
        .kop-surat .kecamatan {
            font-size: 11pt;
        }
        .judul-surat {
            text-align: center;
            font-weight: bold;
            font-size: 14pt;
            text-decoration: underline;
            margin: 20px 0;
        }
        .nomor-surat {
            text-align: center;
            margin-bottom: 20px;
        }
        .isi-surat {
            text-align: justify;
        }
        .isi-surat p {
            margin: 8px 0;
            text-indent: 40px;
        }
        .ttd {
            margin-top: 40px;
            text-align: right;
        }
        .ttd .keterangan {
            margin-bottom: 80px;
        }
        .table-data {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }
        .table-data td {
            padding: 3px 8px;
        }
    </style>
</head>
<body>
    <div class="kop-surat">
        <div class="nama-desa">PEMERINTAH {{ strtoupper($desa->kabupaten ?? '') }}</div>
        <div class="kecamatan">KECAMATAN {{ strtoupper($desa->kecamatan ?? '') }}</div>
        <div class="nama-desa" style="font-size: 16pt;">DESA {{ strtoupper($desa->nama_desa ?? '') }}</div>
        <div class="alamat">
            {{ $desa->alamat_kantor ?? '' }}
            @if($desa->telp) Telp. {{ $desa->telp }} @endif
            @if($desa->email) Email: {{ $desa->email }} @endif
        </div>
    </div>

    <div class="judul-surat">
        SURAT KETERANGAN
    </div>

    <div class="nomor-surat">
        Nomor: {{ $letter->nomor_surat ?? $letter->nomor_pengajuan }}
    </div>

    <div class="isi-surat">
        <p>Yang bertanda tangan di bawah ini, {{ $desa->nama_kepala_desa ?? 'Kepala Desa' }}, menerangkan bahwa:</p>

        <table class="table-data">
            @php
                $data = $letter->data_tambahan ?? [];
            @endphp
            <tr>
                <td style="width: 120px;">Nama</td>
                <td>: {{ $letter->nama_pemohon }}</td>
            </tr>
            <tr>
                <td>NIK</td>
                <td>: {{ $letter->nik_pemohon }}</td>
            </tr>
            @if($letter->resident)
            <tr>
                <td>Tempat, Tgl Lahir</td>
                <td>: {{ $letter->resident->tempat_lahir }}, {{ $letter->resident->tanggal_lahir?->isoFormat('D MMMM Y') ?? '-' }}</td>
            </tr>
            <tr>
                <td>Jenis Kelamin</td>
                <td>: {{ $letter->resident->jenis_kelamin == 'L' ? 'Laki-Laki' : 'Perempuan' }}</td>
            </tr>
            <tr>
                <td>Pekerjaan</td>
                <td>: {{ $letter->resident->pekerjaan ?? '-' }}</td>
            </tr>
            @endif
            @if(!empty($data))
                @foreach($data as $key => $value)
                <tr>
                    <td>{{ ucfirst(str_replace('_', ' ', $key)) }}</td>
                    <td>: {{ is_array($value) ? implode(', ', $value) : $value }}</td>
                </tr>
                @endforeach
            @endif
        </table>

        <p>Benar-benar penduduk Desa {{ $desa->nama_desa ?? '' }}, Kecamatan {{ $desa->kecamatan ?? '' }}, {{ $desa->kabupaten ?? '' }}.</p>
        <p>Surat keterangan ini dibuat untuk {{ $letter->keperluan ?? 'keperluan yang bersangkutan' }}.</p>
        <p>Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
    </div>

    <div class="ttd">
        <div class="keterangan">
            <p>{{ $desa->kabupaten ?? '' }}, {{ \Carbon\Carbon::parse($letter->tanggal_pengajuan)->isoFormat('D MMMM Y') }}</p>
            <p>{{ $desa->kecamatan ?? '' }}, {{ strtoupper($desa->nama_desa ?? '') }}</p>
            <p>{{ $desa->nama_kepala_desa ?? 'KEPALA DESA' }}</p>
        </div>
        <br><br><br>
        <p><u><strong>{{ $desa->nama_kepala_desa ?? '___________________' }}</strong></u></p>
    </div>
</body>
</html>
