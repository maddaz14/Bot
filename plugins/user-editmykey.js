import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    throw `Penggunaan: ${usedPrefix + command} <key_baru>\nContoh: ${usedPrefix + command} KeyBaruSaya123`
  }

  const newKey = text.trim()
  const senderNumber = m.sender.replace(/[^0-9]/g, '')

  const githubUsername = 'Obet24077'
  const repo = 'Database.json'
  const filename = 'database.json'
  const token = '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' // Ganti dengan token aman
  const branch = 'main'

  const databaseApiUrl = `https://api.github.com/repos/${githubUsername}/${repo}/contents/${filename}`

  try {
    // 1. Ambil file database dari GitHub
    const res = await fetch(databaseApiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!res.ok) throw `Gagal mengambil database: ${res.statusText}`

    const json = await res.json()
    const sha = json.sha
    const currentContent = JSON.parse(Buffer.from(json.content, 'base64').toString())

    // 2. Cek struktur
    if (!currentContent.allowedUsers || !Array.isArray(currentContent.allowedUsers)) {
      throw 'Struktur database tidak valid: properti "allowedUsers" tidak ditemukan atau bukan array.'
    }

    const userIndex = currentContent.allowedUsers.findIndex(user => user.number === senderNumber)

    if (userIndex === -1) {
      throw `Nomor Anda (${senderNumber}) belum terdaftar dalam database.`
    }

    const oldKey = currentContent.allowedUsers[userIndex].key
    currentContent.allowedUsers[userIndex].key = newKey

    const updatedContent = Buffer.from(JSON.stringify(currentContent, null, 2)).toString('base64')

    // 3. Kirim PUT ke GitHub
    await fetch(databaseApiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json'
      },
      body: JSON.stringify({
        message: `Edit self key: ${senderNumber} from ${oldKey} to ${newKey}`,
        content: updatedContent,
        branch,
        sha
      })
    })

    m.reply(`✅ Key kamu berhasil diubah dari *${oldKey}* menjadi *${newKey}*.`)

  } catch (error) {
    console.error('Error updating key:', error)
    m.reply(`❌ Gagal mengubah key: ${error.message}`)
  }
}

handler.command = ['editmykey']
handler.tags = ['database', 'user']
handler.help = ['editmykey <key_baru>']
handler.owner = false

export default handler