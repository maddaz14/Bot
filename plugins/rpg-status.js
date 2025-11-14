let handler = async (m) => {
    let who
    let user = global.db.data.users[m.sender]
    let title2 = global.db.data.users[m.sender].title2
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    else who = m.sender
    if (typeof db.data.users[who] == 'undefined') throw 'Pengguna tidak ada didalam data base'
    m.reply(`\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r乂 *S T A T U S* 乂\n\n ∘  👑 *User*:  ${user.registered ? user.name : conn.getName(m.sender)}\n ∘  💰 *Money*: ${global.db.data.users[who].money}\n ∘  🔖 *Limit*: ${global.db.data.users[who].limit}\n ∘  🧪 *Exp*: ${global.db.data.users[who].exp}\n ∘  🪙 *Balance*: ${global.db.data.users[who].balance}\n ∘  📊 *Level*:  ${user.level}\n ∘  🎗️ *Role*: ${user.role}\n ∘  🏷️ *Title*: ${title2 || 'Noob'}\n ∘  ❤️ *Darah*: ${global.db.data.users[who].health}/500\n ∘  💧 *Stamina*: ${global.db.data.users[who].stamina}/100`)
}
handler.help = ['status'].map(v => v + ' <@user>')
handler.tags = ['rpg']
handler.command = /^(status|stats)$/i
export default handler