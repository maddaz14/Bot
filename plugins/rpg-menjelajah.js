const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": `menjelajah ${global.namebot || 'Bot'} ✨`,
    }
};

let handler = async (m, { conn, usedPrefix }) => {
    try {
        let user = global.db.data.users[m.sender];
        let elapsedTime = new Date() - user.lastExploring;
        let remainingTime = 3600000 - elapsedTime;
        let timers = formatTime(remainingTime);
        let explorerName = await conn.getName(m.sender);
        const tag = '@' + m.sender.split`@`[0];

        if (user.stamina < 15) {
            return conn.reply(m.chat, `⚠️ *Stamina Anda Tidak Cukup* ⚠️\n\nIsi stamina Anda dengan *${usedPrefix}eat*`, fkontak); // Menggunakan fkontak
        }

        if (remainingTime > 0) {
            return conn.reply(m.chat, `😩 *Anda Masih Kelelahan* 😩\n\nHarap tunggu ${timers} lagi sebelum Anda dapat menjelajah lagi!`, fkontak); // Menggunakan fkontak
        }

        if (!m.text.includes("1") && !m.text.includes("2") && !m.text.includes("3")) {
            return conn.reply(
                m.chat,
                `🌍 *Pilih Destinasi Menjelajah* 🌍\n\n` +
                `1️⃣ *Hutan Ajaib*\n- Gratis\n` +
                `2️⃣ *Pegunungan Himalaya*\n- 💵 Biaya 5 Juta Money\n` +
                `3️⃣ *Pulau Harta Karun*\n- 💵 Biaya 10 Juta Money\n\n` +
                `💡 Contoh *${usedPrefix}menjelajah 1*`,
                fkontak // Menggunakan fkontak
            );
        }

        let destination, cost, rewardFunc;
        if (m.text.includes("1")) {
            destination = "Hutan Ajaib 🌲";
            cost = 0;
            rewardFunc = getForestRewards;
        } else if (m.text.includes("2")) {
            destination = "Pegunungan Himalaya 🏔️";
            cost = 5000000;
            rewardFunc = getMountainRewards;
        } else if (m.text.includes("3")) {
            destination = "Pulau Harta Karun 🏝️";
            cost = 10000000;
            rewardFunc = getTreasureIslandRewards;
        }

        if (user.money < cost) { // PERUBAHAN: eris diubah menjadi money
            return conn.reply(m.chat, `💸 *Uang Anda Tidak Cukup* 💸\n\nAnda membutuhkan ${cost.toLocaleString()} Money untuk menjelajah ke ${destination}`, fkontak); // Menggunakan fkontak
        }

        if (cost > 0) user.money -= cost; // PERUBAHAN: eris diubah menjadi money

        let rewards = rewardFunc();

        let resultMessage = 
            `🎉 *Petualangan ${explorerName} di ${destination} Berhasil!* 🎉\n\n` +
            `🪵 *Kayu*: ${rewards.wood.toLocaleString()}\n` +
            `🍯 *Madu*: ${rewards.fruits.toLocaleString()}\n` +
            `🍄 *Jamur*: ${rewards.mushrooms.toLocaleString()}\n` +
            `✉️ *Exp*: ${rewards.exp.toLocaleString()}\n` +
            `🪙 *Emas*: ${rewards.gold.toLocaleString()}\n` +
            `🪨 *Batu*: ${rewards.rock.toLocaleString()}\n` +
            `🌿 *Herbal*: ${rewards.herbs.toLocaleString()}\n` +
            `💎 *Diamond*: ${rewards.diamond.toLocaleString()}\n` +
            `🧊 *Kristal*: ${rewards.crystal.toLocaleString()}\n` +
            `🪶 *Bulu*: ${rewards.feathers.toLocaleString()}\n\n` +
            `🔥 *Stamina Anda Berkurang -15* 🔥`;

        user.wood += rewards.wood;
        user.fruits += rewards.fruits;
        user.mushrooms += rewards.mushrooms;
        user.exp += rewards.exp;
        user.gold += rewards.gold;
        user.rock += rewards.rock;
        user.herbs += rewards.herbs;
        user.diamond += rewards.diamond;
        user.crystal += rewards.crystal;
        user.feathers += rewards.feathers;
        user.stamina -= 15;
        user.lastExploring = new Date().getTime();

        setTimeout(() => {
            conn.reply(m.chat, `⏰ *Kak ${tag}, sudah waktunya menjelajah lagi!*`, fkontak); // Menggunakan fkontak
        }, 3600000);

        conn.reply(m.chat, resultMessage, fkontak); // Menggunakan fkontak
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '⚠️ Terjadi kesalahan saat mencoba menjelajah. Silakan coba lagi nanti.', fkontak); // Menggunakan fkontak
    }
};

