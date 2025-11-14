const handler = async (m, { args, text, command }) => {
  const user = global.db.data.users[m.sender] = global.db.data.users[m.sender] || {}

  if (!text) {
    return m.reply(`Gunakan format:\n.setme [opsi] [isi]\n\nContoh:\n.setme nama John Doe\n.setme umur 23\n.setme ttl 1 Januari 2000\n.setme jk Laki-laki\n.setme agama Islam\n.setme hobi Bermain game\n.setme kota Jakarta\n.setme negara Indonesia\n.setme foto https://telegra.ph/file/abc123.jpg\n\nKetik *.setme foto hapus* untuk menghapus foto custom.`);
  }

  const [key, ...rest] = text.split(' ')
  const value = rest.join(' ')

  switch (key.toLowerCase()) {
    case 'nama':
    case 'umur':
    case 'ttl':
    case 'jk':
    case 'agama':
    case 'hobi':
    case 'kota':
    case 'negara':
      user[key.toLowerCase()] = value
      m.reply(`✅ Berhasil mengubah *${key}* menjadi *${value}*.`)
      break
    case 'foto':
      if (value.toLowerCase() === 'hapus') {
        delete user.foto
        m.reply(`✅ Foto profil custom dihapus. Sekarang pakai profil WhatsApp.`)
      } else if (!/^https?:\/\//.test(value)) {
        m.reply(`❌ URL tidak valid. Pastikan dimulai dengan http atau https.`)
      } else {
        user.foto = value
        m.reply(`✅ Foto profil custom berhasil di-set.`)
      }
      break
    default:
      m.reply(`❌ Opsi *${key}* tidak dikenali. Gunakan salah satu:\nnama, umur, ttl, jk, agama, hobi, kota, negara, foto`)
  }
}

handler.help = ['setme']
handler.tags = ['main']
handler.command = ['setme']

export default handler