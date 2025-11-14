import cron from 'node-cron'

let jadwalUser = {} // Object untuk menyimpan jadwal per user

let handler = async (m, { text, command, usedPrefix, conn }) => {
  const user = m.sender

  if (command === 'jadwalku') {
    if (!text.includes('|')) throw `📌 *Contoh penggunaan:*\n${usedPrefix + command} 17,agustus,2025 Pukul 0:01| Hari ini hari kemerdekaan indonesia bro`

    let [waktuStr, pesan] = text.split('|').map(s => s.trim())
    if (!waktuStr.toLowerCase().includes('pukul')) throw `⚠️ Format waktu salah. Gunakan contoh:\n${usedPrefix + command} 17,agustus,2025 Pukul 0:01| Pesan kamu`

    // Ubah ke format Date
    let [tanggalStr, jamStr] = waktuStr.split(/pukul/i).map(s => s.trim())
    let [tgl, bln, thn] = tanggalStr.split(',').map(s => s.trim().toLowerCase())
    let jam = jamStr.replace('.', ':')

    // Konversi nama bulan ke angka
    const bulanMap = {
      januari: 0, februari: 1, maret: 2, april: 3, mei: 4, juni: 5,
      juli: 6, agustus: 7, september: 8, oktober: 9, november: 10, desember: 11
    }

    if (!(bln in bulanMap)) throw '🚫 Nama bulan tidak dikenali. Gunakan nama bulan lengkap (contoh: agustus)'

    if (!/^\d{1,2}[:]\d{2}$/.test(jam)) throw '🕓 Format jam tidak valid. Contoh: 08:30 atau 8:30'

    let [hh, mm] = jam.split(':').map(x => parseInt(x))

    // Buat Date di UTC dan tambah offset +7 jam (WIB)
    let targetDate = new Date(Date.UTC(thn, bulanMap[bln], parseInt(tgl), hh - 7, mm)) // dikurangi 7 karena kita akan tambahkan di cron

    if (isNaN(targetDate)) throw '❌ Tanggal atau waktu tidak valid'
    if (targetDate < new Date()) throw '📅 Waktu sudah lewat, tidak bisa membuat pengingat untuk masa lalu'

    let cronStr = `${mm} ${hh} ${parseInt(tgl)} ${bulanMap[bln] + 1} *`

    let task = cron.schedule(cronStr, () => {
      conn.sendMessage(user, { text: `⏰ *Pengingat Pribadi:*\n${pesan}` })
    })

    if (!jadwalUser[user]) jadwalUser[user] = []
    jadwalUser[user].push({
      waktu: new Date(thn, bulanMap[bln], parseInt(tgl), hh, mm),
      pesan,
      cron: cronStr,
      task
    })

    m.reply(`✅ Jadwal pribadi berhasil dibuat!\n📅 *${tanggalStr}* pukul *${jam}* WIB\n💬 *Pesan:* ${pesan}`)

  } else if (command === 'daftarjadwal' || command === 'daftar-jadwal') {
    if (!jadwalUser[user] || !jadwalUser[user].length) return m.reply('📭 Kamu belum memiliki jadwal pribadi.')

    let daftar = jadwalUser[user].map((j, i) => {
      return `*${i + 1}.* 📅 ${j.waktu.toLocaleString()} \n🗒️ ${j.pesan}`
    }).join('\n\n')

    m.reply(`🗓️ *Daftar Jadwal Pribadi Kamu:*\n\n${daftar}`)
  }
}

handler.help = ['jadwalku <tgl,bln,thn Pukul jam:menit|pesan>', 'daftarjadwal', 'daftar-jadwal']
handler.tags = ['reminder']
handler.command = /^jadwalku|daftarjadwal|daftar-jadwal$/i

export default handler