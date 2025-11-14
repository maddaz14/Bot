// 🗂️ plugins/owner-upch.js
// Dibuat oleh ubed - versi hardcode channel id (media fix)

import { writeFileSync, unlinkSync, readFileSync } from 'fs'
import path from 'path'
import { spawn } from 'child_process'

const handler = async (m, { conn, args }) => {
  const q = m.quoted || m
  const mime = (q.msg || q).mimetype || ''
  const isMedia = /image|video|audio|sticker/.test(mime)

  // === Hardcode channel ID langsung di sini ===
  const channelId = '120363369035192952@newsletter'
  const newsletterName = 'ubed Bot'

  // === kalau .upch doang tanpa teks/media ===
  if (!args[0] && !isMedia) {
    let possibleText = q.text || q.caption || ''
    if (!possibleText || possibleText.trim().toLowerCase() === '.upch') {
      return m.reply('⚠️ Balas/kirim text, gambar, atau video lalu ketik *.upch* untuk upload ke channel.')
    }
  }

  // === contextInfo untuk bikin tampilan channel + thumbnail ===
  const contextInfo = {
    isForwarded: true,
    forwardingScore: 256,
    forwardedNewsletterMessageInfo: {
      newsletterJid: channelId,
      newsletterName,
      serverMessageId: 1
    },
    externalAdReply: {
      title: newsletterName,
      body: 'Broadcast via Bot',
      mediaType: 2,
      thumbnailUrl: 'https://files.catbox.moe/xxzzyv.jpg',
      sourceUrl: `https://whatsapp.com/channel/0029Vb1ryLH3WHTd0blIVg3Z`,
      renderLargerThumbnail: false
    }
  }

  // === isi caption ===
  let caption = args.length > 0 ? args.join(' ').trim() : ''
  if (!caption) {
    caption = q.text || q.caption || ''
    if (caption.trim().toLowerCase() === '.upch') caption = ''
  }

  // === kalau ada media ===
  if (isMedia) {
    m.reply('⏳ Sedang mengupload media...')
    try {
      const media = await q.download()
      if (!media) throw 'Gagal unduh media.'

      if (/image/.test(mime) && mime !== 'image/webp') {
        await conn.sendMessage(channelId, { image: media, caption: caption || '', contextInfo })
      } else if (/video/.test(mime)) {
        await conn.sendMessage(channelId, { video: media, caption: caption || '', mimetype: 'video/mp4', contextInfo })
      } else if (/audio/.test(mime)) {
        const oggPath = await convertToOpus(media)
        const oggBuffer = readFileSync(oggPath)
        unlinkSync(oggPath)
        await conn.sendMessage(channelId, { audio: oggBuffer, mimetype: 'audio/ogg; codecs=opus', ptt: true, contextInfo })
      } else if (mime === 'image/webp') {
        await conn.sendMessage(channelId, { sticker: media })
      } else {
        throw 'Media tidak didukung.'
      }

      return m.reply(`✅ Media berhasil dikirim ke channel *${newsletterName}*!`)
    } catch (err) {
      return m.reply(`❌ Gagal proses media: ${err.message || err}`)
    }
  }

  // === kalau text doang ===
  try {
    await conn.sendMessage(channelId, { text: caption, contextInfo })
    m.reply(`✅ Pesan berhasil dikirim ke channel *${newsletterName}*!`)
  } catch (err) {
    return m.reply(`❌ Gagal kirim pesan: ${err.message || err}`)
  }
}

handler.help = ['upch [caption / reply media]']
handler.tags = ['owner']
handler.command = /^upch$/i
handler.owner = true

export default handler

// 🔧 Fungsi bantu konversi ke opus
async function convertToOpus(buffer) {
  const input = path.join('/tmp', `${Date.now()}.input`)
  const output = path.join('/tmp', `${Date.now()}.ogg`)
  writeFileSync(input, buffer)

  await new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', ['-i', input, '-c:a', 'libopus', '-b:a', '64k', output])
    ffmpeg.on('close', (code) => (code === 0 ? resolve() : reject(new Error('FFmpeg error'))))
  })

  unlinkSync(input)
  return output
}