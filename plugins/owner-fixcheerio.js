import fs from "fs"
import path from "path"

let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) throw "❌ Fitur ini hanya untuk *Owner Bot*!"

  const baseDir = "./node_modules"
  let fixedFiles = []
  let scanned = 0

  function fixCheerioImport(dir) {
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const fullPath = path.join(dir, file)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        fixCheerioImport(fullPath)
      } else if (file.endsWith(".js")) {
        let content = fs.readFileSync(fullPath, "utf8")
        scanned++

        // Deteksi berbagai bentuk import cheerio
        const patterns = [
          /import\s+cheerio\s+from\s+['"]cheerio['"]/g,
          /import\s*\{\s*load\s*\}\s*from\s+['"]cheerio['"]/g,
          /const\s+cheerio\s*=\s*require\s*\(\s*['"]cheerio['"]\s*\)/g
        ]

        let changed = false
        for (const pattern of patterns) {
          if (pattern.test(content)) {
            content = content
              .replace(pattern, "import * as cheerio from 'cheerio'")
            changed = true
          }
        }

        if (changed) {
          fs.writeFileSync(fullPath, content, "utf8")
          fixedFiles.push(fullPath)
        }
      }
    }
  }

  await conn.reply(m.chat, "🔍 Sedang memindai dan memperbaiki file *cheerio* di node_modules...\nMohon tunggu beberapa menit ⏳", m)

  try {
    fixCheerioImport(baseDir)
  } catch (e) {
    console.error(e)
    return conn.reply(m.chat, "❌ Terjadi error saat memperbaiki:\n" + e.message, m)
  }

  // Simpan log hasil perbaikan
  const logContent = [
    "=== FIX CHEERIO LOG ===",
    `Tanggal: ${new Date().toLocaleString()}`,
    `Total File Diperiksa: ${scanned}`,
    `Total File Diperbaiki: ${fixedFiles.length}`,
    "",
    "Daftar File yang Diperbaiki:",
    ...fixedFiles
  ].join("\n")

  fs.writeFileSync("fixcheerio.log", logContent, "utf8")

  let txt = `✅ *Selesai memperbaiki import cheerio!*\n\n📁 File diperiksa: ${scanned}\n🛠️ File diperbaiki: ${fixedFiles.length}\n`
  if (fixedFiles.length) {
    txt += "\n📜 Log perbaikan tersimpan di file *fixcheerio.log*"
  } else {
    txt += "\nSemua file sudah sesuai, tidak ada yang perlu diubah."
  }

  await conn.reply(m.chat, txt, m)
}

handler.help = ['fixcheerio']
handler.tags = ['owner', 'fix']
handler.command = /^fixcheerio$/i
handler.owner = true

export default handler