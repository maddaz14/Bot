// plugins/youtuber-event.js
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

    if (!user.youtube_account) {
        return conn.sendMessage(m.chat, {
            text: `Kamu belum punya akun YouTube.\nBuat dulu dengan: *${usedPrefix}ytcreate*`,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: fkontak });
    }

    // Contoh Logika Event Sederhana
    const now = Date.now();
    let eventMessage = `
*Event Youtuber In Bot*

Saat ini belum ada event khusus yang sedang berlangsung.
Tetaplah aktif dan pantau terus pengumuman event selanjutnya!

*Tips:* Ikuti terus channel *${global.namebot || 'Bot'}* untuk info terbaru!
`;

    // Contoh event sederhana yang bisa kamu atur manual atau dari config
    const weeklyBonusEvent = {
        name: "Bonus Subscriber Mingguan",
        description: "Dapatkan bonus 100 subscribers setiap hari Sabtu pukul 12:00 WIB!",
        isActive: false, // Set true jika event sedang aktif
        triggerTime: new Date("2025-06-21T12:00:00+07:00").getTime() // Contoh waktu pemicu (contoh: 21 Juni 2025, 12:00 WIB)
    };

    if (weeklyBonusEvent.isActive) {
        eventMessage = `
*Event Sedang Berlangsung: ${weeklyBonusEvent.name}!*
${weeklyBonusEvent.description}
`;
    } else if (now < weeklyBonusEvent.triggerTime) {
        const timeUntil = weeklyBonusEvent.triggerTime - now;
        const days = Math.floor(timeUntil / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeUntil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        eventMessage = `
*Event Mendatang: ${weeklyBonusEvent.name}!*
${weeklyBonusEvent.description}
Event akan dimulai dalam: *${days} hari ${hours} jam lagi.*
`;
    }

    conn.sendMessage(m.chat, {
        text: eventMessage.trim()
    }, { quoted: fkontak });
};

handler.help = ['ytevent'];
handler.tags = ['game'];
handler.command = /^(ytevent|youtuberevent|youtuber event|yt event|ytevents)$/i;
handler.register = true;

export default handler;