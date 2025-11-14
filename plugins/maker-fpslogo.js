const handler = async (m, { conn, text }) => {
  try {
    // Memperbaiki URL dengan menggunakan backtick (``) untuk interpolasi string
    const imageUrl = `https://api.lolhuman.xyz/api/ephoto1/fpslogo?apikey=ubed2407&text=${encodeURIComponent(text)}`;

    // Mengirimkan reaksi emoji 🎮
    await conn.sendMessage(m.chat, { react: { text: '🎮', key: m.key } });

    // Mengirimkan gambar dengan caption "FPS Logo oleh ubed Bot"
    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: 'FPS Logo oleh ubed Bot'
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

handler.help = ['fpslogo <text>'];
handler.tags = ['maker'];
handler.command = ['fpslogo'];
handler.limit = true;

export default handler;