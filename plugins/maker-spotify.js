import axios from "axios";

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `📌 *Gunakan format:*\n${usedPrefix}${command} <judul> | <penulis> | <album> | <gambar>\n\n📌 *Contoh:*\n${usedPrefix}${command} Kyy | Kyy | BeforeLife | https://i.scdn.co/image/ab67616d00001e02621fe38a73b2a45e9be957d3`;

    let [title, author, album, image] = text.split("|");
    if (!title || !author || !album || !image) throw `📌 *Gunakan format yang benar:*\n${usedPrefix}${command} <judul> | <penulis> | <album> | <gambar>\n\n📌 *Contoh:*\n${usedPrefix}${command} Kyy | Kyy | BeforeLife | https://i.scdn.co/image/ab67616d00001e02621fe38a73b2a45e9be957d3`;

    let apiUrl = `https://beforelife.me/api/maker/spotify?title=${encodeURIComponent(title.trim())}&author=${encodeURIComponent(author.trim())}&album=${encodeURIComponent(album.trim())}&image=${encodeURIComponent(image.trim())}&apikey=ubed2407`;

    // Mengirim reaksi emoji saat mulai proses
    await conn.sendMessage(m.chat, { react: { text: "🍊", key: m.key } });

    try {
        // Mengambil data dari API
        let response = await axios({ url: apiUrl, method: "GET", responseType: "arraybuffer" });

        // Mengirim gambar yang diterima dari API
        await conn.sendMessage(m.chat, {
            image: response.data,
            caption: `✅ *Spotify Image berhasil dibuat!*\n📌 *Judul:* ${title.trim()}\n📌 *Penulis:* ${author.trim()}\n📌 *Album:* ${album.trim()}`,
        }, { quoted: m });

        // Mengirim reaksi emoji selesai
        await conn.sendMessage(m.chat, { react: { text: "🍏", key: m.key } });

    } catch (e) {
        console.error("[ERROR]", e);
        // Mengirim reaksi error jika ada masalah
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        throw `❌ Terjadi kesalahan saat membuat Spotify image.\n\n🔍 *Error:* ${e.message || e}`;
    }
};

handler.help = ["spotifymaker"];
handler.tags = ["fun"];
handler.command = /^(spotifymaker)$/i;

export default handler;