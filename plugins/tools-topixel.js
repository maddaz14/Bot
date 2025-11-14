import * as jimp from "jimp"

let handler = async (m, { conn, args }) => {
  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''
  
  if (!mime.startsWith('image/')) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    await conn.sendMessage(m.chat, { text: 'Mana gambarnya?' }, { quoted: m })
    return
  }
  
  let pixelSize = parseInt(args[0]) || 32
  if (pixelSize < 8) pixelSize = 8
  if (pixelSize > 1024) pixelSize = 1024
  
  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
  const media = await q.download()
  
  try {
    const image = await Jimp.read(media)
    const small = image.clone().resize(pixelSize, pixelSize, Jimp.RESIZE_NEAREST_NEIGHBOR)
    const pixelated = small.resize(image.bitmap.width, image.bitmap.height, Jimp.RESIZE_NEAREST_NEIGHBOR)
    const buffer = await pixelated.getBufferAsync(Jimp.MIME_JPEG)
    
    await conn.sendMessage(m.chat, { image: buffer, caption: `Pixelated image (size : ${pixelSize})` }, { quoted: m })
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (e) {
    await conn.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } })
    await conn.sendMessage(m.chat, { text: `Error: ${e.message}` }, { quoted: m })
  }
}

handler.help = ['topixel']
handler.command = ['topixel']
handler.tags = ['tools']

export default handler