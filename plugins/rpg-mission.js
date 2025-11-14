import { promises, readFileSync } from 'fs';
let misi = JSON.parse(readFileSync('./lib/misi.json'));

async function handler(m, { conn, args, text, usedPrefix, command }) {
    conn.mission = conn.mission || {};
    if (m.sender in conn.mission) {
        return m.reply("Kamu Masih Melakukan Misi, Tunggu Sampai Selesai!!");
    }

    try {
        let json = misi[Math.floor(Math.random() * misi.length)]; // get misi
        const cooldown = 15 * 60 * 1000; // cooldown timer in milliseconds
        let user = global.db.data.users[m.sender]; // Get user data

        if (user.stamina === 0) {
            return m.reply(`Stamina Kamu Kurang Dari 100, Tidak Bisa Menjalankan Misi\nKetik .eat Untuk Menggunakan Potion`);
        }

        if (typeof user.lastmission !== "number") user.lastmission = 0;
        if (typeof user.exp !== "number") user.exp = 0;
        if (typeof user.crystal !== "number") user.crystal = 0;

        let timeLeft = cooldown - (new Date() - user.lastmission);
        if (timeLeft > 0) {
            return m.reply(`Kamu Sudah Menjalankan Misi, Tunggu Selama ${clockString(timeLeft)}`);
        }

        if (!user.skill) {
            return m.reply("Kamu Belum Mempunyai Skill");
        }

        if (!(m.sender in conn.mission)) {
            conn.mission[m.sender] = {
                sender: m.sender,
                timeout: setTimeout(() => {
                    m.reply('timed out');
                    delete conn.mission[m.sender];
                }, 60000),
                json
            };

            let caption = `*📝 Misi Telah Di Berikan*
📊 *Rank:* ${json.rank}
✉️ *Misi:* ${json.misii}
📦 *Reward:* 
🧪 Exp: ${json.exp}
💎 Crystal Mana: ${json.crystal}

Ketik *terima* Untuk Menerima
Ketik *tolak* Untuk Membatalkan
`;
            return conn.reply(m.chat, caption, m);
        }
    } catch (e) {
        console.error(e);
        if (m.sender in conn.mission) {
            let { timeout } = conn.mission[m.sender];
            clearTimeout(timeout);
            delete conn.mission[m.sender];
            m.reply('Rejected');
        }
    }
}

handler.before = async m => {
    conn.mission = conn.mission || {};
    if (!(m.sender in conn.mission)) return;
    if (m.isBaileys) return;

    let { timeout, json } = conn.mission[m.sender];
    const cooldown = 5 * 60 * 1000; // cooldown timer in milliseconds
    let user = global.db.data.users[m.sender]; // Get user data

    let text = (m.msg && m.msg.selectedDisplayText ? m.msg.selectedDisplayText : m.text ? m.text : '').toLowerCase();
    if (text !== "terima" && text !== "tolak" && text !== "gas") return;

    if (typeof user.lastmission !== "number") user.lastmission = 0;
    if (typeof user.exp !== "number") user.exp = 0;
    if (typeof user.crystal !== "number") user.crystal = 0;

    let timeLeft = cooldown - (new Date() - user.lastmission);
    if (timeLeft > 0) {
        return m.reply(`Kamu Sudah Melakukan Misi, Mohon Tunggu ${clockString(timeLeft)}`);
    }

    if (!user.skill) {
        return m.reply("Kamu Belum Mempunyai Skill");
    }

    let randomAku = Math.floor(Math.random() * 101);
    let randomKamu = Math.floor(Math.random() * 81); // Difficult to win
    let aud = ["Mana Habis", "Stamina Habis", "Diserang Monster", "Dibokong Monster"];
    let aui = aud[Math.floor(Math.random() * aud.length)];

    // Gacha system
    try {
        if (/^terima$/i.test(text)) {
            if (randomAku > randomKamu) {
                m.reply(`${json.title ? `Kamu Mendapatkan Tittle ${json.title}` : ""}`);
                m.reply(`Berhasil Menyelesaikan Misi ${json.misii}`);
                user.exp += json.exp;
                user.crystal += json.crystal;
                user.title += json.title;
                user.misi += json.misii;
            } else {
                m.reply(`Gagal Menyelesaikan Misi ${json.misii} Dikarenakan ${aui}`);
            }
            user.lastmission = new Date().getTime();
            clearTimeout(timeout);
            delete conn.mission[m.sender];
            return true;
        } else if (/^tolak$/i.test(text)) {
            clearTimeout(timeout);
            delete conn.mission[m.sender];
            m.reply('Canceled');
            return true;
        }
    } catch (e) {
        clearTimeout(timeout);
        delete conn.mission[m.sender];
        m.reply('Error Saat Pengambilan Misi (Rejected)');
        console.error(e.stack);
        return true;
    } finally {
        clearTimeout(timeout);
        delete conn.mission[m.sender];
        return true;
    }
}

handler.help = ['mission'];
handler.tags = ['rpg'];
handler.command = /^(misi|mission)$/i;

export default handler;

/**
 * Convert milliseconds to clock string
 * @param {Number} ms
 * @returns {String}
 */
function clockString(ms) {
    let d = Math.floor(ms / 86400000);
    let h = Math.floor(ms / 3600000) % 24;
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return `${d} Hari ${h} Jam ${m} Menit ${s} Detik`.replace(/\b(\d)\b/g, '0$1');
}