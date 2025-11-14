const fetch = require('node-fetch')

let handler = async (m, { conn, text }) => {
  try {
    // Send processing reaction
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    // Check if binary string is provided
    if (!text) throw `
Masukkan kode binary yang ingin dikonversi ke teks!
Contoh: .binary2text 01001000 01100101 01101100 01101100 01101111

Contoh binary valid:
- 01001000 01100101 01101100 01101100 01101111 (Hello)
- 01010111 01101111 01110010 01101100 01100100 (World)
- 01000010 01101001 01101110 01100001 01110010 01111001 (Binary)
`

    // Validate binary format (basic check)
    if (!/^[01\s]+$/.test(text)) throw 'Format binary tidak valid (hanya boleh mengandung 0, 1, dan spasi)'

    // Fetch conversion from API
    const response = await fetch(`https://api.siputzx.my.id/api/tools/binary2text?content=${encodeURIComponent(text)}`)
    if (!response.ok) throw 'Gagal mengkonversi binary ke teks'
    
    const json = await response.json()
    if (!json.status || !json.data) throw 'Gagal mendapatkan hasil konversi'

    const decodedText = json.data

    // Format the response
    let message = `*🔢 BINARY TO TEXT CONVERTER 🔢*\n\n`
    message += `*Binary Input:*\n\`\`\`${text}\`\`\`\n\n`
    message += `*Decoded Text:*\n${decodedText}\n\n`
    message += `_Data diperbarui: ${new Date().toLocaleString('id-ID')}_`

    // Send the message
    await conn.sendMessage(m.chat, { 
      text: message,
      mentions: [m.sender]
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply(`Gagal mengkonversi binary: ${e}`)
  }
}

handler.help = ['binary2text <binary>']
handler.tags = ['tools']
handler.command = /^(binary2text|bin2txt|b2t)$/i
handler.limit = true

module.exports = handler