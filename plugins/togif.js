import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const q = m.quoted ? m.quoted : m
    const mime = q.mimetype || ''

    if (!/video\/(mp4|webm)|image\/gif/.test(mime)) {
      throw `Reply atau kirim video/mp4, webm, atau gif dengan perintah ${usedPrefix + command}`
    }

    const mediaBuffer = await q.download()

    if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp')

    const tempInputPath = path.join('./tmp', `input_${Date.now()}.mp4`)
    const tempOutputPath = path.join('./tmp', `output_${Date.now()}.webp`)

    fs.writeFileSync(tempInputPath, mediaBuffer)

    await new Promise((resolve, reject) => {
      const ffmpegCmd = [
        `-i ${tempInputPath}`,
        '-vcodec libwebp',
        '-lossless 0',
        '-compression_level 6',
        '-qscale 40',
        '-preset default',
        '-filter:v',
        'fps=10,scale=320:320:force_original_aspect_ratio=decrease:flags=lanczos,pad=320:320:-1:-1:color=0x00000000',
        '-loop 0',
        '-an',
        '-vsync 0',
        '-t 5',
        tempOutputPath
      ].join(' ')

      exec(`ffmpeg ${ffmpegCmd}`, (err, stdout, stderr) => {
        if (err) return reject(err)
        resolve()
      })
    })

    const stickerBuffer = fs.readFileSync(tempOutputPath)

    await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })

    fs.unlinkSync(tempInputPath)
    fs.unlinkSync(tempOutputPath)

  } catch (e) {
    m.reply(`Error: ${e.message || e}`)
  }
}

handler.help = ['stikergif']
handler.tags = ['sticker']
handler.command = /^togif$/i

export default handler