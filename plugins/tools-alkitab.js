import axios from 'axios'
import * as cheerio from "cheerio"

const handler = async (m, { conn, text, command, prefix }) => {
  if (!text) return m.reply(`uhm.. teksnya mana?\n\ncontoh:\n${prefix + command} kejadian`)

  try {
    const res = await axios.get(`https://alkitab.me/search?q=${encodeURIComponent(text)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36"
      }
    })

    const $ = cheerio.load(res.data)
    const result = []
    $('div.vw').each((i, el) => {
      const teks = $(el).find('p').text().trim()
      const link = $(el).find('a').attr('href')
      const title = $(el).find('a').text().trim()
      result.push({ teks, link, title })
    })

    if (result.length === 0) return m.reply('Maaf, tidak ditemukan hasil untuk pencarian Anda.')

    const foto = 'https://telegra.ph/file/a333442553b1bc336cc55.jpg'
    const judul = '*────────「 Alkitab 」────────*'
    const caption = result.map(v => `💌 ${v.title}\n📮 ${v.teks}`).join('\n┄┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┄\n')

    await conn.sendMessage(m.chat, { 
      image: { url: foto },
      caption: `${judul}\n\n${caption}`
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('Terjadi kesalahan saat mencari data Alkitab.')
  }
}

handler.help = ['alkitab <kata>']
handler.tags = ['tools']
handler.command = /^alkitab$/i
handler.limit = true

export default handler