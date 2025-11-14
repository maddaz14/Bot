let handler = async (m, { conn, text, args }) => {
    if (!text) throw 'Tag seseorang yang ingin kamu tilang!\nContoh: .menilang @user'

    let who
    if (m.isGroup) {
        who = m.mentionedJid[0] || (text.includes('@') ? text.replace(/[@\s]/g, '') + '@s.whatsapp.net' : text.replace(/\D/g, '') + '@s.whatsapp.net')
    } else {
        who = text.includes('@') ? text.replace(/[@\s]/g, '') + '@s.whatsapp.net' : text.replace(/\D/g, '') + '@s.whatsapp.net'
    }

    if (!who) throw 'Nomor / ID atau tag tidak valid!'

    let users = global.db.data.users
    if (!users[who]) throw 'User tidak ditemukan dalam database!'

    users[who].banned = true
    users[who].banExpires = Date.now() + 30 * 1000 // 30 detik

    conn.reply(m.chat, `@${who.split('@')[0]} telah ditilang oleh owner dan tidak bisa menggunakan bot selama 30 detik.\n\n*Kamu di tilang paksa oleh owner*`, m, {
        mentions: [who]
    })

    setTimeout(() => {
        users[who].banned = false
        users[who].banExpires = null
    }, 30 * 1000)
}

handler.help = ['menilang @user']
handler.tags = ['owner']
handler.command = /^menilang$/i
handler.owner = true

export default handler