import Lens from 'chrome-lens-ocr'

let handler = async (m, { conn }) => {
  const mime = m.quoted?.mimetype
  if (!mime || !/image/.test(mime)) return m.reply('reply gambar dengan command .ocr')
  m.reply('wett')

  try {
    const lens = new Lens()
    await lens.init()
    const buffer = await m.quoted.download()
    const result = await lens.scanByBuffer(buffer)
    const text = result?.segments?.map(v => v.text).join(' ') || ''
    if (!text.trim()) throw new Error('teks gk ada di gambar')
    m.reply(`Result : ${text}`)
  } catch (e) {
    m.reply(`Eror kak : ${e.message}`)
  }
}

handler.help = ['ocr']
handler.tags = ['tools']
handler.command = ['ocr']

export default handler