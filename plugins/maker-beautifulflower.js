const handler = async (m, { conn, text }) => {
  try {
    if (!text) throw 'Masukkan teks!\n\nContoh: .beautifulflower LoLHuman';
    await conn.sendMessage(m.chat, { react: { text: '🌸', key: m.key } });

    const res = await fetch(`https://api.lolhuman.xyz/api/ephoto1/beautifulflower?apikey=ubed2407&text=${encodeURIComponent(text)}`);
    const buffer = await res.arrayBuffer();

    await conn.sendMessage(m.chat, {
      image: Buffer.from(buffer),
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

handler.help = ['beautifulflower <teks>'];
handler.tags = ['maker'];
handler.command = ['beautifulflower'];
handler.limit = true;

export default handler;