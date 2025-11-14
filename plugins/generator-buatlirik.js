import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    // Pastikan ada prompt yang diberikan oleh pengguna untuk dasar lirik
    if (!text) {
        throw `🎵 Aku bisa membantumu menciptakan ide lirik lagu.\n\nContoh: *${usedPrefix}${command} Tentang patah hati dan hujan di malam hari*`;
    }

    // Ambil domain dan API Key Maelyn dari global.maelyn di config.js
    const maelynDomain = global.maelyn.domain;
    const maelynApiKey = global.maelyn.key;

    // Lakukan validasi dasar untuk memastikan konfigurasi ada
    if (!maelynDomain || !maelynApiKey) {
        throw 'API Key atau Domain Maelyn belum diatur di config.js! Mohon hubungi pemilik bot.';
    }

    await conn.sendMessage(m.chat, { react: { text: '🍏', key: m.key } }); // Reaksi loading

    try {
        // Encode prompt untuk keamanan URL
        const encodedPrompt = encodeURIComponent(text);

        // Bangun URL API dengan model "song-lyrics-generator"
        const apiUrl = `${maelynDomain}/api/generator?model=song-lyrics-generator&q=${encodedPrompt}&apikey=${maelynApiKey}`;

        // Kirim permintaan GET ke Maelyn API
        const response = await axios.get(apiUrl);
        const { status, result, code } = response.data;

        if (status === 'Success' && code === 200 && result) {
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); // Reaksi sukses
            m.reply(`🎤 *Ide Lirik Lagu Anda:*\n\n${result}`); // Result langsung berupa string lirik
        } else {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi gagal
            m.reply(`❌ Gagal menghasilkan lirik lagu. Respon API: ${JSON.stringify(response.data)}`);
        }
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi error
        m.reply(`Terjadi kesalahan saat menghubungi Song Lyrics Generator API: ${e.message}`);
    }
};

handler.help = ['lyricsgen', 'lirikgen', 'buatlirik'];
handler.tags = ['ai', 'generator'];
handler.command = /^(lyricsgen|lirikgen|buatlirik)$/i; // Menggunakan regex untuk beberapa alias
handler.limit = true; // Batasi penggunaan jika perlu
handler.premium = false; // Hanya untuk pengguna non-premium jika perlu

export default handler;