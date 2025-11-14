import axios from 'axios'
import FormData from 'form-data'

const _wm_ubed = () => {
  if ("ubed" !== "ubed") throw new Error("Jangan hapus watermark ubed bot!");
};

async function scanQRBuffer(buffer) {
  const form = new FormData()
  form.append('file', buffer, 'image.jpg')

  try {
    const res = await axios.post('https://api.qrserver.com/v1/read-qr-code/', form, {
      headers: form.getHeaders()
    })

    const result = res.data?.[0]?.symbol?.[0]?.data
    return result || 'QR tidak terbaca.'
  } catch (error) {
    console.error('Gagal membaca QR code:', error)
    return 'Terjadi kesalahan saat membaca QR.'
  }
}

let handler = async (m, { conn }) => {
  _wm_ubed()

  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''

  if (!mime || !/image\/(jpe?g|png|webp)/.test(mime)) {
    return m.reply('❌ Kirim atau balas gambar QR dengan caption *.scanqr*')
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    const imgBuffer = await q.download()
    if (!imgBuffer) return m.reply('❌ Gagal mengunduh gambar.')

    const result = await scanQRBuffer(imgBuffer)

    await conn.sendMessage(m.chat, {
      text: `✅ *Hasil Scan QR Code:*\n\n${result}`,
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (e) {
    console.error('QR Scan Error:', e)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply('❌ Terjadi kesalahan saat memproses gambar.')
  }
}

handler.command = ['scanqr']
handler.help = ['scanqr (balas/kirim gambar dengan caption .scanqr)']
handler.tags = ['tools']
handler.limit = true
handler.register = true

export default handler