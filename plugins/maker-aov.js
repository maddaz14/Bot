const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `Masukkan teks!\n\nContoh: ${usedPrefix + command} UbedBot`
    }, { quoted: m });
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const imageUrl = `https://api.lolhuman.xyz/api/ephoto1/aovwall?apikey=ubed2407&text=${encodeURIComponent(text)}`;

    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: `AOV Wall oleh ubed Bot\nTeks: ${text}`
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.sendMessage(m.chat, {
      text: `Terjadi kesalahan: ${err.message || err}`
    }, { quoted: m });
  }
};

handler.help = ['aov <teks>'];
handler.tags = ['maker'];
handler.command = ['aov'];
handler.limit = true;

export default handler;