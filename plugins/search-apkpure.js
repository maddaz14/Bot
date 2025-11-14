import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `Contoh penggunaan:\n${usedPrefix + command} free fire`;
    }

    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/apk/apkpure?search=${encodeURIComponent(text)}`);
        if (!data.status || !data.data || data.data.length === 0) {
            return m.reply('❌ Tidak ditemukan hasil di apkpure.com');
        }

        for (let apk of data.data.slice(0, 5)) {
            await conn.sendMessage(m.chat, {
                image: { url: apk.icon },
                caption:
`📱 *${apk.title || 'Tanpa Judul'}*
👨‍💻 *Developer:* ${apk.developer}
⭐ *Rating:* ${apk.rating?.score ?? '-'} (${apk.rating?.display || '-'})
🔗 *Link:* ${apk.link}`
            }, { quoted: m });
        }

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error(err);
        m.reply('❌ Gagal mengambil data dari APKPure.');
    }
};

handler.help = ['apkpure <keyword>'];
handler.tags = ['apk', 'search'];
handler.command = /^apkpure$/i;
handler.limit = true;

export default handler;