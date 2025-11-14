// Plugin: .countryinfo
// Dibuat oleh ubed - https://siputzx.my.id

import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const query = args.join(' ');
  if (!query) throw `📌 Contoh: ${usedPrefix + command} Indonesia`;

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const url = `https://api.siputzx.my.id/api/tools/countryInfo?name=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const json = await res.json();

    if (!json.status || !json.data) throw '*❌ Negara tidak ditemukan.*';

    const data = json.data;
    const neighbors = data.neighbors?.map(n => `• ${n.name} 🌍 [Maps](https://www.google.com/maps?q=${n.coordinates.latitude},${n.coordinates.longitude})`).join('\n') || '-';

    const caption = `
🏳️ *${data.name}*
🗺️ *Ibu Kota:* ${data.capital}
📍 *Benua:* ${data.continent.name} ${data.continent.emoji}
📌 *Koordinat:* ${data.coordinates.latitude}, ${data.coordinates.longitude}
📞 *Kode Telepon:* ${data.phoneCode}
🌐 *TLD:* ${data.internetTLD}
💱 *Mata Uang:* ${data.currency}
🏛️ *Pemerintahan:* ${data.constitutionalForm}
🚗 *Arah Kemudi:* ${data.drivingSide}
🍺 *Larangan Alkohol:* ${data.alcoholProhibition}
🧭 *Area:* ${data.area.squareKilometers.toLocaleString()} km²
🗣️ *Bahasa:* ${data.languages.native.join(', ')}
📦 *ISO Code:* ${data.isoCode.alpha3} (${data.isoCode.numeric})
🔥 *Terkenal karena:* ${data.famousFor}
📍 *Lokasi Google Maps:* ${data.googleMapsLink}

🌐 *Negara Tetangga:*
${neighbors}
`.trim();

    await conn.sendFile(m.chat, data.flag, 'flag.png', caption, m);
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    throw '*❌ Terjadi kesalahan saat mengambil data negara.*';
  }
};

handler.help = ['countryinfo'].map(v => v + ' <nama negara>');
handler.tags = ['tools', 'info'];
handler.command = /^countryinfo$/i;

export default handler;