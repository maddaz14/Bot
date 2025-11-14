// pake plugins ini klo mw rename, contoh commandnya “.rename ubed Bot|Nama Bot Kamu” bisa juga rename yg lain

import fs from 'fs'
import path from 'path'

const unicodeMap = {}

const addFancy = (start, base, count) => {
  for (let i = 0; i < count; i++) {
    unicodeMap[String.fromCodePoint(start + i)] = base[i]
  }
}

addFancy(0x1D400, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26)
addFancy(0x1D41A, 'abcdefghijklmnopqrstuvwxyz', 26)
addFancy(0x1D434, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26)
addFancy(0x1D44E, 'abcdefghijklmnopqrstuvwxyz', 26)
addFancy(0x1D468, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26)
addFancy(0x1D482, 'abcdefghijklmnopqrstuvwxyz', 26)
addFancy(0x1D49C, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26)
addFancy(0x1D504, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26)
addFancy(0x1D538, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26)
addFancy(0x1D670, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26)
addFancy(0x1D68A, 'abcdefghijklmnopqrstuvwxyz', 26)
addFancy(0x1D7CE, '0123456789', 10)
addFancy(0x1D7D8, '0123456789', 10)
addFancy(0x1D7F6, '0123456789', 10)

Object.assign(unicodeMap, {
  '＠': '@', '❗': '!', '❕': '!', '❓': '?', '❔': '?', '！': '!', '？': '?', '＄': '$'
})

function normalizeFancyText(text) {
  return text.normalize('NFKD').split('').map(char => unicodeMap[char] || char).join('')
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

let handler = async (m, { text, usedPrefix, command, __dirname }) => {
  if (!text || !text.includes('|')) throw `Contoh penggunaan: *${usedPrefix}${command} teks_lama|teks_baru*`
  let [oldText, newText] = text.split('|').map(v => normalizeFancyText(v.trim()))
  if (!oldText || !newText) throw `Format salah!\nContoh: *${usedPrefix}${command} agas|agasBaru*`

  let pluginDir = __dirname
  let files = fs.readdirSync(pluginDir).filter(file => file.endsWith('.js'))
  let totalReplaced = 0
  let editedFiles = []

  for (let file of files) {
    let filePath = path.join(pluginDir, file)
    let isi = fs.readFileSync(filePath, 'utf-8')
    let regex = new RegExp(`\\b${escapeRegex(oldText)}\\b`, 'gi')
    if (regex.test(isi)) {
      let baru = isi.replace(regex, newText)
      fs.writeFileSync(filePath, baru)
      totalReplaced++
      editedFiles.push(file)
    }
  }

  if (!totalReplaced) throw `Tidak ada plugin yang mengandung kata *${oldText}* sebagai kata utuh.`
  m.reply(`Berhasil mengganti *${oldText}* => *${newText}* di *${totalReplaced}* plugin:\n\n` + editedFiles.map(f => `- ${f}`).join('\n'))
}

handler.command = /^renameplug$/i
handler.rowner = true

export default handler