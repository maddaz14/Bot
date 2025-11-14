const handler = async (m, { conn, store, themeemoji = '🔹' }) => {
  try {
    // Ambil semua chat personal (endsWith .net)
    let anulistp = store.chats.all().filter(v => v.id.endsWith('.net')).map(v => v.id)
    let teks = `${themeemoji} *PERSONAL CHAT LIST*\n\nTotal Chat : ${anulistp.length} Chat\n\n`

    for (let id of anulistp) {
      // Ambil nama pengirim dari pesan pertama chat tersebut
      let nama = (store.messages[id]?.array?.[0]?.pushName) || 'Unknown'
      teks += `${themeemoji} *Name :* ${nama}\n${themeemoji} *User :* @${id.split('@')[0]}\n${themeemoji} *Chat :* https://wa.me/${id.split('@')[0]}\n\n────────────────────────\n\n`
    }

    await conn.sendMessage(m.chat, { text: teks, mentions: anulistp }, { quoted: m })
  } catch (e) {
    console.error(e)
    m.reply('Terjadi kesalahan saat mengambil daftar personal chat.')
  }
}

handler.help = ['listpc']
handler.tags = ['info']
handler.command = /^listpc$/i
handler.limit = true

export default handler