import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `Contoh penggunaan:\n${usedPrefix + command} pou`;
    }

    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/apk/an1?search=${encodeURIComponent(text)}`);
        if (!data.status || !data.data || data.data.length === 0) {
            return m.reply('❌ Tidak ditemukan hasil untuk pencarian kamu.');
        }

        for (let apk of data.data.slice(0, 5)) { // Batasin ke 5 hasil pertama
            await conn.sendMessage(m.chat, {
                image: { url: apk.image },
                caption:
`📱 *${apk.title}*
👤 *Developer:* ${apk.developer}
⭐ *Rating:* ${apk.rating.value} (${apk.rating.percentage}%)
📦 *Tipe:* ${apk.type}
🔗 *Link:* ${apk.link}`
            }, { quoted: m });
        }

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error(err);
        m.reply('❌ Terjadi kesalahan saat mengambil data.');
    }
};

handler.help = ['an1 <keyword>'];
handler.tags = ['apk', 'search'];
handler.command = /^an1$/i;
handler.limit = true;

export default handler;