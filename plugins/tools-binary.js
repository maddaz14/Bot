// Plugin: .binary
// Dibuat oleh ubed - https://siputzx.my.id

import fetch from 'node-fetch';

const handler = async (m, { text, args, usedPrefix, command }) => {
  if (!text) throw `📌 Contoh:\n${usedPrefix + command} ubed`;

  try {
    await conn.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });

    const res = await fetch(`https://api.siputzx.my.id/api/tools/text2binary?content=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.status || !json.data) throw '❌ Gagal mengonversi teks ke biner.';

    await m.reply(`📥 *Teks:* ${text}\n📤 *Binary:* \`\`\`${json.data}\`\`\``);
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    throw '*Terjadi kesalahan saat mengonversi ke biner.*';
  }
};

handler.help = ['binary'].map(v => v + ' <teks>');
handler.tags = ['tools'];
handler.command = /^binary$/i;

export default handler;