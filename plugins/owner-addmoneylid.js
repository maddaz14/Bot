let handler = async (m, { conn, args, isOwner, isMods }) => {
  if (!isOwner && !isMods) throw '❌ Hanya Owner/Moderator!';

  if (!args[0] && !m.mentionedJid?.length) {
    throw '❌ Tag orang atau masukkan @lid!';
  }

  // Ambil jumlah money
  let jumlah = 1000;
  if (args[1] && !isNaN(parseInt(args[1]))) jumlah = parseInt(args[1]);
  if (jumlah <= 0) throw '❌ Jumlah money harus lebih dari 0!';

  // Target raw (boleh @lid)
  const targetJid = m.mentionedJid?.[0] || (args[0] || '').trim();
  if (!targetJid) throw '❌ Gagal menentukan target yang valid.';

  // Pastikan user ada di DB
  let users = global.db.data.users;
  if (!users[targetJid]) {
    users[targetJid] = {
      money: 0,
      bank: 0,
      balance: 0,
      exp: 0,
      limit: 0,
      premium: false,
      registered: true,
      name: null
    };
  }

  // Tambahkan money
  users[targetJid].money += jumlah;

  // Simpan DB
  await global.db.write();

  // Ambil nama user (kalau bisa)
  let name;
  try {
    name = await conn.getName(targetJid);
  } catch {
    name = targetJid.split('@')[0];
  }

  // Kirim pesan sukses
  await conn.sendMessage(m.chat, {
    text: `✅ Sukses menambahkan *${jumlah.toLocaleString()}* money untuk:\n👤 Nama: ${name}\n🆔 ID: ${targetJid}`,
    mentions: [targetJid] // tetap mention walau @lid
  }, { quoted: m });
};

handler.help = ['addmoneylid <@lid> [jumlah]'];
handler.tags = ['owner'];
handler.command = /^addmoneylid$/i;

export default handler;