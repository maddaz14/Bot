let handler = async (m, { conn, usedPrefix }) => {
  const sticker = global.db.data.users[m.sender].sticker;

  // Cek jika tidak ada stiker yang tersimpan
  if (!sticker || Object.keys(sticker).length === 0) {
    return m.reply(`*🍭 Oops! Kamu belum punya stiker dengan perintah tersimpan.*
*Coba buat satu dengan ${usedPrefix}setcmd dulu ya!* ✨`);
  }

  // Membuat daftar stiker yang lebih rapi
  const list = Object.entries(sticker)
    .map(([key, value], index) => {
      const status = value.locked ? '🔒 Terkunci' : '🔓 Terbuka';
      return `*${index + 1}.* 🏷️ *${status}*\n\`\`\` ${value.text}\`\`\``;
    })
    .join('\n\n');

  // Mengirim pesan dengan daftar stiker
  await conn.reply(m.chat, 
    `*✨ DAFTAR PERINTAH STIKER KAMU ✨*\n\n` +
    `_Total: ${Object.keys(sticker).length} stiker_ 📝\n\n` +
    list.trim(), m, {
      mentions: Object.values(sticker).map(x => x.mentionedJid || []).flat()
    });
}

handler.help = ['cmdlist'];
handler.tags = ['database'];
handler.command = /^(cmdlist)$/i;
handler.register = true;

export default handler;