import { Sticker } from 'wa-sticker-formatter';
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (m.quoted && m.quoted.text) {
        text = m.quoted.text || 'hai';
    } else if (!text) {
        return m.reply('Reply atau masukkan teks ya Senpai!');
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: '🍋‍🟩', key: m.key } });
        const apiUrl = `https://rest.cloudkuimages.com/api/maker/bratanime?text=${encodeURIComponent(text)}`;
        let stiker = await createSticker(apiUrl, global.namebot, global.author, 100);
        if (stiker) {
            await conn.sendFile(m.chat, stiker, '', '', m);
            await conn.sendMessage(m.chat, { react: { text: '', key: m.key } });
        }
    } catch (e) {
        console.error(e);
        m.reply('Aduh Senpai, error nih! Sabar ya, codingan lagi ngambek. Coba lagi ntar, aku bantu benerin sambil joget biar seru!');
    }
};

handler.help = ['bratanime'];
handler.tags = ['sticker'];
handler.command = /^(bratanime)$/i;
handler.limit = 5;
handler.register = true;

export default handler;

async function createSticker(url, packName, authorName, quality) {
    let res = await fetch(url);
    let buffer = await res.buffer();
    let stickerMetadata = {
        type: 'full',
        pack: packName,
        author: authorName,
        quality: 100
    };
    return (new Sticker(buffer, stickerMetadata)).toBuffer();
}