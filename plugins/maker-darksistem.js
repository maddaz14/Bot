import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Kirim perintah *${usedPrefix + command} [teks]*\n\nContoh: *${usedPrefix + command} Hilman*`)

  try {
    let url = `https://api.sxtream.xyz/maker/yapping?name=${encodeURIComponent(text)}`
    let res = await fetch(url)

    if (!res.ok) throw '❌ Gagal mengambil data dari API.'

    let buffer = await res.buffer()
    await conn.sendFile(m.chat, buffer, 'srtdarksistem.jpg', `🗣️ Sertifikat Dark Sistem by *${text}*`, m)

  } catch (e) {
    console.error(e)
    m.reply('❌ Terjadi kesalahan saat mengambil gambar.')
  }
}

handler.help = ['darksistem <teks>']
handler.tags = ['maker']
handler.command = /^darksistem$/i
handler.limit = true

export default handler