let handler = async (m, { command, usedPrefix, args, conn }) => {
    let user = global.db.data.users[m.sender];
    let type = (args[0] || '').toLowerCase();
    let count = Math.max(parseInt(args[1]) || 1, 1);
    let staminaMax = 250;

    const foodList = {
        ayambakar: { emoji: '🍖', stamina: 10 },
        ikanbakar: { emoji: '🍖', stamina: 10 },
        lelebakar: { emoji: '🍖', stamina: 12 },
        nilabakar: { emoji: '🍖', stamina: 11 },
        bawalbakar: { emoji: '🍖', stamina: 13 },
        udangbakar: { emoji: '🍖', stamina: 14 },
        pausbakar: { emoji: '🍖', stamina: 20 },
        kepitingbakar: { emoji: '🍖', stamina: 16 },
        ayamgoreng: { emoji: '🍗', stamina: 10 },
        rendang: { emoji: '🥘', stamina: 15 },
        steak: { emoji: '🥩', stamina: 18 },
        babipanggang: { emoji: '🥠', stamina: 17 },
        gulai: { emoji: '🍲', stamina: 12 },
        oporayam: { emoji: '🍜', stamina: 11 },
        roti: { emoji: '🍞', stamina: 8 },
        sushi: { emoji: '🍣', stamina: 5 },
        vodka: { emoji: '🍷', stamina: 0 },
        bandage: { emoji: '💉', stamina: 0 },
        ganja: { emoji: '☘️', stamina: 0 },
        soda: { emoji: '🍺', stamina: 2 },
    };

    // Tampilkan daftar makanan jika argumen tidak sesuai
    if (!type || !(type in foodList)) {
        let list = `≡ *DAFTAR MAKANAN YANG BISA DIMAKAN 🍽️*\n`;
        list += `*(Jumlah) Nama : +Stamina*\n\n`;
        for (let [item, data] of Object.entries(foodList)) {
            list += `⬡ ${data.emoji} *${item}* (${user[item] || 0}) : +${data.stamina}\n`;
        }
        list += `\n📌 Ketik: *${usedPrefix + command} <item> <jumlah>*\nContoh: *${usedPrefix + command} ayambakar 2*`;
        return m.reply(list);
    }

    if (user[type] < count) {
        return m.reply(`❌ Kamu tidak punya cukup *${type}*. Punya: ${user[type] || 0}`);
    }

    if (user.stamina >= staminaMax) {
        return m.reply(`⚠️ Stamina kamu sudah penuh (${user.stamina}/${staminaMax})`);
    }

    let data = foodList[type];
    let gained = data.stamina * count;

    user[type] -= count;
    user.stamina = Math.min(user.stamina + gained, staminaMax);

    conn.reply(m.chat, `🍽️ Kamu makan *${count} ${type}*.\n💪 Stamina sekarang: ${user.stamina}/${staminaMax} (+${data.stamina * count})`, m);
};

handler.help = ['eat <item> <jumlah>'];
handler.tags = ['rpg'];
handler.command = /^(eat|makan)$/i;
handler.register = true;

export default handler;