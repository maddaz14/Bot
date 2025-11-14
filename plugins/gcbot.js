import { proto, prepareWAMessageMedia, generateWAMessageFromContent } from '@fuxxy-star/baileys'

let handler = async function (m, { conn }) {
  const gcLink = 'https://chat.whatsapp.com/GDgH88syfmhEhUY4rtkPgL'

  // Foto profil user
  const pp = await conn.profilePictureUrl(m.sender, 'image').catch(
    () => 'https://telegra.ph/file/ee60957d56941b8fdd221.jpg'
  )

  // Nama user
  let name = await conn.getName(m.sender)

  // Media untuk header
  let media = await prepareWAMessageMedia(
    { image: { url: pp } },
    { upload: conn.waUploadToServer }
  )

  // Buat pesan interaktif
  let msg = generateWAMessageFromContent(
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
              text: `${name}, berikut adalah link grup utama bot:\n${gcLink}`
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: 'Klik tombol untuk menyalin link'
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              title: '> 📝 Salin Link Grup Bot Utama',
              subtitle: '> 📝 Klik tombol di bawah',
              hasMediaAttachment: true,
              ...(media.imageMessage ? { imageMessage: media.imageMessage } : {})
            }),
            nativeFlowMessage:
              proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    name: 'cta_copy',
                    buttonParamsJson: JSON.stringify({
                      display_text: '📋 Salin Link',
                      copy_code: gcLink
                    })
                  }
                ]
              })
          })
        }
      }
    },
    {}
  )

  await conn.relayMessage(m.chat, msg.message, { messageId: m.key.id })
}

handler.help = ['gcbot']
handler.tags = ['main']
handler.command = /^(gcbot)$/i
handler.register = true

export default handler