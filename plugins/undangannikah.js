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
    return rawTarget; // fallback: tetap simpan @lid
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

let handler = async (m, { conn, args, participants }) => {
  // sender normalisasi
  let sender;
  try {
    sender = await resolveWid(m, conn, m.sender, participants);
  } catch {
    sender = m.sender;
  }

  // undangan normalisasi
  let undanganRaw = m.mentionedJid || [];
  if (undanganRaw.length < 3) {
    return m.reply('⚠️ Kamu harus mengundang minimal 3 orang!');
  }

  let undangan = [];
  for (let u of undanganRaw) {
    try {
      let fixed = await resolveWid(m, conn, u, participants);
      if (fixed) undangan.push(fixed);
    } catch {
      undangan.push(u);
    }
  }

  if (!global.db.data.users[sender]) {
    return m.reply('⚠️ Kamu tidak terdaftar dalam database');
  }

  let user = global.db.data.users[sender];
  user.undanganDiterima = (user.undanganDiterima || 0) + undangan.length;

  // Simpan status undangan untuk tiap yang diundang
  for (let invitee of undangan) {
    if (!global.db.data.users[invitee]) {
      global.db.data.users[invitee] = {
        money: 0, bank: 0, balance: 0,
        exp: 0, limit: 0,
        premium: false, registered: false,
        name: null
      };
    }
    global.db.data.users[invitee].undangan = true;
  }

  let nameSender;
  try {
    nameSender = await conn.getName(sender);
  } catch {
    nameSender = sender.split('@')[0];
  }

  let caption = `
📜 *Undangan Pernikahan* 📜

💌 *${nameSender}* mengundang kalian ke pernikahannya!

🎉 Gunakan *.hadiracara* untuk memberi hadiah!

💑 Pernikahan akan segera berlangsung!
`;

  await conn.sendMessage(m.chat, { text: caption, mentions: undangan });
};

handler.help = ['undangan @user1 @user2 @user3'];
handler.tags = ['rpg'];
handler.command = /^(undangan)$/i;

export default handler;