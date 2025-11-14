// Plugin: .nik
// Dibuat oleh ubed - https://siputzx.my.id

import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const nik = args[0];
  if (!nik || !/^\d{16}$/.test(nik)) {
    throw `📌 Contoh:\n${usedPrefix + command} 3202285909840005`;
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

    const res = await fetch(`https://api.siputzx.my.id/api/tools/nik-checker?nik=${nik}`);
    const json = await res.json();
    if (!json.status || !json.data?.data) throw '❌ Data tidak ditemukan atau NIK salah.';

    const d = json.data.data;

    const teks = `
📄 *Hasil Pencarian NIK*
──────────────
• 🧾 *Nama:* ${d.nama}
• 🏷️ *NIK:* ${json.data.nik}
• 🧠 *Zodiak:* ${d.zodiak}
• 🎂 *Lahir:* ${d.tempat_lahir}
• 🕒 *Usia:* ${d.usia}
• ⚧️ *Gender:* ${d.kelamin}
• 🗺️ *Alamat:* ${d.alamat}
• 🗳️ *TPS:* ${d.tps}
• 📍 *Kelurahan:* ${d.kelurahan}
• 🏙️ *Kecamatan:* ${d.kecamatan}
• 🏛️ *Kabupaten:* ${d.kabupaten}
• 🌐 *Provinsi:* ${d.provinsi}
• 🗓️ *Ultah Mendatang:* ${d.ultah_mendatang}
• 🔠 *Pasaran:* ${d.pasaran}
──────────────
`.trim();

    await conn.sendMessage(m.chat, {
      image: { url: 'https://flagpedia.net/data/flags/h160/id.png' },
      caption: teks,
      mentions: [m.sender]
    });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (err) {
    console.error(err);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    throw '*Gagal mendapatkan data NIK!*';
  }
};

handler.help = ['nik'].map(v => v + ' <16 digit>');
handler.tags = ['tools', 'identity'];
handler.command = /^nik$/i;

export default handler;