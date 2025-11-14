const handler = async (m, { conn, text }) => {
  try {
    if (!text) {
      return await conn.sendMessage(m.chat, { text: 'Masukkan nama yang ingin ditampilkan (contoh: Test)' });
    }

    // Menggunakan API dengan parameter 'name' yang diambil dari text
    const imageUrl = `https://api.lolhuman.xyz/api/fuckboy?apikey=ubed2407&name=${encodeURIComponent(text)}`;

    // Mengirimkan reaksi emoji 🔥
    await conn.sendMessage(m.chat, { react: { text: '🔥', key: m.key } });

    // Mengirimkan gambar dari API
    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: `Gambar dari API - Dibuat oleh ubed Bot`
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

handler.help = ['fuckboy <nama>'];
handler.tags = ['maker'];
handler.command = ['fuckboy'];
handler.limit = true;

export default handler;