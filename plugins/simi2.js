import axios from 'axios'

let handler = async (m, { conn, command, text, prefix, args, participants }) => {
  const teks = args.join(" ") || ''

  const fkontak = {
    key: {
      participant: '0@s.whatsapp.net',
      remoteJid: "0@s.whatsapp.net",
      fromMe: false,
      id: "Halo",
    },
    message: {
      conversation: "simi"
    }
  }

  if (!teks) {
    return m.reply(`Masukkan teks untuk dibalas Simi.\nContoh: ${prefix + command} Hai`)
  }

  await conn.sendMessage(m.chat, {
    react: {
      text: '💬',
      key: m.key
    }
  })

  try {
    const { data } = await axios.get(`https://api.ubed.my.id/ai/simi`, {
      params: {
        apikey: 'alhamdulillah',
        text: teks
      }
    })

    if (!data?.result || data.status?.toLowerCase() !== 'success') {
      return m.reply('❌ Gagal mendapatkan balasan dari Simi.')
    }

    await conn.sendMessage(m.chat, {
      text: data.result,
    }, { quoted: fkontak })

    await conn.sendMessage(m.chat, {
      react: {
        text: '✅',
        key: m.key
      }
    })

  } catch (e) {
    console.error('Simi Error:', e)
    m.reply('❌ Terjadi kesalahan saat menghubungi Simi API.')
  }
}

handler.help = ['simi <teks>']
handler.tags = ['ai', 'fun']
handler.command = /^(simi)$/i

export default handler