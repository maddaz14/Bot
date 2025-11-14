import { exec } from 'child_process'

let handler = async (m, { conn }) => {
  m.reply('🔍 Sedang menghitung ukuran folder `node_modules` dan `.npm`...\nMohon tunggu sebentar.')

  try {
    // Jalankan perintah du untuk menghitung ukuran folder
    exec(`du -sh node_modules .npm 2>/dev/null`, (err, stdout, stderr) => {
      if (err || stderr) {
        console.error(err || stderr)
        return m.reply('❌ Gagal menghitung ukuran folder.\nPastikan sistem mendukung perintah shell (Linux/Panel).')
      }

      // Format hasilnya
      let lines = stdout.trim().split('\n').filter(Boolean)
      let result = lines.map(line => {
        let [size, folder] = line.split('\t')
        return `📁 *${folder}* : ${size}`
      }).join('\n')

      // Hitung total dalam GB
      let total = lines.reduce((acc, line) => {
        let [size] = line.split('\t')
        let value = parseFloat(size)
        if (size.endsWith('G')) value *= 1024
        acc += value
        return acc
      }, 0)

      let caption = `✅ *Ukuran Folder Node.js Bot*\n\n${result}\n\n📦 *Total:* ${(total / 1024).toFixed(2)} GB`
      conn.sendMessage(m.chat, { text: caption }, { quoted: m })
    })
  } catch (e) {
    console.error(e)
    m.reply('⚠️ Terjadi kesalahan saat memproses ukuran folder.')
  }
}

handler.help = ['cekspace', 'checksize', 'cekukuran']
handler.tags = ['owner']
handler.command = /^(cekspace|checksize|cekukuran)$/i
handler.owner = true // 🔒 hanya bisa dijalankan oleh owner

export default handler