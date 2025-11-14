let handler = async (m, { conn, text }) => {
    if (!text) throw 'Yang Mau Di Suspand Siapa?'
    let who
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat
    if (!who) throw 'Tag??'
    let users = global.db.data.users
    users[who].banned = true
    conn.reply(m.chat, 'Kamu Telah Di Suspand Oleh Moderator', m)
}
handler.help = ['suspand']
handler.tags = ['owner']
handler.command = /^suspand(user)?$/i
handler.mods = true

export default handler