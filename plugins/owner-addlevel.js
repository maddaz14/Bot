import { resolveWid } from '../lib/jid.js'

let handler = async (m, { conn, text, participants }) => {
  if (!text) throw '❌ Masukkan jumlah *Level* yang akan diberi + tag/nomor target.'

  let rawTarget
  if (m.isGroup) rawTarget = m.mentionedJid?.[0] || text.split(' ')[0]
  else rawTarget = m.chat

  if (!rawTarget) throw '❌ Tag salah satu pengguna atau masukkan nomor.'

  // ambil jumlah level dari text
  let txt = text.replace('@' + rawTarget.split('@')[0], '').trim()
  if (isNaN(txt)) throw '❌ Input harus berupa angka.'
  
  let level = parseInt(txt)
  if (level < 1) throw '❌ Minimal 1 level.'

  // resolve jadi JID final
  let targetJid = await resolveWid(m, conn, rawTarget, participants)
  if (!targetJid) throw '❌ Gagal menentukan target yang valid.'

  // pastikan user ada di DB
  let users = global.db.data.users
  if (!users[targetJid]) {
    users[targetJid] = {
      money: 0,
      bank: 0,
      balance: 0,
      exp: 0,
      limit: 0,
      level: 0,
      premium: false,
      registered: true,
      name: null
    }
  }

  // tambahkan level
  users[targetJid].level += level

  // balasan sukses
  await conn.reply(
    m.chat,
    `✅ Selamat @${targetJid.split('@')[0]}, kamu mendapatkan +${level} LEVEL!`,
    m,
    { mentions: [targetJid] }
  )
}

handler.help = ['addlevel @user <jumlah>']
handler.tags = ['owner']
handler.command = /^addlevel$/i
handler.owner = true

export default handler