import similarity from 'similarity'

let timeout = 120000
let poin = 4999
const threshold = 0.72

let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebakhewan_riddle = conn.tebakhewan_riddle ? conn.tebakhewan_riddle : {}
    let id = m.chat
    if (id in conn.tebakhewan_riddle) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakhewan_riddle[id][0])
        throw false
    }

    let json = tebakHewanBank[Math.floor(Math.random() * tebakHewanBank.length)]
    let caption = `*${command.toUpperCase()}*
${json.soal}

Timeout *${(timeout / 1000).toFixed(2)} detik*
Bonus: ${poin} XP
`.trim()
    
    conn.tebakhewan_riddle[id] = [
        await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tebakhewan_riddle[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakhewan_riddle[id][0])
            delete conn.tebakhewan_riddle[id]
        }, timeout)
    ]
}

handler.help = ['tebakhewan']
handler.tags = ['game']
handler.command = /^tebakhewan$/i

handler.before = async function (m, { conn }) {
    let id = m.chat
    if (!m.text) return
    this.tebakhewan_riddle = this.tebakhewan_riddle || {}
    if (!(id in this.tebakhewan_riddle)) return

    let kuis = this.tebakhewan_riddle[id]
    
    // Periksa apakah pengguna menyerah
    let isSurrender = /^(me)?nyerah|surr?ender$/i.test(m.text)
    if (isSurrender) {
        clearTimeout(kuis[3])
        delete this.tebakhewan_riddle[id]
        return m.reply('*Yah, menyerah :( !*')
    }

    let json = kuis[1]
    
    // Cek apakah jawaban pengguna benar
    if (m.text.toLowerCase().trim() === json.jawaban.toLowerCase().trim()) {
        global.db.data.users[m.sender].exp += kuis[2]
        global.db.data.users[m.sender].limit += 2
        conn.reply(m.chat, `✅ *Benar!*\n🎉 +${kuis[2]} XP\n🎁 +2 Limit`, m)
        clearTimeout(kuis[3])
        delete this.tebakhewan_riddle[id]
    } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) {
        m.reply(`*Dikit lagi!*`)
    } else {
        m.reply(`*Salah!*`)
    }
}

export default handler

