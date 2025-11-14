import axios from 'axios'

const fkontak = {
  key: {
    participant: '0@s.whatsapp.net',
    remoteJid: 'status@broadcast',
    fromMe: false,
    id: 'Halo',
  },
  message: {
    conversation: '🏳️‍🌈 Gay Card Generator by UbedBot',
  },
}

// Upload ke Catbox
const uploadToCatbox = async (buffer) => {
  const FormData = (await import('form-data')).default
  const form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', buffer, { filename: 'avatar.jpg' })

  const res = await axios.post('https://catbox.moe/user/api.php', form, {
    headers: form.getHeaders(),
    timeout: 15000
  })

  if (!res.data.includes('https://files.catbox.moe/')) throw '❌ Gagal upload avatar.'
  return res.data
}

// Handler utama
let handler = async (m, { conn, text, usedPrefix, command }) => {
  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''

  if (!mime || !/image\/(jpe?g|png)/.test(mime)) {
    return conn.reply(m.chat, `⚠️ Balas gambar dengan caption:\n*${usedPrefix + command} <nama>*\n\nContoh:\n*${usedPrefix + command} Lendra*`, m, { quoted: fkontak })
  }

  const nama = text?.trim()
  if (!nama) return conn.reply(m.chat, `❌ Masukkan nama kamu.\nContoh: *${usedPrefix + command} Lendra*`, m)

  try {
    await conn.sendMessage(m.chat, { react: { text: '🏳️‍🌈', key: m.key } })

    const imgBuffer = await q.download?.()
    if (!imgBuffer) throw '❌ Gagal mengunduh avatar.'

    const uploadedUrl = await uploadToCatbox(imgBuffer)

    const api = `https://api.siputzx.my.id/api/canvas/gay?nama=${encodeURIComponent(nama)}&avatar=${encodeURIComponent(uploadedUrl)}&num=${Math.floor(Math.random() * 100)}`
    const result = await axios.get(api, { responseType: 'arraybuffer', timeout: 30000 })

    await conn.sendMessage(m.chat, {
      image: result.data,
      caption: `🏳️‍🌈 *GAY CARD*\nNama: ${nama}`,
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    conn.reply(m.chat, `❌ Gagal membuat Gay Card:\n${e.message || e}`, m)
  }
}

handler.help = ['gaycard <nama>']
handler.tags = ['maker']
handler.command = /^gay(card)?$/i
handler.limit = true
handler.register = true

export default handler