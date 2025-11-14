import https from "https";
import { sticker } from "../lib/sticker.js";

let handler = async (m, { conn, text }) => {

    try {
        await m.react("⏳"); // Emoji loading
        
        let url = `https://api.lolhuman.xyz/api/random2/anal?apikey=ubed2407`;
        let buffer = await IBuffer(url);
        let stiker = await sticker(buffer, false, global.packname, global.author);
        
        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'brat.webp', '', m);
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

handler.help = ["anal"];
handler.tags = ["nsfw"];
handler.command = /^(anal)$/i;
handler.limit = true;
handler.premium = true;

export default handler;

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