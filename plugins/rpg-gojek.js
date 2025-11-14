import { readFileSync } from 'fs';

const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": `gojek ${global.namebot || 'Bot'} ✨`,
    }
};

const COOLDOWN_TIME = 1 * 60 * 60 * 1000; // 1 jam
const MAX_PROGRESS = 100;
const LOCATIONS = ["Jakarta", "Surabaya", "Bandung", "Yogyakarta", "Bali", "Medan", "Makassar", "Semarang", "Palembang", "Malang"];

function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculateReward(level) {
    if (level >= 1 && level <= 5) return getRandomValue(50000, 500000);
    if (level > 5 && level <= 50) return getRandomValue(500000, 1000000);
    return getRandomValue(500000, 3000000);
}

function getWIBTime(timestamp) {
    return new Date(timestamp).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
}

let handler = async (m, { conn, command, args, usedPrefix }) => {
    const user = global.db.data.users[m.sender];
    let mentionedJid = [m.sender];

    user.levelGojek = user.levelGojek || 1;
    user.progressGojek = user.progressGojek || 0;
    user.lastGojek = user.lastGojek || 0;
    user.lastGojekStart = user.lastGojekStart || 0;

    let tagUser = `@${m.sender.split('@')[0]}`;

    if (!args[0]) {
        const buttonMessage = {
            document: readFileSync('./autoCreateTmp.js'),
            mimetype: 'application/vnd.ms-powerpoint',
            fileName: `${global.namebot}`,
            fileLength: 999999999999,
            caption: 'Silakan pilih opsi:\n\nKamu bisa mulai Gojek atau melihat profil Gojek kamu.',
            footer: `${global.namebot} || ${global.author}`,
            buttons: [
                { buttonId: `${usedPrefix}gojek mulai`, buttonText: { displayText: '🚦 Mulai Gojek' }, type: 1 },
                { buttonId: `${usedPrefix}gojek profile`, buttonText: { displayText: '👤 Lihat Profil' }, type: 1 }
            ],
            headerType: 1,
            viewOnce: true,
            contextInfo: {
                mentionedJid,
                forwardingScore: 99999999,
                isForwarded: true,
                externalAdReply: {
                    title: "Game Gojek",
                    body: "",
                    thumbnailUrl: "https://files.catbox.moe/intcl3.jpg",
                    sourceUrl: "ponta",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        };
        return conn.sendMessage(m.chat, buttonMessage, { quoted: fkontak }); // Menggunakan fkontak
    }

    switch (args[0].toLowerCase()) {
        case 'mulai': {
            const now = Date.now();
            if (now - user.lastGojek < COOLDOWN_TIME) {
                const remainingTime = COOLDOWN_TIME - (now - user.lastGojek);
                return conn.reply(m.chat, `⏳ Kamu harus menunggu ${formatCooldown(remainingTime)} sebelum bisa mengantar lagi.`, fkontak); // Menggunakan fkontak
            }

            const location = LOCATIONS[getRandomValue(0, LOCATIONS.length - 1)];
            const distance = getRandomValue(1000, 20000);
            const distanceKm = (distance / 1000).toFixed(2);

            user.lastGojekStart = now;
            user.lastGojek = now;
            const progressGain = getRandomValue(1, 5);
            user.progressGojek += progressGain;

            const reward = calculateReward(user.levelGojek);
            user.money += reward; // PERUBAHAN: eris diubah menjadi money
            user.exp += getRandomValue(1000, 5000);

            let messageText = `🚗 *Kamu berhasil mengantar penumpang!*\n\n📍 *Lokasi Tujuan:* ${location}\n📏 *Jarak:* ${distance} meter (${distanceKm} km)\n🕒 *Waktu Mulai:* ${getWIBTime(user.lastGojekStart)} WIB\n\n💰 *Hadiah:* ${reward.toLocaleString()} Money\n📊 *Progres Gojek:* ${user.progressGojek}%`;

            if (user.progressGojek >= MAX_PROGRESS) {
                user.progressGojek = 0;
                user.levelGojek += 1;
                messageText = `🎉 Selamat ${tagUser}! Kamu naik level Gojek ke level ${user.levelGojek} dan mendapatkan 💰 ${reward.toLocaleString()} Money!`;
            }

            const resultMessage = {
                document: readFileSync('./autoCreateTmp.js'),
                mimetype: 'application/vnd.ms-powerpoint',
                fileName: `${global.namebot}`,
                fileLength: 999999999999,
                caption: messageText,
                footer: `${global.namebot} || ${global.author}`,
                buttons: [{ buttonId: `${usedPrefix}gojek profile`, buttonText: { displayText: '👤 Lihat Profil' }, type: 1 }],
                headerType: 1,
                viewOnce: true,
                contextInfo: {
                    mentionedJid,
                    forwardingScore: 99999999,
                    isForwarded: true,
                    externalAdReply: {
                        title: "Game Gojek",
                        body: "",
                        thumbnailUrl: "https://files.catbox.moe/intcl3.jpg",
                        sourceUrl: "ponta",
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            };
            return conn.sendMessage(m.chat, resultMessage, { quoted: fkontak }); // Menggunakan fkontak
        }

        case 'profile': {
            const profileMessage = `👤 *Profil Gojek - ${tagUser}*\n\n` +
                `📈 Level: ${user.levelGojek}\n` +
                `📊 Progres: ${user.progressGojek}%\n` +
                `💰 Uangmu: ${formatNominal(user.money)}\n` + // PERUBAHAN: eris diubah menjadi money
                `🌟 EXP: ${formatNominal(user.exp)}\n` +
                `⏳ Waktu Terakhir Gojek: ${getWIBTime(user.lastGojek)} WIB\n` +
                `🕒 Waktu Mulai Terakhir: ${user.lastGojekStart ? getWIBTime(user.lastGojekStart) + " WIB" : 'Belum ada perjalanan'}`;

            const profileResult = {
                document: readFileSync('./autoCreateTmp.js'),
                mimetype: 'application/vnd.ms-powerpoint',
                fileName: `${global.namebot}`,
                fileLength: 999999999999,
                caption: profileMessage,
                footer: `${global.namebot} || ${global.author}`,
                headerType: 1,
                viewOnce: true,
                contextInfo: {
                    mentionedJid,
                    forwardingScore: 99999999,
                    isForwarded: true,
                    externalAdReply: {
                        title: "Game Gojek",
                        body: "",
                        thumbnailUrl: "https://files.catbox.moe/intcl3.jpg",
                        sourceUrl: "ponta",
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            };
            return conn.sendMessage(m.chat, profileResult, { quoted: fkontak }); // Menggunakan fkontak
        }

        default:
            return conn.reply(m.chat, '🚫 Perintah tidak dikenali. Gunakan:\n- `gojek mulai`\n- `gojek profile`', fkontak); // Menggunakan fkontak
    }
    const remainingCooldown = user.lastGojek + COOLDOWN_TIME - Date.now();
    if (remainingCooldown > 0) {
        setTimeout(() => {
            conn.reply(m.chat, `[🚕] Waktunya ngojek lagi...`, fkontak); // Menggunakan fkontak
        }, remainingCooldown);
    }
};

handler.help = ['gojek'];
handler.tags = ['rpg'];
handler.command = /^(gojek)$/i;
handler.limit = 5;
handler.register = true;
handler.group = true;

export default handler;

function formatNominal(value) {
    if (value >= 1_000_000_000_000) return `${(value / 1_000_000_000_000).toFixed(1)} Triliun`;
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} Miliar`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} Juta`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)} Ribu`;
    return value.toLocaleString();
}

function formatCooldown(ms) {
    let seconds = Math.floor((ms / 1000) % 60);
    let minutes = Math.floor((ms / (1000 * 60)) % 60);
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

    let result = [];
    if (hours > 0) result.push(`${hours} jam`);
    if (minutes > 0) result.push(`${minutes} menit`);
    if (seconds > 0) result.push(`${seconds} detik`);

    return result.join(', ');
}