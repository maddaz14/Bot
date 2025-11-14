const handler = async (m, { conn, args, command }) => {
  const target = m.mentionedJid[0];
  if (!target) throw `Tag seseorang untuk menyerang!\n\nContoh:\n.${command} @user`;

  const teks = `⚔️ Apakah kamu yakin ingin menyerang @${target.split('@')[0]}?`;
  const buttons = [
    { buttonId: `.samuraiserang ${target}`, buttonText: { displayText: 'Serang Sekarang ⚔️' }, type: 1 },
    { buttonId: `.samuraimundur`, buttonText: { displayText: 'Mundur 🛡️' }, type: 1 }
  ];

  await conn.sendMessage(m.chat, {
    text: teks,
    mentions: [target],
    footer: 'ubed Bot - Samurai Battle',
    buttons: buttons,
    headerType: 1
  }, { quoted: m });
};

handler.command = /^samurai$/i;
handler.group = true;
handler.tags = ['game'];

export default handler;