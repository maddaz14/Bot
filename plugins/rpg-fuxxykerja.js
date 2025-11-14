import fs from 'fs'

const cooldown = 5 * 60 * 1000 // 5 menit
const jobs = [
  'Youtuber', 'Streamer', 'Ojol', 'Editor', 'Barista', 'Kuli', 'Vlogger',
  'Petani', 'Dokter', 'Programmer', 'Guru', 'Artis TikTok', 'Montir', 'Nelayan',
  'Penulis', 'Seniman', 'Desainer', 'Marketing', 'Animator', 'Gamers Profesional'
]

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender]

  if (!user) return conn.reply(m.chat, 'Data pengguna tidak ditemukan.', m)

  if (user.balance == null) user.balance = 0
  if (user.kerjaCount == null) user.kerjaCount = 0
  if (!user.lastKerja) user.lastKerja = 0

  if (!args[0]) {
    let jobList = jobs.map(job => `🌟 ${job}`).join('\n')
    return conn.reply(m.chat, `*Pilih pekerjaanmu dengan command:*\n\n*${usedPrefix + command} [nama pekerjaan]*\n\nContoh:\n${usedPrefix + command} Youtuber\n\n*Daftar Pekerjaan:*\n${jobList}`, m)
  }

  // Case insensitive untuk memilih pekerjaan
  let selectedJob = jobs.find(job => job.toLowerCase() === text.toLowerCase())
  if (!selectedJob) {
    return conn.reply(m.chat, `Pekerjaan tidak tersedia. Ketik *.${command}* untuk melihat daftar yang tersedia.`, m)
  }

  let now = Date.now()
  if (now - user.lastKerja < cooldown) {
    let remaining = ((cooldown - (now - user.lastKerja)) / 1000).toFixed(0)
    return conn.reply(m.chat, `Kamu sudah bekerja, tunggu *${remaining} detik* lagi untuk bekerja lagi.`, m)
  }

  let earned = Math.floor(Math.random() * 96) + 5 // antara 5 - 100 ubed coins
  user.balance += earned
  user.lastKerja = now
  user.kerjaCount += 1

  conn.reply(m.chat, `@${m.sender.split('@')[0]} memulai pekerjaan sebagai *${selectedJob}*...`, m)

  // Kirim pesan setiap 2 detik
  let steps = [
    `@${m.sender.split('@')[0]} memulai pekerjaan *${selectedJob}*...`,
    `@${m.sender.split('@')[0]} sedang bekerja sebagai *${selectedJob}*...`,
    `@${m.sender.split('@')[0]} hampir selesai bekerja sebagai *${selectedJob}*...`,
    `@${m.sender.split('@')[0]} selesai bekerja sebagai *${selectedJob}* dan mendapatkan *ᴜ͢ᴄ.${earned.toLocaleString('en-US')}* ubed Coins!`
  ]

  for (let i = 0; i < steps.length; i++) {
    setTimeout(() => {
      conn.reply(m.chat, steps[i], m)
    }, i * 2000) // Kirim pesan tiap 2 detik
  }
}

handler.help = ['fuxxykerja [pekerjaan]']
handler.tags = ['rpg']
handler.command = /^fuxxykerja$/i
handler.group = true

export default handler