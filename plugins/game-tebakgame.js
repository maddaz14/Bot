import fetch from 'node-fetch'
import similarity from 'similarity'

let timeout = 120000
let poin = 4999
const threshold = 0.72

let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebakgames = conn.tebakgames ? conn.tebakgames : {}
    let id = m.chat
    if (id in conn.tebakgames) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakgames[id][0])
        throw false
    }
    let src = await (await fetch('https://raw.githubusercontent.com/qisyana/scrape/main/tebakgame.json')).json()
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `*${command.toUpperCase()}*
Logo apakah ini?

Timeout *${(timeout / 1000).toFixed(2)} detik*
gunakan ${usedPrefix}hgame untuk bantuan
Bonus: ${poin} XP
    `.trim()
    conn.tebakgames[id] = [
        await conn.sendFile(m.chat, json.img, null, caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tebakgames[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakgames[id][0])
            delete conn.tebakgames[id]
        }, timeout)
    ]
}

handler.help = ['tebakgame']
handler.tags = ['game']
handler.command = /^tebakgame/i

handler.before = async function (m, { conn }) {
    let id = m.chat
    if (!m.text) return
    this.tebakgames = this.tebakgames || {}
    if (!(id in this.tebakgames)) return

    let kuis = this.tebakgames[id]
    
    // Periksa apakah pengguna menyerah
    let isSurrender = /^(me)?nyerah|surr?ender$/i.test(m.text)
    if (isSurrender) {
        clearTimeout(kuis[3])
        delete this.tebakgames[id]
        return m.reply('*Yah, menyerah :( !*')
    }

    let json = kuis[1]
    
    // Cek apakah jawaban pengguna benar
    if (m.text.toLowerCase().trim() === json.jawaban.toLowerCase().trim()) {
        global.db.data.users[m.sender].exp += kuis[2]
        global.db.data.users[m.sender].limit += 2
        conn.reply(m.chat, `✅ *Benar!*\n🎉 +${kuis[2]} XP\n🎁 +2 Limit`, m)
        clearTimeout(kuis[3])
        delete conn.tebakgames[id]
    } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) {
        m.reply(`*Dikit lagi!*`)
    } else {
        m.reply(`*Salah!*`)
    }
}

export default handler