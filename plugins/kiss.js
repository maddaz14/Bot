let handler = async (m, { conn, text }) => {
    if (!text) {
        return m.reply('Tolong sebutkan orang yang akan dicium, misalnya: `.kiss @someone`');
    }

    // Ambil mention atau sebutan dari teks
    let mentions = m.mentionedJid
    if (mentions.length === 0) {
        return m.reply('Tolong sebutkan orang yang akan dicium!');
    }

    // Ambil gambar kiss dari URL yang diberikan
    let imageUrl = 'https://files.catbox.moe/6agkm8.jpg';

    // Kirim gambar dengan caption menyebutkan orang
    let caption = `💋 *Ciuman untuk @${mentions[0].split('@')[0]}*`;
    await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: caption, mentions: mentions }, { quoted: m });

};

handler.help = ['kiss <@user>'];
handler.tags = ['fun'];
handler.command = /^(kiss)$/i;

export default handler;