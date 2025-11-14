// plugins/youtuber-leaderboard.js
let handler = async (m, { conn, usedPrefix }) => {
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

    // Ambil semua pengguna dari database yang memiliki akun YouTube
    const users = Object.values(global.db.data.users || {}).filter(user => user.youtube_account);

    if (users.length === 0) {
        return conn.sendMessage(m.chat, {
            text: `Belum ada akun YouTube yang terdaftar di bot ini. Jadilah yang pertama dengan *${usedPrefix}ytcreate*!`
        }, { quoted: fkontak });
    }

    // Urutkan berdasarkan subscribers (tertinggi ke terendah)
    const sortedUsers = users.sort((a, b) => (b.subscribers || 0) - (a.subscribers || 0));

    let leaderboardText = `
*Top 10 YouTuber Bot*
(Berdasarkan Subscribers)

`;
    for (let i = 0; i < Math.min(sortedUsers.length, 10); i++) {
        const user = sortedUsers[i];
        const userName = user.youtube_account || conn.getName(user.id); // Gunakan nama channel atau nama default
        leaderboardText += `*${i + 1}.* ${userName} - *${formatNumber(user.subscribers || 0)} Subscribers*\n`;
    }

    leaderboardText += `\n_Data ini diperbarui secara berkala._`;

    conn.sendMessage(m.chat, {
        text: leaderboardText.trim()
    }, { quoted: fkontak });
};

handler.help = ['ytlb'];
handler.tags = ['game'];
handler.command = /^(ytlb|youtuberlb|youtuber leaderboard|yt leaderboard|topyt)$/i;
handler.register = true;

export default handler;