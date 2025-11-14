let handler = async (m, { conn, usedPrefix }) => {
  const COOLDOWN = 3600000 // 1 jam dalam ms
  const STAMINA_COST = 20
  const user = global.db.data.users[m.sender]
  const name = await conn.getName(m.sender)

  // Inisialisasi properti jika belum ada
  let props = ['diamond', 'iron', 'gold', 'emerald', 'rock', 'clay', 'coal', 'sand', 'exp', 'stamina', 'lastgrab']
  for (let p of props) if (!(p in user)) user[p] = 0

  let __timers = (new Date - user.lastgrab)
  let _timers = (COOLDOWN - __timers)
  let timers = clockString(_timers)

  if (user.stamina < STAMINA_COST) return m.reply(`Stamina Kamu Tidak Cukup\nHarap Isi Stamina Dengan *${usedPrefix}eat*`)
  if (__timers < COOLDOWN) return m.reply(`Kamu Masih Kelelahan\nHarap Tunggu ${timers} Lagi`)

  // Reward random
  let hasil = {
    diamond: Math.floor(Math.random() * 5) * 10,
    iron: Math.floor(Math.random() * 10) * 10,
    gold: Math.floor(Math.random() * 7) * 10,
    emerald: Math.floor(Math.random() * 4) * 10,
    rock: Math.floor(Math.random() * 200) * 10,
    clay: Math.floor(Math.random() * 200) * 10,
    coal: Math.floor(Math.random() * 20) * 10,
    sand: Math.floor(Math.random() * 100) * 10,
    exp: Math.floor(Math.random() * 100) * 10,
  }

  let animasi = [
    `${name} Mencari Area grab.....`,
    `
⬛⬛⬛⬛⬛⬛⬛⬛🚶⬛
⬛⬜⬜⬜⬛⬜⬜⬜⬛⬛
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🏘️🏘️🏘️🏘️🌳🌳🏘️ 🌳🌳🌳

${name} 
Mohon Tunggu....
    `,
    `
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬜⬜⬜⬛⬜⬜⬜⬛🚶
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🏘️🏘️🏘️🏘️🌳🌳🏘️ 🌳🌳🌳

${name} 
Menemukan Area....
    `,
    `
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬜⬜⬛⬛⬜⬜⬜⬛⬛
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🏘️🏘️🏘️🏘️🌳🌳🏘️ 🌳🌳🚶

${name} 
Mulai Grab......
    `,
    `
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬜⬜⬛⬛⬜⬜⬜⬛⬛
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🏘️🏘️🏘️🏘️🌳🌳🏘️ 🚶

${name}
Menerima Gaji....
    `
  ]

  // Kirim animasi berurutan
  for (let i = 0; i < animasi.length; i++) {
    setTimeout(() => {
      conn.reply(m.chat, animasi[i], m)
    }, i * 5000)
  }

  // Kirim hasil akhir setelah animasi selesai
  setTimeout(() => {
    let hasilText = `
*Hasil Dari Grab ${name}*

Diamond: ${hasil.diamond}
Iron: ${hasil.iron}
Gold: ${hasil.gold}
Emerald: ${hasil.emerald}
Rock: ${hasil.rock}
Clay: ${hasil.clay}
Coal: ${hasil.coal}
Sand: ${hasil.sand}
Exp: ${hasil.exp}
    
Stamina Kamu Berkurang -${STAMINA_COST}
    `.trim()
    
    // Tambahkan hasil ke data user
    for (let key in hasil) user[key] += hasil[key]
    user.stamina -= STAMINA_COST
    user.lastgrab = new Date * 1

    conn.reply(m.chat, hasilText, m)
  }, animasi.length * 5000)
}

handler.help = ['grab']
handler.tags = ['rpg']
handler.command = /^(taksi|taxy|grab|megrab)$/i

export default handler

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return ['\n' + d, ' *Hari*\n ', h, ' *Jam*\n ', m, ' *Menit*\n ', s, ' *Detik* '].map(v => v.toString().padStart(2, 0)).join('')
}