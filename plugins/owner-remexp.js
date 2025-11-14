let handler = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan jumlah Exp yang akan dikurangi.\n\nContoh:\n.remexp @tag 10'

    let who
    if (m.isGroup) {
        if (m.mentionedJid?.length) {
            who = m.mentionedJid[0]
        }
    } else {
        who = m.chat
    }

    if (!who) throw 'Tag salah satu pengguna atau gunakan di chat pribadi.'

    // Ambil angka dari input (hapus mention jika ada)
    let jumlahExp = text.replace('@' + who.split('@')[0], '').trim()

    if (!jumlahExp || isNaN(jumlahExp)) throw 'Jumlah EXP harus berupa angka.'
    let poin = parseInt(jumlahExp)
    if (poin < 1) throw 'Minimal 1 EXP.'

    let users = global.db.data.users
    if (!users[who]) throw 'Pengguna tidak ditemukan di database.'

    users[who].exp -= poin
    if (users[who].exp < 0) users[who].exp = 0 // biar ga minus

    await conn.sendMessage(m.chat, {
        text: `Maaf Kak @${who.split('@')[0]}, EXP kamu dikurangi oleh Owner sebanyak -${poin} EXP!`,
        mentions: [who]
    }, { quoted: m })
}

handler.help = ['remexp @user <jumlah>']
handler.tags = ['owner']
handler.command = /^remexp$/i
handler.owner = true

export default handler