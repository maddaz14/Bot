import similarity from 'similarity'

let timeout = 120000
let poin = 4999
const threshold = 0.72

let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebakanlucu = conn.tebakanlucu ? conn.tebakanlucu : {}
    let id = m.chat
    if (id in conn.tebakanlucu) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakanlucu[id][0])
        throw false
    }

    let json = tebakanLucuBank[Math.floor(Math.random() * tebakanLucuBank.length)]
    let caption = `*${command.toUpperCase()}*
${json.soal}

Timeout *${(timeout / 1000).toFixed(2)} detik*
Bonus: ${poin} XP
`.trim()
    
    conn.tebakanlucu[id] = [
        await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tebakanlucu[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakanlucu[id][0])
            delete conn.tebakanlucu[id]
        }, timeout)
    ]
}

handler.help = ['tebakanlucu']
handler.tags = ['game']
handler.command = /^tebakanlucu$/i

handler.before = async function (m, { conn }) {
    let id = m.chat
    if (!m.text) return
    this.tebakanlucu = this.tebakanlucu || {}
    if (!(id in this.tebakanlucu)) return

    let kuis = this.tebakanlucu[id]
    
    // Periksa apakah pengguna menyerah
    let isSurrender = /^(me)?nyerah|surr?ender$/i.test(m.text)
    if (isSurrender) {
        clearTimeout(kuis[3])
        delete this.tebakanlucu[id]
        return m.reply('*Yah, menyerah :( !*')
    }

    let json = kuis[1]
    
    // Cek apakah jawaban pengguna benar
    if (m.text.toLowerCase().trim() === json.jawaban.toLowerCase().trim()) {
        global.db.data.users[m.sender].exp += kuis[2]
        global.db.data.users[m.sender].limit += 2
        conn.reply(m.chat, `✅ *Benar!*\n🎉 +${kuis[2]} XP\n🎁 +2 Limit`, m)
        clearTimeout(kuis[3])
        delete this.tebakanlucu[id]
    } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) {
        m.reply(`*Dikit lagi!*`)
    } else {
        m.reply(`*Salah!*`)
    }
}

export default handler

const tebakanLucuBank = [
  { "soal": "Buah apa yang bisa menampung banyak barang?", "jawaban": "Leci meja" },
  { "soal": "Buah apa yang dimakan berbahaya?", "jawaban": "Buah apa aja yang makannya di jalan tol" },
  { "soal": "Buah apa yang pernah menjajah Indonesia?", "jawaban": "Terong Belanda" },
  { "soal": "Buah apa yang nggak ada otaknya?", "jawaban": "Semua buah dong" },
  { "soal": "Buah apa yang berakhiran huruf 'K'?", "jawaban": "Mangga busuk, pepaya busuk, apel busuk" },
  { "soal": "Buah apa yang muncul di akhir film?", "jawaban": "Toamat" },
  { "soal": "Buah apa yang punya duit banyak?", "jawaban": "Sri kaya" },
  { "soal": "Buah apa yang suka bangun pagi?", "jawaban": "Apel pagi" },
  { "soal": "Buah apa yang suka dipake perang?", "jawaban": "Jambu runcing" },
  { "soal": "Buah apa yang cocok buat jomblo?", "jawaban": "Buahaha" },
  { "soal": "Ada nggak buah rambutan yang berbahaya kalau kita makan?", "jawaban": "Ada, kalau makannya di tengah jalan tol" },
  { "soal": "Sayur apa yang paling suci?", "jawaban": "Kailan suci aku penuh dosa" },
  { "soal": "Kalau rambut putih itu namanya uban, kalau rambut warnanya hijau disebut apa?", "jawaban": "Rambutan" },
  { "soal": "Buah apa yang selalu segar dan bikin ketagihan?", "jawaban": "Buah bibir" },
  { "soal": "Buah, buah apa yang bikin semangat?", "jawaban": "Semangka dong" },
  { "soal": "Sayur apa yang ada pangkatnya?", "jawaban": "Sayur mayor" },
  { "soal": "Buah apa yang paling ditakutin sama LDR?", "jawaban": "Pisang" },
  { "soal": "Buah apa yang sering ngajak ribut?", "jawaban": "Apelo" },
  { "soal": "Buah semangka, dilubangin, dikasih es batu, dikocok-kocok terus digelindingin. Jadi apa?", "jawaban": "Jadi jauh" },
  { "soal": "Buah apa yang ditakutin mahasiswa?", "jawaban": "Belimbingan skripsi" },
  { "soal": "Sebutkan minimal 3 macam buah dalam waktu 1 detik:", "jawaban": "Rujak" },
  { "soal": "Buah yang mirip dengan melon?", "jawaban": "Blewah" },
  { "soal": "Apa nama buah yang dihindari, bahkan ditakuti mahasiswa?", "jawaban": "Belimbingan skripsi" },
  { "soal": "Buah apa yang sering disebut buah durhaka?", "jawaban": "Melon kundang" },
  { "soal": "Buah apa yang banyak dosanya?", "jawaban": "Salak-an saja aku terus" },
  { "soal": "Buah apa yang dibawa pas main ke rumah pacar?", "jawaban": "Apel" },
  { "soal": "Buah apa yang bijinya kasar?", "jawaban": "Kedondong" },
  { "soal": "Buah apa yang bikin panas?", "jawaban": "Apel jam 12 siang" }
]