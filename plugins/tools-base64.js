// Plugin: .base64
// Dibuat oleh ubed - https://siputzx.my.id

import fetch from 'node-fetch';

const handler = async (m, { text, args, usedPrefix, command }) => {
  if (!text) throw `📌 Contoh:\n${usedPrefix + command} ubed`;

  try {
    await conn.sendMessage(m.chat, { react: { text: '🧬', key: m.key } });

    const res = await fetch(`https://api.siputzx.my.id/api/tools/text2base64?text=${encodeURIComponent(text)}`);
    const json = await res.json();
    if (!json.status || !json.data?.base64) throw '❌ Gagal encode teks.';

    const base64 = json.data.base64;

    await m.reply(`📥 *Teks:* ${text}\n📤 *Base64:* \`\`\`${base64}\`\`\``);
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (err) {
    console.error(err);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    throw '*Terjadi kesalahan saat mengonversi ke Base64.*';
  }
};

handler.help = ['base64'].map(v => v + ' <teks>');
handler.tags = ['tools'];
handler.command = /^base64$/i;

export default handler;