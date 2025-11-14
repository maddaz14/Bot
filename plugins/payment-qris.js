import fetch from 'node-fetch'
import QRCode from 'qrcode'

// Konfigurasi API Cashify
const API_KEY = "cashify_1582c52fb9f3df1a27290130429d39067fd7e52f4b22a3c57e186c45111ad59c"

// ID tetap dari kamu
const PAYMENT_ID = "b585a4e7-3b16-4819-8560-4a6711746362"

async function generateQRIS(amount) {
  const res = await fetch("https://cashify.my.id/api/generate/qris", {
    method: "POST",
    headers: {
      "x-license-key": API_KEY,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      id: PAYMENT_ID, // ✅ langsung pakai ID dari kamu
      amount,
      useUniqueCode: true,
      packageIds: ["id.dana"],
      expiredInMinutes: 15
    })
  })

  if (!res.ok) throw new Error(`Gagal generate QRIS: ${res.status}`)
  const json = await res.json()
  if (json.status !== 200) throw new Error(`API error: ${JSON.stringify(json)}`)
  return json.data
}

async function checkStatus(transactionId) {
  const res = await fetch("https://cashify.my.id/api/generate/check-status", {
    method: "POST",
    headers: {
      "x-license-key": API_KEY,
      "content-type": "application/json"
    },
    body: JSON.stringify({ transactionId })
  })
  if (!res.ok) throw new Error(`Gagal cek status: ${res.status}`)
  const json = await res.json()
  return json.data
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let amount = parseInt(args[0])
  if (!amount || amount < 1000) {
    return conn.reply(m.chat, `⚠️ Contoh: *${usedPrefix + command} 10000*\nMinimal 1000`, m)
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    // 1️⃣ Generate QRIS
    const qris = await generateQRIS(amount)

    // 2️⃣ Bikin QRCode gambar dari qr_string
    const qrImage = await QRCode.toBuffer(qris.qr_string, { type: 'png' })

    await conn.sendMessage(m.chat, {
      image: qrImage,
      caption: `💰 *Pembayaran QRIS*\n\nNominal: Rp${qris.totalAmount.toLocaleString()}\nExpired: 15 menit\n\nSilakan scan QR ini untuk melakukan pembayaran.`,
    }, { quoted: m })

    // 3️⃣ Polling cek status setiap 15 detik
    let interval = setInterval(async () => {
      try {
        const status = await checkStatus(qris.transactionId)
        if (status.status === "paid") {
          clearInterval(interval)
          await conn.sendMessage(m.chat, {
            text: `✅ *Pembayaran Rp${status.amount.toLocaleString()} BERHASIL diterima.*\nTerima kasih 🙏`
          }, { quoted: m })
        } else if (status.status === "expired") {
          clearInterval(interval)
          await conn.sendMessage(m.chat, {
            text: `❌ Pembayaran kadaluarsa. Silakan buat QR baru dengan perintah *.${command} ${amount}*`
          }, { quoted: m })
        }
      } catch (err) {
        console.error("Error cek status:", err.message)
      }
    }, 15000)

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
    conn.reply(m.chat, `❌ Terjadi kesalahan:\n${e.message}`, m)
  }
}

handler.help = ['qris <jumlah>']
handler.tags = ['payment']
handler.command = /^(qris|bayar)$/i
handler.limit = false

export default handler