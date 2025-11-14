export async function before(m, { conn }) {
  let chat = global.db.data.chats[m.chat];

  // Pastikan chat ada di database
  if (!chat) return;

  // Jika fitur antiBot tidak aktif, langsung return
  if (!chat.antiBot) return;

  // Cek apakah pesan dari bot lain (Baileys) dan bukan dari bot sendiri
  if (m.isBaileys && m.sender !== conn.user.id) {
    await conn.sendMessage(m.chat, {  
      text: "Bot Terdeteksi! 🚫",  
    }, { quoted: m });

    // Hapus bot lain dari grup
    await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove");

    // Hentikan eksekusi lebih lanjut setelah menghapus bot
    return;
  }
}