let handler = async (m, { conn, text }) => {
    if (!text) throw 'Siapa yang ingin di-unban? Tag orangnya atau masukkan nomor ID (contoh: @tag atau 628xxxxxxxxxx)!';

    let who;
    // Cek apakah input adalah nomor HP
    if (text.match(/^\d{10,15}$/)) {
        // Mencari nomor HP dalam database
        let users = global.db.data.users;
        who = Object.keys(users).find(key => key.includes(text));
    } else {
        // Jika input adalah tag
        if (m.isGroup) who = m.mentionedJid[0];
        else who = m.chat;
    }

    if (!who) throw 'User tidak ditemukan!';

    let users = global.db.data.users;
    if (!users[who]) throw 'User tidak ditemukan dalam database!';
    if (!users[who].banned) throw `User @${who.split('@')[0]} tidak dalam status banned.`;

    // Menghapus banned dan mengatur banExpires ke 0
    users[who].banned = false;
    users[who].banExpires = 0; // Mengatur waktu habis ban ke 0
    users[who].warning = 0; // Reset warning jika diperlukan

    conn.reply(m.chat, `User @${who.split('@')[0]} berhasil di-unban, dan status ban telah dihapus sepenuhnya!`, m, {
        mentions: [who],
    });
};

handler.help = ['unban'];
handler.tags = ['owner'];
handler.command = /^unban(user)?$/i;
handler.owner = true;

export default handler;