import fetch from 'node-fetch'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'

let handler = async (m, { conn }) => {
  try {
    if (m._tourl_done) return
    m._tourl_done = true

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    if (!mime || mime === 'conversation') return m.reply('⚠️ Mana yang mau di-upload bang?')

    let media = await q.download()
    if (!media) throw new Error('Gagal download media.')

    let catboxLink = await catboxUpload(media).catch(() => null)
    if (!catboxLink) throw new Error('Gagal mengunggah file ke Catbox.')

    const teks = `✅ *Uploader Sukses*\n\n📎 URL:\n${catboxLink}`

    const interactiveMessage = {
      interactiveMessage: {
        body: { text: teks },
        footer: { text: "© Uploader Bot" },
        nativeFlowMessage: {
          buttons: [
            {
              name: "cta_copy",
              buttonParamsJson: JSON.stringify({
                display_text: "📋 Salin URL",
                copy_code: catboxLink
              })
            }
          ]
        }
      }
    }

    await conn.relayMessage(
      m.chat,
      { viewOnceMessage: { message: interactiveMessage } },
      {}
    )

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (error) {
    console.error("PLUGIN tourl ERROR:", error)
    conn.sendMessage(m.chat, { text: `💥 Error: ${error.message || error}` }, { quoted: m })
  }
}

handler.help = ['tourl']
handler.tags = ['tools']
handler.command = /^(tourl|unggah|upload)$/i

export default handler

async function catboxUpload(buffer) {
  const { ext, mime } = await fileTypeFromBuffer(buffer) || { ext: 'bin', mime: 'application/octet-stream' }
  const form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', buffer, { filename: `file.${ext}`, contentType: mime })

  const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form })
  if (!res.ok) throw new Error('Gagal menghubungi Catbox.')
  return await res.text()
}