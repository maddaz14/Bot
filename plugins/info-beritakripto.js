import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    // Default jumlah hari adalah 7 jika tidak disebutkan
    const days = parseInt(text) || 7; 

    if (days <= 0 || days > 7) { // Batasan tetap sama untuk menghindari terlalu banyak data atau data tidak relevan
        throw `Jumlah hari harus angka positif antara 1 sampai 7. Contoh: *${usedPrefix}${command} 3*`;
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
        // Bangun URL API
        const apiUrl = `${maelynDomain}/api/news/cryptocurrency?days=${days}&apikey=${maelynApiKey}`;

        // Kirim permintaan GET ke Maelyn API
        const response = await axios.get(apiUrl);
        const { status, result, code } = response.data;

        if (status === 'Success' && code === 200 && Array.isArray(result) && result.length > 0) {
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); // Reaksi sukses

            let replyText = `📰 *Berita Cryptocurrency Terbaru (${days} Hari Terakhir)*\n\n`;
            
            // Batasi tampilan hingga 5 berita untuk menjaga kerapihan
            const articlesToShow = result.slice(0, 5); 

            articlesToShow.forEach((article, index) => {
                const publishedDate = new Date(article.publishedAt).toLocaleDateString('id-ID', {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                });
                
                replyText += `*${index + 1}. ${article.title || 'Tidak Diketahui'}*\n`;
                replyText += `  Sumber: ${article.source || 'N/A'}\n`;
                replyText += `  Publikasi: ${publishedDate || 'N/A'}\n`;
                replyText += `  Link: ${article.url || 'N/A'}\n\n`;
            });

            m.reply(replyText);

        } else {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi gagal
            m.reply(`❌ Gagal mengambil berita cryptocurrency untuk ${days} hari terakhir. Respon API: ${JSON.stringify(response.data)}`);
        }
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi error
        m.reply(`Terjadi kesalahan saat menghubungi Cryptocurrency News API: ${e.message}`);
    }
};

handler.help = ['cryptonews', 'beritakripto'];
handler.tags = ['info'];
handler.command = /^(cryptonews|beritakripto)$/i;
handler.limit = true; // Batasi penggunaan jika perlu
handler.premium = false; // Hanya untuk pengguna non-premium jika perlu

export default handler;