import https from "https";
import { sticker } from "../lib/sticker.js"; // Pastikan sudah ada fungsi sticker

let handler = async (m, { conn }) => {
    try {
        await m.react("⏳"); // Emoji loading
        
        // Mengambil GIF dari API
        let url = `https://api.lolhuman.xyz/api/random2/anal?apikey=ubed2407`; // API URL yang menyediakan GIF
        let buffer = await IBuffer(url);

        // Konversi GIF menjadi Sticker
        let stiker = await sticker(buffer, true, global.packname, global.author); // Mengonversi buffer menjadi sticker GIF
        
        // Jika sticker berhasil dibuat, kirimkan ke chat
        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'gif-sticker.webp', '', m); // Mengirimkan sticker
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

handler.help = ["gifsticker"];
handler.tags = ["sticker"];
handler.command = /^(gifsticker)$/i;
handler.limit = true;
handler.premium = false;

export default handler;

async function IBuffer(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = [];
            res.on('data', chunk => data.push(chunk));
            res.on('end', () => resolve(Buffer.concat(data))); // Menggabungkan data menjadi satu buffer
            res.on('error', reject);
        }).on("error", reject);
    });
}