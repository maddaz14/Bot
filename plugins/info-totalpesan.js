let handler = async (m, { conn }) => {
  if (!m.isGroup) return conn.reply(m.chat, '❌ Fitur ini hanya bisa digunakan di grup.', m)

  let chat = global.db.data.chats[m.chat]
  if (!chat || !chat.totalPesan) return conn.reply(m.chat, 'Belum ada data pesan di grup ini.', m)

  // Ambil semua user dan urutkan dari yang paling banyak
  let sorted = Object.entries(chat.totalPesan)
    .sort((a, b) => b[1] - a[1])

  let teks = `📊 *Total Pesan di Grup Ini*\n\n`
  let no = 1
  for (let [jid, total] of sorted) {
    teks += `${no++}. @${jid.split('@')[0]} — *${total} pesan*\n`
  }

  conn.reply(m.chat, teks, m, { mentions: sorted.map(([jid]) => jid) })
}

handler.help = ['totalpesan']
handler.tags = ['group']
handler.command = /^totalpesan$/i
handler.group = true
handler.admin = true

export default handler