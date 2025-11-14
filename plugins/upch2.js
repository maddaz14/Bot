let handler = async (m, { conn, usedPrefix, command, quoted }) => {
  if (!quoted || !quoted.message) {
    return conn.reply(m.chat, `⚠️ *Reply* file yang ingin dikirim ke Channel!\n\n📌 *Contoh:* ${usedPrefix + command}`, m)
  }

  let mime = quoted.mimetype || quoted.message?.audioMessage?.mimetype || quoted.message?.videoMessage?.mimetype

  // Cek apakah file yang di-reply adalah audio, video, atau PTV
  if (mime && mime.includes('audio')) {
    let media = await quoted.download()
    let channelID = '120363369035192952@newsletter' // Ganti dengan ID Channel WA yang benar
    let isPTT = !!quoted.message.audioMessage?.ptt // Cek apakah audio adalah Voice Note atau Audio biasa

    try {
      await conn.sendMessage(channelID, {
        audio: media,
        mimetype: mime,
        ptt: isPTT,
        fileName: 'audio.mp3',
        caption: '🎵 Audio dari grup/private chat.'
      })
      await conn.reply(m.chat, '✅ Audio berhasil dikirim ke Channel!', m)
    } catch (e) {
      console.log('[❌] Gagal Kirim MP3:', e.message)
      await conn.reply(m.chat, '⚠️ Gagal mengirim MP3! Coba lagi nanti.', m)
    }
  } 
  // Cek apakah file yang di-reply adalah video
  else if (mime && mime.includes('video')) {
    let media = await quoted.download()
    let channelID = '120363369035192952@newsletter' // Ganti dengan ID Channel WA yang benar

    try {
      await conn.sendMessage(channelID, {
        video: media,
        mimetype: mime,
        fileName: 'video.mp4',
        caption: '🎬 Video dari grup/private chat.'
      })
      await conn.reply(m.chat, '✅ Video berhasil dikirim ke Channel!', m)
    } catch (e) {
      console.log('[❌] Gagal Kirim Video:', e.message)
      await conn.reply(m.chat, '⚠️ Gagal mengirim Video! Coba lagi nanti.', m)
    }
  } 
  // Cek jika media adalah PTV (video URL)
  else if (mime && mime.includes('url')) {
    // Mendapatkan PTV URL dari database atau list
    let ptvUrl = global.db.data.ptv[input.toLowerCase()]
    if (!ptvUrl) return conn.reply(m.chat, `❌ PTV dengan judul *${input}* tidak ditemukan.`, m)

    try {
      await conn.sendMessage(channelID, {
        video: { url: ptvUrl },
        ptv: true,
        gifPlayback: true,
        caption: `🎬 PTV: *${input}* dari grup/private chat.`
      })
      await conn.reply(m.chat, '✅ PTV berhasil dikirim ke Channel!', m)
    } catch (e) {
      console.log('[❌] Gagal Kirim PTV:', e.message)
      await conn.reply(m.chat, '⚠️ Gagal mengirim PTV! Coba lagi nanti.', m)
    }
  } 
  // Jika format tidak sesuai
  else {
    return conn.reply(m.chat, `⚠️ *Reply* file audio, video, atau PTV, bukan yang lain!\n\n📌 *Contoh:* ${usedPrefix + command}\n\n📢 Debug MIME: ${mime}`, m)
  }
}

handler.help = ['uploadchannel']
handler.tags = ['tools']
handler.command = /^upch2$/i

export default handler