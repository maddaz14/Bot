import fetch from 'node-fetch'

global.xvideosSearch = global.xvideosSearch || {}

const handler = async (m, { conn, text, usedPrefix }) => {
  const query = text?.trim()
  const apiKey = 'CocoaHoto' // Ganti dengan API key Anda

  if (!query) {
    const example = `${usedPrefix}xsearch Genshin Impact`
    return await conn.sendMessage(m.chat, { text: `🔍 Masukkan kata kunci pencarian!\n\nContoh:\n${example}` }, { quoted: m })
  }

  const loading = await conn.sendMessage(m.chat, { text: '⏳ Mencari video...' }, { quoted: m })

  if (!global.xvideosSearch[query]) {
    try {
      const url = `https://api.betabotz.eu.org/api/search/xvideos?query=${encodeURIComponent(query)}&apikey=${apiKey}`
      const res = await fetch(url)
      const json = await res.json()

      if (!json?.status || !Array.isArray(json.result) || json.result.length === 0) {
        return await conn.sendMessage(m.chat, { text: '❌ Tidak ada hasil ditemukan untuk query itu.' }, { edit: loading.key })
      }

      global.xvideosSearch[query] = json.result
    } catch (err) {
      console.error('❌ Error ambil API:', err)
      return await conn.sendMessage(m.chat, { text: '❌ Gagal ambil data dari API.' }, { edit: loading.key })
    }
  }
  
  await conn.sendMessage(m.chat, { delete: loading.key })

  await sendXvideosResult({ conn, m, query, index: 0 })
}

handler.before = async (m, { conn }) => {
  if (!m.callback_query?.data?.startsWith('xvids_')) return

  const data = m.callback_query.data.replace('xvids_', '')
  const [queryRaw, indexStr] = data.split('|')
  const query = decodeURIComponent(queryRaw)
  const index = parseInt(indexStr || '0')

  if (!global.xvideosSearch[query]) {
      return conn.answerCallbackQuery(m.callback_query.id, { text: '❌ Sesi sudah berakhir. Silakan cari ulang.' })
  }

  await sendXvideosResult({ conn, m, query, index, edit: true })
  await conn.answerCallbackQuery(m.callback_query.id)
}

async function sendXvideosResult({ conn, m, query, index = 0, edit = false }) {
  try {
    const list = global.xvideosSearch[query]
    if (!list || !list[index]) {
      if (edit) {
        return await conn.sendMessage(m.chat, { text: '❌ Data tidak ditemukan lagi di cache.' }, { edit: m.callback_query.message.message_id })
      } else {
        return await conn.sendMessage(m.chat, { text: '❌ Gagal menampilkan hasil. Sesi telah berakhir atau data tidak valid.' }, { quoted: m })
      }
    }

    const data = list[index]
    const caption = `🔞 *XVideos Search Result*\n\n` +
      `🎬 Judul: *${data.title}*\n🕒 Durasi: ${data.duration || '-'}\n` +
      `🔗 [Tonton Video](${data.url})\n\n` +
      `📸 Hasil ke *${index + 1}* dari *${list.length}*\n\n` +
      `_Gunakan tombol untuk navigasi hasil_`

    const buttons = []
    if (index > 0) buttons.push({ text: '⬅️ Sebelumnya', callback_data: `xvids_${encodeURIComponent(query)}|${index - 1}` })
    if (index < list.length - 1) buttons.push({ text: '➡️ Selanjutnya', callback_data: `xvids_${encodeURIComponent(query)}|${index + 1}` })

    if (edit) {
      await conn.sendMessage(m.chat, {
        image: { url: data.thumb },
        caption: caption,
        reply_markup: { inline_keyboard: [buttons] }
      }, { edit: m.callback_query.message.message_id })
    } else {
      await conn.sendMessage(m.chat, {
        image: { url: data.thumb },
        caption,
        quoted: m,
        reply_markup: { inline_keyboard: [buttons] }
      })
    }
  } catch (err) {
    console.error('❌ Error tampil data:', err)
    await conn.sendMessage(m.chat, { text: '❌ Gagal menampilkan hasil.' }, { quoted: m })
  }
}

handler.command = ['xsearch']
handler.tags = ['nsfw']
handler.help = ['xsearch <query>']
handler.private = false
handler.premium = true

export default handler