let handler = async (m, { conn, usedPrefix }) => {
    try {
        let user = global.db.data.users[m.sender];
        let elapsedTime = new Date() - user.lastnambang;
        let remainingTime = 1200000 - elapsedTime;
        let timers = formatTime(remainingTime);
        let minerName = await conn.getName(m.sender);
        const tag = '@' + m.sender.split`@`[0];

        if (user.stamina < 20) {
            return m.reply(`🚫 *Stamina anda tidak cukup* 🚫\nHarap isi stamina anda dengan *${usedPrefix}eat* 🍖`);
        }

        if (remainingTime > 0) {
            return m.reply(`⏳ *Kamu masih kelelahan!* ⏳\n\nTunggu ${timers} sebelum bisa menambang lagi.`);
        }

        let weather = getWeather();
        let weatherEffect = weather === 'Badai' ? 0.8 : (weather === 'Cerah' ? 1.2 : 1);
        let toolDurability = Math.random() < 0.2 ? 'Rusak' : 'Baik';
        let toolEffect = toolDurability === 'Rusak' ? 0.5 : 1;
        let specialItem = Math.random() < 0.05 ? '🔮 Batu Ajaib' : null;

        let rewards = [
            Math.floor((Math.random() * 21) * weatherEffect * toolEffect),
            Math.floor(Math.random() * 11) * 10 * toolEffect,
            Math.floor(Math.random() * 11) * 10 * toolEffect,
            Math.floor((Math.random() * 21 + 5) * toolEffect),
            Math.floor(Math.random() * 11) * 10 * toolEffect,
            Math.floor(Math.random() * 11) * 10 * toolEffect,
            Math.floor(Math.random() * 11) * 10 * toolEffect,
            Math.floor((Math.random() * 6) + 5),
            Math.floor(Math.random() * 11) * 10
        ];

        let items = ['Diamond', 'Iron', 'Gold', 'Emerald', 'Rock', 'Clay', 'Coal', 'String', 'Exp'];
        let resultMessage = `🎉 *《 Hasil Nambang ${minerName} 》* 🎉\n\n` +
            `🌦️ *Cuaca:* ${weather}\n🛠️ *Kondisi Alat:* ${toolDurability}\n\n` +
            `📦 *Hasil Tambang:* \n\n` +
            items.map((item, index) => {
                let emoji = getEmoji(item);
                return `${emoji} *${item}:* [ ${rewards[index]} ]`;
            }).join('\n') +
            (specialItem ? `\n\n🌟 *Bonus Item Spesial:* ${specialItem}` : '') +
            `\n\n🔥 *Stamina berkurang -20* 🔥`;

        user.diamond += rewards[0];
        user.iron += rewards[1];
        user.gold += rewards[2];
        user.emerald += rewards[3];
        user.rock += rewards[4];
        user.clay += rewards[5];
        user.coal += rewards[6];
        user.string += rewards[7];
        user.exp += rewards[8];
        if (specialItem) user.specialItems.push(specialItem);
        user.stamina -= 20;
        user.lastnambang = new Date().getTime();

        setTimeout(() => {
            conn.reply(m.chat, `⛏️ Kak ${tag}, sudah waktunya menambang lagi!`, m);
        }, 1200000);

        m.reply(resultMessage);
    } catch (error) {
        m.reply('❌ Terjadi kesalahan saat mencoba menambang. Silakan coba lagi nanti.');
    }
};

handler.help = ['nambang'];
handler.tags = ['rpg'];
handler.command = /^(nambang|menambang)$/i;
handler.group = true;
export default handler;

function formatTime(ms) {
    let d = Math.floor(ms / 86400000);
    let h = Math.floor(ms / 3600000) % 24;
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [
        `${d} *Hari* 🌞`,
        `${h.toString().padStart(2, '0')} *Jam* 🕐`,
        `${m.toString().padStart(2, '0')} *Menit* ⏰`,
        `${s.toString().padStart(2, '0')} *Detik* ⏱️`
    ].join(', ');
}

function getWeather() {
    let weatherTypes = ['Cerah', 'Berawan', 'Hujan', 'Badai'];
    return weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
}

function getEmoji(item) {
    switch (item) {
        case 'Diamond': return '💎';
        case 'Iron': return '⛓️';
        case 'Gold': return '🪙';
        case 'Emerald': return '💚';
        case 'Rock': return '🪨';
        case 'Clay': return '🌕';
        case 'Coal': return '🕳️';
        case 'String': return '🧵';
        case 'Exp': return '📘';
        default: return '';
    }
}