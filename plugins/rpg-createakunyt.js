// plugins/youtuber-create.js
let handler = async (m, { conn, command, usedPrefix }) => {
    const user = global.db.data.users[m.sender];
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

    if (user.youtube_account) {
        return conn.sendMessage(m.chat, {
            text: `Kamu sudah punya akun YouTube: *${user.youtube_account}*.\nKalau mau lihat, ketik: *${usedPrefix}ytakun*`
        }, { quoted: fkontak });
    }

    // Inisialisasi data akun YouTube baru
    user.youtube_account = `Channel ${conn.getName(m.sender)}`; // Nama channel default
    user.subscribers = 0;
    user.viewers = 0; // Total viewers dari semua video/live
    user.like = 0; // Total likes dari semua video/live
    user.youtubeMoney = 0; // Mata uang khusus YouTube
    user.playButton = 0; // 0: None, 1: Silver, 2: Gold, 3: Diamond
    user.streaming = { // Status dan data streaming saat ini
        active: false,
        title: '',
        startTime: 0,
        currentViewers: 0, // Penonton saat ini
        currentLikes: 0, // Likes saat ini
        totalEarnings: 0 // Pendapatan dari live ini
    };
    user.videos = []; // Array untuk menyimpan riwayat video/live yang selesai
    user.youtubeTools = { // Level upgrade alat
        camera: 1, // Mempengaruhi kualitas video, viewers, likes
        microphone: 1,
        editingSoftware: 1,
        internetSpeed: 1 // Mempengaruhi stabilitas live
    };
    user.lastActivity = 0; // Timestamp aktivitas terakhir, bisa untuk bonus harian dll.

    conn.sendMessage(m.chat, {
        text: `🎉 Selamat! Akun YouTube-mu *${user.youtube_account}* berhasil dibuat!\nSekarang kamu bisa mulai streaming dengan *${usedPrefix}ytstream [judul live]*`
    }, { quoted: fkontak });
};

handler.help = ['ytcreate'];
handler.tags = ['game'];
handler.command = /^(ytcreate|youtubercreate|youtuber create|yt create)$/i;
handler.register = true;

export default handler;