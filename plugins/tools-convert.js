import axios from 'axios'

const fkontak = {
  key: {
    participant: '0@s.whatsapp.net',
    remoteJid: 'status@broadcast',
    fromMe: false,
    id: 'Halo',
  },
  message: {
    conversation: '💱 Currency Converter by UbedBot',
  },
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const [amountStr, from, to] = text.split(' ')
  const amount = parseFloat(amountStr)

  if (!amount || !from || !to) {
    return conn.reply(m.chat, `💱 *Format salah!*\nContoh: *${usedPrefix + command} 100 USD IDR*`, m, { quoted: fkontak })
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '💱', key: m.key } })

    const api = `https://api.siputzx.my.id/api/currency/convert?amount=${amount}&from=${from.toUpperCase()}&to=${to.toUpperCase()}`
    const res = await axios.get(api)
    const data = res.data?.data

    if (!res.data.success || !data) throw '❌ Gagal konversi mata uang.'

    const hasil = `💱 *Currency Converter*\n\n📤 Dari: *${data.amount} ${data.from}*\n📥 Ke: *${data.result.toLocaleString('id-ID')} ${data.to}*\n💹 Kurs: *1 ${data.from} = ${data.rate.toLocaleString('id-ID')} ${data.to}*`

    await conn.sendMessage(m.chat, { text: hasil }, { quoted: m })
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    conn.reply(m.chat, `❌ Terjadi kesalahan:\n${e.message || e}`, m)
  }
}

handler.help = ['convert <jumlah> <from> <to>']
handler.tags = ['tools']
handler.command = /^convert$/i
handler.limit = true
handler.register = true

export default handler