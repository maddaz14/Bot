// plugins/youtuber-rename.js
let handler = async (m, { conn, text, usedPrefix }) => {
    const user = global.db.data.users[m.sender];
    const fkontak = {
        key: {
            participant: '0@s.whatsapp.net',
            remoteJid: "0@s.whatsapp.net",
            fromMe: false,
            id: "Halo",
        },
        message: {
            conversation: `Akun YT ${global.namebot || 'Bot'} 🪾`
        }
    };

    if (!user.youtube_account) {
        return conn.sendMessage(m.chat, {
            text: `Kamu belum punya akun YouTube.\nBuat dulu dengan: *${usedPrefix}ytcreate*`,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: fkontak });
    }

    if (!text) {
        return conn.sendMessage(m.chat, {
            text: `Untuk mengganti nama channel, berikan nama barunya.\nContoh: *${usedPrefix}ytrename MyAwesomeChannel*`
        }, { quoted: fkontak });
    }

    const oldName = user.youtube_account;
    const newName = text.trim();

    if (newName.length < 3 || newName.length > 30) {
        return conn.sendMessage(m.chat, {
            text: `Nama channel harus antara 3 hingga 30 karakter.`
        }, { quoted: fkontak });
    }

    // Opsional: Cek apakah nama sudah digunakan oleh channel lain
    // const channelExists = Object.values(global.db.data.users).some(u => u.youtube_account === newName && u.id !== m.sender);
    // if (channelExists) {
    //     return conn.sendMessage(m.chat, { text: `Nama channel "${newName}" sudah digunakan oleh YouTuber lain.` }, { quoted: fkontak });
    // }

    user.youtube_account = newName;

    conn.sendMessage(m.chat, {
        text: `✅ Nama channel YouTube Anda berhasil diganti dari *"${oldName}"* menjadi *"${newName}"*!`
    }, { quoted: fkontak });
};

handler.help = ['ytrename <nama baru>'];
handler.tags = ['game'];
handler.command = /^(ytrename|youtuberrename|youtuber rename|yt rename|ytgantinama)$/i;
handler.register = true;

export default handler;