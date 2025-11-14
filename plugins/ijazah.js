import { createCanvas, loadImage } from 'canvas'
import db from '../lib/database.js'
import moment from 'moment-timezone'
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  let user = db.data.users[m.sender]

  // Cek syarat kelulusan
  if (!user.sekolah || user.sekolah.peran !== 'murid') return m.reply('Kamu bukan murid.')
  if (user.bk?.sp >= 3) return m.reply('Kamu tidak bisa lulus karena memiliki SP3.')
  if (!user.nilai || Object.keys(user.nilai).length < 3) return m.reply('Kamu belum menyelesaikan semua ujian.')

  // Ambil foto profil
  let pp
  try {
    pp = await conn.profilePictureUrl(m.sender, 'image')
  } catch {
    pp = 'https://telegra.ph/file/265c67242b8a953f2e777.jpg'
  }

  // Buat canvas
  const canvas = createCanvas(1000, 700)
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#fffbe6'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Judul
  ctx.font = 'bold 40px Sans'
  ctx.fillStyle = '#000'
  ctx.fillText('SERTIFIKAT KELULUSAN', 300, 80)

  // Nama
  ctx.font = '30px Sans'
  ctx.fillText(`Diberikan kepada: ${user.name || m.name}`, 100, 200)

  // Tanggal
  ctx.font = '24px Sans'
  ctx.fillText(`Telah dinyatakan LULUS sebagai Sarjana`, 100, 260)
  ctx.fillText(`Tanggal Kelulusan: ${moment().format('LL')}`, 100, 310)

  // Tanda tangan
  ctx.fillText(`ubed Bot`, 800, 600)
  ctx.font = 'italic 18px Sans'
  ctx.fillText(`(Tertanda Otomatis)`, 790, 630)

  // Foto profil bulat
  const avatar = await loadImage(await (await fetch(pp)).buffer())
  ctx.save()
  ctx.beginPath()
  ctx.arc(150, 500, 80, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(avatar, 70, 420, 160, 160)
  ctx.restore()

  conn.sendFile(m.chat, canvas.toBuffer(), 'ijazah.png', 'Selamat! Ini ijazah kelulusanmu dari Sekolah ubed.', m)
}

handler.help = ['ijazah']
handler.tags = ['rpg']
handler.command = /^ijazah$/i

export default handler