let handler = async (m) => {
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    else who = m.sender
    if (typeof db.data.users[who] == 'undefined') throw 'Pengguna tidak ada didalam data base'
    m.reply(`🩸 Your Health ${global.db.data.users[who].health.toLocaleString()}`)
}
handler.help = ['darah']
handler.tags = ['user']
handler.command = /^(darah|cekdarah)$/i
export default handler