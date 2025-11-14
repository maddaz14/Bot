import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) throw `Tolong kirimkan teks setelah perintah *${usedPrefix}${command}*`

  try {
    // Mengirim react emoji saat memproses
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    // Memanggil API untuk mengubah teks
    const res = await axios.get(`https://api.lolhuman.xyz/api/hilih?apikey=ubed2407&text=${encodeURIComponent(text)}`)

    if (res.data.status === 200) {
      const result = res.data.result
      await conn.sendMessage(m.chat, { text: `Hasil perubahan teks: *${result}*` }, { quoted: m })
    } else {
      conn.reply(m.chat, '❌ Terjadi kesalahan dalam memproses permintaan.', m)
    }

    // Mengirim react emoji setelah selesai memproses
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '❌ Gagal mengambil data dari API.', m)
  }
}

handler.command = /^(hilih)$/i
handler.help = ['hilih']
handler.tags = ['tools']
handler.limit = 1
handler.register = true

export default handler