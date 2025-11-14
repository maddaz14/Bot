import { chord } from '../lib/chordlirik.js';

let handler = async (m, { text, conn }) => {
    if (!text) throw 'Input Query Judul Lagu';
    try {
        await conn.sendMessage(m.chat, { react: { text: '🍏', key: m.key } });
        let a = await chord(text);
        await conn.sendMessage(m.chat, { text: `*Lagu:* ${a.title}\n\n*Kunci Gitar:*\n${a.chord}`, quoted: m });
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    } catch (error) {
        console.error(error);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply('Terjadi kesalahan saat mencari kunci gitar.');
    }
};

handler.help = ['chord <judul lagu>'];
handler.tags = ['internet'];
handler.command = /^kunci2|chord$/i;

export default handler;