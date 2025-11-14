let handler = async (m, { conn, usedPrefix, args }) => {
  let user = global.db.data.users[m.sender]

  // Inisialisasi nilai default untuk mencegah error
  if (typeof user.dehidrasi !== 'number' || isNaN(user.dehidrasi)) user.dehidrasi = 0

  const drinks = {
    aqua: { name: "🥤 Aqua", price: 300 },
    tehpucuk: { name: "🧃 Teh Pucuk", price: 500 },
    leminerale: { name: "🥤 Le Minerale", price: 400 },
    floridina: { name: "🧃 Floridina", price: 600 },
    ultramilk: { name: "🥛 Ultra Milk", price: 1000 },
    buavita: { name: "🧃 Buavita", price: 1100 },
    bearbrand: { name: "🧃 Bear Brand", price: 1200 },
    hydrococo: { name: "🧃 Hydro Coco", price: 900 },
    indomilk: { name: "🥛 Indomilk", price: 950 },
    youc1000: { name: "🧃 You C1000", price: 1300 }
  }

  let item = (args[0] || '').toLowerCase()
  let count = Math.max(1, parseInt(args[1]) || 1)

  if (!(item in drinks)) {
    return conn.reply(m.chat, `⚠️ Minuman tidak tersedia!\nKetik *.shopminuman* untuk melihat daftar.`, m)
  }

  let total = drinks[item].price * count
  if (user.money < total) {
    return conn.reply(m.chat, `💸 Uang kamu tidak cukup untuk beli ${count} ${drinks[item].name}.\n💰 Uangmu: ${user.money}\n💰 Total: ${total}`, m)
  }

  user.money -= total
  user[item] = (user[item] || 0) + count

  conn.reply(m.chat, `✅ Kamu berhasil membeli *${count} ${drinks[item].name}* seharga *${total} 💵*\nGunakan dengan *.minum ${item}* untuk mengurangi dehidrasi kamu.`, m)
}

handler.help = ['buyminuman [item] [jumlah]']
handler.tags = ['rpg']
handler.command = /^buyminuman$/i
handler.register = true

export default handler