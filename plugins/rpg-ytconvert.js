// plugins/youtuber-convert.js
let handler = async (m, { conn, args, usedPrefix, command }) => {
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

    const conversionRate = 10; // 10 YT Money = 1 Money bot (contoh)

    if (!user.youtube_account) {
        return conn.sendMessage(m.chat, {
            text: `Kamu belum punya akun YouTube.\nBuat dulu dengan: *${usedPrefix}ytcreate*`,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: fkontak });
    }

    if (!args[0] || isNaN(args[0])) {
        return conn.sendMessage(m.chat, {
            text: `Untuk menukar YT Money menjadi Money bot, masukkan jumlahnya.\nContoh: *${usedPrefix}ytconvert 1000*\n\nYT Money Anda: *${user.youtubeMoney}* 💰\nRate: 10 YT Money = 1 Money bot`
        }, { quoted: fkontak });
    }

    const amountToConvert = parseInt(args[0]);

    if (amountToConvert <= 0) {
        return conn.sendMessage(m.chat, {
            text: `Jumlah yang ingin ditukar harus lebih besar dari 0.`
        }, { quoted: fkontak });
    }

    if (user.youtubeMoney < amountToConvert) {
        return conn.sendMessage(m.chat, {
            text: `YT Money Anda tidak cukup untuk menukar ${amountToConvert}.\nAnda hanya punya: ${user.youtubeMoney} YT Money.`
        }, { quoted: fkontak });
    }

    const convertedMoney = Math.floor(amountToConvert / conversionRate);

    user.youtubeMoney -= amountToConvert;
    user.money = (user.money || 0) + convertedMoney; // Asumsi bot kamu punya 'money' di database

    conn.sendMessage(m.chat, {
        text: `✅ Berhasil menukarkan *${amountToConvert} YT Money* menjadi *${convertedMoney} Money bot*.\n\nYT Money Anda sekarang: *${user.youtubeMoney}* 💰\nMoney bot Anda sekarang: *${user.money}* 💵`
    }, { quoted: fkontak });
};

handler.help = ['ytconvert <jumlah>'];
handler.tags = ['game'];
handler.command = /^(ytconvert|youtuberconvert|youtuber convert|yt convert|ytexchange|yttukar)$/i;
handler.register = true;

export default handler;