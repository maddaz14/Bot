import axios from 'axios'
import { fileTypeFromBuffer } from 'file-type'
import FormData from 'form-data'

async function quaxUpload(buffer) {
  const { ext, mime } = await fileTypeFromBuffer(buffer) || { ext: 'bin', mime: 'application/octet-stream' }

  const form = new FormData()
  form.append('files[]', buffer, { filename: `file.${ext}`, contentType: mime })
  form.append('expiry', '30') // 30 hari expired

  const res = await axios.post('https://qu.ax/upload.php', form, {
    headers: {
      ...form.getHeaders(),
      'User-Agent': 'Mozilla/5.0',
      'origin': 'https://qu.ax',
      'referer': 'https://qu.ax/'
    }
  })

  const data = res.data
  if (!data.files || !data.files[0] || !data.files[0].url) throw new Error('Gagal upload ke Qu.ax')
  return data.files[0].url
}

let handler = async (m, { conn }) => {
  if (!m.quoted || !/audio/.test(m.quoted.mimetype || '')) {
    return m.reply('Reply audio dengan command: .vocal')
  }

  m.reply('Sedang memproses audio... ⏳')

  try {
    // Download audio WA
    const audioBuffer = await m.quoted.download()

    // Upload ke Qu.ax untuk dapat URL publik
    const audioUrl = await quaxUpload(audioBuffer)

    // Panggil API ubed Bot untuk ambil vocal
    const res = await axios.get(`https://apiku.ubed.my.id/api/rvocal?url=${encodeURIComponent(audioUrl)}`)
    const data = res.data

    if (!data.status || !data.vocal) throw new Error('Gagal memproses audio di ubed Bot')

    // Kirim hasil vocal ke chat
    await conn.sendMessage(m.chat, {
      audio: { url: data.vocal },
      mimetype: 'audio/mpeg',
      ptt: false
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    m.reply(`Eror kak: ${err.message}`)
  }
}

handler.command = ['vocal'] // hanya satu command
handler.tags = ['tools']
handler.help = ['vocal (reply audio)']
handler.limit = true

export default handler