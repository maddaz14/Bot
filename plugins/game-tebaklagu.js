import fetch from 'node-fetch'
import similarity from 'similarity'

let timeout = 120000
let poin = 4999
const threshold = 0.72

let handler = async (m, { conn, command, usedPrefix }) => {
    conn.game = conn.game ? conn.game : {}
    let id = 'tebaklagu-' + m.chat
    if (id in conn.game) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.game[id][0])
    let ress = await fetch('https://raw.githubusercontent.com/qisyana/scrape/main/tebaklagu.json')
    let data = await ress.json()
    let json = data[Math.floor(Math.random() * data.length)]
    
    let caption = `
Artist: ${json.artis}

🕑Timeout *${(timeout / 1000).toFixed(2)} detik*

💥Bonus: ${poin} XP
Ketik ${usedPrefix}hlagu untuk bantuan
`.trim()
    conn.game[id] = [
        await m.reply(caption),
        json, poin,
        setTimeout(() => {
            if (conn.game[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.judul}*`, conn.game[id][0])
            delete conn.game[id]
        }, timeout)
    ]
    await conn.sendFile(m.chat, json.lagu, 'tebaklagu.mp3', '', conn.game[id][0])
}

handler.help = ['tebaklagu']
handler.tags = ['game']
handler.command = /^tebaklagu$/i
handler.onlyprem = true
handler.game = true

handler.before = async function (m, { conn }) {
    let id = 'tebaklagu-' + m.chat
    if (!m.text) return
    this.game = this.game || {}
    if (!(id in this.game)) return

    let kuis = this.game[id]
    
    // Periksa apakah pengguna menyerah
    let isSurrender = /^(me)?nyerah|surr?ender$/i.test(m.text)
    if (isSurrender) {
        clearTimeout(kuis[3])
        delete this.game[id]
        return m.reply('*Yah, menyerah :( !*')
    }

    let json = kuis[1]
    
    // Cek apakah jawaban pengguna benar
    if (m.text.toLowerCase().trim() === json.judul.toLowerCase().trim()) {
        global.db.data.users[m.sender].exp += kuis[2]
        global.db.data.users[m.sender].limit += 2
        conn.reply(m.chat, `✅ *Benar!*\n🎉 +${kuis[2]} XP\n🎁 +2 Limit`, m)
        clearTimeout(kuis[3])
        delete this.game[id]
    } else if (similarity(m.text.toLowerCase(), json.judul.toLowerCase().trim()) >= threshold) {
        m.reply(`*Dikit lagi!*`)
    } else {
        m.reply(`*Salah!*`)
    }
}

export default handler