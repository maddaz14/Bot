let handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender]

  // Inisialisasi default jika belum ada
  if (typeof user.stamina !== 'number' || isNaN(user.stamina)) user.stamina = 250
  if (typeof user.dehidrasi !== 'number' || isNaN(user.dehidrasi)) user.dehidrasi = 0

  const staminaMax = 250
  const dehidrasiMax = 100

  const staminaPercent = Math.floor((user.stamina / staminaMax) * 100)
  const dehidrasiPercent = Math.floor((user.dehidrasi / dehidrasiMax) * 100)

  let warning = ''
  if (user.stamina <= 0) warning += '⚠️ *Stamina habis!* Kamu tidak bisa melakukan aktivitas.\n'
  if (user.dehidrasi >= 100) warning += '⚠️ *Dehidrasi penuh!* Kamu harus minum sebelum beraktivitas.\n'

  const statusText = `
╭───〔 *STATUS RPG KAMU* 〕
│🩸 *Stamina:* ${user.stamina}/${staminaMax} (${staminaPercent}%)
│💧 *Dehidrasi:* ${user.dehidrasi}/${dehidrasiMax} (${dehidrasiPercent}%)
│
${warning.trim() || '✅ Kamu siap beraktivitas!'}
╰───────────────`.trim()

  conn.reply(m.chat, statusText, m)
}

handler.help = ['stamina','dehidrasi']
handler.tags = ['rpg']
handler.command = /^stamina|dehidrasi$/i
handler.register = true

export default handler