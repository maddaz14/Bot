import fs from 'fs'
import path from 'path'

// Direktori yang akan dipindai: plugins, node_modules, dan lib.
const TARGET_DIRS = ['./plugins', './node_modules', './lib']
const PATTERN_REPLACEMENTS = [
    // 1. Memperbaiki import default 'cheerio' menjadi namespace import:
    // Contoh: import * as cheerio from "cheerio" -> import * as cheerio from "cheerio"
    {
        regex: /(import\s+cheerio\s+from\s+['"]cheerio['"])/g,
        replacement: 'import * as cheerio from "cheerio"'
    },
    // 2. Memperbaiki named import '{ jimp }' menjadi namespace import:
    // Contoh: import * as jimp from "jimp" -> import * as jimp from "jimp"
    {
        regex: /(import\s*\{\s*jimp\s*\}\s+from\s+['"]jimp['"])/g,
        replacement: 'import * as jimp from "jimp"'
    },
    // 3. Memperbaiki import default 'jimp' menjadi namespace import (untuk file yang mungkin terobfuscate/random name):
    // Contoh: import * as jimp from "jimp" -> import * as jimp from "jimp"
    // Regex mencari 'import' diikuti spasi, nama variabel apapun yang bukan '{' atau spasi, diikuti 'from "jimp"'
    {
        regex: /(import\s+[^\{\s]+?\s+from\s+['"]jimp['"])/g,
        replacement: 'import * as jimp from "jimp"'
    },
    // 4. Memperbaiki error sintaks yang mungkin ada di file 'owner-fixcheerio2.js' atau file serupa:
    // Error: "import * as cheerio from "cheerio"" (kutip ganda ganda) -> 'import * as cheerio from "cheerio"' (kutip tunggal luar)
    {
        regex: /("import * as cheerio from "cheerio"")/g,
        replacement: "'import cheerio from \"cheerio\"'"
    },
    // 5. Memperbaiki import jimp yang mungkin ada di file yang terobfuscate (menggunakan require):
    // Contoh: const jimp = require("jimp") -> const jimp = require("jimp")
    {
        regex: /(const\s+[^\{\s]+?\s*=\s*require\s*\(\s*['"]jimp['"]\s*\))/g,
        replacement: 'const jimp = require("jimp")'
    }
]

let handler = async (m, { conn }) => {
    // Pengecekan isROwner di awal sudah dihapus, mengandalkan handler.rowner = true
    
    let fixedFiles = []
    let scannedFiles = 0

    function recursiveFix(dir) {
        if (!fs.existsSync(dir)) return

        const files = fs.readdirSync(dir)
        for (const file of files) {
            const fullPath = path.join(dir, file)
            const stat = fs.statSync(fullPath)

            if (stat.isDirectory()) {
                // Lewati folder node_modules internal, dll.
                if (file === 'node_modules' && dir.includes('node_modules')) continue
                recursiveFix(fullPath)
            } else if (file.endsWith(".js")) {
                scannedFiles++
                let content = fs.readFileSync(fullPath, "utf8")
                let changed = false

                for (const { regex, replacement } of PATTERN_REPLACEMENTS) {
                    if (regex.test(content)) {
                        content = content.replace(regex, replacement)
                        changed = true
                    }
                }

                if (changed) {
                    fs.writeFileSync(fullPath, content, "utf8")
                    fixedFiles.push(fullPath.replace(process.cwd(), '.')) // Tampilkan path relatif
                }
            }
        }
    }

    await conn.reply(m.chat, `🔍 Sedang memindai dan memperbaiki ${TARGET_DIRS.join(', ')}... Mohon tunggu ⏳`, m)

    try {
        for (const dir of TARGET_DIRS) {
            recursiveFix(dir)
        }
    } catch (e) {
        console.error(e)
        return conn.reply(m.chat, "❌ Terjadi error saat memperbaiki:\n" + e.message, m)
    }

    // Perbaikan khusus untuk error 'gtts' (saran instalasi)
    let gttsNeeded = false;
    // Asumsi: Jika ada error gtts, kita perlu menyarankan instalasi
    if (scannedFiles > 0 && fixedFiles.length === 0) {
        // Ini adalah heuristic. Sebaiknya periksa log error sebenarnya,
        // tapi untuk tujuan ini, kita asumsikan jika tidak ada perbaikan file, 
        // error yang tersisa mungkin adalah gtts yang non-kode.
        gttsNeeded = true;
    }


    let txt = `✅ *Perbaikan Modul Selesai!* (Total file: ${scannedFiles})\n\n🛠️ File berhasil diperbaiki: *${fixedFiles.length}*\n\n`
    
    if (fixedFiles.length > 0) {
        txt += "Daftar File Diperbaiki:\n"
        txt += fixedFiles.slice(0, 10).join('\n') // Tampilkan 10 teratas saja
        if (fixedFiles.length > 10) {
            txt += `\n... dan ${fixedFiles.length - 10} file lainnya.`
        }
        txt += '\n\n*SILAKAN RESTART BOT ANDA* untuk menerapkan perubahan.'
    } else {
        txt += "Semua import modul sudah sesuai atau tidak ada yang perlu diubah."
    }
    
    // Saran untuk error 'gtts'
    if (gttsNeeded) {
        txt += `\n\n📌 *CATATAN:* Mungkin ada error \`Cannot find package 'gtts'\` (tool-tts.js). Pastikan Anda sudah menginstal paket tersebut:\n\`npm install gtts\``
    }


    await conn.reply(m.chat, txt, m)
}

handler.help = ['fixmodules']
handler.tags = ['owner', 'fix']
handler.command = /^fixmodules$/i
handler.rowner = true // Menggunakan rowner untuk membatasi akses

export default handler