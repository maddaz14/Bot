import PhoneNumber from 'awesome-phonenumber';
import moment from 'moment-timezone';

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
    // fallback: biarkan pakai @lid sebagai ID database
    return rawTarget;
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
  let sender;
  try {
    sender = await resolveWid(m, conn, m.sender, participants);
  } catch {
    sender = m.sender; // fallback
  }

  let rawTarget = m.mentionedJid && m.mentionedJid[0];
  if (!rawTarget) return m.reply('⚠️ Tag seseorang yang ingin kamu nikahi!');

  let target;
  try {
    target = await resolveWid(m, conn, rawTarget, participants);
  } catch {
    target = rawTarget; // fallback
  }

  if (!global.db.data.users[sender] || !global.db.data.users[target]) {
    return m.reply('⚠️ Pengguna tidak ada dalam database');
  }

  let user = global.db.data.users[sender];
  let pasangan = global.db.data.users[target];

  let nameUser = user.registered ? user.name : await conn.getName(sender);
  let namePasangan = pasangan.registered ? pasangan.name : await conn.getName(target);

  let biayaMenikah = 100000000; // 100 juta
  let jumlahUndangan = 3;       // Harus mengundang 3 orang

  if (user.money < biayaMenikah) {
    return m.reply(`💰 Uang kamu kurang! Butuh Rp ${biayaMenikah.toLocaleString()} untuk menikah.`);
  }

  if (pasangan.isMarried) {
    return m.reply(`⚠️ ${namePasangan} sudah menikah!`);
  }

  pasangan.lamaranDari = sender;       // Menandai siapa yang melamar
  pasangan.undanganDiterima = 0;       // Reset undangan

  let caption = `
💍 *Lamaran Pernikahan* 💍

👤 *${nameUser}* telah melamar *${namePasangan}*!

🔹 ${namePasangan}, kamu harus menyebarkan undangan ke *${jumlahUndangan} orang* sebelum bisa menerima lamaran.

📜 Gunakan: *.undangan @user1 @user2 @user3*

📝 Jika sudah, gunakan *.terimanikah ${nameUser}* untuk menerima lamaran.
`;

  await conn.sendMessage(m.chat, { text: caption, mentions: [sender, target] });
};

handler.help = ['menikah @user'];
handler.tags = ['rpg'];
handler.command = /^(menikah)$/i;

export default handler;