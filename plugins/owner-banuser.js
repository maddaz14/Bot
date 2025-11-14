let handler = async (m, { conn, text, args }) => {
    if (!text) throw 'Siapa yang ingin di-ban? Tag orangnya atau masukkan nomor ID (contoh: 628xxx)!\n\n# Untuk banned permanen\n- contoh: .ban @tag\n\nUntuk banned sementara\n- contoh: .ban @tag 1 hari'

    let who
    if (m.isGroup) {
        who = m.mentionedJid[0] || (text.includes('@') ? text.replace(/[@\s]/g, '') + '@s.whatsapp.net' : text.replace(/\D/g, '') + '@s.whatsapp.net')
    } else {
        who = text.includes('@') ? text.replace(/[@\s]/g, '') + '@s.whatsapp.net' : text.replace(/\D/g, '') + '@s.whatsapp.net'
    }

    if (!who) throw 'Nomor / ID atau tag tidak valid!'

    let users = global.db.data.users
    if (!users[who]) throw 'User tidak ditemukan dalam database!'

    let time = args.slice(1).join(' ').toLowerCase()
    let duration
    let value, unit

    if (time) {
        let match = time.match(/(\d+)\s*(jam|hari|minggu|bulan|tahun)/)
        if (!match) throw 'Gunakan format: <angka> jam/hari/minggu/bulan/tahun.\n- contoh: .ban @tag 30 hari'

        value = parseInt(match[1])
        unit = match[2]
    } else {
        // Default ban permanen = 999999999 hari
        value = 999999999
        unit = 'hari'
    }

    switch (unit) {
        case 'jam':
            duration = value * 60 * 60 * 1000
            break
        case 'hari':
            duration = value * 24 * 60 * 60 * 1000
            break
        case 'minggu':
            duration = value * 7 * 24 * 60 * 60 * 1000
            break
        case 'bulan':
            duration = value * 30 * 24 * 60 * 60 * 1000
            break
        case 'tahun':
            duration = value * 365 * 24 * 60 * 60 * 1000
            break
    }

    users[who].banned = true
    users[who].banExpires = Date.now() + duration

    let isPermanent = value >= 999999999
    conn.reply(m.chat, `User @${who.split('@')[0]} telah di-ban ${isPermanent ? 'secara permanen' : `selama ${value} ${unit}`}!`, m, {
        mentions: [who]
    })
}

handler.help = ['ban']
handler.tags = ['owner']
handler.command = /^ban(user)?$/i
handler.owner = true

export default handler