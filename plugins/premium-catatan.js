import fs from 'fs'

const catatanFile = './src/catatan.json'

const getWIBDate = () => {
  return new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
}

const loadCatatan = () => {
  if (!fs.existsSync(catatanFile)) fs.writeFileSync(catatanFile, JSON.stringify({}))
  return JSON.parse(fs.readFileSync(catatanFile))
}

const saveCatatan = (data) => fs.writeFileSync(catatanFile, JSON.stringify(data, null, 2))

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let db = loadCatatan()
  let userId = m.sender
  if (!db[userId]) db[userId] = []

  let [action, ...args] = text.split(' ')
  if (!action) return m.reply(`🌸 *Cara Pakai Catatan* 🌸\n\n✨ *${usedPrefix}catatan add judul|isi* - Tambah catatan baru\n✨ *${usedPrefix}catatan edit ID|isi* - Edit catatan\n✨ *${usedPrefix}catatan list* - Lihat semua catatan\n✨ *${usedPrefix}catatan open ID* - Buka isi catatan\n✨ *${usedPrefix}catatan hapus ID* - Hapus catatan`)

  action = action.toLowerCase()

  if (action === 'add') {
    let [judul, isi] = args.join(' ').split('|')
    if (!judul || !isi) return m.reply(`🌿 *Format salah!* \nContoh: *${usedPrefix}catatan add Belanja|Beli sayur dan ikan*`)
    let id = db[userId].length + 1
    db[userId].push({ id, judul, isi, tanggal: getWIBDate() })
    saveCatatan(db)
    return conn.reply(m.chat, `🌟 *Catatan Ditambahkan* 🌟\n\n✨ *ID*: ${id}\n✨ *Judul*: ${judul}\n✨ *Isi*: ${isi}\n✨ *Tanggal*: ${getWIBDate()}`, m)
  }

  if (action === 'edit') {
    let [id, isi] = args.join(' ').split('|')
    if (!id || !isi) return m.reply(`🌿 *Format salah!* \nContoh: *${usedPrefix}catatan edit 1|Beli sayur aja*`)
    id = parseInt(id)
    let note = db[userId].find(n => n.id === id)
    if (!note) return m.reply(`🍂 *Catatan dengan ID ${id} ga ada!*`)
    note.isi = isi
    note.tanggal = getWIBDate()
    saveCatatan(db)
    return conn.reply(m.chat, `🌻 *Catatan Diperbarui* 🌻\n\n✨ *ID*: ${id}\n✨ *Judul*: ${note.judul}\n✨ *Isi Baru*: ${isi}\n✨ *Tanggal*: ${note.tanggal}`, m)
  }

  if (action === 'list') {
    if (db[userId].length === 0) return m.reply(`🌾 *Kamu belum punya catatan!* \nTambah dulu yuk: *${usedPrefix}catatan add judul|isi*`)
    let list = db[userId].map(n => `🌸 *ID*: ${n.id} | *Judul*: ${n.judul}\n✨ *Tanggal*: ${n.tanggal}\n────────────`).join('\n')
    return conn.reply(m.chat, `🌷 *Daftar Catatanmu* 🌷\n\n${list}\n🌿 *Total*: ${db[userId].length} catatan`, m)
  }

  if (action === 'open') {
    let id = parseInt(args[0])
    if (!id) return m.reply(`🌿 *Format salah!* \nContoh: *${usedPrefix}catatan open 1*`)
    let note = db[userId].find(n => n.id === id)
    if (!note) return m.reply(`🍂 *Catatan dengan ID ${id} ga ada!*`)
    return conn.reply(m.chat, `🌺 *Detail Catatan* 🌺\n\n✨ *ID*: ${note.id}\n✨ *Judul*: ${note.judul}\n✨ *Tanggal*: ${note.tanggal}\n\n✨ *Isi*:\n${note.isi}`, m)
  }

  if (action === 'hapus') {
    let id = parseInt(args[0])
    if (!id) return m.reply(`🌿 *Format salah!* \nContoh: *${usedPrefix}catatan hapus 1*`)
    let noteIdx = db[userId].findIndex(n => n.id === id)
    if (noteIdx === -1) return m.reply(`🍂 *Catatan dengan ID ${id} ga ada!*`)
    let deleted = db[userId].splice(noteIdx, 1)[0]
    saveCatatan(db)
    return conn.reply(m.chat, `🍃 *Catatan Dihapus* 🍃\n\n✨ *ID*: ${deleted.id}\n✨ *Judul*: ${deleted.judul}\n✨ *Isi*: ${deleted.isi}`, m)
  }

  return m.reply(`🌸 *Cara Pakai Catatan* 🌸\n\n✨ *${usedPrefix}catatan add judul|isi* - Tambah catatan baru\n✨ *${usedPrefix}catatan edit ID|isi* - Edit catatan\n✨ *${usedPrefix}catatan list* - Lihat semua catatan\n✨ *${usedPrefix}catatan open ID* - Buka isi catatan\n✨ *${usedPrefix}catatan hapus ID* - Hapus catatan`)
}

handler.help = ['catatan']
handler.tags = ['premium']
handler.command = /^catatan$/i
handler.premium = true

export default handler