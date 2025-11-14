let handler = async (m, { conn }) => {
  let groups = Object.values(conn.chats).filter(v => v.id.endsWith('@g.us') && v.subject);

  if (groups.length === 0) {
    return m.reply('Bot tidak berada di grup manapun.');
  }

  let teks = '*📜 Daftar Grup yang Diikuti Bot:*\n\n';
  groups.forEach((group, index) => {
    teks += `${index + 1}. *${group.subject}*\nID: ${group.id}\n\n`;
  });

  m.reply(teks.trim());
};

handler.help = ['listgc'];
handler.tags = ['info'];
handler.command = /^listgc$/i;

export default handler;