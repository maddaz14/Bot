// wm ubed bot

const items = [
  { name: '🗡️ Sword', id: 'sword' },
  { name: '🛡️ Shield', id: 'shield' },
  { name: '🧪 Potion', id: 'potion' },
  { name: '🥩 Pet Food', id: 'petfood' },
  { name: '📜 Map', id: 'map' },
  { name: '💍 Cincin', id: 'cincin' },
  { name: '🎁 Kotak Misteri', id: 'kotak_misteri' },
  { name: '📦 Kupon Gacha', id: 'kupon_gacha' },
  { name: '🏠 Rumah', id: 'rumah' },
  { name: '🐣 Telur Pet', id: 'pet_egg' },
  { name: '🔧 Pancingan', id: 'pancingan' },
  { name: '🪤 Jaring', id: 'jaring' },
  { name: '🧿 Batu Elemental', id: 'elemental_stone' },
  { name: '⚙️ Gear Mesin', id: 'gear' },
  { name: '🚗 Mobil Mini', id: 'mobil' },
  { name: '⚒️ Palu Bangunan', id: 'palu' },
  { name: '🧱 Batu Bata', id: 'batu_bata' },
  { name: '🪵 Kayu', id: 'kayu' },
  { name: '⛏️ Cangkul', id: 'cangkul' },
  { name: '🌱 Bibit Gandum', id: 'bibit_gandum' },
  { name: '💣 Bom Mini', id: 'bom' },
  { name: '🧤 Sarung Tangan', id: 'sarung_tangan' },
  { name: '🧵 Benang Ajaib', id: 'benang_ajaib' },
  { name: '✨ Kristal Rare', id: 'kristal_rare' },
  { name: '🛸 Tiket UFO', id: 'tiket_ufo' },
  { name: '⛺ Tenda', id: 'tenda' },
  { name: '⚗️ Ramuan XP', id: 'ramuan_xp' },
  { name: '⛽ Bensin', id: 'bensin' },
  { name: '⚡ Baterai', id: 'baterai' },
  { name: '🔮 Bola Ramalan', id: 'bola_ramalan' }
]

const handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender]
  if (!user) return m.reply('⚠️ Data pengguna tidak ditemukan.')

  let teks = `
╭───〔 *I N V E N T O R Y  R P G* 〕───⬣
│ Berikut adalah isi tasmu:
│
`.trim()

  for (const item of items) {
    const count = user[item.id] || 0
    teks += `│ ${item.name} : *${count}*\n`
  }

  teks += '╰────────────────────────⬣'
  return conn.reply(m.chat, teks, m)
}

handler.help = ['rpginventory']
handler.tags = ['rpg']
handler.command = /^rpginventory$/i

export default handler