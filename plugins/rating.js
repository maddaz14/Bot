let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) return m.reply(
        `*╭─🍏  Rating Bot Ini  🍏*
*│ Berikan penilaian dari 1 - 5*
*│*
*│ Contoh:*
*│ ${usedPrefix + command} 5*
*│*
*│ Setelah memberi rating,*
*│ kamu bisa menambahkan ulasan:*
*│ ${usedPrefix}ulasan <pendapat kamu>*
*╰───────────────🍎*`
    );

    if (!isNumber(text)) return m.reply("*🍏 Masukkan hanya angka 1 hingga 5 ya!*");
    
    if (global.db.data.users[m.sender]?.rate) return m.reply("*🍏 Kamu sudah memberi rating.\nGunakan *.ulasan* untuk menambahkan pendapat.*");
    
    if (text < 1 || text > 5) return m.reply("*🍏 Nilai tidak valid! Harus dari 1 hingga 5.*");

    // Check if global.db.data exists, initialize if not
    if (!global.db.data) global.db.data = {};

    // Check if global.db.data.bots exists, initialize if not
    if (!global.db.data.bots) global.db.data.bots = {};

    // Check if global.db.data.bots.rating exists, initialize if not
    if (!global.db.data.bots.rating) global.db.data.bots.rating = {};

    // Save the rating
    global.db.data.bots.rating[m.sender] = {
        rate: +text,
        ulasan: ""
    };
    
    // Mark that the user has rated
    global.db.data.users[m.sender].rate = true;

    m.reply(`*🍏 Terima kasih atas rating ${text}-nya!*\n*Kamu bisa ketik .ulasan <isi> untuk menambahkan pendapat.*`);
};

handler.help = ['rate'];
handler.tags = ['main'];
handler.command = /^(rate|rating)$/i;
handler.register = true;

export default handler;

function isNumber(value) {
    value = parseInt(value);
    return typeof value === 'number' && !isNaN(value);
}