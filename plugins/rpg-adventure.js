import fetch from 'node-fetch';

const cooldown = 600000; // 10 menit

let handler = async (m, { usedPrefix }) => {
    let user = global.db.data.users[m.sender];
    const tag = '@' + m.sender.split`@`[0];
    const more = String.fromCharCode(8206);
    const readMore = more.repeat(4001);

    let now = new Date().getTime();
    let remainingTime = cooldown - (now - user.lastadventure || 0);

    if (user.health < 80) {
        return m.reply(
            `Kesehatan kamu kurang dari 80% dan tidak bisa berpetualang.\nGunakan ${usedPrefix}heal jika kamu memiliki potion, atau beli dengan ${usedPrefix}buy potion 1.`
        );
    }

    if (remainingTime > 0) {
        let timeLeft = formatTime(remainingTime);
        return m.reply(
            `Kamu sudah berpetualang. Tunggu *🕐${timeLeft}* lagi untuk bisa berpetualang kembali.`
        );
    }

    // Hitung hadiah adventure
    let rewards = calculateRewards();
    let rewardText = `*[ Selesai Adventure ]*\n\n${tag}\n\nAnda membawa pulang:`;
    for (let item in rewards) {
        if (rewards[item]) {
            if (item === 'money') {
                user.money = (user.money || 0) + rewards[item];
                rewardText += `\n💰 *Money:* ${rewards[item]}`;
            } else {
                user[item] = (user[item] || 0) + rewards[item];
                rewardText += `\n${getEmojiForReward(item)} *${capitalizeFirstLetter(item)}:* ${rewards[item]}`;
            }
        }
    }

    // Kurangi kesehatan
    const healthLost = getRandomValue(20, 100);
    user.health -= healthLost;
    rewardText += `\n\nHealth kamu berkurang sebanyak ${healthLost}.`;

    m.reply(rewardText.trim());
    user.lastadventure = now;
};

handler.help = ['adventure'];
handler.tags = ['rpg'];
handler.command = /^(adventure|adv|adven|(ber)?petualang(ang)?)$/i;
handler.register = true;
handler.cooldown = cooldown;
handler.group = true;

export default handler;

// Fungsi untuk menghitung hadiah adventure
function calculateRewards() {
    return {
        money: getRandomValue(500000, 1000000),
        exp: getRandomValue(100, 500),
        potion: getRandomValue(0, 2),
        common: getRandomValue(1, 5),
        uncommon: getRandomValue(1, 3),
        mythic: getRandomValue(0, 2),
        legendary: getRandomValue(0, 1),
    };
}

// Fungsi untuk mendapatkan nilai random
function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fungsi untuk mendapatkan emoji berdasarkan reward
function getEmojiForReward(item) {
    const emojis = {
        exp: '⭐',
        potion: '🍷',
        common: '⚔️',
        uncommon: '🛡️',
        mythic: '🔥',
        legendary: '🏆',
    };
    return emojis[item] || '';
}

// Fungsi untuk kapitalisasi kata pertama
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Fungsi untuk format waktu (HH:MM:SS)
function formatTime(ms) {
    let totalSeconds = Math.floor(ms / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    return [hours, minutes, seconds]
        .map(v => v.toString().padStart(2, '0'))
        .join(':');
}