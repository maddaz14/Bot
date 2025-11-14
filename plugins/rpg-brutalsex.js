let handler = async (m, { conn }) => {
    let __timers = (new Date - global.db.data.users[m.sender].lastmisi)
    let _timers = (1200000 - __timers) // Ubah nilai cooldown menjadi 20 menit (20 x 60 x 1000 milidetik)
    let order = global.db.data.users[m.sender].ojekk
    let timers = clockString(_timers)
    let name = conn.getName(m.sender)
    let user = global.db.data.users[m.sender]
    let id = m.sender
    let kerja = 'brutal-sex'
    conn.misi = conn.misi ? conn.misi : {}
    if (id in conn.misi) {
        conn.reply(m.chat, `Selesaikan Misi ${conn.misi[id][0]} Terlebih Dahulu`, m)
        throw false
    }
    if (new Date - user.lastmisi > 1200000) { // Ubah nilai cooldown menjadi 20 menit (20 x 60 x 1000 milidetik)
        let randomaku1 = Math.floor(Math.random() * 500000)
        let randomaku2 = Math.floor(Math.random() * 3000)
        
        var dimas = `
👙 *Dia meremas tt kamu*
     *Kamu mulai colmek sampai becek*😋
`.trim()

        var dimas2 = `
🥵💦 *Dia mulai memasukan kontolnya.....*
`.trim()

        var dimas3 = `
🥵*Ahhhh, Sakitttt!! >////<*
 💦*Kencengin sayanggg ahhhh...*
  💦*Terus sayangg ahhh*
`.trim()

        var dimas4 = `
🥵💦💦*Ahhhhhh*😫
`.trim()

        var hsl = `
*—[ Hasil Brutal Sex ${name} ]—*
➕ 💹 Uang = [ Rp ${randomaku1} ]
➕ ✨ Exp = [ ${randomaku2} ]
➕ 😍 Order Selesai = +1
➕ 📥Total Order = ${order}
`.trim()

        user.money += randomaku1
        user.exp += randomaku2
        user.ojekk += 1
        
        conn.misi[id] = [
            kerja,
        setTimeout(() => {
            delete conn.misi[id]
        }, 27000)
        ]
        
        setTimeout(() => {
            m.reply(hsl)
        }, 27000)

        setTimeout(() => {
            m.reply(dimas4)
        }, 25000)

        setTimeout(() => {
            m.reply(dimas3)
        }, 20000)

        setTimeout(() => {
            m.reply(dimas2)
        }, 15000)

        setTimeout(() => {
            m.reply(dimas)
        }, 10000)

        setTimeout(() => {
            m.reply('😋mulai brutal sex..')
        }, 0)
        user.lastmisi = new Date * 1
    } else m.reply(`*Kamu sudah capek, silahkan senunggu selama ${timers}, Untuk Brutal sex kembali*`)
}
handler.help = ['brutalsex']
handler.tags = ['rpg']
handler.command = /^(brutalsex)$/i
handler.register = true
handler.group = true
handler.rpg = true
handler.premium = true
handler.energy = 50
export default handler


function clockString(ms) {
    let h = Math.floor(ms / 3600000)
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}