import { createCanvas, loadImage } from 'canvas'
import axios from 'axios'

const backgroundList = [
  'https://files.catbox.moe/jbd23e.jpg',
  'https://files.catbox.moe/7fja3z.jpg',
  'https://files.catbox.moe/8j0asj.jpg',
  'https://files.catbox.moe/jtsp76.jpg',
  'https://files.catbox.moe/0eslpr.jpg',
  'https://files.catbox.moe/ileqbd.jpg',
  'https://files.catbox.moe/utir3q.jpg',
  'https://files.catbox.moe/jl2sar.jpg',
  'https://files.catbox.moe/j235gb.jpg',
  'https://files.catbox.moe/dlxjj6.jpg',
  'https://files.catbox.moe/awoh5v.jpg',
  'https://files.catbox.moe/2wgtbb.jpg',
  'https://files.catbox.moe/hbbufy.jpg',
  'https://files.catbox.moe/0y5a57.jpg',
  'https://files.catbox.moe/jk4jtv.jpg',
  'https://files.catbox.moe/ucw40m.jpg'
]

let handler = async (m, { conn, args }) => {
  try {
    const q = args.join(' ').trim()
    if (!q) throw new Error('*Example :* .fakefreefire ubed BT')
    
    const [nickname, nomor] = q.split('|').map(v => v?.trim())

    await m.reply('Wait...')
    
    const max = backgroundList.length
    const index = nomor ? 
      (isNaN(nomor) || nomor < 1 || nomor > max ? 
        Math.floor(Math.random() * max) : 
        parseInt(nomor) - 1) : 
      Math.floor(Math.random() * max)

    const fontUrl = 'https://files.cloudkuimages.guru/fonts/vF3tpPDf.ttf'
    const fontResponse = await axios.get(fontUrl, { responseType: 'arraybuffer' })
    const fontBuffer = Buffer.from(fontResponse.data)
    
    const bg = await loadImage(backgroundList[index])
    const canvas = createCanvas(bg.width, bg.height)
    const ctx = canvas.getContext('2d')
    
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)
    ctx.font = `bold 33px "${fontBuffer.toString('base64')}"`
    ctx.fillStyle = '#ffb300'
    ctx.textAlign = 'center'
    ctx.fillText(nickname, 355, canvas.height - 250)
    
    await conn.sendMessage(m.chat, { 
      image: canvas.toBuffer(),
    }, { quoted: m })

  } catch (e) {
    m.reply(e.message)
  }
}

handler.help = ['fakefreefire']
handler.command = ['fakefreefire','fakeff']
handler.tags = ['maker']

export default handler