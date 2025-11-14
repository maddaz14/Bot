import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let handler = async (m, { conn }) => {
  try {
    // --- Deteksi jenis Baileys ---
    let baileysName = 'Tidak ditemukan'
    let baileysVersion = 'Tidak diketahui'
    try {
      const pkgPathWhiskey = path.join(process.cwd(), 'node_modules', '@whiskeysockets', 'baileys', 'package.json')
      const pkgPathAdi = path.join(process.cwd(), 'node_modules', '@adiwajshing', 'baileys', 'package.json')

      if (fs.existsSync(pkgPathWhiskey)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPathWhiskey, 'utf8'))
        baileysName = '@whiskeysockets/baileys'
        baileysVersion = pkg.version
      } else if (fs.existsSync(pkgPathAdi)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPathAdi, 'utf8'))
        baileysName = '@adiwajshing/baileys'
        baileysVersion = pkg.version
      }
    } catch {
      baileysName = 'Tidak terdeteksi'
    }

    // --- Cek versi Node.js ---
    const nodeVersion = process.version

    // --- Cek ukuran folder node_modules ---
    let nodeModulesSize = 'Tidak diketahui'
    try {
      nodeModulesSize = execSync(`du -sh node_modules | cut -f1`).toString().trim()
    } catch {
      nodeModulesSize = 'Gagal menghitung ukuran'
    }

    // --- Hitung total fitur dari handler.help ---
    let totalFitur = 0
    const pluginsDir = path.join(process.cwd(), 'plugins')
    const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js'))

    for (const file of files) {
      try {
        const pluginPath = path.join(pluginsDir, file)
        const { default: plugin } = await import(`file://${pluginPath}`)
        if (plugin && plugin.help) {
          if (Array.isArray(plugin.help)) {
            totalFitur += plugin.help.length
          } else if (typeof plugin.help === 'string') {
            totalFitur += 1
          }
        }
      } catch {
        // Lewati plugin yang error
      }
    }

    // --- Output ---
    const info = `
📦 *Informasi Lingkungan*
────────────────────
🛠 Baileys: ${baileysName} v${baileysVersion}
🖥 Node.js: ${nodeVersion}
📂 node_modules: ${nodeModulesSize}
⚙️ Total Fitur: ${totalFitur}
────────────────────
`.trim()

    m.reply(info)

  } catch (e) {
    m.reply(`❌ Terjadi kesalahan: ${e.message}`)
  }
}

handler.help = ['cekinfo']
handler.tags = ['tools']
handler.command = /^cekinfo$/i

export default handler