// ==== helper: normalisasi target ke WID ====
async function resolveWid(m, conn, rawTarget, participants) {
  if (!rawTarget) return null;

  // sudah WID?
  if (typeof rawTarget === 'string' && /@s\.whatsapp\.net$/.test(rawTarget)) return rawTarget;

  // kalau datang sebagai @lid, coba map via participants/metadata
  if (typeof rawTarget === 'string' && /@lid$/.test(rawTarget)) {
    let parts = participants;
    if (!Array.isArray(parts) || !parts.length) {
      try {
        const meta = await conn.groupMetadata(m.chat);
        parts = meta?.participants || [];
      } catch {}
    }
    const found = parts?.find(p => p.id === rawTarget || p.jid === rawTarget);
    if (found?.id && /@s\.whatsapp\.net$/.test(found.id)) return found.id;
    if (found?.jid && /@s\.whatsapp\.net$/.test(found.jid)) return found.jid;
    throw '⚠️ Gagal ubah @lid ke nomor. Suruh target kirim pesan dulu di grup.';
  }

  // kemungkinan nomor bebas format / teks dengan plus/spasi
  if (typeof rawTarget === 'string') {
    const num = rawTarget.replace(/\D/g, '');
    if (num.length >= 9 && num.length <= 16) {
      const fixed = num.startsWith('0') ? ('62' + num.slice(1))
                   : num.startsWith('62') ? num
                   : '62' + num; // default ke 62 biar aman
      return fixed + '@s.whatsapp.net';
    }
  }

  return null;
}

let handler = async (m, { conn, args, isOwner, isMods, participants }) => {
  if (!isOwner && !isMods) throw '❌ Hanya Owner/Moderator!';

  if (!args[0] && !m.mentionedJid?.length) {
    throw '❌ Tag orang atau masukkan nomor!';
  }

  // Ambil jumlah money
  let jumlah = 1000;
  if (args[1] && !isNaN(parseInt(args[1]))) jumlah = parseInt(args[1]);
  if (jumlah <= 0) throw '❌ Jumlah money harus lebih dari 0!';

  // Tentukan target mentah
  const rawTarget = m.mentionedJid?.[0] || (args[0] || '').trim();

  // Resolve jadi JID final
  let targetJid;
  try {
    targetJid = await resolveWid(m, conn, rawTarget, participants);
  } catch (e) {
    throw String(e);
  }

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

  // Ambil nama user
  let name;
  try {
    name = await conn.getName(targetJid);
  } catch {
    name = targetJid.split('@')[0];
  }

  // Kirim pesan sukses
  await conn.sendMessage(m.chat, {
    text: `✅ Sukses menambahkan *${jumlah.toLocaleString()}* money untuk:\n👤 Nama: ${name}\n📱 Nomor/JID: ${targetJid}`,
    mentions: [targetJid]
  }, { quoted: m });
};

handler.help = ['addmoney <tag/nomor/JID> [jumlah]'];
handler.tags = ['owner'];
handler.command = /^addmoney$/i;

export default handler;