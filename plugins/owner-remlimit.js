let handler = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan nomor/tag dan jumlah limit yang akan dikurangi.\n\nContoh:\n.remlimit 6283857182374 10\n.remlimit @tag 10'
    
    let who
    let args = text.trim().split(/\s+/)

    // Tentukan target user
    if (m.isGroup) {
        if (m.mentionedJid?.length) {
            who = m.mentionedJid[0] // dari tag
        } else if (/^\d+$/.test(args[0])) {
            who = args[0] + '@s.whatsapp.net' // dari nomor
        }
    } else {
        if (/^\d+$/.test(args[0])) {
            who = args[0] + '@s.whatsapp.net'
        } else {
            who = m.chat // chat pribadi
        }
    }

    if (!who) throw 'Masukkan tag atau nomor yang valid.'

    // Ambil jumlah limit dari argumen kedua
    let jumlahLimit = args[1] ? parseInt(args[1]) : null

    if (!jumlahLimit || isNaN(jumlahLimit)) throw 'Jumlah limit harus berupa angka.\n\nContoh:\n.remlimit 6283857182374 10\n.remlimit @tag 10'
    if (jumlahLimit < 1) throw 'Jumlah limit minimal 1.'

    let users = global.db.data.users

    if (!users[who]) throw 'Pengguna tidak ditemukan dalam database.'
    
    users[who].limit -= jumlahLimit
    if (users[who].limit < 0) users[who].limit = 0 // biar gak minus

    // Kirim konfirmasi
    await conn.sendMessage(m.chat, {
        text: `Maaf Kak @${who.split('@')[0]}, limit kamu telah dikurangi sebanyak -${jumlahLimit} LIMIT oleh owner.`,
        mentions: [who]
    }, { quoted: m })
}

handler.help = ['remlimit @user|number <jumlah>']
handler.tags = ['owner']
handler.command = /^remlimit$/i
handler.owner = true

export default handler