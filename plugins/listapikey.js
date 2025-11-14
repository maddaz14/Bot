import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const apikeyFilePath = path.join(__dirname, '..', 'apikey.json')

let handler = async (m, { command }) => {
  if (command !== 'listapikey') return

  try {
    if (!fs.existsSync(apikeyFilePath)) throw 'Belum ada API key yang tersimpan.'

    const content = fs.readFileSync(apikeyFilePath, 'utf8')
    const data = JSON.parse(content)
    const now = Date.now()

    const activeKeys = Object.entries(data)
      .filter(([_, { expiry }]) => expiry > now)
      .map(([key, { expiry }]) => {
        const remaining = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
        return `- ${key} (berlaku ${remaining} hari lagi)`
      })

    if (activeKeys.length === 0) throw 'Tidak ada API key aktif.'

    m.reply(`Daftar API key aktif:\n${activeKeys.join('\n')}`)
  } catch (e) {
    m.reply(`❌ ${e}`)
  }
}

handler.command = ['listapikey']
handler.tags = ['owner']
handler.help = ['listapikey']
handler.owner = true

export default handler