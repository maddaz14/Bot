import fetch from 'node-fetch'

let handler = async (m, { args, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix + command} https://vm.tiktok.com/ZMBQsKwe2/`)

  try {
    let url = `https://api.botcahx.eu.org/api/dowloader/tiktok?url=${encodeURIComponent(text)}&apikey=ubed2407`
    let res = await fetch(url)
    let json = await res.json()

    if (!json.status) throw json

    let title = json.result?.title || 'Tidak ditemukan caption.'

    m.reply(`*Caption TikTok:*\n\n${title}`)
  } catch (e) {
    console.error(e)
    m.reply('Gagal mengambil caption. Pastikan link TikTok valid atau coba lagi nanti.')
  }
}

handler.help = ['ttcaption <url>']
handler.tags = ['tools']
handler.command = /^ttcaption$/i

export default handler