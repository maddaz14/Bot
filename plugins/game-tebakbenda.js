import similarity from 'similarity'

let timeout = 120000
let poin = 4999
const threshold = 0.72

let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebakbenda = conn.tebakbenda ? conn.tebakbenda : {}
    let id = m.chat
    if (id in conn.tebakbenda) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakbenda[id][0])
        throw false
    }

    let json = tebakBendaBank[Math.floor(Math.random() * tebakBendaBank.length)]
    let caption = `*${command.toUpperCase()}*
${json.soal}

Timeout *${(timeout / 1000).toFixed(2)} detik*
Bonus: ${poin} XP
`.trim()
    
    conn.tebakbenda[id] = [
        await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tebakbenda[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakbenda[id][0])
            delete conn.tebakbenda[id]
        }, timeout)
    ]
}

handler.help = ['tebakbenda']
handler.tags = ['game']
handler.command = /^tebakbenda$/i

handler.before = async function (m, { conn }) {
    let id = m.chat
    if (!m.text) return
    this.tebakbenda = this.tebakbenda || {}
    if (!(id in this.tebakbenda)) return

    let kuis = this.tebakbenda[id]
    
    // Periksa apakah pengguna menyerah
    let isSurrender = /^(me)?nyerah|surr?ender$/i.test(m.text)
    if (isSurrender) {
        clearTimeout(kuis[3])
        delete this.tebakbenda[id]
        return m.reply('*Yah, menyerah :( !*')
    }

    let json = kuis[1]
    
    // Cek apakah jawaban pengguna benar
    if (m.text.toLowerCase().trim() === json.jawaban.toLowerCase().trim()) {
        global.db.data.users[m.sender].exp += kuis[2]
        global.db.data.users[m.sender].limit += 2
        conn.reply(m.chat, `✅ *Benar!*\n🎉 +${kuis[2]} XP\n🎁 +2 Limit`, m)
        clearTimeout(kuis[3])
        delete this.tebakbenda[id]
    } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) {
        m.reply(`*Dikit lagi!*`)
    } else {
        m.reply(`*Salah!*`)
    }
}

export default handler

