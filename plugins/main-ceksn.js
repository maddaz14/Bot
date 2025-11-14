import { createHash } from 'crypto';

let handler = async function (m, { conn }) {
  const pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://telegra.ph/file/ee60957d56941b8fdd221.jpg");

  const sn = createHash('md5').update(m.sender).digest('hex');
  const name = await conn.getName(m.sender);

  const caption = `
📛 *Nama:* ${name}
🔐 *Serial Number (SN):* ${sn}

Gunakan SN ini untuk unregister dengan mengetik:
.unreg ${sn}
  `.trim();

  const buttonMessage = {
    image: { url: pp },
    caption,
    footer: global.namebot,
    buttons: [
      { buttonId: `.unreg ${sn}`, buttonText: { displayText: '🔓 Auto Unreg' }, type: 1 },
      { buttonId: `.menu`, buttonText: { displayText: '📋 Menu' }, type: 1 }
    ],
    headerType: 4
  };

  await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
};

handler.help = ['ceksn'];
handler.tags = ['main'];
handler.command = /^(ceksn)$/i;
handler.register = true;

export default handler;