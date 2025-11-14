import WSF from 'wa-sticker-formatter'
import axios from 'axios'

const handler = async (m, { conn, args, command }) => {
  let text =
    args.length > 0
      ? args.join(' ')
      : m.quoted?.text || null

  if (!text) {
    return m.reply(
      `📌 Contoh penggunaan:\n.${command} Halo Dunia`
    )
  }

  // Default warna QC normal (background putih, teks hitam)
  let backgroundColor = '#FFFFFF' // putih
  let textColor = '#000000' // hitam

  let pp =
    (await conn
      .profilePictureUrl(m.sender, 'image')
      .catch(() => null)) ||
    'https://telegra.ph/file/320b066dc81928b782c7b.png'

  const obj = {
    type: 'quote',
    format: 'png',
    backgroundColor,
    width: 512,
    height: 768,
    scale: 2,
    messages: [
      {
        entities: [],
        avatar: true,
        from: {
          id: 1,
          name: m.name || 'Pengguna',
          photo: { url: pp },
          textColor,
        },
        text,
        textColor,
        replyMessage: {},
      },
    ],
  }

  try {
    const json = await axios.post(
      'https://qc.botcahx.eu.org/generate',
      obj,
      { headers: { 'Content-Type': 'application/json' } }
    )

    if (!json.data.result?.image) {
      throw new Error('Gagal mendapatkan gambar dari API.')
    }

    const buffer = Buffer.from(json.data.result.image, 'base64')
    let stiker = await sticker5(
      buffer,
      false,
      global.packname,
      global.author
    )
    if (stiker) {
      return conn.sendFile(m.chat, stiker, 'Quotly.webp', '', m)
    } else {
      return m.reply('Gagal membuat stiker.')
    }
  } catch (e) {
    console.error(e)
    return m.reply('⚠️ Terjadi kesalahan saat membuat stiker.')
  }
}

handler.help = ['qc <text>']
handler.tags = ['sticker']
handler.command = /^qc$/i

export default handler

async function sticker5(
  img,
  url,
  packname,
  author,
  categories = ['']
) {
  try {
    const stickerMetadata = {
      type: 'full',
      pack: packname,
      author,
      categories,
    }
    return await new WSF.Sticker(
      img ? img : url,
      stickerMetadata
    ).build()
  } catch (err) {
    console.error('Gagal membuat stiker:', err)
    return null
  }
}