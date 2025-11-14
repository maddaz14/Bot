import fs from 'fs'
import similarity from 'similarity'

const pemainBola = [
  { url: 'https://files.catbox.moe/1itdea', nama: 'alba' },
  { url: 'https://files.catbox.moe/sb437p', nama: 'van der sar' },
  { url: 'https://files.catbox.moe/hb0gb5', nama: 'ribery' },
  { url: 'https://files.catbox.moe/ozu7hb.jpg', nama: 'zidane' },
  { url: 'https://files.catbox.moe/b0p3z5', nama: 'benzema' },
  { url: 'https://files.catbox.moe/dvfcn3', nama: 'kaka' },
  { url: 'https://files.catbox.moe/yhdd7g', nama: 'baggio' },
  { url: 'https://files.catbox.moe/kl3ip6', nama: 'cafu' },
  { url: 'https://files.catbox.moe/ows719', nama: 'buffon' },
  { url: 'https://files.catbox.moe/vilz3s', nama: 'neymar' },
  { url: 'https://files.catbox.moe/9uo2o6', nama: 'antony' },
  { url: 'https://files.catbox.moe/8smgip', nama: 'isco' },
  { url: 'https://files.catbox.moe/i27r13', nama: 'bale' },
  { url: 'https://files.catbox.moe/5jmmc4', nama: 'ronaldinho' },
  { url: 'https://files.catbox.moe/gf5khc', nama: 'ronaldo' },
  { url: 'https://files.catbox.moe/jgm4z7', nama: 'garnacho' },
  { url: 'https://files.catbox.moe/yb118r', nama: 'inzagni' },
  { url: 'https://files.catbox.moe/dfuhjd', nama: 'materazzi' },
  { url: 'https://files.catbox.moe/b35af0', nama: 'dialo' },
  { url: 'https://files.catbox.moe/zkgj8e', nama: 'patrick kluivert' },
  { url: 'https://files.catbox.moe/z2lqk3', nama: 'drogba' },
  { url: 'https://files.catbox.moe/x5u252', nama: 'etoo' },
]

let timeout = 60000 // 1 menit
let poinExp = 4999
let poinMoney = 50000
const threshold = 0.72

let handler = async (m, { conn, usedPrefix, command }) => {
  let id = m.chat
  if (conn.tebakbola && conn.tebakbola[id]) {
    return m.reply('Masih ada soal belum dijawab!')
  }

  let pemain = pemainBola[Math.floor(Math.random() * pemainBola.length)]
  let caption = `*Tebak Siapa Nama Pemain Sepakbola Ini?*\n\nWaktu: *${timeout / 1000} detik*\n`

  conn.tebakbola = conn.tebakbola || {}
  conn.tebakbola[id] = {
    jawaban: pemain.nama.toLowerCase(),
    timeout: setTimeout(() => {
      if (conn.tebakbola[id]) {
        conn.reply(m.chat, `Waktu habis!\nJawaban: *${pemain.nama}*`, conn.tebakbola[id].msg)
        delete conn.tebakbola[id]
      }
    }, timeout),
    msg: await conn.sendMessage(m.chat, {
      image: { url: pemain.url },
      caption
    }, { quoted: m })
  }
}

handler.before = async function (m, { conn }) {
    let id = m.chat
    if (!m.text) return
    this.tebakbola = this.tebakbola || {}
    if (!(id in this.tebakbola)) return

    let kuis = this.tebakbola[id]
    
    // Periksa apakah pengguna menyerah
    let isSurrender = /^(me)?nyerah|surr?ender$/i.test(m.text)
    if (isSurrender) {
        clearTimeout(kuis.timeout)
        delete this.tebakbola[id]
        return m.reply('*Yah, menyerah :( !*')
    }
    
    // Cek apakah jawaban pengguna benar
    if (m.text.toLowerCase().trim() === kuis.jawaban.toLowerCase().trim()) {
      global.db.data.users[m.sender].money += poinMoney
      global.db.data.users[m.sender].exp += poinExp
      global.db.data.users[m.sender].limit += 2
      clearTimeout(kuis.timeout)
      delete this.tebakbola[id]
      m.reply(`✅ *Benar!*\n\n+${poinMoney} Money\n+${poinExp} Exp\n🎁 +2 Limit`)
    } else if (similarity(m.text.toLowerCase(), kuis.jawaban.toLowerCase().trim()) >= threshold) {
        m.reply(`*Dikit lagi!*`)
    } else {
      m.reply('*Salah!*')
    }
}

handler.help = ['tebakbola']
handler.tags = ['game']
handler.command = /^tebakbola$/i
handler.group = false

export default handler