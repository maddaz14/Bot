import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { Sticker } from 'wa-sticker-formatter'

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!m.quoted) return m.reply(`Balas gambar/video/stiker dengan:\n${usedPrefix + command} packname|author`)

  const q = m.quoted
  const mime = (q.msg || q).mimetype || q.mediaType || ''
  const media = await q.download?.()
  if (!media) return m.reply("❌ Gagal mengunduh media.")

  const [packnameRaw, ...authorParts] = args.join(" ").split("|")
  const packname = packnameRaw?.trim() || "UbedBot"
  const author = authorParts.join("|").trim() || "Sticker Maker"

  try {
    let buffer

    if (/webp/.test(mime)) {
      // Ganti watermark pada stiker .webp
      buffer = await new Sticker(media, {
        pack: packname,
        author,
        type: 'full',
        quality: 60
      }).toBuffer()
    } else if (/image/.test(mime)) {
      // Gambar ke stiker
      buffer = await new Sticker(media, {
        pack: packname,
        author,
        type: 'full',
        quality: 60
      }).toBuffer()
    } else if (/video/.test(mime)) {
      // Video ke stiker (max 7 detik)
      if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp')

      const inputPath = `./tmp/input_${Date.now()}.mp4`
      const outputPath = `./tmp/output_${Date.now()}.webp`

      fs.writeFileSync(inputPath, media)

      await new Promise((resolve, reject) => {
        const cmd = `ffmpeg -i ${inputPath} -vcodec libwebp -filter:v fps=10,scale=320:320:force_original_aspect_ratio=decrease -loop 0 -ss 00:00:00 -t 00:00:07 -preset default -an -vsync 0 ${outputPath}`
        exec(cmd, (err) => err ? reject(err) : resolve())
      })

      buffer = fs.readFileSync(outputPath)
      fs.unlinkSync(inputPath)
      fs.unlinkSync(outputPath)
    } else {
      return m.reply("⚠️ Format tidak didukung. Balas gambar, video, atau stiker.")
    }

    await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m })
  } catch (err) {
    console.error(err)
    m.reply("❌ Gagal membuat atau mengubah stiker.")
  }
}

handler.command = /^(wm|swm)$/i
handler.help = ['wm <pack|author>', 'swm <pack|author>']
handler.tags = ['sticker']
handler.limit = true

export default handler