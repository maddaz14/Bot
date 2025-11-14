let handler = async (m, { args }) => {
  let user = db.data.users[m.sender]
  if (!user.sekolah || user.sekolah.peran !== 'guru')
    return m.reply('Fitur ini hanya untuk guru.')

  let mention = m.mentionedJid?.[0]
  if (!mention) return m.reply('Tag muridnya, contoh: .laporanakhir @murid')

  let murid = db.data.users[mention]
  if (!murid || murid.sekolah?.peran !== 'murid') return m.reply('Itu bukan murid.')

  let nilai = murid.sekolah?.nilai || []
  let rerata = nilai.length ? (nilai.reduce((a, b) => a + b, 0) / nilai.length).toFixed(2) : 0

  m.reply(`*Laporan Akhir Semester*\nNama: ${murid.name}\nNilai Ujian: ${nilai.join(', ') || 'Belum ada'}\nRata-rata: ${rerata}`)
}

handler.help = ['laporanakhir @murid']
handler.tags = ['rpg']
handler.command = /^laporanakhir$/i

export default handler