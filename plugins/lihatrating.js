let handler = async (m, { conn, usedPrefix, command }) => {
    // Mengecek apakah pengguna sudah memberikan rating
    if (!global.db.data.users[m.sender]?.rate) {
        return m.reply("*❀ Kamu belum memberikan rating. Silakan beri rating terlebih dahulu dengan perintah .rate <angka>.*");
    }

    // Mendapatkan rating dan ulasan pengguna
    const rating = global.db.data.bots.rating[m.sender]?.rate;
    const ulasan = global.db.data.bots.rating[m.sender]?.ulasan || "Belum ada ulasan.";

    // Mengirimkan rating dan ulasan kepada pengguna
    m.reply(`*╭─🍏  Rating dan Ulasan Kamu  🍏*
*│ Rating: ${rating}*
*│ Ulasan: ${ulasan}*
*╰───────────────🍎*`);
};

handler.help = ['lihatulasan', 'ratingku'];
handler.tags = ['main'];
handler.command = /^(lihatulasan|ratingku)$/i;
handler.register = true;

export default handler;