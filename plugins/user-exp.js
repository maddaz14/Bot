let handler = async (m) => {
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    else who = m.sender
    if (typeof db.data.users[who] == 'undefined') throw 'Pengguna tidak ada didalam data base'
    m.reply(`🔰 Your EXP ${global.db.data.users[who].exp}`)
}
handler.help = ['exp']
handler.tags = ['user']
handler.command = /^(exp|cekexp)$/i
export default handler