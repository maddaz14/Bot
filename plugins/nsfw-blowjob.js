import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    await conn.sendMessage(m.chat, { react: { text: '💦', key: m.key } })

    const response = await axios.get('https://api.lolhuman.xyz/api/random/nsfw/blowjob?apikey=ubed2407', {
      responseType: 'arraybuffer'
    })

    const buffer = response.data

    await conn.sendMessage(m.chat, {
      video: buffer,
      caption: '🔞 Nih video blowjob buat kamu~',
      gifPlayback: true
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (error) {
    console.error(error)
    await conn.reply(m.chat, '❌ Gagal mengambil video Blowjob.', m)
  }
}

handler.command = /^(blowjob)$/i
handler.tags = ['nsfw']
handler.help = ['blowjob']
handler.limit = 3
handler.premium = true
handler.register = true
handler.nsfw = true

export default handler