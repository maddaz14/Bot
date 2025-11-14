import fs from 'fs'
import path from 'path'

let handler = async (m, { text, usedPrefix, command, __dirname }) => {
  if (!text) throw `Contoh penggunaan: *${usedPrefix}${command} Al Sigma*`

  let pluginDir = __dirname // FIX di sini
  let files = fs.readdirSync(pluginDir).filter(file => file.endsWith('.js'))
  let hasil = []

  // Regex untuk pencarian kata utuh
  let regex = new RegExp(`\\b${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')

  for (let file of files) {
    let filePath = path.join(pluginDir, file)
    let isi = fs.readFileSync(filePath, 'utf-8')
    if (regex.test(isi)) {
      hasil.push(file)
    }
  }

  if (!hasil.length) throw `Tidak ditemukan plugin yang mengandung kata *${text}* sebagai kata utuh.`

  m.reply(`Ditemukan *${hasil.length}* plugin yang mengandung kata "*${text}*":\n\n` + hasil.map(f => `- ${f}`).join('\n'))
}

handler.command = /^cariisi$/i
handler.rowner = true

export default handler