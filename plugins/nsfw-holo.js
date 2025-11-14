const handler = async (m, { conn }) => {
  try {
    const imageUrl = 'https://api.lolhuman.xyz/api/random2/holo?apikey=ubed2407';

    // Mengirimkan reaksi emoji ✨
    await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

    // Mengirimkan gambar dengan caption
    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: 'Holo Image - Dibuat oleh ubed Bot'
    }, { quoted: m });

    // Mengirimkan reaksi emoji ✅
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    // Jika terjadi kesalahan, kirimkan reaksi emoji ❌ dan pesan kesalahan
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.sendMessage(m.chat, {
      text: `Terjadi kesalahan: ${err.message || err}`
    }, { quoted: m });
  }
};

handler.help = ['holo'];
handler.tags = ['nsfw'];
handler.command = ['holo'];
handler.limit = true;
handler.premium = true;

export default handler;