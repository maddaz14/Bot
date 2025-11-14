import axios from 'axios';
import fs from 'fs';

let handler = async (m, { conn, usedPrefix, command }) => {
    await conn.sendMessage(m.chat, { react: { text: '🕑', key: m.key } });

    try {
        // Ambil data top 5 coin dari CoinGecko
        const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets';
        const response = await axios.get(apiUrl, {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 5,
                page: 1,
                sparkline: false
            }
        });
        const topCoins = response.data;

        if (!topCoins.length) throw 'Tidak dapat mengambil data cryptocurrency.';

        // Format pesan
        let message = '📊 *Top 5 Cryptocurrency by Market Cap* 📊\n\n';
        topCoins.forEach((coin, index) => {
            const priceChange = coin.price_change_percentage_24h.toFixed(2);
            const priceChangeColor = priceChange >= 0 ? '🟢' : '🔴'; // Hijau jika naik, merah jika turun
            message += `*${index + 1}. ${coin.name} (${coin.symbol.toUpperCase()})*\n` +
                       `💵 *Harga*: $${coin.current_price.toLocaleString()}\n` +
                       `${priceChangeColor} *24h*: ${priceChange}%\n` +
                       `📈 *Market Cap*: $${coin.market_cap.toLocaleString()}\n` +
                       `💹 *Volume 24h*: $${coin.total_volume.toLocaleString()}\n\n`;
        });

        // Kirim pesan
        conn.sendMessage(m.chat, {
            document: fs.readFileSync("./thumbnail.jpg"),
            fileName: `- Crypto By ${global.author} -`,
            fileLength: '1',
            mimetype: 'application/msword',
            jpegThumbnail: await conn.resize(fs.readFileSync('./src/bahan/ytta.jpg'), 350, 190),
            caption: message,
            contextInfo: {
                forwardingScore: 99999999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363199602506586@newsletter',
                    serverMessageId: null,
                    newsletterName: `© ${global.namebot} || ${global.author}`
                }
            }
        }, { quoted: floc });

        await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
    } catch (err) {
        throw `Terjadi kesalahan: ${err.message}`;
    }
};

handler.help = ['crypto'];
handler.tags = ['info'];
handler.command = ['crypto', 'topcrypto'];
handler.limit = true;
handler.register = true;

export default handler;