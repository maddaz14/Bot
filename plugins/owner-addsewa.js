let linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0] || isNaN(args[0])) {
        throw `Masukkan jumlah hari sewa!\nContoh:\n${usedPrefix + command} 3 https://chat.whatsapp.com/xxxx\n${usedPrefix + command} 3 120363xxxxxx@g.us`
    }

    let jumlahHari = 86400000 * parseInt(args[0])
    let now = Date.now()
    let targetJid

    if (args[1]) {
        if (linkRegex.test(args[1])) {
            let link = args[1].match(linkRegex)
            if (!link) throw 'Link grup tidak valid!'
            let code = link[1]
            targetJid = await conn.groupAcceptInvite(code)
        } else if (args[1].endsWith('@g.us')) {
            targetJid = args[1]
        } else {
            throw 'Format tidak dikenal. Gunakan link grup atau ID grup yang valid.'
        }
    } else if (m.isGroup) {
        targetJid = m.chat
    } else {
        throw `Jika bukan dalam grup, wajib sertakan link atau ID grup!\nContoh:\n${usedPrefix + command} 2 https://chat.whatsapp.com/xxxx`
    }

    if (!global.db.data.chats[targetJid]) global.db.data.chats[targetJid] = {}
    if (!global.db.data.chats[targetJid].expired) global.db.data.chats[targetJid].expired = 0

    if (now < global.db.data.chats[targetJid].expired) {
        global.db.data.chats[targetJid].expired += jumlahHari
    } else {
        global.db.data.chats[targetJid].expired = now + jumlahHari
    }

    global.db.data.chats[targetJid].rpgs = true
    global.db.data.chats[targetJid].games = true

    let remaining = msToDate(global.db.data.chats[targetJid].expired - now)
    let metadata
    try {
        metadata = await conn.groupMetadata(targetJid)
    } catch {
        metadata = { subject: 'Tidak diketahui' }
    }

    m.reply(`✅ Grup *${metadata.subject}*\nID: ${targetJid}\nBerhasil disewa selama ${args[0]} hari.\nSisa waktu: ${remaining}`)
}

handler.help = ['addsewa']
handler.tags = ['owner']
handler.command = /^addsewa$/i
handler.rowner = true

export default handler

function msToDate(ms) {
    let days = Math.floor(ms / (24 * 60 * 60 * 1000))
    let daysms = ms % (24 * 60 * 60 * 1000)
    let hours = Math.floor(daysms / (60 * 60 * 1000))
    let hoursms = ms % (60 * 60 * 1000)
    let minutes = Math.floor(hoursms / (60 * 1000))
    return `${days} Hari ${hours} Jam ${minutes} Menit`
}