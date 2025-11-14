let handler = async (m, { conn }) => {
  let users = global.db.data.users
  let userList = []

  // Ambil data pengguna dan jumlah interaksi
  for (let jid in users) {
    let user = users[jid]
    let name = 'Tidak diketahui'
    
    try {
      name = await conn.getName(jid)
    } catch (e) {
      // Menangani jika terjadi error saat mengambil nama
    }
    
    let total = user.exp || 0 // Bisa diganti dengan user.limit atau lainnya
    if (total > 0) {
      userList.push({ name, jid, total })
    }
  }

  // Urutkan berdasarkan total perintah (dari terbesar ke terkecil)
  userList.sort((a, b) => b.total - a.total)

  // Siapkan output
  let teks = `📊 *Statistik Pengguna ubed Bot*\n\n`
  let limit = Math.min(userList.length, 20) // Batasi hanya 20 teratas
  for (let i = 0; i < limit; i++) {
    let { name, total } = userList[i]
    teks += `#${i + 1} ${name} ${total} perintah ke ubed Bot\n`
  }

  // Batasi panjang output
  if (teks.length > 4000) {
    teks = teks.slice(0, 4000) + '\n\n[Dipangkas karena terlalu panjang...]'
  }

  conn.reply(m.chat, teks.trim(), m)
}

handler.help = ['statuser']
handler.tags = ['owner']
handler.command = /^statuser$/i
handler.owner = true

export default handler