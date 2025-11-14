import { resolveWid } from '../lib/jid.js'

let handler = async (m, { conn, text, args, participants }) => {
  if (!text) throw 'Masukkan jumlah limit dan target user.\nContoh: .dellimit 5 @user'

  let jumlah, rawTarget

  // --- Ambil jumlah (cari argumen yang benar-benar angka)
  for (const a of args) {
    const n = parseInt(a)
    if (!isNaN(n)) {
      jumlah = n
    } else if (!rawTarget) {
      // simpan target pertama yang bukan angka
      rawTarget = a
    }
  }

  if (!jumlah || jumlah <= 0) throw '❌ Jumlah limit tidak valid!'

  // --- Tentukan target
  if (m.isGroup && m.mentionedJid?.length) {
    rawTarget = m.mentionedJid[0]
  } else if (m.quoted?.sender) {
    rawTarget = m.quoted.sender
  } else if (!rawTarget) {
    rawTarget = m.sender
  }

  // --- Normalisasi ke WID
  const who = await resolveWid(m, conn, rawTarget, participants)
  if (!who) throw '❌ Target tidak valid!'

  // --- Inisialisasi user
  if (!global.db.data.users[who]) {
    global.db.data.users[who] = { limit: 0, exp: 0, lastclaim: 0 }
  }

  // --- Kurangi limit (tidak boleh minus)
  global.db.data.users[who].limit = Math.max(
    (global.db.data.users[who].limit || 0) - jumlah,
    0
  )

  await conn.reply(
    m.chat,
    `⚠️ @${who.split('@')[0]} limit kamu dikurangi -${jumlah} oleh Owner.\nSisa: ${global.db.data.users[who].limit}`,
    m,
    { mentions: [who] }
  )

  console.log('[DEBUG dellimit]', {
    target: who,
    jumlah,
    sisa: global.db.data.users[who].limit,
    by: m.sender
  })
}

handler.help = ['dellimit <jumlah> [@user|nomor|reply]']
handler.tags = ['owner']
handler.command = /^dellimit$/i
handler.owner = true

export default handler