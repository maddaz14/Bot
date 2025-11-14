const buildings = {
  rumah: { 
    bahan: { kayu: 30, batu_bata: 20, palu: 1 },
    emoji: '🏠'
  },
  kontrakan: { 
    bahan: { kayu: 15, batu_bata: 10, palu: 1 },
    emoji: '🏚️'
  },
  toko: { 
    bahan: { kayu: 40, batu_bata: 20, gear: 5 },
    emoji: '🏪'
  },
  kebun: { 
    bahan: { kayu: 25, air: 10, cangkul: 1 },
    emoji: '🌾'
  },
  gudang: { 
    bahan: { kayu: 50, gear: 10, palu: 1 },
    emoji: '📦'
  },
  hotel: { 
    bahan: { kayu: 80, batu_bata: 40, gear: 10, palu: 2 },
    emoji: '🏨'
  },
  sekolah: { 
    bahan: { kayu: 70, batu_bata: 30, gear: 10, benang_ajaib: 5 },
    emoji: '🏫'
  },
  istana: { 
    bahan: { kayu: 120, batu_bata: 100, kristal_rare: 10, gear: 5, palu: 3 },
    emoji: '🏰'
  },
  labirin: { 
    bahan: { kayu: 90, batu_bata: 50, bola_ramalan: 10, gear: 3 },
    emoji: '🌀'
  },
  rumah_sakit: { 
    bahan: { kayu: 60, batu_bata: 30, ramuan_xp: 3, gear: 5 },
    emoji: '🏥'
  },
  benteng: { 
    bahan: { kayu: 100, batu_bata: 80, bom: 5, gear: 3 },
    emoji: '🛡️'
  }
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const user = global.db.data.users[m.sender]
  if (!args[0]) {
    let teks = `
╭───〔 *B A N G U N A N* 〕───⬣
│ Cara bangun: *.rpgbangun [nama]*
│
│ Daftar bangunan yang bisa dibangun:
`.trim()
    for (const [key, value] of Object.entries(buildings)) {
      let list = Object.entries(value.bahan).map(([x, y]) => `${y} ${x}`).join(', ')
      teks += `\n│ ${value.emoji} *${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}* - _${list}_`
    }
    teks += '\n╰────────────────────────⬣\n\n> © ubed Bot'
    return conn.reply(m.chat, teks, m)
  }

  const nama = args[0].toLowerCase()
  if (!buildings[nama]) return m.reply(`❌ Bangunan tidak ditemukan. Cek dengan *.rpgbangun*`)

  const bahan = buildings[nama].bahan
  for (let i in bahan) {
    if ((user[i] || 0) < bahan[i]) return m.reply(`❌ Bahan *${i}* kurang. Butuh ${bahan[i]}, kamu punya ${(user[i] || 0)}.`)
  }

  // Kurangi bahan
  for (let i in bahan) user[i] -= bahan[i]
  if (!user.buildings) user.buildings = {}
  user.buildings[nama] = { level: 1, waktu: new Date().toISOString() }

  return m.reply(`✅ Kamu berhasil membangun *${buildings[nama].emoji} ${nama.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}*!\n\n> © ubed Bot`)
}

handler.help = ['rpgbangun']
handler.tags = ['rpg']
handler.command = /^rpgbangun$/i

export default handler