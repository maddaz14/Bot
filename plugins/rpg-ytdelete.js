// plugins/youtuber-delete.js
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
            text: `Kamu belum punya akun YouTube. Tidak ada yang bisa dihapus.\nBuat dulu dengan: *${usedPrefix}ytcreate*`,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: fkontak });
    }

    if (user.streaming.active) {
        return conn.sendMessage(m.chat, {
            text: `Kamu sedang melakukan live streaming. Harap batalkan live dulu dengan *${usedPrefix}ytcancel* sebelum menghapus akun.`
        }, { quoted: fkontak });
    }

    if (!user.confirmDeleteYT) {
        user.confirmDeleteYT = true;
        return conn.sendMessage(m.chat, {
            text: `⚠️ Kamu yakin ingin menghapus akun YouTube-mu (*${user.youtube_account}*)?\nSemua data (subscribers, viewers, dll.) akan hilang permanen.\n\nKetik *"${usedPrefix}ytdelete confirm"* untuk melanjutkan.`
        }, { quoted: fkontak });
    }

    if (args[0] && args[0].toLowerCase() === 'confirm') {
        // Hapus semua data YouTube dari user
        delete user.youtube_account;
        delete user.subscribers;
        delete user.viewers;
        delete user.like;
        delete user.youtubeMoney;
        delete user.playButton;
        delete user.streaming;
        delete user.videos;
        delete user.youtubeTools;
        delete user.lastActivity;
        delete user.confirmDeleteYT; // Hapus flag flag konfirmasi

        conn.sendMessage(m.chat, {
            text: `✅ Akun YouTube Anda telah berhasil dihapus. Sampai jumpa lagi!`
        }, { quoted: fkontak });
    } else {
        user.confirmDeleteYT = false; // Reset flag jika konfirmasi tidak cocok
        return conn.sendMessage(m.chat, {
            text: `Penghapusan akun YouTube dibatalkan atau konfirmasi salah.\nJika ingin menghapus, ketik: *${usedPrefix}ytdelete confirm*`
        }, { quoted: fkontak });
    }
};

handler.help = ['ytdelete', 'ytdelete confirm'];
handler.tags = ['game'];
handler.command = /^(ytdelete|youtuberdelete|youtuber delete|yt delete|ythapus)$/i;
handler.register = true;

export default handler;