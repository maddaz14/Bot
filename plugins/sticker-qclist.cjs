// plugins/qc-list.cjs
let handler = async (m, { conn, usedPrefix, command }) => {
  const fkontak = {
      "key": {
          "participant": '0@s.whatsapp.net',
          "remoteJid": "0@s.whatsapp.net",
          "fromMe": false,
          "id": "Halo",
      },
      "message": {
          "conversation": `Quotly Colors ${global.namebot || 'Bot'} 🎨`,
      }
  };

  // Daftar 20 kode warna HEX (harus sama dengan di qc.cjs)
  const COLORS_LIST = [
    { name: "Normal (Putih)", hex: "#ffffffff" },
    { name: "Merah Muda Pastel", hex: "#FFEBEE" },
    { name: "Hijau Muda Pastel", hex: "#E8F5E9" },
    { name: "Biru Muda Pastel", hex: "#E3F2FD" },
    { name: "Oranye Muda Pastel", hex: "#FFF3E0" },
    { name: "Ungu Muda Pastel", hex: "#F3E5F5" },
    { name: "Merah Muda Sedang", hex: "#FFCDD2" },
    { name: "Hijau Sedang", hex: "#C8E6C9" },
    { name: "Biru Sedang", hex: "#BBDEFB" },
    { name: "Oranye Sedang", hex: "#FFE0B2" },
    { name: "Ungu Sedang", hex: "#D1C4E9" },
    { name: "Merah Cerah", hex: "#FF8A80" },
    { name: "Hijau Cerah", hex: "#B9F6CA" },
    { name: "Biru Cerah", hex: "#82B1FF" },
    { name: "Oranye Cerah", hex: "#FFD180" },
    { name: "Ungu Cerah", hex: "#EA80FC" },
    { name: "Merah Tua", hex: "#C51162" },
    { name: "Teal Tua", hex: "#00BFA5" },
    { name: "Biru Tua", hex: "#2962FF" },
    { name: "Oranye Tua", hex: "#FF6E40" }
  ];

  let listText = `*LIST WARNA QUOTLY (${usedPrefix}qc)*\n\n`;
  listText += `Untuk menggunakan warna, tambahkan nomor di belakang perintah *qc*.\n`;
  listText += `Contoh: *${usedPrefix}qc5* (untuk warna Ungu Muda Pastel)\n\n`;

  COLORS_LIST.forEach((color, index) => {
    listText += `*${usedPrefix}qc${index}*: ${color.name} (HEX: ${color.hex})\n`;
  });

  listText += `\n_Pilih warna yang sesuai dengan selera Anda!_`;

  await conn.sendMessage(m.chat, { react: { text: '🎨', key: m.key } });
  await conn.reply(m.chat, listText.trim(), m, { quoted: fkontak });
  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
};

handler.help = ['qclist', 'qccolors'];
handler.tags = ['sticker'];
handler.command = /^(qclist|qccolors|listqc)$/i;
handler.limit = true;

module.exports = handler;