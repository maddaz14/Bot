// plugins/stopjadibot.js

import PhoneNumber from "awesome-phonenumber"; // Untuk memformat dan memvalidasi nomor

const handler = async (m, { conn, args, isOwner }) => {
    let targetNumber = args[0] ? args[0].replace(/[^0-9]/g, '') : null; // Bersihkan input nomor
    
    // Jika tidak ada argumen, coba hentikan bot milik pengirim
    if (!targetNumber) {
        targetNumber = m.sender.split('@')[0];
    }

    // Pastikan global.conns terdefinisi
    if (!global.conns || !Array.isArray(global.conns) || global.conns.length === 0) {
        return conn.reply(m.chat, '❌ Tidak ada sub-bot yang aktif untuk dihentikan.', m);
    }

    let found = false;
    for (let i = 0; i < global.conns.length; i++) {
        const subConn = global.conns[i];
        if (subConn && subConn.user && subConn.user.jid) {
            const subBotNumber = subConn.user.jid.split('@')[0];

            // Jika owner bot, bisa menghentikan bot siapapun
            // Jika bukan owner, hanya bisa menghentikan bot miliknya sendiri
            if (isOwner || subBotNumber === m.sender.split('@')[0]) {
                if (subBotNumber === targetNumber) {
                    try {
                        await subConn.sendMessage(subConn.user.jid, { text: 'Bot Anda telah dihentikan oleh admin atau oleh Anda sendiri. Sampai jumpa!' });
                        subConn.ws.close(); // Menutup koneksi WebSocket
                        subConn.ev.removeAllListeners(); // Menghapus semua event listener
                        global.conns.splice(i, 1); // Hapus dari array global.conns
                        found = true;
                        conn.reply(m.chat, `✅ Sub-bot untuk nomor *${new PhoneNumber('+' + targetNumber).getNumber('international')}* telah dihentikan.`, m);
                        break; // Keluar dari loop setelah menemukan dan menghentikan
                    } catch (e) {
                        console.error('Gagal menghentikan sub-bot:', e);
                        conn.reply(m.chat, `⚠️ Gagal menghentikan sub-bot untuk nomor *${new PhoneNumber('+' + targetNumber).getNumber('international')}*. Terjadi kesalahan.`, m);
                        found = true; // Set found true agar tidak masuk ke pesan "tidak ditemukan"
                        break;
                    }
                }
            }
        }
    }

    if (!found) {
        if (isOwner) {
            conn.reply(m.chat, `❌ Sub-bot dengan nomor *${new PhoneNumber('+' + targetNumber).getNumber('international')}* tidak ditemukan atau Anda tidak memiliki izin untuk menghentikannya.`, m);
        } else {
            conn.reply(m.chat, `❌ Anda hanya bisa menghentikan sub-bot milik Anda sendiri. Sub-bot Anda tidak ditemukan atau sudah terputus.`, m);
        }
    }
};

// Properti Handler
handler.help = ['stopjadibot'];
handler.tags = ['jadibot'];
handler.command = ['stopjadibot', 'deljadibot'];
handler.owner = false; // Bisa digunakan oleh pemilik sub-bot
handler.private = true; // Hanya bisa di chat pribadi bot utama atau sub-bot

export default handler;