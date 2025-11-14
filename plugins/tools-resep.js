import fetch from 'node-fetch';

// Objek kontak dummy (Opsional, tergantung framework bot yang digunakan)
const fkontak = {
  key: {
    participant: '0@s.whatsapp.net',
    remoteJid: 'status@broadcast',
    fromMe: false,
    id: 'Halo',
  },
  message: {
    conversation: '🍲 Pencarian Resep by UbedBot',
  },
};

// Handler utama untuk plugin
let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Pastikan pengguna menyertakan kata kunci pencarian
  if (!text) {
    return conn.reply(m.chat, `⚠️ Masukkan nama resep yang ingin dicari.\nContoh: *${usedPrefix + command} nasi goreng*`, m, { quoted: fkontak });
  }

  try {
    // Kirim reaksi '⏳' untuk menandakan sedang diproses
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    // Panggil API untuk mencari resep
    const url = `https://api.siputzx.my.id/api/s/resep?query=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    
    // Periksa status respons
    if (!res.ok) {
      throw new Error(`Gagal terhubung ke API resep. Status: ${res.status}`);
    }

    const json = await res.json();

    // Periksa apakah ada resep yang ditemukan
    if (!json.status || !json.data || json.data.length === 0) {
      return conn.reply(m.chat, `❌ Tidak ada resep yang ditemukan untuk "${text}".`, m);
    }

    // Ambil resep pertama dari hasil pencarian
    const resep = json.data[0];

    // Buat format pesan yang akan dikirim
    const caption = `
*🍲 Resep: ${resep.judul}*
---
⏱️ *Waktu Masak:* ${resep.waktu_masak}
🧑‍🍳 *Porsi:* ${resep.hasil}
⭐ *Tingkat Kesulitan:* ${resep.tingkat_kesulitan}
---
*📝 Bahan-bahan:*
${resep.bahan.trim()}
---
*📖 Langkah-langkah:*
${resep.langkah_langkah.trim()}
    `.trim();

    // Kirim pesan dengan gambar dan teks
    await conn.sendMessage(m.chat, {
      image: { url: resep.thumb },
      caption: caption,
    }, { quoted: m });

    // Kirim reaksi '✅' setelah berhasil
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (e) {
    console.error(e);
    // Kirim reaksi '❌' jika terjadi error
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    conn.reply(m.chat, `❌ Terjadi kesalahan: ${e.message}`, m);
  }
};

// Pengaturan metadata plugin
handler.help = ['resep'];
handler.tags = ['tools', 'internet'];
handler.command = /^(resep)$/i;
handler.limit = true;
handler.register = true;

export default handler;