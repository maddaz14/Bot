import axios from "axios"

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Anti Private Chat
  if (!m.isGroup) return m.reply("❌ Fitur ini hanya bisa digunakan di grup!")

  // Pastikan ada gambar
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime || !/image\/(jpe?g|png)/.test(mime)) 
    return m.reply(`📸 Kirim atau reply gambar dengan caption *${usedPrefix + command}*`)

  m.reply('⏳ Sedang memproses, mohon tunggu...')

  try {
    // Download gambar
    let img = await q.download()
    let { fileTypeFromBuffer } = await import('file-type')
    let type = await fileTypeFromBuffer(img)
    let FormData = (await import('form-data')).default
    let form = new FormData()
    form.append('reqtype', 'fileupload')
    form.append('fileToUpload', img, `input.${type.ext}`)

    // Upload ke Catbox
    let catbox = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders(),
      params: { reqtype: 'fileupload' }
    })

    let imageUrl = catbox.data
    if (!imageUrl.startsWith('https://')) throw new Error('Gagal upload ke Catbox')

    // Panggil API remove clothes
    let res = await axios.get(`https://api.nekolabs.my.id/tools/convert/remove-clothes?imageUrl=${encodeURIComponent(imageUrl)}`)
    if (!res.data?.success) throw new Error('Gagal memproses gambar!')

    let resultUrl = res.data.result

    // Kirim hasil
    await conn.sendMessage(m.chat, {
      image: { url: resultUrl },
      caption: `✅ *Selesai!*\n\n📁 Source: ${imageUrl}\n🪄 Output: ${res.data.responseTime}\n\n© ${global.botname}`
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('❌ Gagal memproses gambar. Pastikan gambar jelas dan server tidak down.')
  }
}

handler.help = ['removeclothes']
handler.tags = ['ai', 'tools']
handler.command = /^(removeclothes|remclothes|hapusbaju)$/i
handler.owner = false

export default handler