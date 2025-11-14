import axios from 'axios'
import similarity from 'similarity'

let timeout = 120000
let poin = 4999
const threshold = 0.72

let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebakchara = conn.tebakchara ? conn.tebakchara : {}
    let id = m.chat
    if (id in conn.tebakchara) {
        conn.reply(m.chat, 'Masih Ada Soal Yang Blum Terjawab', m, conn.tebakchara[id][0])
        throw false
    }
    let res = await axios.get('https://api.jikan.moe/v4/characters')
    let jsons = await res.data.data
    jsons.getRandom = function() {
        return this[Math.floor(Math.random() * this.length)];
    };
    
    let json = jsons.getRandom()
    let caption = `*${command.toUpperCase()}*
Siapakah Nama Dari Foto Diatas?

Waktu *${(timeout / 1000).toFixed(2)} Detik*
Ketik ${usedPrefix}hcha Untuk Bantuan
Bonus: ${poin} XP
    `.trim()
    conn.tebakchara[id] = [
        await conn.sendFile(m.chat, `${json.images.jpg.image_url}`, 'anuu.jpg', caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tebakchara[id]) conn.sendFile(m.chat, json.images.jpg.image_url, '', `Waktu Habis!\nJawabannya Adalah *${json.name}*\nKanji : ${json.name_kanji}\n*Url :* ${json.url}\n*Desk :* ${json.about}`, conn.tebakchara[id][0])
            delete conn.tebakchara[id]
        }, timeout)
    ]
}

handler.help = ['tebakchara']
handler.tags = ['game']
handler.command = /^tebakchara/i
handler.register = true

handler.before = async function (m, { conn }) {
    let id = m.chat
    if (!m.text) return
    this.tebakchara = this.tebakchara || {}
    if (!(id in this.tebakchara)) return

    let kuis = this.tebakchara[id]
    
    // Periksa apakah pengguna menyerah
    let isSurrender = /^(me)?nyerah|surr?ender$/i.test(m.text)
    if (isSurrender) {
        clearTimeout(kuis[3])
        delete this.tebakchara[id]
        return m.reply('*Yah, menyerah :( !*')
    }

    let json = kuis[1]
    
    // Cek apakah jawaban pengguna benar
    if (m.text.toLowerCase().trim() === json.name.toLowerCase().trim()) {
        global.db.data.users[m.sender].exp += kuis[2]
        global.db.data.users[m.sender].limit += 2
        conn.reply(m.chat, `✅ *Benar!*\n🎉 +${kuis[2]} XP\n🎁 +2 Limit`, m)
        clearTimeout(kuis[3])
        delete this.tebakchara[id]
    } else if (similarity(m.text.toLowerCase(), json.name.toLowerCase().trim()) >= threshold) {
        m.reply(`*Dikit lagi!*`)
    } else {
        m.reply(`*Salah!*`)
    }
}

export default handler