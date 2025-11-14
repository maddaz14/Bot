import fetch from 'node-fetch'
import similarity from 'similarity'

let timeout = 120000
let poin = 4999
const threshold = 0.72

let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebaklogo = conn.tebaklogo ? conn.tebaklogo : {}
    let id = m.chat
    if (id in conn.tebaklogo) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebaklogo[id][0])
        throw false
    }
    let res = await fetch(`https://raw.githubusercontent.com/orderku/db/main/dbbot/game/tebakapp.json`)
    let src = await res.json()
    let Apps = src[Math.floor(Math.random() * src.length)]
    let json = {
        hasil: Apps
    }
    let caption = `*${command.toUpperCase()}*
Logo apakah ini?

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}hlog untuk hint
Bonus: ${poin} XP
    `.trim()
    conn.tebaklogo[id] = [
        await conn.sendFile(m.chat, json.hasil.data.image, '', caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tebaklogo[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.hasil.data.jawaban}*`, conn.tebaklogo[id][0])
            delete conn.tebaklogo[id]
        }, timeout)
    ]
}

handler.help = ['tebaklogo']
handler.tags = ['game']
handler.command = /^tebaklogo/i

handler.before = async function (m, { conn }) {
    let id = m.chat
    if (!m.text) return
    this.tebaklogo = this.tebaklogo || {}
    if (!(id in this.tebaklogo)) return

    let kuis = this.tebaklogo[id]
    
    // Periksa apakah pengguna menyerah
    let isSurrender = /^(me)?nyerah|surr?ender$/i.test(m.text)
    if (isSurrender) {
        clearTimeout(kuis[3])
        delete this.tebaklogo[id]
        return m.reply('*Yah, menyerah :( !*')
    }

    let json = kuis[1]
    
    // Cek apakah jawaban pengguna benar
    if (m.text.toLowerCase().trim() === json.hasil.data.jawaban.toLowerCase().trim()) {
        global.db.data.users[m.sender].exp += kuis[2]
        global.db.data.users[m.sender].limit += 2
        conn.reply(m.chat, `✅ *Benar!*\n🎉 +${kuis[2]} XP\n🎁 +2 Limit`, m)
        clearTimeout(kuis[3])
        delete conn.tebaklogo[id]
    } else if (similarity(m.text.toLowerCase(), json.hasil.data.jawaban.toLowerCase().trim()) >= threshold) {
        m.reply(`*Dikit lagi!*`)
    } else {
        m.reply(`*Salah!*`)
    }
}

export default handler