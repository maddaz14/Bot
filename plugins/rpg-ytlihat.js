// plugins/youtuber-lihat.js
let handler = async (m, { conn, usedPrefix }) => {
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

    const formatNumber = (number) => {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'Jt';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        } else {
            return number;
        }
    };

    if (!user.youtube_account) {
        return conn.sendMessage(m.chat, {
            text: `Kamu belum punya akun YouTube.\nBuat dulu dengan: *${usedPrefix}ytcreate*`,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: fkontak });
    }

    if (!user.videos || user.videos.length === 0) {
        return conn.sendMessage(m.chat, {
            text: `Kamu belum punya riwayat video/live. Mulai streaming dulu dengan *${usedPrefix}ytstream [judul live]*!`
        }, { quoted: fkontak });
    }

    let videoList = `*Daftar Video/Live YouTube Kamu*\n\n`;
    user.videos.forEach((video, index) => {
        videoList += `*${index + 1}. Judul:* ${video.title}\n`;
        videoList += `   Durasi: ${video.duration} menit\n`;
        videoList += `   Penonton: ${formatNumber(video.viewers)}\n`;
        videoList += `   Likes: ${formatNumber(video.likes)}\n`;
        videoList += `   Pendapatan: ${formatNumber(video.earnings)} YT Money\n`;
        videoList += `   Tanggal: ${new Date(video.timestamp).toLocaleDateString('id-ID')}\n\n`;
    });

    return conn.sendMessage(m.chat, {
        text: videoList.trim(),
        contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: fkontak });
};

handler.help = ['ytlihat'];
handler.tags = ['game'];
handler.command = /^(ytlihat|youtuberlihat|youtuber lihat|yt lihat|ytvideo|ythistory)$/i;
handler.register = true;

export default handler;