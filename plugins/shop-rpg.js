// plugins/shop.js
let handler = async (m, { command, args, usedPrefix, conn }) => {
  const shopItems = {
    '🍌 Pisang': 1000,
    '🥭 Mangga': 1500,
    '🍊 Jeruk': 1200,
    '🍇 Anggur': 2000,
    '🍎 Apel': 1300,
    '🌱🍌 Bibit Pisang': 1000,
    '🌱🥭 Bibit Mangga': 1500,
    '🌱🍊 Bibit Jeruk': 1200,
    '🌱🍇 Bibit Anggur': 2000,
    '🌱🍎 Bibit Apel': 1300,
    '🧪 Potion': 5000,
    '💎 Diamond': 10000,
    '📦 Common Box': 7000,
    '🎁 Uncommon Box': 10000,
    '⚗️ Mythic Box': 20000,
    '🏆 Legendary Box': 30000,
    '⭐ Exp': 2000,
    '🪵 Kayu': 500,
    '🪨 Batu': 500,
    '⛓️ Iron': 2000,
    '🧵 String': 1000,
    '💧 Aqua': 700,
    '🟡 Emas Batang': 5000,
    '🪙 Emas Biasa': 3000,
    '🔷 Berlian': 10000,
    '🗑️ Sampah': 100,
    '🍾 Botol': 150,
    '🥫 Kaleng': 150,
    '📦 Kardus': 200,
    '🔥🐦 Phonix': 100000,
    '🦅🦁 Griffin': 100000,
    '🦊✨ Kyubi': 100000,
    '🐉 Naga': 100000,
    '🐎🏹 Centaur': 100000,
    '🐎 Kuda': 50000,
    '🦊 Rubah': 50000,
    '🐱 Kucing': 50000,
    '🐺 Serigala': 50000,
    '🐾 Pet Biasa': 30000,
    '🍖 Makanan Pet': 2000,
    '🔥🍗 Makanan Phonix': 5000,
    '🦅🍗 Makanan Griffin': 5000,
    '🐉🍖 Makanan Naga': 5000,
    '🦊🍖 Makanan Kyubi': 5000,
    '🏹🍗 Makanan Centaur': 5000,
    '🍞 Roti': 500,
    '🗡️ Sword': 10000,
    '🎣 Pancingan': 10000,
    '⛽ Bensin': 5000,
    '🔫 Senjata': 15000,
    '🔧 Stok Senjata': 10000,
    '🏞️ Kolam': 20000,
    '🎫 Tiket Coin': 7000,
    '🪙✨ Koin EXP G': 8000,
    '🪴 Garden Boxs': 12000,
    '🍄 Ketake': 2500,
    '⚗️ Eleksir B': 3000,
    '💊 Obat': 1000,
    '📈 nStock': 2000,
    '🪱 Umpan': 1000,
    '❤️‍🩹 Healt Monster': 4000,
    '🦈 Hiu': 50000,
    '🐟 Ikan': 10000,
    '🐠 Dory': 25000,
    '🐋 Orca': 100000,
    '🐳 Paus': 80000,
    '🦑 Cumi': 20000,
    '🐙 Gurita': 30000,
    '🐡 Buntal': 15000,
    '🦐 Udang': 5000,
    '🐬 Lumba²': 10000,
    '🦞 Lobster': 20000,
    '🦀 Kepiting': 15000
    // Tambahkan item lainnya jika perlu
  }

  const itemAlias = {}
  for (const item in shopItems) {
    const cleanName = item.replace(/[\p{Emoji}\uFE0F]/gu, '').trim().toLowerCase()
    itemAlias[cleanName] = item
  }

  const user = global.db.data.users[m.sender]
  if (!user) return m.reply('Data pengguna tidak ditemukan.')

  if (command === 'shop') {
    let teks = '╭───〔  *TOKO ITEM RPG* 〕───⬣\n'
    for (const [name, price] of Object.entries(shopItems)) {
      teks += `│ ${name} | ${price.toLocaleString()} money\n`
    }
    teks += `╰── Ketik *.shopbuy <item> <jumlah>* untuk membeli\n`
    teks += `╰── Ketik *.shopsell <item> <jumlah>* untuk menjual\n`
    return m.reply(teks.trim())
  }

  if ((command === 'shopbuy2' || command === 'shopsell') && args.length === 2) {
    let rawName = args[0].toLowerCase()
    let jumlah = parseInt(args[1])

    if (isNaN(jumlah) || jumlah <= 0) return m.reply('Masukkan jumlah yang benar.')

    let namaItem = itemAlias[rawName]
    if (!namaItem) return m.reply('Item tidak ditemukan di toko.')

    let harga = shopItems[namaItem]
    if (!harga) return m.reply('Harga item tidak ditemukan.')

    let propertiDb = rawName.toLowerCase().replace(/\s+/g, '_') // pisang -> pisang
    if (command === 'shopbuy') {
      let total = harga * jumlah
      if (user.money < total) return m.reply(`Uangmu tidak cukup. Kamu butuh ${total.toLocaleString()} money.`)

      user.money -= total
      user[propertiDb] = (user[propertiDb] || 0) + jumlah
      return m.reply(`Berhasil membeli ${jumlah} ${namaItem} seharga ${total.toLocaleString()} money.`)
    }

    if (command === 'shopsell2') {
      if ((user[propertiDb] || 0) < jumlah) return m.reply(`Kamu tidak punya cukup ${namaItem} untuk dijual.`)

      let total = Math.floor(harga * jumlah * 0.6) // harga jual 60% dari beli
      user[propertiDb] -= jumlah
      user.money += total
      return m.reply(`Berhasil menjual ${jumlah} ${namaItem} dan mendapatkan ${total.toLocaleString()} money.`)
    }
  }
}

handler.help = ['shop', 'shopbuy <item> <jumlah>', 'shopsell <item> <jumlah>']
handler.tags = ['rpg']
handler.command = ['shop2', 'shopbuy2', 'shopsell2']
handler.register = true

export default handler