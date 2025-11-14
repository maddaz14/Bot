import fs from 'fs'

const cooldown = 5 * 60 * 1000 // 5 menit
const vlogDuration = 60000 // 1 menit

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender]

  // Inisialisasi akun vlog jika belum ada
  if (!user.ubedvlog) {
    user.ubedvlog = {
      akun: null,
      title: null,
      lastCreate: 0,
    }
  }

  // Hiasan untuk proses pembuatan vlog dan akun vlog
  const hiasanVlog = '🎥📸 *[ ubed Vlog Creation ]* 🎥📸\n' + '━━━━━━━━━━━━━━━━━━━━\n'
  const hiasanAkun = '📡📲 *[ ubed Vlog Account ]* 📡📲\n' + '━━━━━━━━━━━━━━━━━━━━\n'

  if (command === 'ubedvlog') {
    // Cek apakah judul sudah diberikan
    if (!text) return conn.reply(m.chat, 'Masukkan judul vlog yang ingin dibuat.', m)

    // Cek cooldown
    let now = Date.now()
    if (now - user.ubedvlog.lastCreate < cooldown) {
      let remaining = ((cooldown - (now - user.ubedvlog.lastCreate)) / 1000).toFixed(0)
      return conn.reply(m.chat, `Kamu sudah membuat vlog, tunggu *${remaining} detik* lagi untuk membuat vlog baru.`, m)
    }

    // Set judul vlog dan update waktu
    user.ubedvlog.title = text
    user.ubedvlog.lastCreate = now

    // Menambahkan hiasan saat pembuatan vlog
    conn.reply(m.chat, `${hiasanVlog}Vlog dengan judul *${text}* telah berhasil dibuat! Sekarang, kamu akan mendapatkan hadiah setelah membuat vlog selama 1 menit...`, m)

    // Timer untuk memberikan hadiah setelah 1 menit
    setTimeout(() => {
      // Hadiah acak
      let ubedCoins = Math.floor(Math.random() * (100 - 5 + 1)) + 5
      let money = Math.floor(Math.random() * (500000 - 10000 + 1)) + 10000
      let exp = Math.floor(Math.random() * (4999 - 500 + 1)) + 500

      // Menambahkan hadiah ke user
      user.ubedvlog.earnedCoins = ubedCoins
      user.ubedvlog.earnedMoney = money
      user.ubedvlog.earnedExp = exp

      // Memberikan hadiah kepada user
      user.balance += ubedCoins
      user.money += money
      user.exp += exp

      // Kirim pesan hadiah
      conn.reply(m.chat, `🎉 *Selamat!* Kamu telah berhasil membuat vlog dan mendapatkan hadiah:\n\n🪙 *ubed Coins:* +${ubedCoins}\n💰 *Money:* +${money}\n🎓 *Exp:* +${exp}`, m)
    }, vlogDuration) // Setelah 1 menit

  } else if (command === 'createvlog') {
    // Cek apakah akun sudah diberikan
    if (!text) return conn.reply(m.chat, 'Masukkan nama akun vlog yang ingin dibuat.', m)

    // Set akun vlog
    user.ubedvlog.akun = text

    // Menambahkan hiasan saat pembuatan akun
    conn.reply(m.chat, `${hiasanAkun}Akun vlog dengan nama *${text}* telah berhasil dibuat!`, m)

  } else if (command === 'akunubedvlog') {
    // Cek apakah akun dan judul vlog sudah ada
    if (!user.ubedvlog.akun || !user.ubedvlog.title) {
      return conn.reply(m.chat, 'Kamu belum membuat akun vlog atau vlog.', m)
    }

    // Tampilkan detail akun vlog dengan hiasan
    conn.reply(m.chat, `${hiasanAkun}🔹 *Akun Vlog:* ${user.ubedvlog.akun}\n🔹 *Judul Vlog:* ${user.ubedvlog.title}\n━━━━━━━━━━━━━━━━━━━━`, m)

  }
}

handler.help = ['vlog [judul]', 'createvlog [akun]', 'akunubedvlog']
handler.tags = ['rpg']
handler.command = /^(vlog|createvlog|akunubedvlog)$/i
handler.group = true

export default handler