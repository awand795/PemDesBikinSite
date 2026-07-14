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

    <div class="nomor-surat">
        Nomor: {{ $letter->nomor_surat ?? $letter->nomor_pengajuan }}
    </div>

    <div class="isi-surat">
        {!! $dynamicContent !!}
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
