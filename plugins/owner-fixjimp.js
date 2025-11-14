import fs from "fs"
import path from "path"

const handler = async (m, { conn }) => {
  const folderPath = "./plugins"
  let changed = 0
  let skipped = 0

  const fixImports = (dir) => {
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        fixImports(filePath)
        continue
      }

      if (!filePath.endsWith(".js")) {
        skipped++
        continue
      }

      let content = fs.readFileSync(filePath, "utf8")

      // Deteksi kedua variasi import
      if (
        /import\s+jimp\s+from\s+['"]jimp['"]/.test(content) ||
        /import\s+Jimp\s+from\s+['"]jimp['"]/.test(content)
      ) {
        content = content
          .replace(/import\s+jimp\s+from\s+['"]jimp['"]/g, 'import * as jimp from "jimp"')
          .replace(/import\s+Jimp\s+from\s+['"]jimp['"]/g, 'import * as jimp from "jimp"')

        fs.writeFileSync(filePath, content, "utf8")
        changed++
      } else {
        skipped++
      }
    }
  }

  await conn.reply(m.chat, "🔍 Sedang memindai dan memperbaiki import jimp di folder plugins...", m)

  fixImports(folderPath)

  await conn.reply(
    m.chat,
    `✅ *Selesai memperbaiki import jimp!*\n\n📂 Folder: plugins\n🛠️ File diubah: ${changed}\n⏭️ File dilewati: ${skipped}`,
    m
  )
}

handler.help = ["fixjimp"]
handler.tags = ["owner", "fix"]
handler.command = /^fixjimp$/i
handler.owner = true

export default handler