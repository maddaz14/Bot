// wm ubed bot

const handler = async (m, { conn, args }) => {
  const user = global.db.data.users[m.sender]
  const inventory = user.inventory || {}

  const recipes = [
    {
      output: 'sword',
      materials: {
        kayu: 2,
        elemental_stone: 1
      },
      desc: '🗡️ Sword dari Kayu & Batu Elemental'
    },
    {
      output: 'gear',
      materials: {
        baterai: 2,
        gear: 1
      },
      desc: '⚙️ Gear dari Baterai bekas'
    },
    {
      output: 'armor',
      materials: {
        benang_ajaib: 3,
        sarung_tangan: 1
      },
      desc: '🛡️ Armor Ringan'
    }
  ]

  if (!args[0]) {
    let teks = `╭───〔 *C R A F T  M E N U* 〕───⬣\n│\n`
    for (let r of recipes) {
      let mat = Object.entries(r.materials).map(([k, v]) => `• ${v} ${k}`).join('\n')
      teks += `│ ${r.desc}\n${mat}\n│\n`
    }
    teks += '╰────────────────────────⬣\n\nKetik: *.rpgcraft [item]* untuk membuat'
    return m.reply(teks)
  }

  const selected = recipes.find(r => r.output.toLowerCase() === args[0].toLowerCase())
  if (!selected) return m.reply('⚠️ Item tidak ditemukan dalam daftar craft.')

  for (let [item, qty] of Object.entries(selected.materials)) {
    if (!inventory[item] || inventory[item] < qty) {
      return m.reply(`❌ Bahan tidak cukup:\nKamu butuh ${qty} ${item}, tapi hanya punya ${inventory[item] || 0}`)
    }
  }

  // Kurangi bahan
  for (let [item, qty] of Object.entries(selected.materials)) {
    inventory[item] -= qty
  }

  // Tambahkan hasil
  inventory[selected.output] = (inventory[selected.output] || 0) + 1
  user.inventory = inventory

  m.reply(`✅ Berhasil membuat *${selected.output}*!\nSilakan cek inventori kamu.`)
}

handler.help = ['rpgcraft']
handler.tags = ['rpg']
handler.command = /^rpgcraft$/i

export default handler