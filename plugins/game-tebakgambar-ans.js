import similarity from 'similarity'
const threshold = 0.72

let handler = async (m, { conn, text }) => {
    let id = m.chat
    conn.tebakingambar = conn.tebakingambar ? conn.tebakingambar : {}
    if (!(id in conn.tebakingambar)) 
        return conn.reply(m.chat, 'Tidak ada soal untuk dijawab!', m)
    if (!text) 
        return conn.reply(m.chat, 'Ketik jawabannya setelah perintah .itu\nContoh: *.itu kucing lucu*', m)
    
    let json = JSON.parse(JSON.stringify(conn.tebakingambar[id][1]))
    let jawaban = json.jawaban.toLowerCase().trim()
    let input = text.toLowerCase().trim()
    
    let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(input)
    if (isSurrender) {
        clearTimeout(conn.tebakingambar[id][3])
        delete conn.tebakingambar[id]
        return conn.reply(m.chat, '*Yah Menyerah :( !*', m)
    }

    if (input === jawaban) {
        global.db.data.users[m.sender].exp += conn.tebakingambar[id][2]
        conn.reply(m.chat, `✅ *Benar!*\n+${conn.tebakingambar[id][2]} XP`, m)
        clearTimeout(conn.tebakingambar[id][3])
        delete conn.tebakingambar[id]
    } else if (similarity(input, jawaban) >= threshold) {
        conn.reply(m.chat, `❗ *Dikit Lagi!*`, m)
    } else {
        conn.reply(m.chat, `❌ *Salah!*`, m)
    }
}

handler.help = ['itu <jawaban>']
handler.tags = ['game']
handler.command = /^itu$/i

export default handler
export const exp = 0