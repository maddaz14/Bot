let handler = async (m, { conn, usedPrefix, args }) => {
  let user = global.db.data.users[m.sender]

  // Inisialisasi jika belum ada
  if (typeof user.dehidrasi !== 'number' || isNaN(user.dehidrasi)) user.dehidrasi = 0

  const drinks = {
    aqua: { name: "🥤 Aqua", restore: 20 },
    tehpucuk: { name: "🧃 Teh Pucuk", restore: 25 },
    leminerale: { name: "🥤 Le Minerale", restore: 22 },
    floridina: { name: "🧃 Floridina", restore: 30 },
    ultramilk: { name: "🥛 Ultra Milk", restore: 35 },
    buavita: { name: "🧃 Buavita", restore: 40 },
    bearbrand: { name: "🧃 Bear Brand", restore: 45 },
    hydrococo: { name: "🧃 Hydro Coco", restore: 30 },
    indomilk: { name: "🥛 Indomilk", restore: 33 },
    youc1000: { name: "🧃 You C1000", restore: 50 }
  }

  let item = (args[0] || '').toLowerCase()

  if (!(item in drinks)) {
    let list = Object.entries(drinks)
      .map(([key, val]) => {
        let owned = user[key] || 0
        return `⬡ ${val.name} - Kurangi ${val.restore}% dehidrasi | Kamu punya: ${owned}`
      })
      .join('\n')

    return conn.reply(m.chat, `🔰 *MINUMAN YANG TERSEDIA*\n\nGunakan: *${usedPrefix}minum [item]*\nContoh: *${usedPrefix}minum aqua*\n\n${list}`, m)
  }

  if ((user[item] || 0) <= 0) {
    return conn.reply(m.chat, `⚠️ Kamu tidak memiliki ${drinks[item].name}. Beli dulu pakai *.buyminuman ${item}*`, m)
  }

  let restore = drinks[item].restore
  let before = user.dehidrasi
  user.dehidrasi = Math.max(0, user.dehidrasi - restore)
  user[item]--

  conn.reply(m.chat, `✅ Kamu minum ${drinks[item].name}\n💧 Dehidrasi: ${before} ➜ ${user.dehidrasi} (-${restore}%)\n📦 Sisa: ${user[item]} ${drinks[item].name}`, m)
}

handler.help = ['minum [item]']
handler.tags = ['rpg']
handler.command = /^minum$/i
handler.register = true

export default handler