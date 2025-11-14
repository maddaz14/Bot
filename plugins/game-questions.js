import fetch from 'node-fetch'
import similarity from 'similarity'

let timeout = 120000
let poin = 4999
const threshold = 0.72

let handler = async (m, { conn, text, command, usedPrefix }) => {
    conn.question = conn.question ? conn.question : {}
    let id = m.chat
    if (!text)
        return m.reply(
            `Silakan gunakan command seperti ini: ${usedPrefix}question easy/medium/hard`
        );
    if (id in conn.question) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.question[id][0])
        throw false
    }
    
    let src = await (await fetch("https://opentdb.com/api.php?amount=1&difficulty=" + text + "&type=multiple")).json()
    let json = src
    let caption = `            *『  Question Answers  』*\n\n🎀  *Category:* ${json.results[0].category}\n❄  *Difficulty:* ${json.results[0].difficulty}\n\n📒  *Question:* ${json.results[0].question}
  
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}hasa untuk bantuan
Bonus: ${poin} XP
`.trim()
    conn.question[id] = [
        await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.question[id]) conn.reply(m.chat, `Waktu habis!\n\n🎋  *Jawaban:* ${json.results[0].correct_answer}\n`, conn.question[id][0])
            delete conn.question[id]
        }, timeout)
    ]
}
handler.help = ['question']
handler.tags = ['game']
handler.command = /^question$/i;

handler.before = async function (m, { conn }) {
    let id = m.chat
    if (!m.text) return
    this.question = this.question || {}
    if (!(id in this.question)) return

    let kuis = this.question[id]
    
    // Periksa apakah pengguna menyerah
    let isSurrender = /^(me)?nyerah|surr?ender$/i.test(m.text)
    if (isSurrender) {
        clearTimeout(kuis[3])
        delete this.question[id]
        return m.reply('*Yah, menyerah :( !*')
    }

    let json = kuis[1]
    let correctAnswer = json.results[0].correct_answer.toLowerCase().trim()
    let userAnswer = m.text.toLowerCase().trim()
    
    // Cek apakah jawaban pengguna benar
    if (userAnswer === correctAnswer) {
        global.db.data.users[m.sender].exp += kuis[2]
        global.db.data.users[m.sender].limit += 2
        conn.reply(m.chat, `✅ *Benar!*\n🎉 +${kuis[2]} XP\n🎁 +2 Limit`, m)
        clearTimeout(kuis[3])
        delete this.question[id]
    } else if (similarity(userAnswer, correctAnswer) >= threshold) {
        m.reply(`*Dikit lagi!*`)
    } else {
        m.reply(`*Salah!*`)
    }
}

export default handler