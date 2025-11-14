import fetch from 'node-fetch';
import { sticker } from '../lib/sticker.js';

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('⚠️ Harap masukkan emoji!\n\nContoh: *.emojiapple 😂*');

    try {
        await m.reply('🔍 Sedang mengubah emoji ke versi Apple dan membuat stiker...');

        let apiUrl = `https://api.botcahx.eu.org/api/emoji/apple?emoji=${encodeURIComponent(text)}&apikey=Liana2407`;
        let res = await fetch(apiUrl);

        if (!res.ok) throw `❌ Gagal mengambil gambar emoji. Status: ${res.status}`;

        let buffer = await res.buffer(); // Mengambil gambar sebagai buffer

        console.log('Emoji fetched successfully'); // Debugging

        let stiker = await sticker(buffer, false, global.packname, global.author);
        await conn.sendFile(m.chat, stiker, 'emojiapple.webp', '', m);

    } catch (error) {
        console.error('Error:', error);
        m.reply(`❌ Terjadi kesalahan: ${error}`);
    }
}

handler.help = ['apple'];
handler.tags = ['sticker'];
handler.limit = false;
handler.command = /^(apple|emojiapple)$/i;

export default handler;