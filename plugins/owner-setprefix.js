let handler = async (m, { conn, text, command }) => {
  const input = text?.trim()

  // Opsi prefix
  const options = {
    dot: new RegExp('^[\\.]'),
    nodot: /^/, // tanpa prefix
    both: new RegExp('^[\\.]?'), // titik atau tanpa
  }

  if (!input) {
    return conn.sendMessage(m.chat, {
      text: 'Silakan pilih prefix yang ingin digunakan:',
      buttons: [
        { buttonId: '.setprefix dot', buttonText: { displayText: 'Pakai Titik (.)' }, type: 1 },
        { buttonId: '.setprefix nodot', buttonText: { displayText: 'Tanpa Prefix' }, type: 1 },
        { buttonId: '.setprefix both', buttonText: { displayText: 'Gabungan Titik & Tanpa' }, type: 1 },
      ],
      footer: 'Prefix Bot Config',
      headerType: 1
    }, { quoted: m })
  }

  if (input in options) {
    global.prefix = options[input]
    return m.reply(`Prefix berhasil diatur ke: *${input === 'dot' ? 'pakai titik (.)' : input === 'nodot' ? 'tanpa prefix' : 'gabungan titik & tanpa'}*`)
  }

  return m.reply(`Format prefix tidak dikenal!\nGunakan .setprefix untuk memilih prefix yang tersedia.`)
}

handler.help = ['setprefix']
handler.tags = ['owner']
handler.command = /^setprefix$/i
handler.rowner = true

export default handler