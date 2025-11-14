// plugins/rpg-bank.js — perbaikan: resolve WID & sinkron total balance
import fetch from 'node-fetch'

// --- helper: resolve ke WID (selaras dgn addmoney) ---
async function resolveWid(m, conn, rawTarget, participants) {
  if (!rawTarget) return null;

  // sudah WID?
  if (typeof rawTarget === 'string' && /@s\.whatsapp\.net$/.test(rawTarget)) return rawTarget;

  // @lid -> map via participants/metadata
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
    throw '⚠️ Gagal ubah @lid ke nomor. Suruh target kirim chat dulu di grup.';
  }

  // kemungkinan nomor bebas format
  if (typeof rawTarget === 'string') {
    const num = rawTarget.replace(/\D/g, '');
    if (num.length >= 9 && num.length <= 16) {
      const fixed = num.startsWith('0') ? ('62' + num.slice(1))
                 : num.startsWith('62') ? num
                 : '62' + num;
      return fixed + '@s.whatsapp.net';
    }
  }
  return null;
}

const handler = async (m, { conn, args, usedPrefix, command, participants }) => {
  const fkontak = {
    key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
    message: { conversation: `🌷 Info Bank ${global.namebot || 'Bot'} ✨` }
  };

  if (command === 'bal') {
    return conn.reply(m.chat, `🌸 Ups, Kak! Command salah nih. Mungkin yang Kakak maksud adalah *${usedPrefix}bank* atau *${usedPrefix}dompet*? ✨`, m, { quoted: fkontak });
  }

  // ambil target: mention → reply → arg0 → diri sendiri
  const ci = m.msg?.contextInfo || m.message?.extendedTextMessage?.contextInfo || {};
  const firstMention = (Array.isArray(ci.mentionedJid) && ci.mentionedJid[0]) ||
                       (Array.isArray(m.mentionedJid) && m.mentionedJid[0]) ||
                       null;

  const rawTarget = firstMention ||
                    (m.quoted && m.quoted.sender) ||
                    (args[0] || '').trim() ||
                    m.sender;

  let target;
  try {
    target = await resolveWid(m, conn, rawTarget, participants);
  } catch (e) {
    return conn.reply(m.chat, String(e), m, { quoted: fkontak });
  }
  if (!target) target = m.sender; // fallback aman

  const users = global.db.data.users || (global.db.data.users = {});
  if (!users[target]) users[target] = {};

  // inisialisasi field
  const user = users[target];
  if (typeof user.money !== 'number') user.money = 0;
  if (typeof user.bank !== 'number') user.bank = 0;

  // sinkron totalBalance (kalau kamu mau tetap simpan user.balance)
  const totalBalance = user.money + user.bank;
  user.balance = totalBalance;

  // jika kamu mau mewajibkan registrasi, aktifkan blok ini:
  // if (!user.registered) {
  //   return conn.reply(m.chat, `❌ Aduh, Kak! Pengguna @${target.split('@')[0]} belum terdaftar di bot ini. 😥\n\nSilakan daftar dulu ya! 🌷`,
  //     m, { quoted: fkontak, mentions: [target] });
  // }

  // ambil nama & pp
  let name;
  try { name = user.name || await conn.getName(target) || 'Pengguna'; } catch { name = user.name || target.split('@')[0]; }
  let userPfp;
  try { userPfp = await conn.profilePictureUrl(target, 'image'); } catch { userPfp = 'https://telegra.ph/file/8904062b17875a2ab2984.jpg'; }

  const formatRp = n => 'Rp ' + (n || 0).toLocaleString('id-ID');

  const fullInfoText = `
✨ *Nama:* ${name}
💸 *Saldo Dompet:* ${formatRp(user.money)}
🏦 *Saldo Bank:* ${formatRp(user.bank)}
💰 *Total Balance:* Bc.${totalBalance}
💖 *Status:* ${user.premium ? 'Premium ✨' : 'Free 🌸'}
✅ *Terdaftar:* ${user.registered ? 'Terdaftar ✅' : 'Belum Terdaftar ❌'}

----------------------------------------
*Cara Mengelola Saldo:*
• Ketik: *${usedPrefix}atm <jumlah>* (Menabung ke bank)
• Ketik: *${usedPrefix}pull <jumlah>* (Tarik dari bank)
`.trim();

  const bankOptions = [
    { header: '👤 Lihat Profil Lengkap', title: 'Cek detail akun', description: 'Statistik & info lainnya.', id: `${usedPrefix}me @${target.split('@')[0]}` },
    { header: '💰 ATM (Menabung)',      title: 'Dompet ➜ Bank',   description: `Ketik: ${usedPrefix}atm <jumlah>`,  id: `${usedPrefix}atm` },
    { header: '💸 Tarik Uang',          title: 'Bank ➜ Dompet',   description: `Ketik: ${usedPrefix}pull <jumlah>`, id: `${usedPrefix}pull` },
    { header: '➕ Top Up Saldo',        title: 'Hubungi owner',   description: 'Top up saldo dompet.',              id: '.sewa' }
  ];

  const interactiveButtons = [{
    name: 'single_select',
    buttonParamsJson: JSON.stringify({
      title: 'Pilih Aksi Bank & Dompet',
      sections: [{ title: 'Tindakan Keuangan', highlight_label: 'Pilih Salah Satu', rows: bankOptions }]
    })
  }];

  await conn.sendMessage(m.chat, {
    product: {
      productImage: { url: userPfp },
      productId: '9999999999999999',
      title: `💰 SALDO BANK UTAMA: ${formatRp(user.bank)}`,
      description: `Total Balance: Bc.${totalBalance}`,
      currencyCode: 'IDR',
      priceAmount1000: '0',
      retailerId: `bank-info-${target.split('@')[0]}`,
      url: 'https://api.ubed.my.id',
      productImageCount: 1
    },
    businessOwnerJid: '6285147777105@s.whatsapp.net',
    caption: fullInfoText,
    title: `🏦 INFO BANK & DOMPET ${name.toUpperCase()} 🏦`,
    subtitle: `Halo, ${name}!`,
    footer: `> © ${global.namebot || 'Bot'} 2025 | RPG System`,
    interactiveButtons,
    hasMediaAttachment: false
  }, { quoted: fkontak });

  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
};

handler.help = ['bank [@user]', 'dompet [@user]', 'balance [@user]'];
handler.tags = ['rpg', 'main'];
handler.command = /^(bank|dompet|balance|bal)$/i;
handler.rpg = true;
// handler.register = true; // aktifkan kalau memang wajib daftar

export default handler;