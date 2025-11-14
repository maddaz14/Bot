import fetch from 'node-fetch'

let handler = async (m, { args }) => {
  if (!args[0]) return m.reply('Masukkan API Key-nya!\n\nContoh:\n.ceklolkey ubed2407')

  let apikey = args[0]

  try {
    let res = await fetch(`https://api.lolhuman.xyz/api/checkapikey?apikey=${apikey}`)
    if (!res.ok) throw await res.text()

    let json = await res.json()
    if (json.status !== 200) throw '❌ API key tidak valid atau gagal mengambil data!'

    let { username, requests, today, account_type, expired } = json.result

    let caption = `
🔑 *Status API Key LOLHuman*
👤 Username: ${username}
📅 Expired: ${expired}
💼 Tipe Akun: ${account_type}
📊 Total Request: ${requests}
📆 Request Hari Ini: ${today}
`.trim()

    m.reply(caption)
  } catch (err) {
    console.error(err)
    m.reply('❌ Terjadi kesalahan!\nPastikan API key valid dan masih aktif.')
  }
}

handler.help = ['ceklolkey <apikey>']
handler.tags = ['tools']
handler.command = /^ceklolkey$/i
handler.owner = false // Hanya owner

export default handler