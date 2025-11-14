let cooldownMap = new Map()

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!m.isGroup) throw 'Gunakan perintah ini di dalam grup.'
  if (!args[0]) throw `Contoh:\n${usedPrefix + command} @target`

  let target = m.mentionedJid[0]
  if (!target) throw 'Tag pengguna yang ingin kamu serang.'
  if (target === m.sender) throw 'Kamu tidak bisa menyerang dirimu sendiri.'

  let user = global.db.data.users[m.sender]
  let enemy = global.db.data.users[target]

  if (!user || !enemy) throw 'Data pengguna tidak ditemukan.'

  const now = Date.now()
  const cd = 3600000 // 1 jam cooldown
  if (cooldownMap.has(m.sender)) {
    let last = cooldownMap.get(m.sender)
    if (now - last < cd) {
      let sisa = msToTime(cd - (now - last))
      throw `Tunggu *${sisa}* untuk menyerang lagi.`
    }
  }

  // Cek apakah musuh punya shield aktif
  if (enemy.shield > 0 && enemy.shieldDurability > 0) {
    let damageToShield = Math.floor(Math.random() * 16) + 15 // 15–30
    enemy.shieldDurability -= damageToShield

    let resultMsg = `@${target.split('@')[0]} memiliki *Shield*!\n⚡ Durabilitas -${damageToShield}\n`

    if (enemy.shieldDurability > 20) {
      resultMsg += `🛡️ Shield masih kuat! Serangan gagal.`
      cooldownMap.set(m.sender, now)
      return conn.reply(m.chat, resultMsg, m, { mentions: [target] })
    } else {
      resultMsg += `💥 Shield rapuh! Serangan tetap masuk!`
      // Shield jadi tidak aktif
      enemy.shield--
      enemy.shieldDurability = 0
      conn.reply(m.chat, resultMsg, m, { mentions: [target] })
    }
  }

  // Serangan tetap lanjut kalau tidak dilindungi atau shield rapuh
  const success = Math.random() < 0.7
  const reward = Math.floor(Math.random() * 120000) + 30000
  const damage = Math.floor(Math.random() * 35) + 15

  cooldownMap.set(m.sender, now)

  if (success) {
    enemy.health -= damage
    user.money += reward
    user.exp += 50
    m.reply(`*Orbital Strike Sukses!*\n\n@${target.split('@')[0]} terkena serangan!\n-❤️ ${damage} HP\n+💸 ${reward.toLocaleString()} money\n+✨ 50 exp`, null, {
      mentions: [target]
    })
  } else {
    user.health -= damage
    m.reply(`*Orbital Strike Gagal!*\n\nSeranganmu gagal dan meledak balik!\n-❤️ ${damage} HP`)
  }
}

handler.help = ['orbitalstrike @tag']
handler.tags = ['rpg']
handler.command = /^orbitalstrike$/i
handler.group = true
handler.register = true

export default handler

function msToTime(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor((ms % 3600000) / 60000)
  let s = Math.floor((ms % 60000) / 1000)
  return `${h} jam ${m} menit ${s} detik`
}