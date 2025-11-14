

import pkg from '@fuxxy-star/baileys'
const { /* kalau perlu */ } = pkg

let handler = async (m, { conn, command, args }) => {
  let type = (args[0] || '').toLowerCase()
  let _type = (args[0] || '').toLowerCase()
  let user = global.db.data.users[m.sender]
  
  // Pastikan properti ada
  user.pickaxe = user.pickaxe || 0
  user.pedang = user.pedang || 0
  user.fishingrod = user.fishingrod || 0

  let caption = `
▧ Pickaxe 
▧ Sword 
▧ Fishingrod 

*❏ Bahan Yang Di Butuhkan*
▧ Pickaxe 
〉 10 Kayu
〉 5 Batu
〉 5 Iron
〉 20 String

▧ Sword 
〉 10 Kayu
〉 15 Iron

▧ Fishingrod 
〉 10 Kayu
〉 2 Iron
〉 20 String

▧ Armor
〉 30 Iron
〉 1 Emerald
〉 5 Diamond

▧ Atm 
〉3 Emerald
〉6 Diamond
〉10k Money

Note:
Jika Ingin Craft Caranya
*Ketik .craft (barang yang mau di craft)*
Contoh:
*.craft sword*
Pastikan Kamu Memiliki Bahannya
`

  try {
    if (/craft|Crafting/i.test(command)) {
      const count = args[1] && args[1].length > 0
        ? Math.min(99999999, Math.max(parseInt(args[1]), 1))
        : 1

      switch (type) {
        case 'pickaxe':
          if (user.pickaxe > 0) return m.reply('Kamu Sudah Memiliki Ini')
          if (user.rock < 5 || user.kayu < 10 || user.iron < 5 || user.string < 20)
            return m.reply(`Barang Tidak Cukup!\nUntuk Membuat Pickaxe, perlu:\n10 Kayu\n5 Iron\n20 String\n5 Batu`)
          user.kayu -= 10
          user.iron -= 5
          user.rock -= 5
          user.string -= 20
          user.pickaxe += 1
          user.pickaxedurability = 40
          m.reply("Sukses membuat 1 Pickaxe")
          break

        case 'sword':
          if (user.sword > 0) return m.reply('Kamu Sudah Memiliki Ini')
          if (user.kayu < 10 || user.iron < 15)
            return m.reply(`Barang Tidak Cukup!\nUntuk Membuat Sword, perlu:\n10 Kayu\n15 Iron`)
          user.kayu -= 10
          user.iron -= 15
          user.sword += 1
          user.sworddurability = 40
          m.reply("Sukses Membuat 1 Sword")
          break

        case 'fishingrod':
          if (user.fishingrod > 0) return m.reply('Kamu Sudah Memiliki Ini')
          if (user.kayu < 10 || user.iron < 2 || user.string < 20)
            return m.reply(`Barang Tidak Cukup!\nUntuk Membuat Pancingan, perlu:\n10 Kayu\n2 Iron\n20 String`)
          user.kayu -= 10
          user.iron -= 2
          user.string -= 20
          user.fishingrod += 1
          user.fishingroddurability = 40
          m.reply("Sukses Membuat 1 Pancingan")
          break

        case 'armor':
          if (user.armor > 0) return m.reply('Kamu Sudah Memiliki Ini')
          if (user.iron < 30 || user.emerald < 1 || user.diamond < 5)
            return m.reply(`Barang Tidak Cukup!\nUntuk Membuat Armor, perlu:\n30 Iron\n1 Emerald\n5 Diamond`)
          user.emerald -= 1
          user.iron -= 30
          user.diamond -= 5
          user.armor += 1
          user.armordurability = 50
          m.reply("Sukses Membuat 1 Armor")
          break

        case 'atm':
          if (user.atm > 0) return m.reply('Kamu Sudah Memiliki Ini')
          if (user.emerald < 3 || user.money < 10000 || user.diamond < 6)
            return m.reply(`Barang Tidak Cukup!\nUntuk Membuat ATM, perlu:\n10K Money\n3 Emerald\n6 Diamond`)
          user.emerald -= 3
          user.money -= 10000
          user.diamond -= 6
          user.atm += 1
          user.fullatm = 5000000
          m.reply("Sukses Membuat 1 ATM")
          break

        default:
          return conn.reply(m.chat, caption, m)
      }
    } else if (/enchant|enchan/i.test(command)) {
      const count = args[2] && args[2].length > 0
        ? Math.min(99999999, Math.max(parseInt(args[2]), 1))
        : 1
      switch (_type) {
        case 't':
          break
        case '':
          break
        default:
          return conn.reply(m.chat, caption, m)
      }
    }
  } catch (err) {
    m.reply("Error\n\n" + err.stack)
  }
}

handler.help = ['craft']
handler.tags = ['rpg']
handler.command = /^(craft|crafting|chant)$/i

export default handler