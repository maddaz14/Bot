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
        if (number >= 1000000) return (number / 1000000).toFixed(1) + 'Jt';
        if (number >= 1000) return (number / 1000).toFixed(1) + 'K';
        return number;
    };

    if (!user.youtube_account) {
        return conn.sendMessage(m.chat, {
            text: `Kamu belum punya akun YouTube.\nBuat dulu dengan: *${usedPrefix}ytcreate*`,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: fkontak });
    }

    if (!user.streaming || !user.streaming.active) {
        return conn.sendMessage(m.chat, {
            text: `Kamu tidak sedang melakukan live streaming. Tidak ada yang bisa dibatalkan.`
        }, { quoted: fkontak });
    }

    const duration = Math.floor((Date.now() - user.streaming.startTime) / (1000 * 60));
    const finalViewers = user.streaming.currentViewers;
    const finalLikes = user.streaming.currentLikes;
    const earnings = user.streaming.totalEarnings || 0;

    user.viewers = (user.viewers || 0) + finalViewers;
    user.like = (user.like || 0) + finalLikes;
    user.youtubeMoney = (user.youtubeMoney || 0) + earnings;

    if (!user.videos) user.videos = []; // 💡 Fix: inisialisasi jika belum ada

    user.videos.push({
        title: user.streaming.title,
        duration: duration,
        viewers: finalViewers,
        likes: finalLikes,
        earnings: earnings,
        timestamp: Date.now()
    });

    // Simpan title dulu sebelum reset, agar tidak hilang dari pesan akhir
    const title = user.streaming.title;

    user.streaming = {
        active: false,
        title: '',
        startTime: 0,
        currentViewers: 0,
        currentLikes: 0,
        totalEarnings: 0
    };

    let summary = `
✅ Live streaming *"${title}"* telah berakhir!

*Statistik Live Ini:*
⏰ Durasi: *${duration} menit*
🪬 Penonton: *${formatNumber(finalViewers)}*
👍🏻 Likes: *${formatNumber(finalLikes)}*
💰 Pendapatan: *${formatNumber(earnings)} YT Money*

*Total Akun Anda Sekarang:*
👥 Subscribers: *${formatNumber(user.subscribers || 0)}*
🪬 Total Viewers: *${formatNumber(user.viewers)}*
👍🏻 Total Likes: *${formatNumber(user.like)}*
💰 YT Money: *${formatNumber(user.youtubeMoney)}*
`;

    conn.sendMessage(m.chat, {
        text: summary.trim(),
        contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: fkontak });
};

handler.help = ['ytcancel'];
handler.tags = ['game'];
handler.command = /^(ytcancel|youtubercancel|youtuber cancel|yt cancel|ytstop|ytendstream)$/i;
handler.register = true;

export default handler;