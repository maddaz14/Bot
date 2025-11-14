const handler = async (m, { conn, text }) => {
  try {
    if (!text) {
      return await conn.sendMessage(m.chat, { text: 'Masukkan teks yang ingin ditampilkan di gambar (contoh: LoLHuman).' });
    }

    // URL API untuk mengonversi teks ke gambar dengan gaya galaxy
    const imageUrl = `https://api.lolhuman.xyz/api/ephoto1/galaxystyle?apikey=Queen&text=${encodeURIComponent(text)}`;

    // Mengirimkan reaksi emoji 🔥
    await conn.sendMessage(m.chat, { react: { text: '🔥', key: m.key } });

    // Mengirimkan gambar dengan caption
    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: `Gambar dengan gaya Galaxy - Dibuat oleh ubed Bot`
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

handler.help = ['galaxystyle <teks>'];
handler.tags = ['maker'];
handler.command = ['galaxystyle'];
handler.limit = true;

export default handler;