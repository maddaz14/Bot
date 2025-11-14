let handler = async (m, { conn }) => {
  let list = `
📦 *SHOP MINUMAN SEHAT & HALAL* 📦

1. 🥤 Aqua - 300 💵
2. 🧃 Teh Pucuk - 500 💵
3. 🥤 Le Minerale - 400 💵
4. 🧃 Floridina - 600 💵
5. 🥛 Ultra Milk - 1000 💵
6. 🧃 Buavita - 1100 💵
7. 🧃 Bear Brand - 1200 💵
8. 🧃 Hydro Coco - 900 💵
9. 🥛 Indomilk - 950 💵
10. 🧃 You C1000 - 1300 💵

Gunakan perintah:
➡️ *.buyminuman [nama] [jumlah]*
Contoh: *.buyminuman aquA 2*
`.trim()

  conn.reply(m.chat, list, m)
}

handler.help = ['shopminuman']
handler.tags = ['rpg']
handler.command = /^shopminuman$/i
handler.register = true
export default handler