let handler = async (m, { conn, isOwner, participants, text }) => {
  if (!isOwner) throw '❌ Fitur ini hanya untuk Owner bot!'

  let who;
  let debugPath = [];

  // 1. Dari tag
  if (m.isGroup && m.mentionedJid?.length) {
    who = m.mentionedJid[0];
    debugPath.push('Source: Mention');
  }
  // 2. Dari reply
  else if (m.isGroup && m.quoted?.sender) {
    who = m.quoted.sender;
    debugPath.push('Source: Reply');
  }
  // 3. Dari nomor manual
  else if (text) {
    debugPath.push('Source: Raw Text Input');
    let nomor = text.replace(/\D/g, '');
    if (nomor.startsWith('0')) nomor = '62' + nomor.slice(1);

    if (nomor.length < 9 || nomor.length > 15) throw '❌ Format nomor tidak valid.';

    who = nomor + '@s.whatsapp.net';
    debugPath.push(`Constructed JID: ${who}`);
  }

  if (!who) throw '⚠️ Masukkan nomor atau tag orang yang ingin dihapus dari daftar owner.';

  // 4. Resolve @lid → @s.whatsapp.net lewat participants
  if (m.isGroup && who.endsWith('@lid')) {
    const resolved = participants.find(u => u.id === who || u.jid === who);
    if (resolved?.jid?.endsWith('@s.whatsapp.net')) {
      debugPath.push(`Resolved from participants: ${resolved.jid}`);
      who = resolved.jid;
    } else {
      throw '🚫 Tidak bisa menemukan nomor asli dari pengguna bertipe @lid. Suruh mereka kirim pesan ke bot dulu.';
    }
  }

  let nomor = who.split('@')[0];

  let index = global.owner.findIndex(([no]) => no === nomor || no === '+' + nomor);
  if (index === -1) throw '❌ Nomor tersebut tidak terdaftar sebagai owner.';

  global.owner.splice(index, 1);

  await conn.reply(m.chat, `✅ Berhasil menghapus *${nomor}* dari daftar owner.`, m);

  // Debug opsional
  console.log('\n[DEBUG delowner]');
  console.log('Path:', debugPath.join(' → '));
  console.log('Resolved:', who);
  console.log('Nomor:', nomor);
  console.log('--------------------------------\n');
};

handler.help = ['delowner <@tag/nomor>'];
handler.tags = ['owner'];
handler.command = /^delowner$/i;
handler.owner = true;

export default handler;