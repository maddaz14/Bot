import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `Contoh penggunaan:\n${usedPrefix + command} free fire`;
    }

    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/apk/apkmody?search=${encodeURIComponent(text)}`);
        if (!data.status || !data.data || data.data.length === 0) {
            return m.reply('❌ Tidak ditemukan hasil untuk pencarian kamu.');
        }

        for (let apk of data.data.slice(0, 5)) { // Batasi ke 5 hasil pertama
            await conn.sendMessage(m.chat, {
                image: { url: apk.icon },
                caption:
`📱 *${apk.title}*
🧩 *Versi:* ${apk.version}
🎮 *Genre:* ${apk.genre}
✨ *Fitur:* ${apk.features || '-'}
⭐ *Rating:* ${apk.rating.stars} (${apk.rating.percentage}%)
🔗 *Link:* ${apk.link}`
            }, { quoted: m });
        }

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error(err);
        m.reply('❌ Terjadi kesalahan saat mengambil data dari APKMODY.');
    }
};

handler.help = ['apkmody <keyword>'];
handler.tags = ['apk', 'search'];
handler.command = /^apkmody$/i;
handler.limit = true;

export default handler;