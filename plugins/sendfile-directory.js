import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(`Contoh:\n.reply media lalu ketik *${usedPrefix}${command} media/fotoku.jpg*`)

  let q = m.quoted ? m.quoted : m
  if (!q.mimetype) return m.reply(`Reply media (gambar/audio/video/dokumen) dengan caption:\n*${usedPrefix}${command} [folder/namafile]*`)

  const filepath = args[0].replace(/^\/+/, '') // hapus slash di depan
  const fullPath = path.join(process.cwd(), filepath)

  const folderDir = path.dirname(fullPath)
  if (!fs.existsSync(folderDir)) fs.mkdirSync(folderDir, { recursive: true })

  const buffer = await q.download()
  fs.writeFileSync(fullPath, buffer)

  m.reply(`Berhasil menyimpan media ke *${filepath}*`)
}

handler.help = ['sendfile <folder/namafile>']
handler.tags = ['tools']
handler.command = /^sendfile$/i

export default handler