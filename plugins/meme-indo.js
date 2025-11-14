import https from 'https';
import { sticker } from '../lib/sticker.js';

let handler = async (m, { conn }) => {
    try {
        await m.react("⏳"); // Emoji loading
        
        // Mengambil gambar meme dari API
        let url = 'https://api.autoresbot.com/api/random/memeindo?apikey=ubed2407';
        let buffer = await IBuffer(url);
        
        // Membuat sticker dari gambar meme
        let stiker = await sticker(buffer, false, global.packname, global.author);
        
        if (stiker) {
            // Mengirimkan sticker ke WhatsApp
            await conn.sendFile(m.chat, stiker, 'memeindo.webp', '', m);
            await m.react("✅"); // Emoji sukses
        } else {
            throw "❌ Gagal membuat stiker!";
        }

    } catch (e) {
        console.error('[ERROR]', e);
        await m.react("❌"); // Emoji error
        throw "❌ Terjadi kesalahan saat membuat stiker!";
    }
};

handler.help = ["memeindo"];
handler.tags = ["sticker"];
handler.command = /^(memeindo)$/i;
handler.limit = true;
handler.premium = false;

export default handler;

// Fungsi untuk mengambil gambar dari URL
async function IBuffer(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = [];
            res.on('data', chunk => data.push(chunk));
            res.on('end', () => resolve(Buffer.concat(data)));
            res.on('error', reject);
        }).on("error", reject);
    });
}