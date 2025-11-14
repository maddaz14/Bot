let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Tentukan apakah perintahnya 'lock' atau 'unlock'
  const isLock = /lock/i.test(command);
  const actionText = isLock ? 'kunci' : 'buka';
  const successEmoji = isLock ? '🔒' : '🔓';
  const failEmoji = '❌';

  // Periksa apakah pengguna membalas stiker
  if (!m.quoted || !m.quoted.fileSha256) {
    return m.reply(`*${failEmoji} Format salah! Mohon balas stiker yang ingin di-${actionText}.*`);
  }

  const hash = m.quoted.fileSha256.toString('hex');
  const stickerData = global.db.data.users[m.sender].sticker;

  // Periksa apakah stiker sudah terdaftar di database
  if (!stickerData || !(hash in stickerData)) {
    return m.reply(`*${failEmoji} Stiker ini belum terdaftar di database kamu!*`);
  }

  // Terapkan perubahan
  stickerData[hash].locked = isLock;

  // Kirim pesan konfirmasi
  m.reply(`*${successEmoji} Berhasil! Perintah stiker ${isLock ? 'terkunci' : 'terbuka'} dan sekarang ${isLock ? 'tidak' : ''} bisa diubah lagi.*`);
}

handler.help = ['lockcmd', 'unlockcmd'];
handler.tags = ['database'];
handler.command = /^(lockcmd|unlockcmd)$/i;
handler.premium = true;
handler.register = true;

export default handler;