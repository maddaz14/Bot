let handler = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan nomor/tag dan jumlah Eris yang akan dikurangi.\n\nContoh:\n.remmoney 628xxxxxx 10\n.remmoney @tag 10'

    let who
    let args = text.trim().split(/\s+/)
    let phoneRegex = /^\+?\d+$/

    // Tentukan target user
    if (m.isGroup) {
        if (m.mentionedJid?.length) {
            who = m.mentionedJid[0]
        } else if (phoneRegex.test(args[0])) {
            who = args[0].replace(/\D/g, '') + '@s.whatsapp.net'
        }
    } else {
        if (phoneRegex.test(args[0])) {
            who = args[0].replace(/\D/g, '') + '@s.whatsapp.net'
        } else {
            who = m.chat
        }
    }

    if (!who) throw 'Tag salah satu atau masukkan nomor telepon yang valid.'

    // Ambil jumlah Eris
    let jumlahEris = args[1] ? parseInt(args[1]) : null
    if (!jumlahEris || isNaN(jumlahEris)) throw 'Jumlah Eris harus berupa angka.'
    if (jumlahEris < 1) throw 'Minimal 1 Eris.'

    let users = global.db.data.users
    if (!users[who]) throw 'User tidak ditemukan di database.'

    users[who].eris -= jumlahEris
    if (users[who].eris < 0) users[who].eris = 0 // biar gak minus

    await conn.sendMessage(m.chat, {
        text: `Maaf Kak @${who.split('@')[0]}, Eris kamu dikurangi oleh Owner sebanyak -${jumlahEris} Eris!`,
        mentions: [who]
    }, { quoted: m })
}

handler.help = ['remmoney @user <jumlah>']
handler.tags = ['owner']
handler.command = /^remmoney$/i
handler.owner = true

export default handler