const tebakBendaBank = [
  { "soal": "Punya lengan tapi tak punya jari, punya leher tapi tak punya kepala, apakah itu?", "jawaban": "Baju" },
  { "soal": "Mata apa yang berfungsi untuk memotong?", "jawaban": "Mata pisau" },
  { "soal": "Dia selalu berada di atas kepala Presiden, Menteri, atau Pejabat Daerah. Namun dia tidak memliki jabatan dalam pemerintahan, Siapakah dia?", "jawaban": "Peci" },
  { "soal": "Benda ini sangat takut dengan hujan, tetapi terbangnya sangat tinggi, benda apakah itu?", "jawaban": "Layang-Layang" },
  { "soal": "Aku adalah benda yang selalu dipukul orang di tempat yang ramai, benda apakah aku?", "jawaban": "Gendang" },
  { "soal": "Aku dibeli untuk makanan. Tapi aku tidak pernah dimakan. Apakah aku?", "jawaban": "Piring" },
  { "soal": "Apa nama sebuah benda yang kalau ditutup berubah jadi tongkat, tapi ketika dibuka malah jadi tenda?", "jawaban": "Payung" },
  { "soal": "Jika ada 1 kilo batu dan ada 1 kilo kapas, ketika dijatuhkan ke atas kaki, apa yang lebih sakit?", "jawaban": "Kaki kita" },
  { "soal": "Benda apa yang kalau disambung akan lebih pendek daripada diputus?", "jawaban": "Kain sarung" },
  { "soal": "Bila diinjak akan selalu ikut ke mana saja, jika tidak diinjak akan diam saja di tempat?", "jawaban": "Sandal Jepit" },
  { "soal": "Mengapa pintu selalu menghadap ke arah matahari?", "jawaban": "Karena kalau menghadap ke tembok tidak bisa dibuka" },
  { "soal": "Seorang pria terjebak di dalam gua, ia kebingungan karena gua tersebut gelap. Di tangannya ada lilin dan obor. Apa yang harus ia nyalakan terlebih dahulu?", "jawaban": "Korek api" },
  { "soal": "Posisiku ada di depan ibu, tetapi suka bersembunyi di belakang televisi. Aku bisa hidup di tengah air. Tapi, kalau ayah datang, aku akan menghilang. Siapakah aku?", "jawaban": "Huruf i" },
  { "soal": "Kenapa pohon mangga yang ada di depan rumah harus ditebang?", "jawaban": "Kalau dicabut berat" },
  { "soal": "Kotak apa yang bisa memberikan jabatan pada seseorang?", "jawaban": "Kotak suara" },
  { "soal": "Aku terbuat dari kaca dan aku bisa diisi air aku biasanya digunakan untuk tempat tinggal hewan, siapakah aku?", "jawaban": "Akuarium" },
  { "soal": "Semakin sering dipukul, maka semakin nyaring dan merdu suara yang dihasilkan, apakah itu?", "jawaban": "Drum" },
  { "soal": "Menteri apa yang kepalanya selalu dipegang-pegang?", "jawaban": "Menteri catur" },
  { "soal": "Sarung apa yang cocok untuk digunakan berkelahi?", "jawaban": "Sarung tinju" },
  { "soal": "Mana yang lebih berat, kapas 100 kg atau besi 100 kg?", "jawaban": "Sama aja, sama-sama 100 kg" },
  { "soal": "Apa yang ada di ujung langit?", "jawaban": "Huruf t" },
  { "soal": "Kalau tengkurap berisi kalau tengadah malah kosong, apakah itu?", "jawaban": "Topi" },
  { "soal": "Sepeda apa yang tidak bisa dicat?", "jawaban": "Sepeda hilang" },
  { "soal": "Pintu apa yang kalau didorong oleh banyak orang, tetapi tetap tidak bisa dibuka?", "jawaban": "Pintu yang tulisannya 'TARIK'" },
  { "soal": "Seorang tahanan berencana untuk melarikan diri dari penjara yang terletak di sebuah pulau. Tapi dia tidak bisa berenang. Suatu hari, ia berhasil melarikan diri tanpa menggunakan alat apa pun. Bagaimana itu bisa terjadi?", "jawaban": "Dia melakukannya di musim dingin ketika air membeku" },
  { "soal": "Kunci apa yang bisa bikin orang joget?", "jawaban": "Kunci-kunci hota hee" },
  { "soal": "Anak siapa yang bisa bergerak cepat?", "jawaban": "Anak panah" },
  { "soal": "Benda apa yang bisa pergi ke seluruh dunia tanpa harus pergi dari tempatmu berasal?", "jawaban": "Perangko" },
  { "soal": "Kapan waktu yang tepat membuka pintu?", "jawaban": "Ketika pintu sedang tertutup" },
  { "soal": "Dipeluk bukannya anak, dipetik bukannya buah, lalu apakah itu?", "jawaban": "Gitar" },
  { "soal": "Daun apa yang tidak pernah gugur?", "jawaban": "Daun telinga" },
  { "soal": "Dalam sebuah keluarga, terdapat 3 anak perempuan yang masing-masing memiliki 1 adik laki-laki. Berapakah jumlah anak laki-laki dalam keluarga tersebut?", "jawaban": "1" },
  { "soal": "Jika dibutuhkan waktu 10 menit untuk merebus 1 butir telur, berapa waktu yang diperlukan untuk merebus 5 butir telur?", "jawaban": "Tetap 10 menit" },
  { "soal": "Gang apa yang selalu bikin ibu-ibu kesel?", "jawaban": "Gang-guin suaminya" },
  { "soal": "Dibeli mahal-mahal akhirnya disobek apakah itu?", "jawaban": "Tiket Bioskop" },
  { "soal": "Ada tiga orang yang berjalan di bawah satu payung kecil, tetapi anehnya kenapa mereka tidak kehujanan?", "jawaban": "Itu karena memang tidak hujan" },
  { "soal": "Ada seorang anak raja yang ditinggalkan oleh ayahnya karena wafat. Setelah ditinggalkan, maka anak itu akan menjadi apa?", "jawaban": "Anak yatim" },
  { "soal": "Air apa yang tidak bisa digunakan untuk diminum, mandi, dan mencuci?", "jawaban": "Airport" },
  { "soal": "Kembang apa yang tidak bisa dicium oleh banyak orang?", "jawaban": "Kembang api" },
  { "soal": "Pekerjaaan yang setiap menyelesaikan masalahnya menggunakan sebelah mata?", "jawaban": "Fotografer" },
  { "soal": "Barang apa yang bisa dibeli tapi gak bisa dipilih?", "jawaban": "Barang tinggal Satu" },
  { "soal": "Kenapa tokoh Harry Potter wajahnya lucu?", "jawaban": "Karena kalau wajahnya serem dikira harimau" },
  { "soal": "Kapan pencuri tidak ditangkap lagi?", "jawaban": "Pencuri masih di penjara" },
  { "soal": "Bibir apa yang tebal dan tak pernah memakai lipstik?", "jawaban": "Bibir sumur" },
  { "soal": "Jalanan apa yang tidak pernah di aspal?", "jawaban": "Jalanan kereta atau rel kereta api" },
  { "soal": "Roti apa yang harganya tidak pernah sesuai dengan pembelinya?", "jawaban": "Roti tawar" },
  { "soal": "Resep apa yang bisa berbicara?", "jawaban": "Resepsionis" },
  { "soal": "Nenek jatuh ke sungai munculnya di mana?", "jawaban": "Munculnya di kora" }
]