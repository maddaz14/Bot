import fs from 'fs'
import moment from 'moment-timezone'

let handler = async (m, { conn }) => {
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered === true).length
    let name = conn.getName(m.sender)

    let txt = `
┌──⭓ 👥 *USER DATABASE*
│
│📛 *Nama:* ${name}
│🌐 *Total Pengguna:* ${totalreg.toLocaleString()} user
│✅ *Sudah Register:* ${rtotalreg.toLocaleString()} user
│🕒 *Waktu:* ${moment().tz('Asia/Jakarta').format('HH:mm:ss - dddd, DD MMMM YYYY')}
│
└──────⭓
`.trim()

    await m.reply(txt)
}

handler.help = ['user', 'pengguna']
handler.tags = ['main']
handler.command = /^(pengguna|(jumlah)?database|user)$/i

export default handler