import fetch from 'node-fetch'

const tebaktebakan = {}

const handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.isGroup) return m.reply('Fitur ini hanya dapat digunakan di grup!')

  const id = m.sender.split('@')[0]
  if (tebaktebakan.hasOwnProperty(id)) {
    return m.reply('Masih ada sesi tebakan yang belum selesai!')
  }

  let res = await fetch('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebaktebakan.json')
  if (!res.ok) return m.reply('Gagal mengambil soal. Coba lagi nanti.')
  let data = await res.json()

  const soal = data[Math.floor(Math.random() * data.length)]
  tebaktebakan[id] = soal.jawaban.toLowerCase()

  conn.sendText(m.chat, `*Tebak-Tebakan*\n\nPertanyaan:\n*${soal.soal}*\n\nWaktu menjawab: *60 detik*`, m)

  setTimeout(() => {
    if (tebaktebakan[id]) {
      conn.sendText(m.chat, `⏰ Waktu habis!\nJawaban yang benar: *${tebaktebakan[id]}*`, m)
      delete tebaktebakan[id]
    }
  }, 60000)
}

handler.customPrefix = /^(tebaktebakan)$/i
handler.command = new RegExp
handler.group = true
handler.tags = ['game']
handler.help = ['tebaktebakan']

export default handler