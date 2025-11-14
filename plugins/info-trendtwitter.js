import axios from "axios";

let handler = async (m, { conn, usedPrefix, command }) => {
    let apiUrl = "https://beforelife.me/api/info/trend/twitter?country=indonesia&apikey=ubed2407";

    try {
        let response = await axios.get(apiUrl);
        let result = response.data.result;

        if (!result || !result.data || result.data.length === 0) {
            throw "❌ Tidak ada trending topic yang ditemukan!";
        }

        let message = `🌍 *Trending Twitter di Indonesia*\n\n`;
        result.data.forEach((item, index) => {
            message += `*${item.trending_number}.* ${item.hastag}\n`;
            message += `   📝 *Tweet Count:* ${item.tweet_count}\n`;
            message += `   🔗 [Lihat di Twitter](${item.url})\n\n`;
        });

        await conn.sendMessage(m.chat, { text: message }, { quoted: m });
    } catch (e) {
        console.error("[ERROR]", e);
        await conn.sendMessage(m.chat, { text: "❌ Terjadi kesalahan saat mengambil data trending Twitter!" }, { quoted: m });
    }
};

handler.help = ["trendtwitter"];
handler.tags = ["info"];
handler.command = /^(trendtwitter)$/i;

export default handler;