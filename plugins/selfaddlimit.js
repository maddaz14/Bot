let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  if (!user) throw 'User tidak ditemukan dalam database!';

  const usedKey = 'lastSelfAddLimit';
  const cooldown = 365 * 24 * 60 * 60 * 1000; // 1 tahun dalam ms
  const now = Date.now();

  if (user[usedKey] && now - user[usedKey] < cooldown) {
    let remaining = cooldown - (now - user[usedKey]);
    let remainingDays = Math.floor(remaining / (24 * 60 * 60 * 1000));
    throw `Kamu sudah pernah klaim. Silakan coba lagi dalam ${remainingDays} hari.`;
  }

  user.limit += 1000;
  user[usedKey] = now;

  await conn.reply(m.chat, `Berhasil! Kamu telah menambahkan +1000 limit ke akunmu.\n\nFitur ini hanya bisa dipakai 1x dalam 1 tahun.`, m);
};

handler.help = ['selfaddlimit'];
handler.tags = ['user'];
handler.command = /^selfaddlimit$/i;
handler.register = true;

export default handler;