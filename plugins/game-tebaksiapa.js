import fetch from 'node-fetch'
import similarity from 'similarity'

let timeout = 120000
let poin = 4999
const threshold = 0.72

let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebaksiapa = conn.tebaksiapa ? conn.tebaksiapa : {}
    let id = m.chat
    if (id in conn.tebaksiapa) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebaksiapa[id][0])
        throw false
    }
    let src = await (await fetch('https://raw.githubusercontent.com/BochilTeam/database/master/games/siapakahaku.json')).json()
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `*${command.toUpperCase()}*
${json.soal}

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}hsia untuk bantuan
Ketik ${usedPrefix}nyerah untuk nyerah
Bonus: ${poin} XP
`.trim()
    conn.tebaksiapa[id] = [
        await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tebaksiapa[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebaksiapa[id][0])
            delete conn.tebaksiapa[id]
        }, timeout)
    ]
}

handler.help = ['tebaksiapa']
handler.tags = ['game']
handler.command = /^tebaksiapa/i

handler.before = async function (m, { conn }) {
    let id = m.chat
    if (!m.text) return
    this.tebaksiapa = this.tebaksiapa || {}
    if (!(id in this.tebaksiapa)) return

    let kuis = this.tebaksiapa[id]
    
    // Periksa apakah pengguna menyerah
    let isSurrender = /^(me)?nyerah|surr?ender$/i.test(m.text)
    if (isSurrender) {
        clearTimeout(kuis[3])
        delete this.tebaksiapa[id]
        return m.reply('*Yah, menyerah :( !*')
    }

    let json = kuis[1]
    
    // Cek apakah jawaban pengguna benar
    if (m.text.toLowerCase().trim() === json.jawaban.toLowerCase().trim()) {
        global.db.data.users[m.sender].exp += kuis[2]
        global.db.data.users[m.sender].limit += 2
        conn.reply(m.chat, `✅ *Benar!*\n🎉 +${kuis[2]} XP\n🎁 +2 Limit`, m)
        clearTimeout(kuis[3])
        delete conn.tebaksiapa[id]
    } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) {
        m.reply(`*Dikit lagi!*`)
    } else {
        m.reply(`*Salah!*`)
    }
}

export default handler