let linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i

const durasiSewa = {
    sewa1hari: 1,
    sewa5hari: 5,
    sewa7hari: 7,
    sewa2minggu: 14,
    sewa1bulan: 30,
    sewa2bulan: 60,
}

let handler = async (m, { conn, args, command }) => {
    const hari = durasiSewa[command.toLowerCase()]
    if (!hari) return m.reply('❌ Durasi sewa tidak dikenal.')

    const jumlahHari = 86400000 * hari
    const now = Date.now()
    let targetJid

    // Deteksi target dari argumen
    if (args[0]) {
        if (linkRegex.test(args[0])) {
            const link = args[0].match(linkRegex)
            if (!link) throw '❌ Link grup tidak valid!'
            const code = link[1]
            targetJid = await conn.groupAcceptInvite(code)
        } else if (args[0].endsWith('@g.us')) {
            targetJid = args[0]
        } else {
            throw '⚠️ Format tidak dikenal. Gunakan link grup atau ID grup yang valid.'
        }
    } else if (m.isGroup) {
        targetJid = m.chat
    } else {
        throw `⚠️ Di luar grup wajib sertakan link atau ID grup.\nContoh:\n.${command} 120363xxxxxx@g.us`
    }

    // Inisialisasi data
    if (!global.db.data.chats[targetJid]) global.db.data.chats[targetJid] = {}
    if (!global.db.data.chats[targetJid].expired) global.db.data.chats[targetJid].expired = 0

    // Tambah waktu
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

    m.reply(`✅ Grup *${metadata.subject}*\n🆔 ID: ${targetJid}\n🕒 Disewa selama *${hari} hari*\n⏳ Sisa waktu: ${remaining}`)
}

handler.command = /^(sewa1hari|sewa5hari|sewa7hari|sewa2minggu|sewa1bulan|sewa2bulan)$/i
handler.tags = ['owner']
handler.owner = true

export default handler

function msToDate(ms) {
    let d = Math.floor(ms / (24 * 60 * 60 * 1000))
    let h = Math.floor(ms % (24 * 60 * 60 * 1000) / (60 * 60 * 1000))
    let m = Math.floor(ms % (60 * 60 * 1000) / (60 * 1000))
    return `${d} Hari ${h} Jam ${m} Menit`
}