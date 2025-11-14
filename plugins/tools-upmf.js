import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

let handler = async (m, { conn }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) return m.reply('Silakan kirim atau reply *media* (foto, video, audio, dokumen) untuk diupload.')

    // React dengan emoji 🍏
    await conn.sendMessage(m.chat, {
      react: {
        text: '🍏',
        key: m.key
      }
    })

    let media = await q.download()
    let ext = mime.split('/')[1].split(';')[0] || 'bin'
    let file = `./tmpupload.${ext}`
    fs.writeFileSync(file, media)

    let form = new FormData()
    form.append('file', fs.createReadStream(file))

    let { data } = await axios.post('https://fgsi1-restapi.hf.space/api/upload/uploadMediaFire', form, {
      headers: form.getHeaders()
    })

    let d = data.data
    let text = `Nama File : ${d.filename}\nUkuran : ${d.size} byte\nTipe : ${d.mimetype}\nUploader : ${d.owner_name}\nDownload : ${d.links.normal_download}`
    await m.reply(text)
    fs.unlinkSync(file)
  } catch (e) {
    m.reply(`Gagal mengupload: ${e.message}`)
  }
}

handler.help = ['up-mf','uploadmediafire']
handler.command = ['up-mf','upmf','uploadmediafire']
handler.tags = ['tools']

export default handler