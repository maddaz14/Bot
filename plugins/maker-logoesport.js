import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Gunakan perintah ini dengan format: ${usedPrefix + command} <nama brand>`;

    try {
        await conn.sendMessage(m.chat, { react: { text: '🍏', key: m.key } });

        const url = `https://api.ubed.my.id/maker/Logo-esport?apikey=ubed2407&brandname=${encodeURIComponent(text)}&industry=Technology`;
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        let sentMsg = await conn.sendMessage(m.chat, {
            image: response.data,
            caption: `Berikut logo esport untuk: *${text}*`
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: sentMsg.key } });
    } catch (error) {
        console.error(error);
        await conn.reply(m.chat, 'Gagal mengambil logo. Pastikan server aktif dan nama brand valid.', m);
    }
};

handler.help = ['logoesp <brandname>'];
handler.tags = ['maker'];
handler.command = /^(logoesp|esportlogo)$/i;
handler.limit = 5;
handler.register = true;
handler.premium = false;

export default handler;