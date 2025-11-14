import fetch from 'node-fetch'
import similarity from 'similarity'

let timeout = 120000
let poin = 402
const threshold = 0.72

let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebaksurah = conn.tebaksurah ? conn.tebaksurah : {}
    let id = m.chat
    if (id in conn.tebaksurah) {
        conn.reply(m.chat, 'Masih Ada Soal Yang Belum Terjawabi', conn.tebaksurah[id][0])
        throw false
    }
    
    // Perbaikan getRandom()
    let ran = 6236
    let randomAyah = Math.floor(Math.random() * ran) + 1
    
    let res = await fetch('https://api.alquran.cloud/v1/ayah/' + randomAyah + '/ar.alafasy')
    if (res.status !== 200) throw await res.text()
    let result = await res.json()
    let json = result.data
    
    if (result.code == 200) {
        let caption = `*${command.toUpperCase()}*
Number In Surah: ${json.numberInSurah}
By: ${json.edition.name} ${json.edition.englishName}

Waktu *${(timeout / 1000).toFixed(2)} Detik*
Ketik *${usedPrefix}hsur* Untuk Bantuan
Bonus: ${poin} XP
`.trim()

        conn.tebaksurah[id] = [
            await m.reply(`${caption}`),
            json, poin,
            setTimeout(() => {
                if (conn.tebaksurah[id]) conn.reply(m.chat, `Waktu Habis!\nJawabannya Adalah *${json.surah.englishName}*`, conn.tebaksurah[id][0])
                delete conn.tebaksurah[id]
            }, timeout)
        ]
        await conn.sendFile(m.chat, json.audio, 'coba-lagi.mp3', '', m)
    } else if (result.code == 404) {
        m.reply(`*Ulangi! Command ${usedPrefix + command} Karena ${json.data}*`)
    }
}

handler.help = ['tebaksurah']
handler.tags = ['game']
handler.command = /^tebaksurah/i

handler.before = async function (m, { conn }) {
    let id = m.chat
    if (!m.text) return
    this.tebaksurah = this.tebaksurah || {}
    if (!(id in this.tebaksurah)) return
    
    let kuis = this.tebaksurah[id]
    
    // Periksa apakah pengguna menyerah
    let isSurrender = /^(me)?nyerah|surr?ender$/i.test(m.text)
    if (isSurrender) {
        clearTimeout(kuis[3])
        delete this.tebaksurah[id]
        return m.reply('*Yah, menyerah :( !*')
    }

    let json = kuis[1]
    
    // Cek apakah jawaban pengguna benar
    if (m.text.toLowerCase().trim() === json.surah.englishName.toLowerCase().trim()) {
        global.db.data.users[m.sender].exp += kuis[2]
        global.db.data.users[m.sender].limit += 2
        conn.reply(m.chat, `✅ *Benar!*\n🎉 +${kuis[2]} XP\n🎁 +2 Limit`, m)
        clearTimeout(kuis[3])
        delete conn.tebaksurah[id]
    } else if (similarity(m.text.toLowerCase(), json.surah.englishName.toLowerCase().trim()) >= threshold) {
        m.reply(`*Dikit lagi!*`)
    } else {
        m.reply(`*Salah!*`)
    }
}

export default handler