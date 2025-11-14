import axios from 'axios'

let handler = async (m, { conn, text }) => {
  try {
    if (!text) return m.reply('Gunakan format:\n.iqc <text>\nContoh: .iqc Hai')

    // Ambil jam & menit sekarang
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const time = `${hours}:${minutes}`

    // Battery otomatis 100%
    const battery = '100'

    const url = `https://apiku.ubed.my.id/api/iphonequote?text=${encodeURIComponent(text)}&time=${encodeURIComponent(time)}&battery=${encodeURIComponent(battery)}`

    // Ambil response sebagai arraybuffer
    const res = await axios.get(url, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(res.data, 'binary')

    // Kirim sebagai gambar
    await conn.sendMessage(m.chat, { image: buffer, caption: 'iPhone Quote' }, { quoted: m })

  } catch (err) {
    console.error(err)
    m.reply(`Eror kak: ${err.message}`)
  }
}

handler.command = ['iqc'] // command .iqc
handler.tags = ['tools']
handler.help = ['iqc <text>']
handler.limit = true

export default handler