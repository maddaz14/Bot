// plugins/owner-sc.js (ESM)
import pkg from '@fuxxy-star/baileys'
const { generateWAMessageFromContent } = pkg

const defaultQuotedMessage = {
  key: {
    participant: "0@s.whatsapp.net",
    remoteJid: "0@s.whatsapp.net",
    fromMe: false,
    id: "Halo"
  },
  message: {
    conversation: " Info Script " + (global.namebot || "Bot") + " ✨"
  }
}

const handler = async (m, { conn }) => {
  const botName = global.namebot || "ubed-MD"
  const photoUrl = global.fotorpg || 'https://telegra.ph/file/ee60557d56941b8fdd221.jpg'
  const waNumber = "6282113443806"

  const messageText = `
*SC ubed-MD WHATSAPP × TELEGRAM*

⪩ Type Plugins ESM × CJS
⪩ Support WA Bussines
⪩ Support All Button
⪩ Support Prefix Dan No prefix
⪩ 1800+ Fitur Aktif
⪩ Node V 20+
⪩ Custom Pairing Code
⪩ 4 Tampilan Menu Mode
⪩ Free Apikey Premium
⪩ Update Life Time
⪩ Harga Murah IDR 80.000
⪩ Dan Masih banyak lagi

📞 *Minat? Chat:*
• 6282113443806

`.trim()

  const interactiveMessage = {
    body: { text: messageText },
    footer: { text: "Klik tombol untuk order sekarang! 💬" },
    header: { hasMediaAttachment: false },
    nativeFlowMessage: {
      buttons: [
        {
          name: "cta_url",
          buttonParamsJson: JSON.stringify({
            display_text: "🔗 Order SC via WhatsApp",
            url: `https://wa.me/${waNumber}?text=Halo+Owner+${botName}%2C+saya+tertarik+untuk+membeli+SC+${botName}`,
            merchant_url: `https://wa.me/${waNumber}?text=Halo+Owner+${botName}%2C+saya+tertarik+untuk+membeli+SC+${botName}`
          })
        }
      ]
    },
    contextInfo: {
      mentionedJid: [m.sender],
      externalAdReply: {
        title: `✨ SC ubed--MD× TELEGRAM`,
        body: "Harga: Rp60.000 | Free Update & API Key Premium!",
        thumbnailUrl: photoUrl,
        sourceUrl: `https://wa.me/${waNumber}`,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }

  const waMessage = generateWAMessageFromContent(
    m.chat,
    {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage // ← langsung pakai object biasa, tidak perlu proto
        }
      }
    },
    { quoted: defaultQuotedMessage }
  )

  await conn.relayMessage(m.chat, waMessage.message, { messageId: waMessage.key.id })
  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}

handler.help = ['sc']
handler.tags = ['owner']
handler.command = /^(sc|script|sourcecode)$/i
handler.register = true
handler.group = false

export default handler