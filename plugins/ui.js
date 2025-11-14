import fetch from 'node-fetch';

const handler = async (m, { conn, args, command }) => {
  const url = args[0];
  if (!url || !/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(url)) {
    return m.reply(`📌 *Contoh penggunaan:*\n.${command} https://youtu.be/dQw4w9WgXcQ`);
  }

  // Kirim reaksi saat memproses
  if (conn.sendMessage) {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
  }

  try {
    const api = `https://apizell.web.id/download/youtube?url=${encodeURIComponent(url)}&format=360`;
    const res = await fetch(api);
    const json = await res.json();

    if (!json.success || !json.download) {
      throw new Error('Gagal mengambil data dari API.');
    }

    const { title, thumbnail, download: downloadUrl } = json;

    const caption = `🎬 *YouTube Video Download*\n\n📌 *Judul:* ${title}\n🔗 *Link:* ${url}\n\n© ubed Bot`;

    await conn.sendMessage(
      m.chat,
      {
        video: { url: downloadUrl },
        caption,
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`,
        jpegThumbnail: await (await fetch(thumbnail)).buffer(),
      },
      { quoted: m }
    );

    // Kirim reaksi setelah berhasil
    if (conn.sendMessage) {
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    }
  } catch (e) {
    console.error('[YT-APIZELL ERROR]', e);
    if (conn.sendMessage) {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    }
    m.reply('❌ *Gagal mengunduh video.*');
  }
};

handler.help = ['ytmp4 <url>'];
handler.tags = ['downloader'];
handler.command = /^ui$/i;
handler.limit = true;
handler.premium = false;

export default handler;