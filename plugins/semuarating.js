let handler = async (m, { conn, usedPrefix, command }) => {
    // Mengecek apakah data rating tersedia di global.db.data.bots.rating
    if (!global.db.data.bots || !global.db.data.bots.rating) {
        return m.reply("*🍏 Belum ada rating dan ulasan yang diberikan.*");
    }

    // Mengambil semua rating dan ulasan yang sudah diberikan oleh pengguna
    let output = "*╭─🍏  Daftar Rating dan Ulasan  🍏*\n";

    // Iterasi semua pengguna yang memberikan rating
    let ratingsAvailable = false; // Flag untuk mengecek apakah ada rating yang ditemukan
    for (let user of Object.keys(global.db.data.bots.rating)) {
        const userRating = global.db.data.bots.rating[user]?.rate;
        const userUlasan = global.db.data.bots.rating[user]?.ulasan || "Belum ada ulasan.";

        // Mengambil nama pengguna berdasarkan ID pengguna WhatsApp
        const userName = await conn.getName(user); // Mendapatkan nama pengguna berdasarkan nomor telepon

        // Pastikan rating dan ulasan tersedia
        if (userRating != undefined) {
            ratingsAvailable = true;
            output += `*│ ${userName}: Rating ${userRating} - Ulasan: ${userUlasan}\n`;
        }
    }

    if (!ratingsAvailable) {
        return m.reply("*🍏 Tidak ada rating atau ulasan yang tersedia.*");
    }

    output += "*╰───────────────🍎*";

    // Kirimkan daftar rating dan ulasan kepada semua pengguna
    m.reply(output);
};

handler.help = ['semuarating', 'ratingsemua'];
handler.tags = ['main'];
handler.command = /^(semuarating|ratingsemua)$/i;
handler.register = true;

export default handler;