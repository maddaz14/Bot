import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    // Pastikan ada input kota dan negara
    if (!text) {
        throw `🕌 Hai! Aku bisa menampilkan jadwal sholat.
        
Contoh:
*${usedPrefix}${command} Jakarta, Indonesia*
*${usedPrefix}${command} Surabaya, Indonesia*

Format: *[kota], [negara]*
`;
    }

    const parts = text.split(',').map(s => s.trim());
    let city = parts[0];
    let country = parts[1] || 'Indonesia'; // Default negara ke Indonesia jika tidak disebutkan

    // Ambil domain dan API Key Maelyn dari global.maelyn di config.js
    const maelynDomain = global.maelyn.domain;
    const maelynApiKey = global.maelyn.key;

    // Lakukan validasi dasar untuk memastikan konfigurasi ada
    if (!maelynDomain || !maelynApiKey) {
        throw 'API Key atau Domain Maelyn belum diatur di config.js! Mohon hubungi pemilik bot.';
    }

    await conn.sendMessage(m.chat, { react: { text: '🍏', key: m.key } }); // Reaksi loading

    try {
        // Encode city dan country untuk keamanan URL
        const encodedCity = encodeURIComponent(city);
        const encodedCountry = encodeURIComponent(country);

        // Bangun URL API
        const apiUrl = `${maelynDomain}/api/jadwalsholat?city=${encodedCity}&country=${encodedCountry}&apikey=${maelynApiKey}`;

        // Kirim permintaan GET ke Maelyn API
        const response = await axios.get(apiUrl);
        const { status, result, code } = response.data;

        if (status === 'Success' && code === 200 && result?.timings && result?.date) {
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); // Reaksi sukses

            const { gregorian, hijri } = result.date;
            const { Imsak, Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha } = result.timings;
            const { timezone, method, location } = result.meta;

            let replyText = `🕌 *Jadwal Sholat*\n`;
            replyText += `Lokasi: *${location}*\n`;
            replyText += `Tanggal Masehi: *${gregorian}*\n`;
            replyText += `Tanggal Hijriah: *${hijri}*\n\n`;
            replyText += `*Waktu Sholat Hari Ini:*\n`;
            replyText += `\`\`\`
Imsak   : ${Imsak}
Subuh   : ${Fajr}
Terbit  : ${Sunrise}
Dzuhur  : ${Dhuhr}
Ashar   : ${Asr}
Maghrib : ${Maghrib}
Isya'   : ${Isha}
\`\`\`
\n`;
            replyText += `Metode Kalkulasi: ${method}\n`;
            replyText += `Zona Waktu: ${timezone}`;

            m.reply(replyText);
        } else {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi gagal
            m.reply(`❌ Gagal mendapatkan jadwal sholat untuk ${city}, ${country}. Respon API: ${JSON.stringify(response.data)}`);
        }
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi error
        m.reply(`Terjadi kesalahan saat menghubungi Jadwal Sholat API: ${e.message}`);
    }
};

handler.help = ['jadwalsholat', 'sholat'];
handler.tags = ['internet'];
handler.command = /^(jadwalsholat|sholat)$/i;
handler.limit = true; // Batasi penggunaan jika perlu
handler.premium = false; // Hanya untuk pengguna non-premium jika perlu

export default handler;