import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    // Pastikan ada query berita yang diberikan oleh pengguna
    if (!text) {
        throw `Hai! Aku bisa mencari berita terbaru untukmu dari Google News.\n\nContoh: *${usedPrefix}${command} Teknologi AI terbaru*`;
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
        // Encode query untuk keamanan URL
        const encodedQuery = encodeURIComponent(text);

        // Bangun URL API
        const apiUrl = `${maelynDomain}/api/gnews?q=${encodedQuery}&apikey=${maelynApiKey}`;

        // Kirim permintaan GET ke Maelyn API
        const response = await axios.get(apiUrl);
        const { status, result, code } = response.data;

        if (status === 'Success' && code === 200 && Array.isArray(result) && result.length > 0) {
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); // Reaksi sukses

            let newsText = `📰 *Berita Terbaru untuk "${text}"*\n\n`;
            
            // Ambil beberapa berita teratas (misalnya 5 berita)
            const articlesToShow = result.slice(0, 5);

            articlesToShow.forEach((article, index) => {
                newsText += `*${index + 1}. ${article.title}*\n`;
                newsText += `Sumber: ${article.source} (${article.time})\n`;
                newsText += `Link: ${article.link}\n\n`;
            });

            newsText += `_Powered by Maelyn API_`;

            // Coba kirim dengan thumbnail dari berita pertama jika ada
            if (articlesToShow[0]?.image) {
                try {
                    const thumbRes = await fetch(articlesToShow[0].image);
                    const thumbBuffer = await thumbRes.buffer();
                    await conn.sendMessage(m.chat, {
                        image: thumbBuffer,
                        caption: newsText
                    }, { quoted: m });
                } catch (thumbError) {
                    console.error('Gagal mengirim thumbnail berita:', thumbError);
                    // Lanjutkan tanpa thumbnail jika gagal
                    await conn.reply(m.chat, newsText, m);
                }
            } else {
                await conn.reply(m.chat, newsText, m);
            }

        } else {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi gagal
            m.reply(`❌ Tidak dapat menemukan berita untuk "${text}". Respon API: ${JSON.stringify(response.data)}`);
        }
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi error
        m.reply(`Terjadi kesalahan saat menghubungi Google News API: ${e.message}`);
    }
};

handler.help = ['gnews', 'berita'];
handler.tags = ['info'];
handler.command = /^(gnews|berita)$/i;
handler.limit = true; // Batasi penggunaan jika perlu
handler.premium = false; // Hanya untuk pengguna non-premium jika perlu

export default handler;