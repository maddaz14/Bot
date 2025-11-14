let toM = a => '@' + a.split('@')[0]

// Tambahkan method getRandom ke Array
Array.prototype.getRandom = function() {
  return this[Math.floor(Math.random() * this.length)]
}

let handler = async (m, { conn, usedPrefix, groupMetadata }) => {
  let user = global.db.data.users[m.sender]
  let __timers = Date.now() - (user.lastngocok || 0)
  let cooldown = 3600000 // 1 jam dalam ms

  if (user.stamina < 20) 
    return m.reply(`Stamina anda tidak cukup\nharap isi stamina anda dengan *${usedPrefix}eat8*`)

  if (__timers < cooldown) {
    let timers = clockString(cooldown - __timers)
    return m.reply(`Kamu masih kelelahan\nHarap tunggu${timers} lagi`)
  }

  let pengocok = await conn.getName(m.sender)
  let ps = groupMetadata.participants.map(v => v.id)
  let a = ps.getRandom()

  // Generate angka random
  let rndm1 = Math.floor(Math.random() * 5)
  let rndm2 = Math.floor(Math.random() * 10)
  let rndm3 = Math.floor(Math.random() * 7)
  let rndm4 = Math.floor(Math.random() * 4)
  let rndm5 = Math.floor(Math.random() * 200)
  let rndm6 = Math.floor(Math.random() * 200)
  let rndm7 = Math.floor(Math.random() * 20)
  let rndm8 = Math.floor(Math.random() * 100)
  let rndm9 = Math.floor(Math.random() * 100)

  // Kalikan 10 untuk hasil akhir
  let hmsil1 = rndm1 * 10
  let hmsil2 = rndm2 * 10
  let hmsil3 = rndm3 * 10
  let hmsil4 = rndm4 * 10
  let hmsil5 = rndm5 * 10
  let hmsil6 = rndm6 * 10
  let hmsil7 = rndm7 * 10
  let hmsil8 = rndm8 * 10
  let hmsil9 = rndm9 * 10

  // Animasi pesan bertahap
  let jln = `
⬛⬛⬛⬛⬛⬛⬛⬛🚶⬛
⬛⬜⬜⬜⬛⬜⬜⬜⬛⬛
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🏘️🏘️🏘️🏘️🌳🌳🏘️ 🌳🌳🌳

✔️ ${pengocok} Mencari Target....
`
  let jln2 = `
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬜⬜⬜⬛⬜⬜⬜⬛🚶
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🏘️🏘️🏘️🏘️🌳🌳🏘️ 🌳🌳🌳

➕ ${pengocok} Menemukan Target....
`
  let jln3 = `
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬜⬜⬛⬛⬜⬜⬜⬛⬛
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🏘️🏘️🏘️🏘️🌳🌳🏘️ 🌳🌳🚶

➕ ${pengocok} Mulai Mengocok Bersama Target....
`
  let jln4 = `
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬜⬜⬛⬛⬜⬜⬜⬛⬛
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🏘️🏘️🏘️🏘️🌳🌳🏘️ 🚶

➕ ${pengocok}
💹 Menerima Gaji Ngocok....
`

  let hsl = `
*《 Hasil Ngocok ${pengocok} 》*

 *💎 = [ ${hmsil1} ] Diamond*
 *⛓️ = [ ${hmsil2} ] Iron*
 *🪙 = [ ${hmsil3} ] Gold*
 *💚 = [ ${hmsil4} ] Emerald*
 *🪨 = [ ${hmsil5} ] Rock*
 *🌕 = [ ${hmsil6} ] Clay*
 *🕳️ = [ ${hmsil7} ] Coal*
 *🌑 = [ ${hmsil8} ] Sand*
 *✉️ = [ ${hmsil9} ] Exp*
 
Stamina anda berkurang -20
*Korban Ngocok:* ${toM(a)}
`

  // Update data user
  user.diamond += hmsil1
  user.iron += hmsil2
  user.gold += hmsil3
  user.emerald += hmsil4
  user.rock += hmsil5
  user.clay += hmsil6
  user.coal += hmsil7
  user.sand += hmsil8
  user.exp += hmsil9
  user.stamina -= 20
  user.lastngocok = Date.now()

  setTimeout(() => conn.reply(m.chat, hsl, m, { mentions: conn.parseMention(hsl) }), 27000)
  setTimeout(() => conn.reply(m.chat, jln4, m), 25000)
  setTimeout(() => conn.reply(m.chat, jln3, m), 20000)
  setTimeout(() => conn.reply(m.chat, jln2, m), 15000)
  setTimeout(() => conn.reply(m.chat, jln, m), 10000)
  setTimeout(() => conn.reply(m.chat, `🔍 ${pengocok} Mencari Area ngocok.....`, m), 0)
}

handler.help = ['ngocok']
handler.tags = ['rpg']
handler.command = /^(ngocok|mengocok)$/i
handler.group = true

export default handler

function clockString(ms) {
  if (isNaN(ms)) return '-- *Days* -- *Hours* -- *Minutes* -- *Seconds*'
  let d = Math.floor(ms / 86400000)
  let h = Math.floor(ms / 3600000) % 24
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return `\n${d} *Days ☀️*\n${h} *Hours 🕐*\n${m} *Minute ⏰*\n${s} *Second ⏱️*`
}