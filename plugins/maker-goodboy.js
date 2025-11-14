const handler = async (m, { conn, text }) => {
  try {
    if (!text) {
      return await conn.sendMessage(m.chat, { text: 'Masukkan nama untuk mendapatkan gambar goodboy (contoh: Test).' });
    }

    // URL API untuk mengonversi nama menjadi gambar goodboy
    const imageUrl = `https://api.lolhuman.xyz/api/goodboy?apikey=ubed2407&name=${encodeURIComponent(text)}`;

    // Mengirimkan reaksi emoji 🐶
    await conn.sendMessage(m.chat, { react: { text: '🐶', key: m.key } });

    // Mengirimkan gambar dengan caption
    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: `Good Boy - Dibuat oleh ubed Bot`
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

handler.help = ['goodboy <nama>'];
handler.tags = ['maker'];
handler.command = ['goodboy'];
handler.limit = true;

export default handler;