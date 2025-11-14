let handler = async (m, { conn, args, usedPrefix, command }) => {
    let target;
    if (m.quoted) {
        target = m.quoted.sender;
    } else if (m.mentionedJid?.length) {
        target = m.mentionedJid[0];
    } else if (args[0]?.includes('@')) {
        target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    } else if (args[0]?.endsWith('@s.whatsapp.net')) {
        target = args[0];
    } else {
        return m.reply(`🚫 Gunakan dengan:\n- Reply pesan\n- Tag user\n- Masukkan nomor\n\nContoh:\n${usedPrefix + command} @628xxx 1000`);
    }

    const jumlah = parseInt(args[1] || args[0]);
    if (isNaN(jumlah) || jumlah <= 0) {
        return m.reply('⚠️ Jumlah YT Money harus berupa angka dan lebih dari 0.');
    }

    const user = global.db.data.users[target];
    if (!user) {
        return m.reply('❌ Pengguna tidak ditemukan di database.');
    }

    user.youtubeMoney = (user.youtubeMoney || 0) + jumlah;

    conn.sendMessage(m.chat, {
        text: `✅ Berhasil menambahkan *${jumlah}* YT Money ke @${target.split('@')[0]}.`,
        mentions: [target]
    }, { quoted: m });
};

handler.help = ['addmoneyyt @user 1000'];
handler.tags = ['owner'];
handler.command = /^addmoneyyt$/i;
handler.owner = true;

export default handler;