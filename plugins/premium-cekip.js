import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `
≡ *CEK IP* 🔍
───────────────
Penggunaan:
${usedPrefix + command} <Alamat IP>

Contoh:
${usedPrefix + command} 8.8.8.8
`.trim();
    }

    let ip = text;

    try {
        const res = await fetch(`http://ip-api.com/json/${ip}`);
        const json = await res.json();

        if (json.status === 'success') {
            const {
                country,
                countryCode,
                city,
                regionName,
                timezone,
                isp,
                org,
                as,
                lat,
                lon,
                proxy,
                hosting
            } = json;

            let message = `
≡ *INFORMASI IP* 🌐🔍
──────────────────
📍 Alamat IP: ${ip}
🗺️ Negara: ${country} (${countryCode})
🏙️ Kota: ${city}
🏞️ Wilayah: ${regionName}
⏰ Zona Waktu: ${timezone}
🏢 ISP: ${isp}
🏢 Organisasi: ${org}
🏛️ AS: ${as}
📍 Latitude: ${lat}
📍 Longitude: ${lon}
🛡️ Proxy: ${proxy ? '✅' : '❌'}
🚀 Hosting: ${hosting ? '✅' : '❌'}
`.trim();

            conn.reply(m.chat, message, m);
        } else {
            conn.reply(m.chat, `Terjadi Kesalahan: ${json.message}`, m);
        }
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, 'Terjadi kesalahan saat memproses permintaan.', m);
    }
};

handler.help = ['cekip <ip address>'];
handler.tags = ['premium'];
handler.command = /^(cekip)$/i;
handler.premium = true;

export default handler;