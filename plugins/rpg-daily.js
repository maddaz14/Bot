let handler = async (m, { conn }) => {
  let __timers = (new Date - global.db.data.users[m.sender].lastclaim)
  let _timers = (43200000 - __timers)
  let timers = clockString(_timers)
  let user = global.db.data.users[m.sender]
  
  // Fungsi untuk mendapatkan angka acak dalam rentang tertentu
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Daftar reward tambahan yang akan dipilih secara acak dengan jumlah dinamis
  const randomRewards = [
    { item: 'Diamond', quantity: getRandomInt(5, 25) },  // Random antara 5 - 25
    { item: 'Apel', quantity: getRandomInt(60, 222) },  // Random antara 60 - 222
    { item: 'Gold Coin', quantity: getRandomInt(50, 300) },  // Random antara 50 - 300
    { item: 'Health Potion', quantity: 3 },  // Tetap 3
  ]

  // Pilih reward acak dari daftar
  let randomReward = randomRewards[Math.floor(Math.random() * randomRewards.length)]

  if (new Date - global.db.data.users[m.sender].lastclaim > 43200000) {
    conn.reply(m.chat, `🎉 *Selamat!* 🎉\n\nKamu berhasil mengambil hadiah harian dan mendapatkan:\n\n✨ *Money:* 100000\n🧪 *Potion:* 2\n🎁 *${randomReward.item}:* ${randomReward.quantity}\n\nJangan lupa klaim lagi besok!`, m)
    
    user.money += 100000
    user.potion += 2
    user.lastclaim = new Date * 1

    // Tambah reward acak ke user
    if (randomReward.item === 'Diamond') {
      user.diamond = (user.diamond || 0) + randomReward.quantity
    } else if (randomReward.item === 'Apel') {
      user.apel = (user.apel || 0) + randomReward.quantity
    } else if (randomReward.item === 'Gold Coin') {
      user.gold = (user.gold || 0) + randomReward.quantity
    } else if (randomReward.item === 'Health Potion') {
      user.potion += randomReward.quantity
    }
    
  } else {
    conn.reply(m.chat, `⏳ *Harap tunggu ${timers} lagi* untuk bisa klaim hadiah harian kamu.`, m)

    // Notifikasi ketika cooldown habis
    setTimeout(() => {
      conn.reply(m.chat, `⚡ *Yuk, ambil hadiah harianmu sekarang! Waktunya sudah habis!* ⚡`, m)
    }, 43200000)
  }
}

handler.help = ['daily']
handler.tags = ['rpg']
handler.command = /^(daily|claim)$/i
handler.group = true
handler.register = true
handler.fail = null

export default handler

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return ['\n' + d, ' *Hari*\n ', h, ' *Jam*\n ', m, ' *Menit*\n ', s, ' *Detik* '].map(v => v.toString().padStart(2, 0)).join('')
}