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
        const apiUrl = `${maelynDomain}/api/market/topgainers?apikey=${maelynApiKey}`;

        // Kirim permintaan GET ke Maelyn API
        const response = await axios.get(apiUrl);
        const { status, result, code } = response.data;

        if (status === 'Success' && code === 200 && Array.isArray(result) && result.length > 0) {
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); // Reaksi sukses

            let replyText = `📈 *Top Gainers Pasar Kripto (24 Jam)*\n\n`;
            
            // Batasi tampilan hingga 10 item untuk menjaga kerapihan
            const itemsToShow = result.slice(0, 10); 

            itemsToShow.forEach((item, index) => {
                const changePercentage = typeof item.change === 'number' ? item.change.toFixed(2) : item.change;
                replyText += `*${index + 1}. Pair:* ${item.pair || 'N/A'}\n`;
                replyText += `  Perubahan: *+${changePercentage}%*\n\n`;
            });

            m.reply(replyText);

        } else {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi gagal
            m.reply(`❌ Gagal mengambil data top gainers pasar kripto. Respon API: ${JSON.stringify(response.data)}`);
        }
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi error
        m.reply(`Terjadi kesalahan saat menghubungi Market Top Gainers API: ${e.message}`);
    }
};

handler.help = ['topgainers', 'kriptonaik'];
handler.tags = ['info'];
handler.command = /^(topgainers|kriptonaik)$/i;
handler.limit = true; // Batasi penggunaan jika perlu
handler.premium = false; // Hanya untuk pengguna non-premium jika perlu

export default handler;