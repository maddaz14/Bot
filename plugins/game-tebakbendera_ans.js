import similarity from 'similarity'

const threshold = 0.72

let handler = async (m, { conn }) => {
    let id = m.chat
    conn.tebakbendera = conn.tebakbendera ? conn.tebakbendera : {}
    if (!(id in conn.tebakbendera)) {
        return m.reply('Tidak ada soal tebak bendera yang aktif di chat ini.')
    }

    let json = JSON.parse(JSON.stringify(conn.tebakbendera[id][1]))
    let jawaban = json.name.toLowerCase().trim()
    let userAns = m.text.toLowerCase().trim()

    if (userAns === jawaban) {
        global.db.data.users[m.sender].exp += conn.tebakbendera[id][2]
        m.reply(`*🎉 Benar!*\n+${conn.tebakbendera[id][2]} XP`)
        clearTimeout(conn.tebakbendera[id][3])
        delete conn.tebakbendera[id]
    } else if (similarity(userAns, jawaban) >= threshold) {
        m.reply('*Dikit Lagi!*')
    } else {
        m.reply('*Salah!*')
    }
}
handler.help = ['bendera <jawaban>']
handler.tags = ['game']
handler.command = /^bendera/i
handler.limit = false
handler.group = true

export default handler