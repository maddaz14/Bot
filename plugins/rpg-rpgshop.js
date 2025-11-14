// wm ubed bot

const items = [
  { name: '🗡️ Sword', id: 'sword', price: 500, desc: 'Menambah kekuatan serangan' },
  { name: '🛡️ Shield', id: 'shield', price: 450, desc: 'Menambah pertahanan' },
  { name: '🧪 Potion', id: 'potion', price: 200, desc: 'Menyembuhkan HP' },
  { name: '🥩 Pet Food', id: 'petfood', price: 100, desc: 'Makanan peliharaan' },
  { name: '📜 Map', id: 'map', price: 300, desc: 'Menjelajah wilayah' },
  { name: '💍 Cincin', id: 'cincin', price: 750, desc: 'Untuk menikah' },
  { name: '🎁 Kotak Misteri', id: 'kotak_misteri', price: 600, desc: 'Berisi hadiah acak' },
  { name: '📦 Kupon Gacha', id: 'kupon_gacha', price: 400, desc: 'Gacha random' },
  { name: '🏠 Rumah', id: 'rumah', price: 1000, desc: 'Tempat tinggal setelah menikah' },
  { name: '🐣 Telur Pet', id: 'pet_egg', price: 800, desc: 'Pet langka acak' },
  { name: '🔧 Pancingan', id: 'pancingan', price: 250, desc: 'Alat untuk memancing' },
  { name: '🪤 Jaring', id: 'jaring', price: 250, desc: 'Menjebak hewan liar' },
  { name: '🧿 Batu Elemental', id: 'elemental_stone', price: 900, desc: 'Material langka untuk crafting' },
  { name: '⚙️ Gear Mesin', id: 'gear', price: 700, desc: 'Komponen untuk kendaraan' },
  { name: '🚗 Mobil Mini', id: 'mobil', price: 2500, desc: 'Kendaraan cepat' },
  { name: '⚒️ Palu Bangunan', id: 'palu', price: 300, desc: 'Alat untuk membangun rumah' },
  { name: '🧱 Batu Bata', id: 'batu_bata', price: 150, desc: 'Bahan bangunan' },
  { name: '🪵 Kayu', id: 'kayu', price: 120, desc: 'Bahan dasar bangunan' },
  { name: '⛏️ Cangkul', id: 'cangkul', price: 200, desc: 'Alat berkebun' },
  { name: '🌱 Bibit Gandum', id: 'bibit_gandum', price: 100, desc: 'Untuk berkebun' },
  { name: '💣 Bom Mini', id: 'bom', price: 650, desc: 'Untuk bertempur' },
  { name: '🧤 Sarung Tangan', id: 'sarung_tangan', price: 180, desc: 'Pelindung tangan' },
  { name: '🧵 Benang Ajaib', id: 'benang_ajaib', price: 300, desc: 'Digunakan membuat kostum' },
  { name: '✨ Kristal Rare', id: 'kristal_rare', price: 1200, desc: 'Barang langka & mahal' },
  { name: '🛸 Tiket UFO', id: 'tiket_ufo', price: 999, desc: 'Akses ke event alien' },
  { name: '⛺ Tenda', id: 'tenda', price: 400, desc: 'Buat camping & healing' },
  { name: '⚗️ Ramuan XP', id: 'ramuan_xp', price: 550, desc: 'Tambahan exp instan' },
  { name: '⛽ Bensin', id: 'bensin', price: 250, desc: 'Untuk kendaraan' },
  { name: '⚡ Baterai', id: 'baterai', price: 180, desc: 'Power untuk item elektronik' },
  { name: '🔮 Bola Ramalan', id: 'bola_ramalan', price: 600, desc: 'Item misterius' }
]


const handler = async (m, { conn, args, command }) => {
  const user = global.db.data.users[m.sender]
  if (!user) return m.reply('⚠️ Data pengguna tidak ditemukan.')

  if (!args[0]) {
    let teks = `
╭───〔 *R P G  S H O P* 〕───⬣
│ Ketik:
│ • *.rpgshop buy [id] [jumlah]*
│ • *.rpgshop sell [id] [jumlah]*
│
│ Daftar item tersedia:
`.trim()
    for (const item of items) {
      teks += `\n│ • *${item.name}* (ID: ${item.id}) - ᴜ͢ᴄ.${item.price.toLocaleString('en-US')}\n│   _${item.desc}_`
    }
    teks += '\n╰────────────────────────⬣'
    return conn.reply(m.chat, teks, m)
  }

  const action = args[0].toLowerCase()
  const itemId = (args[1] || '').toLowerCase()
  const quantity = Math.max(1, parseInt(args[2] || 1))

  const item = items.find(i => i.id === itemId)
  if (!item) return m.reply('❌ Item tidak ditemukan. Cek ID item di *.rpgshop*.')

  const itemKey = item.id

  switch (action) {
    case 'buy':
    case 'beli':
      const totalBuy = item.price * quantity
      if (user.balance < totalBuy) return m.reply(`❌ Uang kamu tidak cukup. Harga total: ᴜ͢ᴄ.${totalBuy}`)
      user.balance -= totalBuy
      user[itemKey] = (user[itemKey] || 0) + quantity
      return m.reply(`✅ Kamu berhasil membeli *${quantity} ${item.name}*\n- Total: ᴜ͢ᴄ.${totalBuy}`)

    case 'sell':
    case 'jual':
      if ((user[itemKey] || 0) < quantity) return m.reply(`❌ Kamu tidak punya cukup *${item.name}* untuk dijual.`)
      const totalSell = Math.floor(item.price * 0.5) * quantity
      user[itemKey] -= quantity
      user.balance += totalSell
      return m.reply(`✅ Kamu berhasil menjual *${quantity} ${item.name}*\n+ ᴜ͢ᴄ.${totalSell}`)
      
    default:
      return m.reply('❌ Gunakan perintah: *.rpgshop buy/jual [item_id] [jumlah]*')
  }
}

handler.help = ['rpgshop']
handler.tags = ['rpg']
handler.command = /^rpgshop$/i

export default handler