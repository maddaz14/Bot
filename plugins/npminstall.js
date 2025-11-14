import { exec } from 'child_process'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} axios`)

  m.reply(`Memasang *${text}*...\nTunggu beberapa saat.`)

  exec(`npm install ${text}`, (err, stdout, stderr) => {
    if (err) return m.reply(`Gagal menginstall:\n\n${stderr}`)
    m.reply(`Berhasil menginstall:\n\n${stdout}`)
  })
}

handler.help = ['npminstall <package>']
handler.tags = ['owner']
handler.command = /^npminstall$/i
handler.rowner = true // hanya bisa dipakai owner

export default handler