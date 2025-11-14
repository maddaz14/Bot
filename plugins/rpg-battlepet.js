let handler = async (m, { conn, args, participants }) => {
    const petTypes = ['anjing', 'kucing', 'naga', 'kuda', 'rubah'];
    const petType = args[0] ? args[0].toLowerCase() : '';

    if (!petTypes.includes(petType)) {
        return m.reply(`*Pilih Pet kamu*\n${petTypes.map(pet => `* ${capitalize(pet)}`).join('\n')}\n\n*Contoh*: _.battlepet kucing_`);
    }

    if (!global.db.data.users[m.sender][petType]) {
        return m.reply(`⚠️ *Kamu belum memiliki pet ${capitalize(petType)}!*\nLatih dulu atau pilih pet lain.`);
    }

    // Check for cooldown
    const userCooldown = global.db.data.users[m.sender].battleCooldown || 0;
    const now = new Date().getTime();
    const cooldownTime = 15 * 60 * 1000; // 15 minutes in milliseconds

    if (now - userCooldown < cooldownTime) {
        const remainingTime = Math.ceil((cooldownTime - (now - userCooldown)) / 1000 / 60);
        return m.reply(`⏳ *Tunggu ${remainingTime} menit lagi sebelum bisa bertarung lagi!*`);
    }

    await handlePetBattle(m, conn, participants, petType);
};

async function handlePetBattle(m, conn, participants, petType) {
    const userPetLevel = global.db.data.users[m.sender][petType];
    conn.fightArena = conn.fightArena ? conn.fightArena : {};
    const delay = time => new Promise(res => setTimeout(res, time));

    if (conn.fightArena[m.sender]) {
        return m.reply(`⚔️ *Arena pertarungan kamu sedang digunakan oleh pet lain.*`);
    }

    let users = participants.map(u => u.id);
    let opponent = users[Math.floor(Math.random() * users.length)];

    // Ensure the opponent has a pet and that pet has at least level 1
    while (!global.db.data.users?.[opponent] || opponent == m.sender || global.db.data.users[opponent][petType] < 1) {
        opponent = users[Math.floor(Math.random() * users.length)];
    }

    const opponentPetLevel = global.db.data.users[opponent][petType];
    let battleDuration = randomBetween(8, 20);
    let opponentTag = `@${opponent.split('@')[0]}`;
    m.reply(`🐾 *Pet Kamu* (${capitalize(petType)} Level ${userPetLevel}) menantang *${capitalize(petType)} milik ${opponentTag}* (Level ${opponentPetLevel})!`, null, {
        mentions: [opponent]
    });

    conn.fightArena[m.sender] = true;
    await delay(1000 * 60 * battleDuration);

    let loseReasons = ['Kurang kuat 💔', 'Pet kamu kelelahan 😓', 'Level terlalu rendah ⚠️', 'Kurang latihan 📉'];
    let winReasons = ['Sangat kuat 💪', 'Latihan membuahkan hasil 🏆', 'Pet kamu unggul 🔥', 'Level tinggi ⬆️'];

    let chances = [];
    for (let i = 0; i < userPetLevel; i++) chances.push(m.sender);
    for (let i = 0; i < opponentPetLevel; i++) chances.push(opponent);

    let playerPoints = 0;
    let opponentPoints = 0;

    for (let i = 0; i < 10; i++) {
        let winner = randomBetween(0, chances.length - 1);
        if (chances[winner] == m.sender) playerPoints += 1;
        else opponentPoints += 1;
    }

    let resultMessage;
    if (playerPoints > opponentPoints) {
        let reward = (playerPoints - opponentPoints) * 20000;
        global.db.data.users[m.sender].money += reward; // PERUBAHAN: user.eris diubah menjadi user.money
        global.db.data.users[m.sender].tiketcoin += 1;
        resultMessage = `🎉 *Selamat!* Pet Kamu (${capitalize(petType)} Level ${userPetLevel}) berhasil mengalahkan *${capitalize(petType)} milik ${opponentTag}* (Level ${opponentPetLevel})!\n\n🏆 *Skor*: ${playerPoints * 10} - ${opponentPoints * 10}\n\n💰 *Hadiah*: Rp ${reward.toLocaleString()}\n🎫 *Tiket Coin*: 1`;
    } else if (playerPoints < opponentPoints) {
        let penalty = (opponentPoints - playerPoints) * 100000;
        global.db.data.users[m.sender].money -= penalty; // PERUBAHAN: user.eris diubah menjadi user.money
        global.db.data.users[m.sender].tiketcoin += 1;
        resultMessage = `😢 *Pet Kamu (${capitalize(petType)} Level ${userPetLevel}) kalah melawan ${capitalize(petType)} milik ${opponentTag}* (Level ${opponentPetLevel}).\n\n❌ *Skor*: ${playerPoints * 10} - ${opponentPoints * 10}\n\n💸 *Denda*: Rp ${penalty.toLocaleString()}\n🎫 *Tiket Coin*: 1`;
    } else {
        resultMessage = `🤝 *Pertarungan antara Pet Kamu (${capitalize(petType)} Level ${userPetLevel}) dan ${capitalize(petType)} milik ${opponentTag} (Level ${opponentPetLevel}) berakhir imbang*.\n\n*Skor*: ${playerPoints * 10} - ${opponentPoints * 10}\nTidak ada hadiah atau denda.`;
    }

    m.reply(resultMessage, null, {
        mentions: [opponent]
    });

    delete conn.fightArena[m.sender];

    // Set the cooldown for the user after the battle
    global.db.data.users[m.sender].battleCooldown = new Date().getTime();

    // Notify the user about the cooldown
    m.reply(`🛌 *Pertarungan selesai!*\nPet Kamu sekarang istirahat selama ⏳ *15 menit* sebelum bisa bertarung lagi.`);
}

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

handler.help = ['battlepet <nama_pet>'];
handler.tags = ['rpg'];
handler.command = /^battlepet$/i;
handler.limit = true;
handler.group = true;

export default handler;