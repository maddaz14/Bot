/*
wa.me/6282285357346
github: https://github.com/sadxzyq
Instagram: https://instagram.com/tulisan.ku.id
ini wm gw cok jan di hapus
*/

let handler = async (m, { conn, usedPrefix }) => {
    let user = global.db.data.users[m.sender]
    let name = await conn.getName(m.sender)
    let __timers = new Date() - user.lastroket
    let _timers = 600000 - __timers // 10 menit = 600000 ms
    let timers = clockString(_timers)

    if (user.stamina < 20) return m.reply(`⚠️ Stamina kamu tidak cukup!\nSilakan isi stamina dengan perintah *${usedPrefix}eat8*`)

    if (__timers < 600000) return m.reply(`🕐 Kamu masih kelelahan!\nHarap tunggu *${timers}* sebelum bisa roket lagi.`)

    // Random hasil
    let ngrk1 = Math.floor(Math.random() * 10) * 2
    let ngrk2 = Math.floor(Math.random() * 10) * 10
    let ngrk3 = Math.floor(Math.random() * 10) * 1
    let ngrk4 = Math.floor(Math.random() * 5) * 15729
    let ngrk5 = Math.floor(Math.random() * 10) * 120

    // Animasi
    let rokit1 = `🔍 ${name} sedang mencari lokasi peluncuran...`
    let rokit2 = `🚀 Memulai peluncuran roket...`
    let rokit3 = `🚀 Dalam perjalanan...`
    let rokit4 = `🚀 Hampir sampai...`
    let rokit5 = `✅ Sukses mendarat di bulan! 👨‍🚀`

    // Hasil
    let result = `
*—[ Hasil Ngroket ${name} ]—*
➕ 💹 Uang: +${ngrk4}
➕ ✨ Exp: +${ngrk5}
➕ 📥 Total Pendaratan: ${user.roket + 1}
`

    // Update data
    user.money += ngrk4
    user.exp += ngrk5
    user.roket += 1
    user.lastroket = new Date() * 1

    // Kirim animasi berurutan
    setTimeout(() => conn.reply(m.chat, result, null), 27000)
    setTimeout(() => conn.reply(m.chat, rokit5, null), 25000)
    setTimeout(() => conn.reply(m.chat, rokit4, null), 20000)
    setTimeout(() => conn.reply(m.chat, rokit3, null), 15000)
    setTimeout(() => conn.reply(m.chat, rokit2, null), 10000)
    setTimeout(() => conn.reply(m.chat, rokit1, null), 0)
}

handler.help = ['roket']
handler.tags = ['rpg']
handler.command = /^(roket|ngroket|groket|jadiroket)$/i
handler.register = true
handler.group = true

export default handler

function clockString(ms) {
  let d = Math.floor(ms / 86400000)
  let h = Math.floor(ms / 3600000) % 24
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return `${d} Hari, ${h} Jam, ${m} Menit, ${s} Detik`
}