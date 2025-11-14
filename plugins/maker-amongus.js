import fetch from 'node-fetch'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.sendMessage(m.chat, { text: `Masukkan teksnya!\n\nContoh: ${usedPrefix + command} UbedBot` }, { quoted: m })
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    const res = await fetch(`https://api.lolhuman.xyz/api/amongus?apikey=ubed2407&text=${encodeURIComponent(text)}`)
    if (!res.ok) throw await res.text()

    const buffer = await res.buffer()
    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: `Among Us oleh ubed Bot\nTeks: ${text}`
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (err) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    await conn.sendMessage(m.chat, { text: `Terjadi kesalahan: ${err.message || err}` }, { quoted: m })
  }
}

handler.help = ['amongus <teks>']
handler.tags = ['maker']
handler.command = ['amongus']
handler.limit = true

export default handler