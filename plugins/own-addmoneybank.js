let handler = async (m, { conn, command, text, args, isOwner, isMods }) => {
    if (!isOwner && !isMods) throw 'Fitur ini hanya bisa digunakan oleh Owner atau Moderator!'
    
    if (!text) throw 'Format salah!\nContoh: .addmoneybank @user 1000'
    
    let who
    if (m.isGroup) {
        who = m.mentionedJid[0] 
            ? m.mentionedJid[0] 
            : (args[0].includes('@') ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : args[0] + '@s.whatsapp.net')
    } else {
        who = m.sender
    }

    let users = global.db.data.users
    let jum = args[1] ? parseInt(args[1]) : 1000
    
    if (!users[who]) throw 'User tidak ditemukan dalam database!'
    
    users[who].bank += jum
    conn.reply(m.chat, `Sukses menambahkan saldo bank sebesar ${jum} ke @${who.split('@')[0]}`, m, { mentions: [who] })
}

handler.help = ['addmoneybank']
handler.tags = ['owner']
handler.command = /^addmoneybank$/i
handler.premium = false

export default handler