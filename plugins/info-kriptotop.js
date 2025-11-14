import axios from 'axios';

const handler = async (m, { conn, usedPrefix, command }) => {
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
        const apiUrl = `${maelynDomain}/api/market/topvolume?apikey=${maelynApiKey}`;

        // Kirim permintaan GET ke Maelyn API
        const response = await axios.get(apiUrl);
        const { status, result, code } = response.data;

        if (status === 'Success' && code === 200 && Array.isArray(result) && result.length > 0) {
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); // Reaksi sukses

            let replyText = `📊 *Top Volume Pasar Kripto (IDR)*\n\n`;
            
            // Batasi tampilan hingga 5 atau 10 item untuk menjaga kerapihan
            const itemsToShow = result.slice(0, 5); 

            itemsToShow.forEach((item, index) => {
                replyText += `*${index + 1}. Pair:* ${item.market || 'N/A'}\n`;
                replyText += `  Harga Terakhir: ${item.lastPrice || 'N/A'}\n`;
                replyText += `  Harga Tertinggi (24h): ${item.high || 'N/A'}\n`;
                replyText += `  Harga Terendah (24h): ${item.low || 'N/A'}\n`;
                replyText += `  Volume IDR (24h): ${item.volumeIDR || 'N/A'}\n`;
                replyText += `  Harga Beli: ${item.buyPrice || 'N/A'}\n`;
                replyText += `  Harga Jual: ${item.sellPrice || 'N/A'}\n\n`;
            });

            m.reply(replyText);

        } else {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi gagal
            m.reply(`❌ Gagal mengambil data top volume pasar kripto. Respon API: ${JSON.stringify(response.data)}`);
        }
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi error
        m.reply(`Terjadi kesalahan saat menghubungi Market Top Volume API: ${e.message}`);
    }
};

handler.help = ['topvolume', 'kriptotop'];
handler.tags = ['info'];
handler.command = /^(topvolume|kriptotop)$/i;
handler.limit = true; // Batasi penggunaan jika perlu
handler.premium = false; // Hanya untuk pengguna non-premium jika perlu

export default handler;