import fetch from 'node-fetch'
import similarity from 'similarity'

let timeout = 120000
let poin = 4999
const threshold = 0.72

let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebakkimia = conn.tebakkimia ? conn.tebakkimia : {}
    let id = m.chat
    if (id in conn.tebakkimia) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkimia[id][0])
        throw false
    }
    let src = await (await fetch('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkimia.json')).json()
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `*${command.toUpperCase()}*
Unsur kimia : *[ ${json.lambang} ]*

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}hkim untuk bantuan
Bonus: ${poin} XP
    `.trim()
    conn.tebakkimia[id] = [
        await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tebakkimia[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.unsur}* *[ ${json.lambang} ]*`, conn.tebakkimia[id][0])
            delete conn.tebakkimia[id]
        }, timeout)
    ]
}

handler.help = ['tebakkimia']
handler.tags = ['game']
handler.command = /^tebakkimia/i

handler.before = async function (m, { conn }) {
    let id = m.chat
    if (!m.text) return
    this.tebakkimia = this.tebakkimia || {}
    if (!(id in this.tebakkimia)) return

    let kuis = this.tebakkimia[id]
    
    // Periksa apakah pengguna menyerah
    let isSurrender = /^(me)?nyerah|surr?ender$/i.test(m.text)
    if (isSurrender) {
        clearTimeout(kuis[3])
        delete this.tebakkimia[id]
        return m.reply('*Yah, menyerah :( !*')
    }

    let json = kuis[1]
    
    // Cek apakah jawaban pengguna benar
    if (m.text.toLowerCase().trim() === json.unsur.toLowerCase().trim()) {
        global.db.data.users[m.sender].exp += kuis[2]
        global.db.data.users[m.sender].limit += 2
        conn.reply(m.chat, `✅ *Benar!*\n🎉 +${kuis[2]} XP\n🎁 +2 Limit`, m)
        clearTimeout(kuis[3])
        delete conn.tebakkimia[id]
    } else if (similarity(m.text.toLowerCase(), json.unsur.toLowerCase().trim()) >= threshold) {
        m.reply(`*Dikit lagi!*`)
    } else {
        m.reply(`*Salah!*`)
    }
}

export default handler