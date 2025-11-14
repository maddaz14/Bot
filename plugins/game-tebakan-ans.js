import similarity from 'similarity'
const threshold = 0.72

let handler = async (m, { conn, args }) => {
    conn.tebaktebakan = conn.tebaktebakan ? conn.tebaktebakan : {}
    let id = m.chat

    if (!(id in conn.tebaktebakan)) {
        return m.reply('*Tidak ada soal Tebak-tebakan aktif di chat ini!*')
    }

    if (!args[0]) return m.reply('Format salah!\nGunakan: *.tebak <jawaban>*')

    let json = conn.tebaktebakan[id][1]
    let jawabanUser = args.join(' ').toLowerCase().trim()

    if (jawabanUser === json.jawaban.toLowerCase().trim()) {
        global.db.data.users[m.sender].exp += conn.tebaktebakan[id][2]
        m.reply(`*🎉 Benar!*\n\n+${conn.tebaktebakan[id][2]} XP`)
        clearTimeout(conn.tebaktebakan[id][3])
        delete conn.tebaktebakan[id]
    } else if (similarity(jawabanUser, json.jawaban.toLowerCase().trim()) >= threshold) {
        m.reply('*Dikit Lagi!*')
    } else {
        m.reply('*Salah!*')
    }
}

handler.help = ['tebak <jawaban>']
handler.tags = ['game']
handler.command = /^tebak$/i

export default handler