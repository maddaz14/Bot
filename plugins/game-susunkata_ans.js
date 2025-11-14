import similarity from 'similarity'
const threshold = 0.72

let handler = async (m, { conn, args }) => {
    conn.susunkata = conn.susunkata ? conn.susunkata : {}
    let id = m.chat
    if (!(id in conn.susunkata)) {
        return m.reply('*Tidak ada soal Susun Kata aktif di chat ini!*')
    }

    if (!args[0]) return m.reply('Format salah!\nGunakan: *.susun <jawaban>*')

    let json = conn.susunkata[id][1]
    let jawabanUser = args.join(' ').toLowerCase().trim()

    if (jawabanUser === json.jawaban.toLowerCase().trim()) {
        global.db.data.users[m.sender].eris += conn.susunkata[id][2]
        global.db.data.users[m.sender].limit += 1
        global.db.data.users[m.sender].balance += 15
        m.reply(`*🎉 Benar!*\n\n+${conn.susunkata[id][2]} Money\n+1 Limit\n+15 Balance`)
        clearTimeout(conn.susunkata[id][3])
        delete conn.susunkata[id]
    } else if (similarity(jawabanUser, json.jawaban.toLowerCase().trim()) >= threshold) {
        m.reply('*Dikit Lagi!*')
    } else {
        m.reply('*Salah!*')
    }
}

handler.help = ['susun <jawaban>']
handler.tags = ['game']
handler.command = /^susun$/i
handler.group = true

export default handler