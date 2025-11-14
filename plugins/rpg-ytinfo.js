// plugins/youtuber-menu.js
let handler = async (m, { conn, usedPrefix, command }) => {
    const fkontak = {
        key: {
            participant: '0@s.whatsapp.net',
            remoteJid: "0@s.whatsapp.net",
            fromMe: false,
            id: "Halo",
        },
        message: {
            conversation: `Akun YT ${global.namebot || 'Bot'} 🪾`
        }
    };

    let introText = `
*YOUTUBER IN BOT: JADILAH BINTANG DIGITAL!*
_Wujudkan Mimpimu Menjadi Content Creator Terkenal di Sini!_

Selamat datang para calon YouTuber sukses! Di sini, kalian bisa merasakan serunya membangun channel dan jadi sensasi internet. Siap untuk *NGONTEN*? Yuk, intip perintah-perintah di bawah ini:

---

*DAFTAR COMMAND SPESIAL YOUTUBER*

${usedPrefix}ytakun
  Cek *dashboard* channel-mu: lihat subscriber, viewer, like, dan YT Money.

${usedPrefix}ytcreate
  Mulai petualanganmu! Buat channel YouTube pertamamu dan raih impian.

${usedPrefix}ytstream [judul live]
  Saatnya *LIVE!* Mulai siaran langsung dan tarik perhatian penonton.

${usedPrefix}ytupgrade [alat]
  Upgrade *STUDIO*-mu! Tingkatkan kamera, mic, software, dan internet untuk kualitas konten terbaik.

${usedPrefix}ytlihat
  Intip kembali *KOLEKSI VIDEO*-mu: rekam jejak live streaming yang sudah kamu lakukan.

${usedPrefix}ytconvert [jumlah]
  Cairkan penghasilan! Tukar *YT Money*-mu jadi mata uang utama bot.

${usedPrefix}ytevent
  Jangan sampai ketinggalan! Cek event spesial dengan hadiah melimpah.

${usedPrefix}ytbackup
  Aman terkendali! Cadangkan data channel-mu agar progresmu selalu terjaga.

${usedPrefix}ytlb
  Siapa *RAJA/RATU YOUTUBE*? Lihat peringkat YouTuber teratas di bot ini.

${usedPrefix}ytrename [nama baru]
  Ganti nama channel? *REBRANDING* jadi lebih mudah.

${usedPrefix}ytdelete confirm
  Pensiun dini? Hapus akun YouTube-mu, tapi ingat, data akan hilang permanen!

${usedPrefix}ytcancel
  Udahan dulu live-nya? Akhiri streaming secara manual kapan pun kamu mau.

${usedPrefix}ytreset confirm
  Mulai dari nol? Reset semua riwayat channel-mu, cocok buat kamu yang mau tantangan baru!

---

*PANDUAN CEPAT JADI YOUTUBER SUKSES*

1.  *Action!* Ketik *${usedPrefix}ytcreate* untuk bikin channel barumu.
2.  *Go Live!* Mulai streaming dengan *${usedPrefix}ytstream [judul live]*. Semakin sering live, semakin banyak *viewers* dan *likes* yang kamu dapat!
3.  *Wrap Up!* Selesai live? Pakai *${usedPrefix}ytcancel* untuk melihat laporan performa live-mu.
4.  *Level Up!* Gunakan *${usedPrefix}ytupgrade [alat]* buat ningkatin kualitas alat-alat *ngonten*-mu. Alat bagus = penonton makin betah!
5.  *Profit!* Kumpulin *YT Money* dari hasil streaming, lalu tukar jadi uang utama bot dengan *${usedPrefix}ytconvert [jumlah]*.
6.  *Analyze!* Pantau progresmu di *${usedPrefix}ytakun* dan lihat koleksi videomu di *${usedPrefix}ytlihat*.
7.  *Compete!* Tantang dirimu jadi nomor satu! Cek *leaderboard* dengan *${usedPrefix}ytlb*.

---

_Catatan:_ Game ini masih dalam tahap pengembangan (beta testing). Jika ada _bug_ atau error, mohon dimaklumi. Feedbackmu sangat berarti!

_Yuk, MULAI PETUALANGAN YOUTUBER-mu sekarang!_
`;

    conn.sendMessage(m.chat, {
        text: introText.trim(),
        contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: fkontak });
};

handler.help = ['ytmenu'];
handler.tags = ['game'];
handler.command = /^(ytmenu|youtubermenu|youtuber|yt)$/i;
handler.register = true;

export default handler;