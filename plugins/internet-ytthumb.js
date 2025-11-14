import yts from 'yt-search'

let handler = async (m, { conn, args }) => {
  if (!args.length) {
    return m.reply('📌 Contoh penggunaan:\n.ytthumb Alan Walker Faded\n.ytthumb https://youtu.be/60ItHLz5WEA')
  }

  try {
    const query = args.join(' ')
    const res = await yts(query)

    if (!res?.videos?.length) {
      return m.reply('❌ Video tidak ditemukan.')
    }

    // Ambil video pertama
    const video = res.videos[0]

    // Ambil thumbnail (ada beberapa ukuran, ambil maxres kalau ada)
    const thumb = video.thumbnail || video.image || video.imageUrl

    await conn.sendMessage(m.chat, {
      image: { url: thumb },
      caption: `🎬 *Judul:* ${video.title}\n📺 *Channel:* ${video.author?.name}\n⏱️ *Durasi:* ${video.timestamp}\n🔗 *Link:* ${video.url}`
    }, { quoted: m })

  } catch (e) {
    console.error('Error ytthumb:', e)
    m.reply(`💥 Terjadi kesalahan: ${e.message}`)
  }
}

handler.help = ['ytthumb <judul/url>']
handler.tags = ['internet', 'tools']
handler.command = /^ytthumb$/i

export default handler