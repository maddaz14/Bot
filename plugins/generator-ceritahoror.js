import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    // Pastikan ada prompt yang diberikan oleh pengguna
    if (!text) {
        throw `Hai! Aku bisa menciptakan cerita horor untukmu.\n\nContoh: *${usedPrefix}${command} Sebuah rumah tua di hutan yang angker*`;
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

        // Bangun URL API
        const apiUrl = `${maelynDomain}/api/generator?model=horror-story-generator&q=${encodedPrompt}&apikey=${maelynApiKey}`;

        // Kirim permintaan GET ke Maelyn API
        const response = await axios.get(apiUrl);
        const { status, result, code } = response.data;

        if (status === 'Success' && code === 200 && result) {
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); // Reaksi sukses
            m.reply(`👻 *Kisah Horor Anda:*\n\n${result}`); // Result langsung berupa string cerita
        } else {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi gagal
            m.reply(`❌ Gagal menghasilkan cerita horor. Respon API: ${JSON.stringify(response.data)}`);
        }
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi error
        m.reply(`Terjadi kesalahan saat menghubungi Horror Story Generator API: ${e.message}`);
    }
};

handler.help = ['horrorstory', 'ceritahoror', 'kisahseram'];
handler.tags = ['ai', 'generator'];
handler.command = /^(horrorstory|ceritahoror|kisahseram)$/i; // Menggunakan regex untuk beberapa alias
handler.limit = true; // Batasi penggunaan jika perlu
handler.premium = false; // Hanya untuk pengguna non-premium jika perlu

export default handler;