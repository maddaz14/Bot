import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) throw `Contoh penggunaan:\n${usedPrefix + command} LoL Human`;

    await conn.sendMessage(m.chat, { react: { text: '🧠', key: m.key } });

    const api = `https://api.lolhuman.xyz/api/creator/changemymind?apikey=ubed2407&text=${encodeURIComponent(text)}`;

    await conn.sendMessage(m.chat, {
      image: { url: api },
      caption: 'Dibuat oleh ubed Bot'
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.sendMessage(m.chat, {
      text: `Terjadi kesalahan: ${err.message || err}`
    }, { quoted: m });
  }
};

handler.help = ['changemymind <teks>'];
handler.tags = ['maker'];
handler.command = ['changemymind'];
handler.limit = true;

export default handler;