const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": `warnet ${global.namebot || 'Bot'} ✨`,
    }
};

const games = [
    { name: 'Game Petualangan', cost: 50000, time: 10 * 60 * 1000 },
    { name: 'Game Balap', cost: 70000, time: 15 * 60 * 1000 },
    { name: 'Puzzle Challenge', cost: 30000, time: 5 * 60 * 1000 },
    { name: 'Board Game', cost: 40000, time: 8 * 60 * 1000 },
    { name: 'Game Olahraga', cost: 60000, time: 12 * 60 * 1000 },
    { name: 'Game Klasik', cost: 20000, time: 6 * 60 * 1000 },
    { name: 'RPG Fantasi', cost: 80000, time: 20 * 60 * 1000 },
    { name: 'Battle Royale', cost: 90000, time: 15 * 60 * 1000 },
    { name: 'Simulator Perkotaan', cost: 100000, time: 30 * 60 * 1000 },
    { name: 'Game Ruang Angkasa', cost: 85000, time: 25 * 60 * 1000 },
    { name: 'Game Zombie', cost: 75000, time: 20 * 60 * 1000 },
    { name: 'Game Keluarga', cost: 40000, time: 10 * 60 * 1000 },
    { name: 'Game Balapan Kuda', cost: 60000, time: 12 * 60 * 1000 },
    { name: 'Game E-Sport', cost: 95000, time: 15 * 60 * 1000 },
    { name: 'Karaoke Online', cost: 30000, time: 5 * 60 * 1000 },
    { name: 'Simulator Astronot', cost: 120000, time: 40 * 60 * 1000 },
    { name: 'Game Petualangan Luar Angkasa', cost: 110000, time: 35 * 60 * 1000 },
    { name: 'Game RPG Dungeons', cost: 90000, time: 25 * 60 * 1000 },
    { name: 'Game Sulap', cost: 35000, time: 8 * 60 * 1000 },
    { name: 'Game Sepak Bola', cost: 60000, time: 15 * 60 * 1000 },
    { name: 'Game Fitness', cost: 45000, time: 10 * 60 * 1000 },
    { name: 'Game Musik', cost: 30000, time: 5 * 60 * 1000 },
    { name: 'Game Fantasi', cost: 80000, time: 20 * 60 * 1000 },
    { name: 'Game Simulator Ilmuwan', cost: 70000, time: 18 * 60 * 1000 },
    { name: 'Game Balap Mobil', cost: 75000, time: 12 * 60 * 1000 },
    { name: 'Game Petualangan Alam', cost: 65000, time: 15 * 60 * 1000 },
    { name: 'Game Membangun Kerajaan', cost: 90000, time: 25 * 60 * 1000 },
    { name: 'Game Superhero', cost: 95000, time: 30 * 60 * 1000 },
    { name: 'Game Edukasi', cost: 20000, time: 10 * 60 * 1000 },
    { name: 'Game Detektif', cost: 40000, time: 15 * 60 * 1000 },
    { name: 'Game Strategi Perkotaan', cost: 80000, time: 20 * 60 * 1000 },
    { name: 'Game Horor', cost: 75000, time: 20 * 60 * 1000 },
    { name: 'Game Pesta', cost: 50000, time: 10 * 60 * 1000 }
];

let formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
};

let ponta = async (m, { conn, args, usedPrefix, command }) => {
    const user = global.db.data.users[m.sender];
    const tag = '@' + m.sender.split`@`[0];

    // Jika tidak ada argumen, tampilkan daftar permainan
    if (!args[0]) {
        let gameList = `🖥️ *${tag} Daftar Permainan di Warnet* 🖥️\n\nKetik nama permainan untuk memilih dan bermain\ncontoh: .warnet game horor\n\n`;
        games.forEach((game, i) => {
            gameList += `${i + 1}. ${game.name} - 💰 Biaya: ${formatNumber(game.cost)} 💰, ⏳ Waktu: ${game.time / 60000} menit\n`;
        });
        return conn.reply(m.chat, gameList, fkontak); // Menggunakan fkontak
    }

    // Jika pengguna memilih game
    let gameName = args.join(' ').trim();
    let selectedGame = games.find(g => g.name.toLowerCase() === gameName.toLowerCase());

    if (!selectedGame) {
        return conn.reply(m.chat, `${tag} Permainan "${gameName}" tidak ditemukan. Silakan pilih dari daftar yang tersedia.`, fkontak); // Menggunakan fkontak
    }

    if (user.money < selectedGame.cost) { // PERUBAHAN: eris diubah menjadi money
        return conn.reply(m.chat, `${tag} Uang kamu tidak cukup untuk memainkan ${selectedGame.name}. Kamu membutuhkan ${formatNumber(selectedGame.cost - user.money)} 💰 lebih banyak.`, fkontak); // PERUBAHAN: eris diubah menjadi money, menggunakan fkontak
    }

    // Handle cooldown
    let now = Date.now();
    if (user.lastwarpet && now - user.lastwarpet < selectedGame.time) {
        let remainingTime = ((selectedGame.time - (now - user.lastwarpet)) / 1000).toFixed(0);
        return conn.reply(m.chat, `${tag} Kamu masih dalam waktu tunggu. Silakan tunggu ${remainingTime} detik lagi untuk bermain kembali.`, fkontak); // Menggunakan fkontak
    }

    // Deduksi uang, mulai cooldown, dan kirim respons
    user.money -= selectedGame.cost; // PERUBAHAN: eris diubah menjadi money
    user.lastwarpet = now;

    conn.reply(m.chat, `${tag} Kamu mulai memainkan ${selectedGame.name}! 🎮\n\n⏳ Waktu bermain: ${selectedGame.time / 60000} menit.\n💸 Uang di dompet: ${formatNumber(user.money)} 💰`, fkontak); // PERUBAHAN: eris diubah menjadi money, menggunakan fkontak

    // Kalkulasi keuntungan dan pendapatan tambahan setelah waktu habis
    setTimeout(() => {
        let profit = selectedGame.cost * 0.70; // 70% dari biaya permainan
        let additionalIncome = 10000; // Pendapatan tambahan tetap
        user.money += profit + additionalIncome; // PERUBAHAN: eris diubah menjadi money
        conn.reply(m.chat, `${tag} Permainan ${selectedGame.name} telah selesai! 🎉\n\nKamu mendapatkan keuntungan sebesar 70% dari biaya: 💰 ${formatNumber(profit)}.\nPendapatan tambahan: 💸 ${formatNumber(additionalIncome)}.\nTotal pendapatan: 💰 ${formatNumber(profit + additionalIncome)}.\n💸 Uang di dompet sekarang: ${formatNumber(user.money)} 💰`, fkontak); // PERUBAHAN: eris diubah menjadi money, menggunakan fkontak
    }, selectedGame.time);
};

ponta.help = ['warnet'];
ponta.tags = ['rpg'];
ponta.command = /^(warnet)$/i;

export default ponta;