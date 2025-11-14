import { promises as fs } from 'fs'
import { join } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''

  if (!/audio/.test(mime)) return conn.reply(m.chat, `Send/Reply a song with the caption *${usedPrefix + command} <start> <duration>*\nExample: *${usedPrefix + command} 00:00:30 00:00:10*`, m)

  const audio = await q.download?.()
  if (!audio) return conn.reply(m.chat, '❌ Failed to download audio!', m)

  if (!args[0] || !args[1]) return conn.reply(m.chat, `❗ Example:\n*${usedPrefix + command} 00:00:30 00:00:10*`, m)

  const tmpFile = join('./tmp', `${Date.now()}.mp3`)
  const outFile = join('./tmp', `${Date.now()}-cut.mp3`)

  await fs.writeFile(tmpFile, audio)

  try {
    await execAsync(`ffmpeg -ss ${args[0]} -i "${tmpFile}" -t ${args[1]} -c copy "${outFile}"`)
    const cutAudio = await fs.readFile(outFile)

    await conn.sendFile(m.chat, cutAudio, 'cut.mp3', null, m, true, {
      quoted: m,
      mimetype: 'audio/mpeg'
    })
  } catch (e) {
    console.error(e)
    return conn.reply(m.chat, '❌ Failed to cut audio.', m)
  } finally {
    // Clean up
    await fs.unlink(tmpFile).catch(() => {})
    await fs.unlink(outFile).catch(() => {})
  }
}

handler.help = ['cut <start> <duration>']
handler.tags = ['tools']
handler.command = /^(potong(audio|mp3)|cut(audio|cut))$/i

export default handler