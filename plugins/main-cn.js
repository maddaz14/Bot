// handlers/changenama.js
let handler = async function (m, { text, usedPrefix, command }) {
    let user = global.db.data.users[m.sender];

    if (!user.registered) {
        throw `Kamu belum terdaftar! Silakan daftar terlebih dahulu dengan perintah *${usedPrefix}daftar <nama>.<umur>*`;
    }

    if (!text) {
        throw `Gunakan format yang benar!\nContoh: *${usedPrefix + command} NamaBaru*`;
    }

    let oldName = user.name;
    let newName = text.trim();

    if (newName.length < 3) {
        throw `Nama terlalu pendek! Minimal 3 karakter.`;
    }

    if (newName.length > 20) {
        throw `Nama terlalu panjang! Maksimal 20 karakter.`;
    }

    user.name = newName;

    await conn.sendMessage(m.chat, {
        react: {
            text: "✅",
            key: m.key,
        }
    });

    m.reply(`Nama kamu berhasil diubah dari *${oldName}* menjadi *${newName}*`);
};

handler.help = ['cn <nama_baru>'];
handler.tags = ['main', 'users'];
handler.command = /^(cn|changename)$/i;
handler.register = true; // Hanya user terdaftar yang bisa menggunakan perintah ini

export default handler;