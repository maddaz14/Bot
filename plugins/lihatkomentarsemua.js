const handler = async (m, { conn }) => {
  global.db.data.ubedStatus ??= [];

  const mentioned = m.mentionedJid?.[0];
  if (!mentioned) return m.reply('Tag pengguna yang ingin kamu lihat semua komentarnya.\nContoh: *.lihatsemuakomentar @user*');

  const statusList = global.db.data.ubedStatus.filter(s => s.sender === mentioned);
  if (statusList.length === 0) return m.reply('❌ Pengguna tersebut belum membuat status.');

  let result = `💬 *Semua komentar pada status @${statusList[0].username}:*\n\n`;
  let komentarFound = false;
  let allMentions = new Set();

  for (let i = 0; i < statusList.length; i++) {
    const status = statusList[i];
    if (!status.komentar || status.komentar.length === 0) continue;

    komentarFound = true;
    result += `📝 *Status #${i + 1}:*\n${status.text.slice(0, 150)}\n`;

    for (let j = 0; j < status.komentar.length; j++) {
      const k = status.komentar[j];
      const waktu = new Date(k.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      result += `   ${j + 1}. @${k.sender.split('@')[0]}: ${k.text} (_${waktu}_)\n`;
      allMentions.add(k.sender);
    }

    result += `\n`;
  }

  if (!komentarFound) return m.reply('Status milik pengguna ini belum memiliki komentar sama sekali.');

  return conn.sendMessage(m.chat, {
    text: result.trim(),
    mentions: [...allMentions]
  }, { quoted: m });
};

handler.help = ['lihatsemuakomentar @user'];
handler.tags = ['media'];
handler.command = /^lihatsemuakomentar$/i;

export default handler;