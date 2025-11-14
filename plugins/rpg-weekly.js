const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": `weekly ${global.namebot || 'Bot'} ✨`,
    }
};

const rewards = {
  exp: { min: 15000, max: 20000 },
  money: { min: 30000, max: 50000 }, // PERUBAHAN: eris diubah menjadi money
  potion: { min: 5, max: 10 },
}

const cooldown = 604800000 // 7 hari dalam milidetik
const getRandomReward = (reward) => Math.floor(Math.random() * (reward.max - reward.min + 1)) + reward.min

let handler = async (m, { usedPrefix }) => {
  let user = global.db.data.users[m.sender]
  let imgr = flaaa.getRandom() // Pastikan 'flaaa' didefinisikan secara global
  let currentTime = new Date()
  
  if (currentTime - user.lastweekly < cooldown) {
    let remainingTime = new Date(user.lastweekly + cooldown - currentTime).toISOString().substr(11, 8) // Format hh:mm:ss
    let percentage = Math.floor(((currentTime - user.lastweekly) / cooldown) * 100)
    
    let progressBar = `⌛ [${'■'.repeat(percentage / 10)}${'□'.repeat(10 - percentage / 10)}] ${percentage}%`
    
    return conn.reply(m.chat, `⏳ *Kamu sudah mengklaim reward mingguan!*\nTunggu sampai cooldown berakhir dalam: ${remainingTime}\n${progressBar}`, fkontak); // Menggunakan fkontak
  }

  let text = '🎊 *Selamat! Reward Mingguan Telah Tiba!* 🎊\n\n'
  text += `📦 *Berikut hadiahmu:* \n`

  for (let reward of Object.keys(rewards)) {
    if (!(reward in user)) continue
    let earned = getRandomReward(rewards[reward])
    user[reward] += earned
    text += `✨ *+${earned}* ${global.rpg.emoticon(reward)} ${reward.charAt(0).toUpperCase() + reward.slice(1)}\n` // Pastikan 'rpg' didefinisikan
  }

  await conn.reply(m.chat, "⚙️ Mengumpulkan reward...", fkontak); // Menggunakan fkontak
  await new Promise(resolve => setTimeout(resolve, 1500)) // Simulasi loading

  text += `\n⚔️ *Pertahankan usahamu, ${user.name}, dalam perjalanan ini!* ⚔️\n💪 Tetaplah berjuang dan klaim Money sebanyak-banyaknya! 💰` // PERUBAHAN: Eris diubah menjadi Money
  
  conn.reply(m.chat, text.trim(), fkontak); // Menggunakan fkontak
  user.lastweekly = currentTime * 1
}

handler.help = ['weekly']
handler.tags = ['rpg']
handler.command = /^(weekly|mingguan)$/i
handler.register = true
handler.group = true
handler.cooldown = cooldown
handler.rpg = true

export default handler