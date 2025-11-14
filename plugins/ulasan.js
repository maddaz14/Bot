let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) return m.reply(
        `*╭─🍏  Ulasan Bot Ini  🍏*
*│ Setelah memberi rating, kamu bisa memberikan ulasan tentang bot ini.*
*│*
*│ Contoh:*
*│ ${usedPrefix + command} Bot ini keren!*
*│*
*│ Kami menghargai setiap ulasan dari kamu.*
*╰───────────────🍎*`
    );

    if (!global.db.data.users[m.sender]?.rate) {
        return m.reply("*❀ Kamu belum memberikan rating. Silakan beri rating terlebih dahulu dengan perintah .rate <angka>.*");
    }

    // Menyimpan ulasan yang diberikan oleh pengguna
    global.db.data.bots.rating[m.sender].ulasan = text;

    m.reply(`*❀ Terima kasih atas ulasan kamu!*\n*Ulasan kamu:* "${text}"\n*Kamu bisa memberikan rating lagi kapan saja.*`);

    // Membuat status ulasan untuk pengguna
    global.db.data.users[m.sender].rate = false;  // Mengatur ulang status rating sehingga bisa diberi rating lagi nanti
};

handler.help = ['ulasan'];
handler.tags = ['main'];
handler.command = /^(ulasan)$/i;
handler.register = true;

export default handler;