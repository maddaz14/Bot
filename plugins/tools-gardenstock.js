import fetch from "node-fetch"
import pkg from "@fuxxy-star/baileys"
const { proto } = pkg

let handler = async (m, { conn }) => {
  try {
    const res = await fetch('https://gagstock.gleeze.com/grow-a-garden')
    const json = await res.json()

    if (!json || json.status !== 'success')
      throw 'Gagal mengambil data Garden Stock!'

    const data = json.data
    const updated = new Date(json.updated_at).toLocaleString('id-ID')

    const formatItems = (title, obj = {}) => {
      const list = (obj.items || [])
        .map(v => `${v.emoji || '•'} ${v.name} x${v.quantity}`)
        .join('\n') || '— Tidak ada item —'

      const cd = obj.countdown ? `\n⏳ *Cooldown:* ${obj.countdown}` : ''
      return `*${title}*\n${list}${cd}\n`
    }

    const teks = `
🌱 *Grow A Garden Stock (v2)*

🕒 *Update:* ${updated}

${formatItems('🥚 Egg', data.egg)}
${formatItems('🧰 Gear', data.gear)}
${formatItems('🌾 Seed', data.seed)}
${formatItems('🍯 Honey Event', data.honey)}
${formatItems('🎨 Cosmetics', data.cosmetics)}

🧳 *Traveling Merchant*
📛 ${data.travelingmerchant?.merchantName || 'Unknown'}
🧺 Items:
${(data.travelingmerchant.items || [])
  .map(v => `  ${v.emoji || '•'} ${v.name} x${v.quantity}`)
  .join('\n') || '  — Tidak ada —'}
📅 Appear In: ${data.travelingmerchant.appearIn || '-'}
`.trim()

    const msg = {
      interactiveMessage: proto.Message.InteractiveMessage.create({
        header: { hasMediaAttachment: false },
        body: { text: teks },
        footer: { text: "© GardenStock Bot" },
        nativeFlowMessage: {
          buttons: [
            {
              name: "cta_copy",
              buttonParamsJson: JSON.stringify({
                display_text: "📋 Salin Data",
                copy_code: teks
              })
            }
          ]
        }
      })
    }

    await conn.relayMessage(m.chat, msg, { messageId: m.key.id })

  } catch (err) {
    console.error(err)
    await m.reply('❌ Terjadi kesalahan saat ambil data Garden Stock.\n\n' + err)
  }
}

handler.help = ['gardenstock','ggstock']
handler.tags = ['tools']
handler.command = /^((gg|garden)stock)$/i

export default handler