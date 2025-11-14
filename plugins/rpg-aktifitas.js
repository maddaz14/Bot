let handler = async (m, { conn, usedPrefix, command, args }) => {
  const user = global.db.data.users[m.sender]
  const act = (args[0] || '').toLowerCase()

  const activities = {
    'lari': ['lari pagi', 20, 10],
    'olahraga': ['olahraga', 25, 15],
    'jalan': ['jalan-jalan', 10, 5],
    'sekolah': ['sekolah', 15, 8],
    'pt': ['kerja di pt', 30, 20],
    'pln': ['kerja pln', 28, 18],
    'kuliah': ['kuliah', 20, 10],
    'bola': ['main bola', 25, 15],
    'futsal': ['main futsal', 28, 20],
    'balap': ['balap liar', 35, 25],
    'nonton': ['menonton bola', 5, 3],
    'jaga': ['jaga ade dirumah', 12, 5],
    'omelan': ['denger Omelan ibu', 8, 4],
    'jemur': ['berjemur', 10, 5],
    'pantai': ['kepantai', 15, 7],
    'liburan': ['liburan', 20, 10],
    'pacaran': ['pacaran', 30, 15]
  }

  if (!(act in activities)) {
    let list = Object.values(activities).map(([label]) => `⬡ ${label}`).join('\n')
    return conn.reply(m.chat, `🔰 *Aktifitas RPG*\n\nGunakan: *${usedPrefix + command} [nama]*\nContoh: *${usedPrefix + command} lari*\n\n${list}`, m)
  }

  // Cooldown
  const cooldown = 15 * 60 * 1000 // 15 menit
  const last = user.lastAktifitas || 0
  const now = new Date() * 1

  if (now - last < cooldown) {
    let remaining = ((cooldown - (now - last)) / 60000).toFixed(1)
    return conn.reply(m.chat, `⏳ Kamu baru saja melakukan aktivitas!\nTunggu *${remaining} menit* lagi.`, m)
  }

  const [label, staminaCost, dehydrationCost] = activities[act]

  if (user.stamina < staminaCost)
    return conn.reply(m.chat, `⚠️ Stamina kamu tidak cukup untuk *${label}*.`, m)
  if (user.dehidrasi + dehydrationCost > 100)
    return conn.reply(m.chat, `⚠️ Kamu terlalu dehidrasi untuk *${label}*.`, m)

  // Lakukan aktivitas
  user.stamina -= staminaCost
  user.dehidrasi += dehydrationCost
  user.lastAktifitas = now

  // Hadiah acak
  let moneyReward = Math.floor(Math.random() * 4900000) + 100000
  let expReward = Math.floor(Math.random() * 1400) + 100

  user.money += moneyReward
  user.exp += expReward

  conn.reply(m.chat, `🎯 Kamu melakukan *${label}*\n- 🔋 -${staminaCost} Stamina\n- 💧 +${dehydrationCost} Dehidrasi\n\n🎁 *Hadiah:*\n- 💵 Rp${moneyReward.toLocaleString('id-ID')}\n- ✨ ${expReward} Exp`, m)
}

handler.help = ['aktifitas']
handler.tags = ['rpg']
handler.command = /^aktifitas$/i
handler.register = true
export default handler