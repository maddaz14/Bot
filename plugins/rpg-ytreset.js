// plugins/youtuber-reset.js
let handler = async (m, { conn, usedPrefix, command, args }) => {
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

    if (!user.youtube_account) {
        return conn.sendMessage(m.chat, {
            text: `Kamu belum punya akun YouTube. Tidak ada yang bisa di-reset.\nBuat dulu dengan: *${usedPrefix}ytcreate*`,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: fkontak });
    }

    if (user.streaming.active) {
        return conn.sendMessage(m.chat, {
            text: `Kamu sedang melakukan live streaming. Harap batalkan live dulu dengan *${usedPrefix}ytcancel* sebelum me-reset akun.`
        }, { quoted: fkontak });
    }

    if (!user.confirmResetYT) {
        user.confirmResetYT = true;
        return conn.sendMessage(m.chat, {
            text: `⚠️ Kamu yakin ingin me-reset semua progres akun YouTube-mu (*${user.youtube_account}*)?\nSemua subscribers, viewers, likes, YT Money, dan riwayat video akan di-reset ke 0.\n\nKetik *"${usedPrefix}ytreset confirm"* untuk melanjutkan.`
        }, { quoted: fkontak });
    }

    if (args[0] && args[0].toLowerCase() === 'confirm') {
        // Reset data YouTube user ke nilai awal
        user.subscribers = 0;
        user.viewers = 0;
        user.like = 0;
        user.youtubeMoney = 0;
        user.playButton = 0;
        user.streaming = { // Reset juga status streaming
            active: false,
            title: '',
            startTime: 0,
            currentViewers: 0,
            currentLikes: 0,
            totalEarnings: 0
        };
        user.videos = []; // Hapus riwayat video
        user.youtubeTools = { // Reset level alat ke default
            camera: 1,
            microphone: 1,
            editingSoftware: 1,
            internetSpeed: 1
        };
        user.lastActivity = 0;
        delete user.confirmResetYT; // Hapus flag konfirmasi

        conn.sendMessage(m.chat, {
            text: `✅ Akun YouTube Anda telah berhasil di-reset. Semua progres kembali ke awal!`
        }, { quoted: fkontak });
    } else {
        user.confirmResetYT = false; // Reset flag jika konfirmasi tidak cocok
        return conn.sendMessage(m.chat, {
            text: `Reset akun YouTube dibatalkan atau konfirmasi salah.\nJika ingin me-reset, ketik: *${usedPrefix}ytreset confirm*`
        }, { quoted: fkontak });
    }
};

handler.help = ['ytreset', 'ytreset confirm'];
handler.tags = ['game'];
handler.command = /^(ytreset|youtuberreset|youtuber reset|yt reset|ythapusdata)$/i;
handler.register = true;

export default handler;