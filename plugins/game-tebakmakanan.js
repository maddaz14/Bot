import fs from 'fs'
import similarity from 'similarity'

let timeout = 120000
let poin = 4999
const threshold = 0.72

let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakmakanan = conn.tebakmakanan ? conn.tebakmakanan: {}
    let id = m.chat
    if (id in conn.tebakmakanan) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakmakanan[id][0])
    let src = JSON.parse(fs.readFileSync('./assets/games/tebakmakanan.json', 'utf-8'))
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
${json.deskripsi}

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}teman untuk bantuan
Bonus: ${poin} XP
`.trim()
    conn.tebakmakanan[id] = [
        await conn.sendFile(m.chat, json.img, 'tebakmakanan.jpg', caption, m),
        json, poin, 3, // Kesempatan menjawab (mulai dari 3)
        setTimeout(() => {
            if (conn.tebakmakanan[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakmakanan[id][0])
            delete conn.tebakmakanan[id]
        }, timeout)
    ]
}

handler.help = ['tebakmakanan']
handler.tags = ['game']
handler.command = /^tebakmakanan$/i
handler.onlyprem = true
handler.game = true

handler.before = async function (m, { conn }) {
    let id = m.chat
    if (!m.text) return
    this.tebakmakanan = this.tebakmakanan ? this.tebakmakanan : {}
    if (!(id in this.tebakmakanan)) return

    let kuis = this.tebakmakanan[id]
    
    // Periksa apakah pengguna menyerah
    let isSurrender = /^(me)?nyerah|surr?ender$/i.test(m.text)
    if (isSurrender) {
        clearTimeout(kuis[4])
        delete this.tebakmakanan[id]
        return m.reply('*Yah, menyerah :( !*')
    }

    let json = kuis[1]
    
    // Cek apakah jawaban pengguna benar
    if (m.text.toLowerCase().trim() === json.jawaban.toLowerCase().trim()) {
        global.db.data.users[m.sender].exp += kuis[2]
        global.db.data.users[m.sender].limit += 2
        conn.reply(m.chat, `✅ *Benar!*\n🎉 +${kuis[2]} XP\n🎁 +2 Limit`, m)
        clearTimeout(kuis[4])
        delete this.tebakmakanan[id]
    } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) {
        m.reply(`*Dikit Lagi!*`)
    } else if (--kuis[3] == 0) {
        // Jika kesempatan habis
        clearTimeout(kuis[4])
        delete this.tebakmakanan[id]
        conn.reply(m.chat, `*Kesempatan habis!*\nJawaban: *${json.jawaban}*`, m)
    } else {
        m.reply(`*Jawaban Salah!*\nMasih ada ${kuis[3]} kesempatan`)
    }
}

export default handler