handler.help = ['menjelajah'];
handler.tags = ['rpg'];
handler.command = /^(menjelajah)$/i;
handler.group = true;
export default handler;

function formatTime(ms) {
    let d = Math.floor(ms / 86400000);
    let h = Math.floor(ms / 3600000) % 24;
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [
        `${d}:`,
        `${h.toString().padStart(2, '0')}:`,
        `${m.toString().padStart(2, '0')}:`,
        `${s.toString().padStart(2, '0')}:`
    ].join('');
}

function getForestRewards() {
    return {
        wood: Math.floor(Math.random() * 1901) + 100,
        fruits: Math.floor(Math.random() * 46),
        mushrooms: Math.floor(Math.random() * 46),
        exp: Math.floor(Math.random() * 46),
        gold: Math.floor(Math.random() * 46),
        rock: Math.floor(Math.random() * 46),
        herbs: Math.floor(Math.random() * 15),
        crystal: Math.floor(Math.random() * 31), // Max 30
        diamond: Math.floor(Math.random() * 31), // Max 30
        feathers: Math.floor(Math.random() * 46)
    };
}

function getMountainRewards() {
    let totalReward = 0;
    let rewards = {
        wood: Math.floor(Math.random() * 500) + 200,
        fruits: Math.floor(Math.random() * 400) + 100,
        mushrooms: Math.floor(Math.random() * 400) + 100,
        exp: Math.floor(Math.random() * 500) + 100,
        gold: Math.floor(Math.random() * 400) + 100,
        rock: Math.floor(Math.random() * 300) + 100,
        herbs: Math.floor(Math.random() * 44) + 10,
        crystal: Math.floor(Math.random() * 101) + 50, // Max 150, Min 50
        diamond: Math.floor(Math.random() * 101) + 50, // Max 150, Min 50
        feathers: Math.floor(Math.random() * 46)
    };

    totalReward = Object.values(rewards).reduce((a, b) => a + b);
    if (totalReward > 1500) { 
        rewards.exp = Math.max(0, 1500 - (totalReward - rewards.exp)); // Ensure exp is not negative
    }

    return rewards;
}

function getTreasureIslandRewards() {
    let totalReward = 0;
    let rewards = {
        wood: Math.floor(Math.random() * 1000) + 500,
        fruits: Math.floor(Math.random() * 800) + 200,
        mushrooms: Math.floor(Math.random() * 800) + 200,
        exp: Math.floor(Math.random() * 1000) + 500,
        gold: Math.floor(Math.random() * 800) + 200,
        rock: Math.floor(Math.random() * 600) + 300,
        herbs: Math.floor(Math.random() * 40) + 20,
        crystal: Math.floor(Math.random() * 251) + 50, // Max 300, Min 50
        diamond: Math.floor(Math.random() * 251) + 50, // Max 300, Min 50
        feathers: Math.floor(Math.random() * 46)
    };

    totalReward = Object.values(rewards).reduce((a, b) => a + b);
    if (totalReward > 3500) {
        rewards.exp = Math.max(0, 3500 - (totalReward - rewards.exp)); // Ensure exp is not negative
    }

    return rewards;
}