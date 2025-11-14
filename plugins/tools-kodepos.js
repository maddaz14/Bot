// Plugin: .kodepos
// Dibuat oleh ubed - https://siputzx.my.id

import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const query = args.join(' ');
  if (!query) throw `📌 Contoh: ${usedPrefix + command} Pasiran Jaya`;

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const url = `https://api.siputzx.my.id/api/tools/kodepos?form=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const json = await res.json();

    if (!json.status || !json.data || json.data.length === 0)
      throw `❌ Kodepos untuk *${query}* tidak ditemukan.`;

    const results = json.data.map((d, i) => `
📍 *Hasil ${i + 1}:*
• Desa: ${d.desa}
• Kecamatan: ${d.kecamatan}
• Kota: ${d.kota}
• Provinsi: ${d.provinsi}
🏷️ Kode Pos: *${d.kodepos}*
`.trim()).join('\n\n');

    await conn.sendMessage(m.chat, { text: results, mentions: [m.sender] });
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    throw '*❌ Terjadi kesalahan saat mencari kodepos.*';
  }
};

handler.help = ['kodepos'].map(v => v + ' <nama kelurahan/desa>');
handler.tags = ['tools', 'info'];
handler.command = /^kodepos$/i;

export default handler;