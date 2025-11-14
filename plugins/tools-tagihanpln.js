import fetch from 'node-fetch';

// Objek kontak dummy (Opsional)
const fkontak = {
  key: {
    participant: '0@s.whatsapp.net',
    remoteJid: 'status@broadcast',
    fromMe: false,
    id: 'Halo',
  },
  message: {
    conversation: `💡 Cek Tagihan PLN by ${global.namebot}`,
  },
};

// Handler utama untuk plugin
let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Pastikan pengguna menyertakan nomor pelanggan
  if (!text) {
    return conn.reply(m.chat, `⚠️ Masukkan nomor pelanggan PLN yang ingin dicek.\nContoh: *${usedPrefix + command} 443100003506*`, m, { quoted: fkontak });
  }

  const noPelanggan = text.trim();

  try {
    // Kirim reaksi '⏳' untuk menandakan sedang diproses
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    // Panggil API untuk memeriksa tagihan PLN
    const url = `https://api.siputzx.my.id/api/check/tagihanpln?nopel=${encodeURIComponent(noPelanggan)}`;
    const res = await fetch(url);
    
    // Periksa status respons
    if (!res.ok) {
      throw new Error(`Gagal terhubung ke API. Status: ${res.status}`);
    }

    const json = await res.json();

    // Periksa jika status API false atau data tidak ditemukan
    if (!json.status || !json.data) {
        // Asumsi pesan error dari API ada di json.message
        const errorMessage = json.message || 'Tagihan tidak ditemukan atau sudah lunas.';
        return conn.reply(m.chat, `❌ ${errorMessage}`, m);
    }
    
    const { jenis_tagihan, no_pelanggan, nama_pelanggan, tarif_daya, bulan_tahun, stand_meter, total_tagihan } = json.data;

    // Buat format pesan untuk ditampilkan
    const caption = `
*💡 Info Tagihan PLN*
---
*Jenis Tagihan:* ${jenis_tagihan}
*No. Pelanggan:* ${no_pelanggan}
*Nama:* ${nama_pelanggan}
*Tarif/Daya:* ${tarif_daya}
*Periode:* ${bulan_tahun}
*Stand Meter:* ${stand_meter}
*Total Tagihan:* ${total_tagihan}
---
_Harap segera lakukan pembayaran untuk menghindari denda._
    `.trim();

    // Kirim pesan ke pengguna
    await conn.reply(m.chat, caption, m);

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
handler.help = ['cekpln'];
handler.tags = ['tools', 'cek'];
handler.command = /^(cekpln|tagihanpln)$/i;
handler.limit = true;
handler.register = true;

export default handler;