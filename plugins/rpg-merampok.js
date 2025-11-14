const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": `merampok ${global.namebot || 'Bot'} ✨`,
    }
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let dapat = Math.floor(Math.random() * 100000); // Random amount of money to rob
    let denda = Math.floor(Math.random() * (500000 - 1000) + 1000); // Random fine between 1000 and 500000
    let nomors = m.sender; // Sender's number
    let who;

    if (m.isGroup) who = m.mentionedJid && m.mentionedJid[0];
    else who = m.chat;

    if (!who) throw 'Tag salah satu lah'; // Ini akan tetap error jika tidak ada tag
    if (typeof global.db.data.users[who] == 'undefined') throw 'Pengguna tidak ada didalam data base';

    let __timers = (new Date - global.db.data.users[m.sender].lastrob);
    let _timers = (3600000 - __timers); // 1 hour cooldown
    let timers = clockString(_timers);
    let users = global.db.data.users;

    // Cek apakah target memiliki shield
    if (users[who].shield && users[who].shieldDurability > 0) {
        // Kurangi durabilitas shield
        users[who].shieldDurability -= 1;

        if (users[who].shieldDurability <= 0) {
            // Jika durabilitas habis, hapus shield
            users[who].shield = false;
            conn.reply(m.chat, `Target memiliki shield, tetapi sekarang shield mereka sudah rusak dan hilang! Kamu tertangkap polisi dan didenda 💰${denda}.`, fkontak); // Menggunakan fkontak
        } else {
            // Perampok tertangkap polisi dan dikenakan denda
            users[m.sender].money -= denda; // PERUBAHAN: eris diubah menjadi money
            conn.reply(m.chat, `Kamu gagal merampok karena target memiliki shield! Kamu tertangkap polisi dan didenda sebesar 💰${denda}.`, fkontak); // Menggunakan fkontak
        }
        return;
    }

    if (new Date - global.db.data.users[m.sender].lastrob > 3600000) {
        if (10000 > users[who].money) return conn.reply(m.chat, 'Target tidak memiliki cukup uang!', fkontak); // PERUBAHAN: eris diubah menjadi money, dan throw diganti reply

        users[who].money -= dapat; // PERUBAHAN: eris diubah menjadi money
        users[m.sender].money += dapat; // PERUBAHAN: eris diubah menjadi money
        global.db.data.users[m.sender].lastrob = new Date * 1; // Update last robbery time

        conn.reply(m.chat, `Berhasil merampok uang target sebesar 💰${dapat}`, fkontak); // Menggunakan fkontak
    } else {
        conn.reply(m.chat, `Anda sudah merampok dan berhasil sembunyi, tunggu ${timers} untuk merampok lagi`, fkontak); // Menggunakan fkontak
    }
}

handler.help = ['merampok'];
handler.tags = ['rpg'];
handler.command = /^merampok|rob$/;
handler.limit = true;
handler.group = true;
// handler.limit = 5; // Ini duplikat dan bisa dihapus

export default handler;

function clockString(ms) {
    let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
    return [
        '\n' + d, ' *Days ☀️*\n ',
        h, ' *Hours 🕐*\n ',
        m, ' *Minute ⏰*\n ',
        s, ' *Second ⏱️* '
    ].map(v => v.toString().padStart(2, 0)).join('');
}