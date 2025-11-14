const timeout = 3600000

let handler = async (m, { conn, usedPrefix, text }) => {
  const tag = '@' + m.sender.split`@`[0]
  let aqua = global.db.data.users[m.sender].aqua
  let time = global.db.data.users[m.sender].lastnebang + 3600000
  
  if (aqua == 0) return m.reply(`*Pastikan kamu memiliki semua aqua*\nKetik :\n${usedPrefix}shop buy aqua 5`)
  
  if (new Date - global.db.data.users[m.sender].lastnebang < 3600000) throw `Anda sudah menebang\nMohon tunggu hasil tebangan mu\nTunggu selama ${msToTime(time - new Date())} lagi`
  
  if (global.db.data.users[m.sender].aqua > 9) {
    let kayus = `${Math.floor(Math.random() * 1000)}`.trim()
    let aquas = `${Math.floor(Math.random() * 10)}`.trim()
    let apels = Math.floor(Math.random() * (33 - 12 + 1)) + 12
    let strings = Math.floor(Math.random() * (12 - 2 + 1)) + 2

    global.db.data.users[m.sender].wood += kayus * 1
    global.db.data.users[m.sender].tiketcoin += 1
    global.db.data.users[m.sender].apple += apels
    global.db.data.users[m.sender].string += strings
    global.db.data.users[m.sender].aqua -= aquas * 1
    global.db.data.users[m.sender].lastnebang = new Date * 1
    
    conn.reply(m.chat, `Selamat ${tag} kamu mendapatkan:\n*🪵 = [ ${kayus} ] Kayu*\n*🍎 = [ ${apels} ] Apel*\n*🕸 = [ ${strings} ] String*\n*🎫 = [ 1 ] Tiketcoin*\n\nKamu sudah menghabiskan aqua\n-${aquas} Aqua`, floc)
    
    setTimeout(() => {
      conn.reply(m.chat, `Waktunya nebang pohon lagi kak 😅`, m)
    }, timeout)
  } else {
    m.reply(`Pastikan aqua kamu *10* untuk bisa nebang, Karena menguras tenaga`)
  }
}

handler.help = ['nebang']
handler.tags = ['rpg']
handler.command = /^(nebang)/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false
handler.register = true

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.limit = true
handler.exp = 0
handler.money = 0

export default handler;

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
    
  hours = (hours < 10) ? "0" + hours : hours
  minutes = (minutes < 10) ? "0" + minutes : minutes
  seconds = (seconds < 10) ? "0" + seconds : seconds

  return hours + " jam " + minutes + " menit " + seconds + " detik"
}