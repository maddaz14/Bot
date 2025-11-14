let handler = async (m, { conn, args }) => {
  let sender = m.sender
  let user = global.db.data.users[sender]

  if (!user.isMarried) return m.reply('⚠️ Kamu harus menikah dulu untuk bisa punya anak.')
  if (!user.anak || user.anak.length === 0) return m.reply('⚠️ Kamu belum punya anak untuk diubah namanya.')

  if (args.length < 2) return m.reply('⚠️ Gunakan format: .ubahnamaAnak <namaLama> <namaBaru>')

  let namaLama = args[0]
  let namaBaru = args.slice(1).join(' ')

  if (!user.anak.includes(namaLama)) return m.reply(`⚠️ Kamu tidak punya anak bernama *${namaLama}*.`)

  // Ubah nama di data user
  user.anak = user.anak.map(n => n === namaLama ? namaBaru : n)

  // Ubah nama di pasangan juga
  let pasanganData = global.db.data.users[user.pasangan]
  if (pasanganData && pasanganData.anak) {
    pasanganData.anak = pasanganData.anak.map(n => n === namaLama ? namaBaru : n)
  }

  // Update data anak di DB (jika ada)
  for (let jid in global.db.data.users) {
    let calonAnak = global.db.data.users[jid]
    if (calonAnak.namaAnak === namaLama && calonAnak.orangtua === sender) {
      calonAnak.namaAnak = namaBaru
      break
    }
  }

  return m.reply(`✅ Nama anak berhasil diubah dari *${namaLama}* menjadi *${namaBaru}*.`)
}

handler.help = ['ubahnamaAnak <namaLama> <namaBaru>']
handler.tags = ['rpg']
handler.command = /^ubahnamaAnak$/i

export default handler