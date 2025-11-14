let handler = async (m, { conn, text, command }) => {
    // ambil target dari tag, balasan, atau input manual
    let who = m.mentionedJid?.[0] || m.quoted?.sender || text?.trim()

    if (!who) throw `❗ Gunakan dengan tag / reply / nomor / jid / lid.\n\nContoh:\n.addmods @user\n.addmods 6285xxxxxx`

    // normalisasi nomor/jid/lid
    if (!who.includes('@')) {
        if (/^lid_/.test(who)) {
            // langsung LID, biarin
        } else if (/^\d+$/.test(who)) {
            who = who + '@s.whatsapp.net'
        }
    }

    let userId = who
    let users = global.db.data.users
    if (!users[userId]) users[userId] = {}
    let user = users[userId]

    if (/^(add|tambah|\+)mods$/i.test(command)) {
        if (user.moderatorV2) throw 'Dia sudah menjadi Moderator!'
        user.moderatorV2 = true
        conn.reply(m.chat, `✅ @${userId.split('@')[0]} sekarang Moderator!`, m, {
            contextInfo: { mentionedJid: [userId] }
        })
    } else if (/^(del|hapus|-)mods$/i.test(command)) {
        if (!user.moderatorV2) throw 'Dia bukan Moderator!'
        user.moderatorV2 = false
        conn.reply(m.chat, `❌ @${userId.split('@')[0]} bukan Moderator lagi!`, m, {
            contextInfo: { mentionedJid: [userId] }
        })
    } else {
        throw 'Perintah tidak dikenali!'
    }
}

handler.help = ['addmods', 'delmods']
handler.tags = ['owner']
handler.command = /^(add|tambah|\+|del|hapus|-)mods$/i
handler.owner = true

export default handler