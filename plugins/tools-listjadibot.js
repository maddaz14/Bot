// plugins/listjadibot.js

// Import PhoneNumber untuk format nomor yang lebih baik
import PhoneNumber from "awesome-phonenumber";

const handler = async (m, { conn }) => {
    // Pastikan global.conns terdefinisi dan merupakan array
    if (!global.conns || !Array.isArray(global.conns) || global.conns.length === 0) {
        return conn.reply(m.chat, '❌ Tidak ada sub-bot yang aktif saat ini.', m);
    }

    let message = '⚡️ *Daftar Sub-Bot Aktif:*\n\n';
    let count = 0;

    // Iterasi melalui setiap koneksi di global.conns
    for (const subConn of global.conns) {
        // Pastikan koneksi memiliki user dan jid
        if (subConn && subConn.user && subConn.user.jid) {
            count++;
            const jid = subConn.user.jid;
            const number = jid.split('@')[0];
            const formattedNumber = new PhoneNumber('+' + number).getNumber('international');
            
            message += `*${count}.* ${formattedNumber} (${subConn.getName(jid) || 'Nama Tidak Diketahui'})\n`;
            message += `   • Status: ${subConn.connection === 'open' ? '✅ Terhubung' : '⚠️ Terputus'}\n`;
            message += `   • Dari: ${subConn.user.id === m.sender ? 'Diri Anda' : 'Lainnya'}\n\n`; // Menunjukkan apakah bot sendiri atau bukan
        }
    }

    if (count === 0) {
        return conn.reply(m.chat, '❌ Tidak ada sub-bot yang aktif saat ini.', m);
    }

    conn.reply(m.chat, message.trim(), m);
};

// Properti Handler
handler.help = ['listjadibot'];
handler.tags = ['jadibot'];
handler.command = ['listjadibot', 'listbot'];
handler.owner = true; // Hanya owner bot utama yang bisa melihat daftar ini
handler.private = false; // Hanya bisa di chat pribadi bot utama

export default handler;