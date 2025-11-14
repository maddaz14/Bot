import fetch from 'node-fetch'
import similarity from 'similarity'

let timeout = 120000
let poin = 4999
const threshold = 0.72

let handler = async (m, { conn, text, command, usedPrefix }) => {
    conn.quizz = conn.quizz ? conn.quizz : {}
    let id = m.chat
    if (!text)
        return m.reply(
            `Silakan gunakan command seperti ini: ${usedPrefix}quizz easy/medium/hard`
        );
    if (id in conn.quizz) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.quizz[id][0])
        throw false
    }
    
    let json = await quizApi(text)
    let caption = `            *『  quizz Answers  』*\n\n📒  *quizz:* ${json[0].soal}
  
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}quizzh untuk bantuan
Bonus: ${poin} XP
    `.trim()
    conn.quizz[id] = [
        await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.quizz[id]) conn.reply(m.chat, `Waktu habis!\n\n🎋  *Jawaban:* ${json[0].jawaban}\n`, conn.quizz[id][0])
            delete conn.quizz[id]
        }, timeout)
    ]
}
handler.help = ['quizz']
handler.tags = ['game']
handler.command = /^quizz/i

handler.before = async function (m, { conn }) {
    let id = m.chat
    if (!m.text) return
    this.quizz = this.quizz || {}
    if (!(id in this.quizz)) return

    let kuis = this.quizz[id]
    
    // Periksa apakah pengguna menyerah
    let isSurrender = /^(me)?nyerah|surr?ender$/i.test(m.text)
    if (isSurrender) {
        clearTimeout(kuis[3])
        delete this.quizz[id]
        return m.reply('*Yah, menyerah :( !*')
    }

    let json = kuis[1]
    let correctAnswer = json[0].jawaban.toLowerCase().trim()
    let userAnswer = m.text.toLowerCase().trim()
    
    // Cek apakah jawaban pengguna benar
    if (userAnswer === correctAnswer) {
        global.db.data.users[m.sender].exp += kuis[2]
        global.db.data.users[m.sender].limit += 2
        conn.reply(m.chat, `✅ *Benar!*\n🎉 +${kuis[2]} XP\n🎁 +2 Limit`, m)
        clearTimeout(kuis[3])
        delete this.quizz[id]
    } else if (similarity(userAnswer, correctAnswer) >= threshold) {
        m.reply(`*Dikit lagi!*`)
    } else {
        m.reply(`*Salah!*`)
    }
}

async function quizApi(difficulty) {
  const response = await fetch('https://quizapi.io/api/v1/questions?apiKey=MrSORkLFSsJabARtQhyloo7574YX2dquEAchMn8x&difficulty=' + difficulty + '&limit=1');
  const quizData = await response.json();

  const transformedData = quizData.map(({ question, answers, correct_answers }) => ({
    soal: question,
    hint: Object.values(answers).filter(value => value !== null),
    jawaban: Object.entries(correct_answers)
      .reduce((acc, [key, value]) => (value === 'true' ? answers[key.replace('_correct', '')] : acc), null)
  }));

  return transformedData;
}

export default handler