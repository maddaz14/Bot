import { tebakkata } from '@bochilteam/scraper'
import similarity from 'similarity'

let timeout = 60000
let poin = 4999
const threshold = 0.72

let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakkata = conn.tebakkata ? conn.tebakkata : {}
    let id = m.chat
    if (id in conn.tebakkata) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkata[id][0])
        throw false
    }
    const json = await tebakkata()
    let caption = `
${json.soal}
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}teka untuk bantuan
Bonus: ${poin} XP
`.trim()
    conn.tebakkata[id] = [
        await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tebakkata[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakkata[id][0])
            delete conn.tebakkata[id]
        }, timeout)
    ]
}

handler.help = ['tebakkata']
handler.tags = ['game']
handler.command = /^tebakkata/i

handler.before = async function (m, { conn }) {
    let id = m.chat
    if (!m.text) return
    this.tebakkata = this.tebakkata ? this.tebakkata : {}
    if (!(id in this.tebakkata)) return

    let kuis = this.tebakkata[id]
    
    // Check if the user's message is the correct answer
    if (m.text.toLowerCase().trim() === kuis[1].jawaban.toLowerCase().trim()) {
        global.db.data.users[m.sender].exp += kuis[2]
        conn.reply(m.chat, `✅ *Benar!*\n🎉 +${kuis[2]} XP`, m)
        clearTimeout(kuis[3])
        delete this.tebakkata[id]
    } else if (similarity(m.text.toLowerCase(), kuis[1].jawaban.toLowerCase().trim()) >= threshold) {
        // If the answer is close but not exact
        m.reply(`*Dikit Lagi!*`)
    } else {
        // If the answer is wrong
        // Anda bisa tambahkan feedback salah di sini, seperti:
        // conn.reply(m.chat, '❌ Jawaban salah, coba lagi!', m)
    }
}

export default handler