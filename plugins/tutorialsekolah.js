let handler = async (m) => {
  m.reply(`*Panduan Lengkap Sekolah ubed*

Fitur eksklusif pendidikan di dalam bot. Lengkap dengan sistem guru, murid, orang tua, nilai, tabungan, BK, beasiswa & sertifikat.

––––––––––––––––––––––––––––––
*1. REGISTRASI & PERAN*
• .sekolah daftar dan pilih peran
  - .sekolahmurid
  - .sekolahguru
  - .sekolahortu

*Note:* Bisa ganti peran setelah 3 hari.

––––––––––––––––––––––––––––––
*2. PERINTAH MURID*
• .absen = absen harian
• .tugas = lihat & kerjakan tugas
• .kerjatugas [jawaban] = jawab tugas
• .ujian = jawab soal ujian dari guru
• .ceknilai = cek semua nilai ujian
• .izin [alasan] =izin tidak masuk
• .tabung [jumlah] = menabung
• .cektabungan = cek saldo tabungan
• .rankingsekolah = cek ranking

*Bonus:*  
- Kerja tugas/ujian = +Money (10rb–10jt), +EXP (500–9999)  
- Ranking tinggi = potensi beasiswa

––––––––––––––––––––––––––––––
*3. PERINTAH GURU*
• .buatsoal [soal | jawaban] = buat soal
• .ujian @murid = kirim ujian ke murid
• .nilai @murid [angka] = beri nilai
• .laporanakhir @murid = ringkasan nilai
• .hapustugas = hapus tugas aktif
• .bk @murid [pelanggaran] = lapor BK
• .setreward @murid [money|exp] = beri reward manual

––––––––––––––––––––––––––––––
*4. PERINTAH ORANG TUA*
• .cekrapor @anak = cek nilai anak
• .absenanak @anak = cek absen anak
• .bayarspp [jumlah] = bayar SPP anak
• .izinanak @anak [alasan] = izin anak

*Bonus:*  
Orang tua juga dapat reward Money/Exp setelah interaksi.

––––––––––––––––––––––––––––––
*5. SISTEM NILAI & RAPOR*
• Nilai ujian dinilai guru secara manual
• Tugas otomatis dicek oleh bot
• Nilai bisa dilihat di:
  - .ceknilai
  - .cekrapor (oleh ortu)

––––––––––––––––––––––––––––––
*6. SISTEM BK (Bimbingan Konseling)*
• .bk @murid [pelanggaran]
• Setiap pelanggaran tercatat dan bisa berdampak ke:
  - Beasiswa
  - Sertifikat kelulusan
  - Ranking

––––––––––––––––––––––––––––––
*7. SERTIFIKAT KELULUSAN*
• .sertifikatsarjana @murid  
Diberikan oleh guru jika murid lulus (level tinggi & nilai memadai)

––––––––––––––––––––––––––––––
*8. BEASISWA*
• Otomatis diberikan jika:
  - Nilai rata-rata tinggi
  - Ranking top
• .beasiswaku = cek beasiswa
• .beasiswamanual @murid → diberi manual oleh guru

––––––––––––––––––––––––––––––
*9. REWARD OTOMATIS*
Setiap aktivitas (tugas, absen, ujian, cek nilai):
• Money: 10.000 – 10.000.000
• Exp: 500 – 9999

––––––––––––––––––––––––––––––
*10. LEADERBOARD / RANKING*
• .rankingsekolah = urutan berdasarkan nilai total
• .lb sekolah = leaderboard resmi

––––––––––––––––––––––––––––––
*Tips:*
- Aktif setiap hari untuk reward
- Ranking tinggi = potensi beasiswa
- Saling bantu antar murid & guru
- Taat peran & semangat belajar!

*Sekolah ubed*  
“Tempat belajar, bertumbuh, dan bersenang-senang bareng komunitas bot!”

`)
}

handler.help = ['tutorialsekolah']
handler.tags = ['info']
handler.command = /^tutorialsekolah$/i

export default handler