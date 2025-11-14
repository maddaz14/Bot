import fetch from 'node-fetch'

let handler = async (m, { args, usedPrefix, command }) => {
  if (!args[0]) throw `Contoh:\n${usedPrefix + command} Aku ubed`

  m.reply('_Mengubah gaya teks..._')

  try {
    let res = await fetch(`https://api.ubed.my.id/maker/Style-text?apikey=ubed2407&text=${encodeURIComponent(args.join(' '))}`)
    let json = await res.json()

    if (!json || json.status !== 200 || !Array.isArray(json.result))
      return m.reply('Gagal mengambil data.')

    let teks = `*Gaya Teks:*\n\n` + json.result.map(v => `• *${v.name}*:\n${v.value}`).join('\n\n')
    m.reply(teks)

  } catch (e) {
    console.error(e)
    m.reply('Terjadi kesalahan saat mengambil data.')
  }
}

handler.command = /^styletext$/i
handler.tags = ['tools']
handler.help = ['styletext <teks>']
handler.limit = true

export default handler