import axios from "axios";

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `📌 *Gunakan format:*\n${usedPrefix}${command} <teks1> | <teks2>\n\n📌 *Contoh:*\n${usedPrefix}${command} Free Server | prem Server`;

    let [text1, text2] = text.split("|");
    if (!text1 || !text2) throw `📌 *Gunakan format yang benar:*\n${usedPrefix}${command} <teks1> | <teks2>\n\n📌 *Contoh:*\n${usedPrefix}${command} Free Server | prem Server`;

    let apiUrl = `https://beforelife.me/api/maker/drakeposting?text=${encodeURIComponent(text1.trim())}&text2=${encodeURIComponent(text2.trim())}&apikey=ubed2407`;

    // Mengirim reaksi emoji saat mulai proses
    await conn.sendMessage(m.chat, { react: { text: "🍊", key: m.key } });

    try {
        // Mengambil data dari API
        let response = await axios({ url: apiUrl, method: "GET", responseType: "arraybuffer" });

        // Mengirim gambar yang diterima dari API
        await conn.sendMessage(m.chat, {
            image: response.data,
            caption: `✅ *Drake Posting berhasil dibuat!*\n📌 *Teks 1:* ${text1.trim()}\n📌 *Teks 2:* ${text2.trim()}`,
        }, { quoted: m });

        // Mengirim reaksi emoji selesai
        await conn.sendMessage(m.chat, { react: { text: "🍏", key: m.key } });

    } catch (e) {
        console.error("[ERROR]", e);
        // Mengirim reaksi error jika ada masalah
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        throw `❌ Terjadi kesalahan saat membuat drake posting.\n\n🔍 *Error:* ${e.message || e}`;
    }
};

handler.help = ["drakeposting"];
handler.tags = ["fun"];
handler.command = /^(drakeposting)$/i;

export default handler;