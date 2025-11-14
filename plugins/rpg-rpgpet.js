// wm ubed bot

const handler = async (m, { conn, args }) => {
  const user = global.db.data.users[m.sender]
  const inventory = user.inventory || {}

  // Daftar pet
  const pets = [
    { name: '🐕 Dog', id: 'dog', price: 500, desc: 'Peliharaan yang setia' },
    { name: '🐈 Cat', id: 'cat', price: 400, desc: 'Peliharaan yang manja' },
    { name: '🐦 Bird', id: 'bird', price: 300, desc: 'Peliharaan terbang' }
  ]

  // Tampilkan daftar pet
  if (!args[0]) {
    let teks = `╭───〔 *P E T  M E N U* 〕───⬣\n│\n`
    for (let pet of pets) {
      teks += `│ ${pet.name} - ${pet.desc}\n│ Harga: ${pet.price} UC\n│\n`
    }
    teks += '╰────────────────────────⬣\n\nKetik: *.rpgpet [pet]* untuk membeli'
    return m.reply(teks)
  }

  const selected = pets.find(p => p.id === args[0].toLowerCase())
  if (!selected) return m.reply('⚠️ Pet tidak ditemukan.')

  // Cek saldo
  if (user.balance < selected.price) {
    return m.reply(`❌ Saldo tidak cukup! Kamu butuh ${selected.price} UC untuk membeli ${selected.name}.`)
  }

  // Kurangi saldo dan tambahkan pet ke inventory
  user.balance -= selected.price
  inventory[selected.id] = (inventory[selected.id] || 0) + 1
  user.inventory = inventory

  m.reply(`✅ Berhasil membeli *${selected.name}*!\nCek inventori kamu untuk melihat pet-mu.`)
}

handler.help = ['rpgpet']
handler.tags = ['rpg']
handler.command = /^rpgpet$/i

export default handler