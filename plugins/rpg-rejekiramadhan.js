import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  let fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  }

  let user = global.db.data.users[m.sender]
  if (!user) throw 'User tidak ditemukan di database.'

  const defaultProps = ['exp', 'diamond', 'kyubi', 'sampah', 'sword', 'uncoommon', 'mythic', 'money', 'ramadhan', 'premium']
  for (let prop of defaultProps) {
    if (typeof user[prop] === 'undefined') user[prop] = prop === 'ramadhan' ? 0 : 0
  }

  let premium = user.premium

  let exp = pickRandom([1000, 1800, 2500, 3000, 3700, 4400, 5000])
  let exppremium = pickRandom([3000, 4500, 6600, 8500, 9999, 10500, 11600])

  let diamond = pickRandom([3, 5, 8, 9, 11, 13, 16])
  let diamondpremium = pickRandom([8, 14, 18, 22, 27, 29, 33])

  let kyubi = pickRandom([5, 8, 15, 16, 25])
  let kyubipremium = pickRandom([12, 19, 25, 34, 44])

  let sampah = pickRandom([3, 5, 7, 9, 14])
  let sampahpremium = pickRandom([5, 8, 16, 21, 25])

  let sword = pickRandom([1, 2])
  let swordpremium = pickRandom([2, 3, 5])

  let uncoommon = pickRandom([2, 3, 4, 5])
  let uncoommonpremium = pickRandom([5, 7, 9, 10])

  let mythic = pickRandom([1, 2, 3])
  let mythicpremium = pickRandom([2, 3, 4])

  let money = pickRandom([10000, 15000, 20000, 25000, 30000])
  let moneypremium = pickRandom([30000, 45000, 60000, 75000, 100000])

  const rewards = {
    exp: premium ? exppremium : exp,
    diamond: premium ? diamondpremium : diamond,
    kyubi: premium ? kyubipremium : kyubi,
    sampah: premium ? sampahpremium : sampah,
    sword: premium ? swordpremium : sword,
    uncoommon: premium ? uncoommonpremium : uncoommon,
    mythic: premium ? mythicpremium : mythic,
    money: premium ? moneypremium : money
  }

  let cooldown = 18000000 // 5 jam
  let time = user.ramadhan + cooldown

  if (new Date - user.ramadhan < cooldown) {
    let remaining = clockString(time - new Date())
    return m.reply(`⏳ Kamu sudah klaim *Rezeki Ramadhan* hari ini.\n\nSilakan kembali dalam:\n${remaining}`)
  }

  let teks = ''
  for (let hadiah in rewards) {
    user[hadiah] = (user[hadiah] || 0) + rewards[hadiah]

    // Gunakan emoticon jika tersedia, jika tidak gunakan nama hadiahnya
    let emoji = (global.rpgshop && typeof global.rpgshop.emoticon === 'function') 
      ? global.rpgshop.emoticon(hadiah) 
      : hadiah

    teks += `*+${rewards[hadiah].toLocaleString()}* ${emoji}\n`
  }

  user.ramadhan = new Date() * 1

  let caption = `
╭───『 *RAIH REZEKI RAMADHAN* 』
│ ${premium ? '🌙 *Hadiah Premium*' : '🕌 *Hadiah Gratis*'}
╰───────────────
${teks}
🎟️ PREMIUM ⇢ ${premium ? '✅' : '❌'}
${global.wm || ''}
`.trim()

  return conn.sendMessage(m.chat, {
    text: caption,
    mentions: conn.parseMention(caption)
  }, { quoted: fkontak })
}

handler.command = ['rejekiramadhan']
handler.tags = ['rpg']
handler.help = ['rejekiramadhan']
handler.register = true

export default handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function clockString(ms) {
  let d = Math.floor(ms / 86400000)
  let h = Math.floor(ms / 3600000) % 24
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return `${d} Hari ${h} Jam ${m} Menit ${s} Detik`
}