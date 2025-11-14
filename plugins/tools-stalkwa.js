let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Masukkan nomor yang ingin di-stalk!\nContoh: .stalkwa 628xxxxxx')
  let jid = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

  try {
    let info = await conn.onWhatsApp(jid)
    if (!info || !info[0]?.exists) return m.reply('Nomor tidak terdaftar di WhatsApp.')

    let status = await conn.fetchStatus(jid).catch(_ => ({ status: 'Tidak dapat mengambil status.' }))

    let txt = `*STALK WHATSAPP*\n\n`
    txt += `*Nomor:* ${text}\n`
    txt += `*JID:* ${jid}\n`
    txt += `*Nama:* ${info[0]?.jid?.split('@')[0] || '-'}\n`
    txt += `*Status:* ${status.status || '-'}\n`

    m.reply(txt)
  } catch (e) {
    console.error(e)
    m.reply('Gagal mendapatkan informasi. Mungkin nomor tidak aktif atau dibatasi privasinya.')
  }
}

handler.command = /^stalkwa$/i
handler.tags = ['tools']
handler.help = ['stalkwa <nomor>']

export default handler