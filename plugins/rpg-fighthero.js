let handler = async (m, { conn, usedPrefix, participants }) => {
  const user = global.db.data.users[m.sender]
  const hero = user.hero || 1
  conn.fighthero = conn.fighthero || {}

  const delay = time => new Promise(res => setTimeout(res, time))

  // Cek minimal level hero
  if (hero < 2) {
    return m.reply(`🚫 *Level hero kamu terlalu rendah!*\n\nButuh minimal *Hero Level 2* untuk bisa ikut bertarung.\nLatih hero kamu lebih sering dulu ya!`)
  }

  if (conn.fighthero[m.sender]) {
    return m.reply(`⚔️ *Arena sedang dipakai!* Hero kamu masih bertarung, tunggu sampai selesai!`)
  }

  let users = participants.map(u => u.id)
  let lawan = users[Math.floor(Math.random() * users.length)]

  while (!global.db.data.users[lawan] || lawan === m.sender) {
    lawan = users[Math.floor(Math.random() * users.length)]
  }

  const heroLawan = global.db.data.users[lawan].hero || 1
  let durasi = Acakin(8, 20)

  m.reply(`⚔️ *PERTARUNGAN HERO DIMULAI!*\n\n*${conn.getName(m.sender)}* (Hero ⭐${hero}) menantang *${conn.getName(lawan)}* (Hero ⭐${heroLawan})!\n\n⏳ Tunggu *${durasi} menit* untuk melihat siapa yang menang...`)

  conn.fighthero[m.sender] = true
  await delay(1000 * 60 * durasi)

  const alasanKalah = ['Belum cukup kuat', 'Lemah', 'Kurang latihan', 'Senjatanya karatan', 'Kurang fokus']
  const alasanMenang = ['Penuh strategi', 'Cepat dan gesit', 'Menguasai medan', 'Berani dan kuat', 'Hero legendaris']

  let chance = []
  for (let i = 0; i < hero; i++) chance.push(m.sender)
  for (let i = 0; i < heroLawan; i++) chance.push(lawan)

  let poinPemain = 0
  let poinLawan = 0

  for (let i = 0; i < 10; i++) {
    let pemenang = chance[Acakin(0, chance.length - 1)]
    if (pemenang === m.sender) poinPemain++
    else poinLawan++
  }

  if (poinPemain > poinLawan) {
    let hadiah = (poinPemain - poinLawan) * 25000
    user.money += hadiah
    user.tiketcoin += 1

    m.reply(`*${conn.getName(m.sender)}* [${poinPemain * 10}] - [${poinLawan * 10}] *${conn.getName(lawan)}*\n\n*Hero kamu menang!* Karena dia ${alasanMenang[Acakin(0, alasanMenang.length - 1)]}!\n\n🎉 Kamu mendapat:\n+ 💰 Rp. ${hadiah.toLocaleString()}\n+ 🎟️ 1 Tiket Coin`)
  } else if (poinPemain < poinLawan) {
    let denda = (poinLawan - poinPemain) * 125000
    user.money -= denda
    user.tiketcoin += 1

    m.reply(`*${conn.getName(m.sender)}* [${poinPemain * 10}] - [${poinLawan * 10}] *${conn.getName(lawan)}*\n\n*Hero kamu kalah!* Karena dia ${alasanKalah[Acakin(0, alasanKalah.length - 1)]}.\n\n😢 Kamu kehilangan:\n- 💸 Rp. ${denda.toLocaleString()}\n+ 🎟️ 1 Tiket Coin`)
  } else {
    m.reply(`*${conn.getName(m.sender)}* [${poinPemain * 10}] - [${poinLawan * 10}] *${conn.getName(lawan)}*\n\n⚖️ Pertarungan berakhir imbang. Tidak ada hadiah atau kerugian.`)
  }

  delete conn.fighthero[m.sender]
}

handler.help = ['fighthero']
handler.tags = ['rpg']
handler.command = /^fighthero$/i
handler.limit = true
handler.group = true

export default handler

function Acakin(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}