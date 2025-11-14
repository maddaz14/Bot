/*
wa.me/6282285357346
github: https://github.com/sadxzyq
Instagram: https://instagram.com/tulisan.ku.id
ini wm gw cok jan di hapus
*/

let handler = async (m, { conn, command, text, args, isOwner, isMods }) => {
    if (!isOwner && !isMods) throw '❌ Fitur ini hanya bisa digunakan oleh *Owner* atau *Moderator*!'

    if (!text) throw '⚠️ Masukkan nomor atau tag pengguna, lalu jumlah saldo bank yang ingin ditambahkan.\n\nContoh:\n.addbank @tag 5000\n.addbank 628xxxx 1000'

    let who
    if (m.isGroup) {
        who = m.mentionedJid[0] ? m.mentionedJid[0] : (args[0].includes('@') ? args[0] : args[0] + '@s.whatsapp.net')
    } else {
        who = m.sender
    }

    let users = global.db.data.users
    let jumlah = parseInt(args[1]) || 1000

    if (isNaN(jumlah) || jumlah <= 0) throw '⚠️ Jumlah tidak valid! Harus berupa angka lebih dari 0.'

    if (!users[who]) throw '⚠️ Pengguna tidak ditemukan dalam database!'

    users[who].bank += jumlah
    conn.reply(m.chat, `✅ Berhasil menambahkan *${jumlah} bank saldo* untuk @${who.split('@')[0]}`, m, { mentions: [who] })
}

handler.help = ['addbank']
handler.tags = ['owner']
handler.command = /^addbank$/i
handler.premium = false

export default handler