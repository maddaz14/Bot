// plugins/listowner.js
let handler = async (m, { conn }) => {
  let teks = '*Daftar Owner Saat Ini:*\n\n'
  global.owner.forEach(([nomor, nama], i) => {
    teks += `${i + 1}. wa.me/${nomor} ${nama ? `(${nama})` : ''}\n`
  })
  m.reply(teks.trim())
}

handler.help = ['listowner']
handler.tags = ['owner']
handler.command = /^listowner$/i

handler.owner = true

export default handler