// Dibuat oleh ubed - Dilarang keras menyalin tanpa izin!
// --- Kode Plugin Dimulai di sini ---

import {
  proto,
  prepareWAMessageMedia,
  generateWAMessageFromContent
} from '@fuxxy-star/baileys';

const fkontak = {
  key: {
    participant: '0@s.whatsapp.net',
    remoteJid: 'status@broadcast',
    fromMe: true,
    id: 'ubed',
  },
  message: {
    contactMessage: {
      displayName: `🌷 Grup Bot ${global.namebot || 'Bot'} ✨`,
      vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:ubed\nTEL;type=CELL:+6280000000000\nEND:VCARD'
    },
  },
};

const handler = async (m, { conn }) => {
  try {
    const gcLink = 'https://chat.whatsapp.com/EfPjvlM7WIkBTfE5C2mNG1';
    const pp = await conn.profilePictureUrl(m.sender, 'image').catch(
      () => global.fotorpg || 'https://telegra.ph/file/ee60557d56941b8fdd221.jpg'
    );
    const name = await conn.getName(m.sender);

    const media = await prepareWAMessageMedia(
      { image: { url: pp } },
      { upload: conn.waUploadToServer }
    );

    await conn.sendMessage(m.chat, { react: { text: '🔗', key: m.key } });

    const msgs = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `
🌷 *GRUP UTAMA ${global.namebot || 'BOT'}!* 🌷
─────────────────────────────
Halo Kak *${name}*! ✨
Berikut adalah link grup utama bot:
*${gcLink}*
─────────────────────────────
Yuk, gabung dan jangan lupa ikuti aturannya ya! 💖
`.trim()
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: `Klik tombol di bawah untuk menyalin atau langsung join! ✨`
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: `📝 SALIN LINK GRUP ${global.namebot || 'BOT'} UTAMA`,
                subtitle: ``,
                hasMediaAttachment: true,
                imageMessage: media.imageMessage
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    name: 'cta_copy',
                    buttonParamsJson: JSON.stringify({
                      display_text: '🔗 Klik untuk Salin Link',
                      copy_code: gcLink
                    })
                  },
                  {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                      display_text: '🚀 Buka Grup Sekarang!',
                      url: gcLink
                    })
                  }
                ]
              })
            })
          }
        }
      },
      { quoted: fkontak }
    );

    await conn.relayMessage(m.chat, msgs.message, { messageId: m.key.id });
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (err) {
    console.error(err);
    await conn.reply(m.chat, '⚠️ Terjadi kesalahan saat mengirim pesan grup.', m);
  }
};

handler.help = ['botgc'];
handler.tags = ['main', 'info'];
handler.command = /^(botgc)$/i;
handler.register = true;
handler.group = false;
handler.limit = true;

export default handler;