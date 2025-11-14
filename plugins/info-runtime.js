import moment from 'moment-timezone'
import { createCanvas, loadImage } from 'canvas'
import axios from 'axios'

function clockString(ms) {
  if (isNaN(ms)) return '--'
  let days = Math.floor(ms / (1000 * 60 * 60 * 24))
  let hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  let minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  let seconds = Math.floor((ms % (1000 * 60)) / 1000)
  return `${days}d ${hours}h ${minutes}m ${seconds}s`
}

let handler = async (m, { conn }) => {
  try {
    let uptime = process.uptime() * 1000
    let runtime = clockString(uptime)
    let currentDate = moment().tz('Asia/Jakarta').format('D MMMM YYYY')

    const imageUrl = 'https://files.catbox.moe/98hyo2.jpg'
    const res = await axios.get(imageUrl, { responseType: 'arraybuffer' })
    const bgImage = await loadImage(res.data)

    const canvas = createCanvas(bgImage.width, bgImage.height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(bgImage, 0, 0)

    ctx.font = 'bold 40px Sans'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.fillText(`Runtime: ${runtime}`, canvas.width / 2, canvas.height / 2)

    const buffer = canvas.toBuffer()

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: `🗓️ *Tanggal:* ${currentDate}\n⏱️ *Uptime Bot:* ${runtime}`,
      buttons: [
        {
          buttonId: '.menu',
          buttonText: { displayText: '🍏 Menu' },
          type: 1
        }
      ],
      headerType: 4
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('Terjadi kesalahan dalam menampilkan runtime.')
  }
}

handler.help = ['runtime']
handler.tags = ['info']
handler.command = ['runtime', 'rt']

export default handler