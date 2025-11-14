// plugins/fakestory.js
import { createCanvas, loadImage } from 'canvas'

let handler = async (m, { conn, text, command }) => {
  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    let [username, caption] = text.split('|')
    if (!username || !caption)
      return m.reply(`⚠️ Format salah!\n\nContoh:\n.${command} Ichika|hmm...`)

    // Background
    const bgUrl = 'https://files.catbox.moe/3gwr1l.jpg'
    const bg = await loadImage(bgUrl)

    // Profile picture
    const userPP = await conn
      .profilePictureUrl(m.sender, 'image')
      .catch(() => 'https://img1.pixhost.to/images/5831/600387261_biyu-offc.jpg')
    const pp = await loadImage(userPP)

    // Canvas
    const canvas = createCanvas(720, 1280)
    const ctx = canvas.getContext('2d')

    // Background
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)

    // Profile picture bulat
    const ppX = 40
    const ppY = 250
    const ppSize = 70
    ctx.save()
    ctx.beginPath()
    ctx.arc(ppX + ppSize / 2, ppY + ppSize / 2, ppSize / 2, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(pp, ppX, ppY, ppSize, ppSize)
    ctx.restore()

    // Username
    ctx.font = '28px Arial'
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    const usernameX = ppX + ppSize + 15
    const usernameY = ppY + ppSize / 2
    ctx.fillText(username, usernameX, usernameY)

    // Caption (wrap center)
    ctx.font = 'bold 30px Arial'
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    const captionX = canvas.width / 2
    const captionY = canvas.height - 650
    const maxWidth = canvas.width - 100
    const lineHeight = 42
    wrapTextCenter(ctx, caption, captionX, captionY, maxWidth, lineHeight)

    // Kirim hasil
    let buffer = canvas.toBuffer()
    await conn.sendMessage(
      m.chat,
      {
        image: buffer,
        caption: '✅ Berhasil membuat Fake Story'
      },
      { quoted: m }
    )
  } catch (e) {
    m.reply(`❌ Error!\nLogs error: ${e.message}`)
  }
}

handler.help = ['fakestory <username|caption>']
handler.tags = ['maker']
handler.command = /^fakestory$/i
handler.limit = true

export default handler

function wrapTextCenter(ctx, text, x, y, maxWidth, lineHeight) {
  let line = ''
  for (let i = 0; i < text.length; i++) {
    let testLine = line + text[i]
    let testWidth = ctx.measureText(testLine).width
    if (testWidth > maxWidth && line !== '') {
      ctx.fillText(line, x, y)
      line = text[i]
      y += lineHeight
    } else {
      line = testLine
    }
  }
  if (line) ctx.fillText(line, x, y)
}