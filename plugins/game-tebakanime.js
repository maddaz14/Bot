import fetch from 'node-fetch'
import similarity from 'similarity'

let timeout = 120000
let poin = 500
const threshold = 0.72

let handler = async (m, { conn, usedPrefix, command }) => {
    conn.tebakanime = conn.tebakanime ? conn.tebakanime : {}
    let id = m.chat
    if (id in conn.tebakanime) {
        conn.reply(m.chat, '❗Masih Ada Soal Yang Belum Terjawab', conn.tebakanime[id][0])
        throw false
    }
    let src = await (await fetch('https://raw.githubusercontent.com/unx21/ngetezz/main/src/data/nyenyenye.json')).json()
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
🕑Waktu *${(timeout / 1000).toFixed(2)} Detik*
Ketik ${usedPrefix}wa Untuk Bantuan
💥Bonus: ${poin} XP
`.trim()
    conn.tebakanime[id] = [
        await conn.sendFile(m.chat, json.img, 'anu.jpg', caption, m, false),
        json, poin,
        setTimeout(async () => {
            if (conn.tebakanime[id]) await conn.reply(m.chat, `❗Waktu Habis!\nJawabannya Adalah *${json.jawaban}*`, conn.tebakanime[id][0])
            delete conn.tebakanime[id]
        }, timeout)
    ]
}

handler.help = ['tebakanime']
handler.tags = ['game']
handler.command = /^tebakanime$/i

handler.before = async function (m, { conn }) {
    let id = m.chat
    if (!m.text) return
    this.tebakanime = this.tebakanime || {}
    if (!(id in this.tebakanime)) return

    let kuis = this.tebakanime[id]
    
    // Periksa apakah pengguna menyerah
    let isSurrender = /^(me)?nyerah|surr?ender$/i.test(m.text)
    if (isSurrender) {
        clearTimeout(kuis[3])
        delete this.tebakanime[id]
        return m.reply('*Yah, menyerah :( !*')
    }

    let json = kuis[1]
    
    // Cek apakah jawaban pengguna benar
    if (m.text.toLowerCase().trim() === json.jawaban.toLowerCase().trim()) {
        global.db.data.users[m.sender].exp += kuis[2]
        global.db.data.users[m.sender].limit += 2
        conn.reply(m.chat, `✅ *Benar!*\n🎉 +${kuis[2]} XP\n🎁 +2 Limit`, m)
        clearTimeout(kuis[3])
        delete this.tebakanime[id]
    } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) {
        m.reply(`*Dikit lagi!*`)
    } else {
        m.reply(`*Salah!*`)
    }
}

export default handler