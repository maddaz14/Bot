import axios from "axios";

let handler = async (m, { conn, usedPrefix, command }) => {
    let apiUrl = "https://beforelife.me/api/info/rsrujukan?apikey=ubed2407";

    try {
        let response = await axios.get(apiUrl);
        let result = response.data.result;

        if (!result || result.length === 0) {
            throw "❌ Tidak ada data rumah sakit rujukan yang ditemukan!";
        }

        let message = `🏥 *Daftar Rumah Sakit Rujukan COVID-19 di Indonesia*\n\n`;
        result.forEach((item, index) => {
            message += `*${index + 1}.* ${item.name}\n`;
            message += `   📍 *Alamat:* ${item.address}\n`;
            message += `   🏙️ *Wilayah:* ${item.region}\n`;
            message += `   🗺️ *Provinsi:* ${item.province}\n`;
            message += `   ☎️ *Telepon:* ${item.phone}\n\n`;
        });

        await conn.sendMessage(m.chat, { text: message }, { quoted: m });
    } catch (e) {
        console.error("[ERROR]", e);
        await conn.sendMessage(m.chat, { text: "❌ Terjadi kesalahan saat mengambil data rumah sakit rujukan!" }, { quoted: m });
    }
};

handler.help = ["rsrujukan"];
handler.tags = ["info"];
handler.command = /^(rsrujukan)$/i;

export default handler;