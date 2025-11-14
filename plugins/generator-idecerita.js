import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    // Pastikan ada prompt yang diberikan oleh pengguna untuk dasar ide cerita
    if (!text) {
        throw `Hai! Aku bisa memberimu ide atau prompt cerita yang menarik.\n\nContoh: *${usedPrefix}${command} Tentang petualangan di dunia sihir*`;
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

        // Bangun URL API dengan model yang baru: "story-prompt-generator"
        const apiUrl = `${maelynDomain}/api/generator?model=story-prompt-generator&q=${encodedPrompt}&apikey=${maelynApiKey}`;

        // Kirim permintaan GET ke Maelyn API
        const response = await axios.get(apiUrl);
        const { status, result, code } = response.data;

        if (status === 'Success' && code === 200 && result) {
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); // Reaksi sukses
            m.reply(`💡 *Ide Cerita Anda:*\n\n${result}`); // Result langsung berupa string ide cerita
        } else {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi gagal
            m.reply(`❌ Gagal menghasilkan ide cerita. Respon API: ${JSON.stringify(response.data)}`);
        }
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi error
        m.reply(`Terjadi kesalahan saat menghubungi Story Prompt Generator API: ${e.message}`);
    }
};

handler.help = ['storyprompt', 'idecerita', 'buatinide'];
handler.tags = ['ai', 'generator'];
handler.command = /^(storyprompt|idecerita|buatinide)$/i; // Menggunakan regex untuk beberapa alias
handler.limit = true; // Batasi penggunaan jika perlu
handler.premium = false; // Hanya untuk pengguna non-premium jika perlu

export default handler;