const tebakHewanBank = [
    { "soal": "Hewan apa yang pintar berhitung?", "jawaban": "Kalkun" },
    { "soal": "Hewan apa yang namanya hanya dua huruf?", "jawaban": "Udang" },
    { "soal": "Hewan apa yang sering terlambat?", "jawaban": "Siput" },
    { "soal": "Hewan apa yang suka berantem?", "jawaban": "Ayam jago" },
    { "soal": "Hewan apa yang bisa terbang tapi bukan burung?", "jawaban": "Kelelawar" },
    { "soal": "Hewan apa yang paling romantis?", "jawaban": "Kupu-kupu" },
    { "soal": "Hewan apa yang badannya panjang tapi kecil?", "jawaban": "Ular" },
    { "soal": "Hewan apa yang tidak bisa duduk?", "jawaban": "Kuda" },
    { "soal": "Hewan apa yang hobinya mandi?", "jawaban": "Bebek" },
    { "soal": "Hewan apa yang punya banyak kaki tapi tidak bisa lari?", "jawaban": "Kaki seribu" },
    { "soal": "Hewan apa yang bisa nyanyi?", "jawaban": "Burung" },
    { "soal": "Hewan apa yang doyan gosip?", "jawaban": "Burung beo" },
    { "soal": "Hewan apa yang kalau tidur tetap berdiri?", "jawaban": "Flamingo" },
    { "soal": "Hewan apa yang bisa menyala di gelap?", "jawaban": "Kunang-kunang" },
    { "soal": "Hewan apa yang paling setia?", "jawaban": "Anjing" },
    { "soal": "Hewan apa yang paling sabar?", "jawaban": "Kura-kura" },
    { "soal": "Hewan apa yang paling suka berkumpul?", "jawaban": "Semut" },
    { "soal": "Hewan apa yang bisa menari?", "jawaban": "Monyet" },
    { "soal": "Hewan apa yang bisa menggulung dirinya sendiri?", "jawaban": "Trenggiling" },
    { "soal": "Hewan apa yang punya tangan panjang?", "jawaban": "Orangutan" },
    { "soal": "Hewan apa yang paling kaya?", "jawaban": "Beruang" },
    { "soal": "Hewan apa yang bisa hidup di dua alam?", "jawaban": "Katak" },
    { "soal": "Hewan apa yang suka bersuara nyaring di malam hari?", "jawaban": "Jangkrik" },
    { "soal": "Hewan apa yang paling rajin?", "jawaban": "Lebah" },
    { "soal": "Hewan apa yang suka bermain petak umpet?", "jawaban": "Cicak" },
    { "soal": "Hewan apa yang selalu terlambat ke sekolah?", "jawaban": "Kura-kura" },
    { "soal": "Hewan apa yang paling pesimis?", "jawaban": "Kepiting" },
    { "soal": "Hewan apa yang paling jago main catur?", "jawaban": "Kuda" },
    { "soal": "Hewan apa yang paling ramah?", "jawaban": "Jerapah" },
    { "soal": "Hewan apa yang suka menempel di dinding?", "jawaban": "Cicak" },
    { "soal": "Hewan apa yang paling kaya?", "jawaban": "Ber-uang" },
    { "soal": "Hewan apa yang suka berbaris?", "jawaban": "Semut" },
    { "soal": "Hewan apa yang paling berisik?", "jawaban": "Kucing" },
    { "soal": "Hewan apa yang tidak bisa berenang?", "jawaban": "Ayam" },
    { "soal": "Hewan apa yang selalu ngantuk?", "jawaban": "Koala" },
    { "soal": "Hewan apa yang bisa hidup tanpa kepala?", "jawaban": "Kecoak" },
    { "soal": "Hewan apa yang paling jago menari salsa?", "jawaban": "Ular" },
    { "soal": "Hewan apa yang sering ganti warna?", "jawaban": "Bunglon" },
    { "soal": "Hewan apa yang paling jahil?", "jawaban": "Kera" },
    { "soal": "Hewan apa yang paling sering lupa?", "jawaban": "Ikan dori" },
    { "soal": "Hewan apa yang hobi makan permen?", "jawaban": "Beruang madu" },
    { "soal": "Hewan apa yang bisa nyala di dalam air?", "jawaban": "Ubur-ubur" },
    { "soal": "Hewan apa yang suka olahraga lompat?", "jawaban": "Kanguru" },
    { "soal": "Hewan apa yang kepalanya bisa muter ke belakang?", "jawaban": "Burung hantu" },
    { "soal": "Hewan apa yang bisa hidup di padang pasir?", "jawaban": "Unta" },
    { "soal": "Hewan apa yang ekornya bisa putus dan tumbuh lagi?", "jawaban": "Cicak" },
    { "soal": "Hewan apa yang paling suka bergelantungan?", "jawaban": "Monyet" },
    { "soal": "Hewan apa yang tidak punya jari tapi bisa menggenggam?", "jawaban": "Gajah" },
    { "soal": "Hewan apa yang suka tidur di lumpur?", "jawaban": "Babi" },
    { "soal": "Hewan apa yang bisa berjalan mundur?", "jawaban": "Kepiting" },
    { "soal": "Hewan apa yang suka mendengung?", "jawaban": "Nyamuk" },
    { "soal": "Hewan apa yang sering pura-pura tidur?", "jawaban": "Kucing" },
    { "soal": "Hewan apa yang bisa tidur dengan satu mata terbuka?", "jawaban": "Lumba-lumba" },
    { "soal": "Hewan apa yang paling pemalu?", "jawaban": "Kura-kura" },
    { "soal": "Hewan apa yang paling sabar?", "jawaban": "Siput" },
    { "soal": "Hewan apa yang bisa menangis?", "jawaban": "Buaya" },
    { "soal": "Hewan apa yang punya sengatan beracun?", "jawaban": "Kalajengking" },
    { "soal": "Hewan apa yang suka makan darah?", "jawaban": "Nyamuk" },
    { "soal": "Hewan apa yang bisa menangkap mangsa dengan jaring?", "jawaban": "Laba-laba" },
    { "soal": "Hewan apa yang bisa terbang ke luar angkasa?", "jawaban": "Burung roket" }
]