import fetch from 'node-fetch'
import FormData from 'form-data'
import fakeUserAgent from 'fake-useragent'
import { fileTypeFromBuffer } from 'file-type'

// Objek kontak dummy
const fkontak = {
  key: {
    participant: '0@s.whatsapp.net',
    remoteJid: 'status@broadcast',
    fromMe: false,
    id: 'Halo',
  },
  message: {
    conversation: '🖼️ Convert Image by UbedBot',
  },
}

// ✅ Upload ke Catbox
const uploadToCatbox = async (buffer) => {
  const fileInfo = await fileTypeFromBuffer(buffer)
  if (!fileInfo) throw new Error('Format file tidak dikenali.')

  const { ext, mime } = fileInfo
  const form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', buffer, {
    filename: `file.${ext}`,
    contentType: mime,
  })

  const res = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: form,
    headers: {
      'User-Agent': fakeUserAgent(),
    },
    timeout: 15000,
  })

  if (!res.ok) throw new Error(`Gagal upload ke Catbox. Status: ${res.status}`)
  const url = await res.text()
  if (!url.startsWith('https://')) throw new Error('Gagal mengunggah ke Catbox.')
  return url
}

// 🧠 Proses convert via API Siputzx
const convertImage = async (imageUrl, template, style) => {
  const url = `https://api.siputzx.my.id/api/imgedit/convphoto?image=${encodeURIComponent(imageUrl)}&template=${template}&style=${style}`
  const res = await fetch(url, {
    headers: { 'User-Agent': fakeUserAgent() },
    timeout: 30000,
  })

  if (!res.ok) throw new Error(`Gagal konversi gambar. Status: ${res.status}`)

  return Buffer.from(await res.arrayBuffer())
}

// 🧾 Handler utama
let handler = async (m, { conn, args, usedPrefix, command }) => {
  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''

  if (!mime || !/image\/(jpe?g|png)/.test(mime)) {
    return conn.reply(
      m.chat,
      `⚠️ Balas gambar dengan perintah:\n*${usedPrefix + command} <template> <style>*\n\nContoh:\n*${usedPrefix + command} sketch_v2 manga_sketch*`,
      m,
      { quoted: fkontak }
    )
  }

  const [template = 'sketch_v2', style = 'manga_sketch'] = args

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    const imgBuffer = await q.download?.()
    if (!imgBuffer) throw new Error('Gagal mengunduh gambar')
    if (imgBuffer.length > 2 * 1024 * 1024) {
      throw new Error('Ukuran gambar melebihi 2MB.')
    }

    const uploadedUrl = await uploadToCatbox(imgBuffer)
    const resultBuffer = await convertImage(uploadedUrl, template, style)

    await conn.sendMessage(
      m.chat,
      {
        image: resultBuffer,
        caption: `✅ Gambar berhasil dikonversi dengan template *${template}* dan style *${style}*.`,
      },
      { quoted: m }
    )

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    conn.reply(m.chat, `❌ Ups! Terjadi kesalahan:\n${e.message}`, m)
  }
}

handler.help = ['imgedit <template> <style>']
handler.tags = ['tools', 'image']
handler.command = /^(imgedit|sketch|mangify)$/i
handler.limit = true
handler.register = true

export default handler