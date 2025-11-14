function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

let handler = async (m, { conn }) => {
  // Ambil data user dari database
  const users = global.db?.data?.users || {};

  // Ambil semua ID yang telah register/verifikasi
  const verifiedUsers = Object.keys(users).filter(jid => users[jid].registered);

  if (!verifiedUsers.length) {
    return m.reply("❌ *Belum ada pengguna yang terdaftar atau terverifikasi!*");
  }

  // Reaksi emoji saat mulai
  await conn.sendMessage(m.chat, {
    react: {
      text: '⏱️',
      key: m.key
    }
  });

  // Pilih satu secara acak
  const teman = pickRandom(verifiedUsers);

  // Simulasi pencarian dengan jeda
  setTimeout(() => {
    m.reply("🔍 *Mencari teman cocok...*");
  }, 1000);

  setTimeout(() => {
    m.reply("✅ *Berhasil mendapatkan satu orang!*");
  }, 5000);

  setTimeout(() => {
    conn.sendMessage(m.chat, {
      text: `📍 *Di sini @${teman.split("@")[0]}!*`,
      mentions: [teman]
    }, { quoted: m });
  }, 9000);
};

handler.help = ['friend', 'searchfriend'];
handler.tags = ['tools'];
handler.command = /^(friend|searchfriend)$/i;
handler.limit = true;
handler.register = true;

export default handler;