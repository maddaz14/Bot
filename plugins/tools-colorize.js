// Plugin: .colorize
// Dibuat oleh ubed - https://siputzx.my.id

import fetch from 'node-fetch';

const handler = async (m, { conn, usedPrefix, command }) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q || {}).mimetype || '';

  if (!/image\/(jpe?g|png)/.test(mime)) throw `📌 *Reply atau kirim gambar dengan perintah:* ${usedPrefix + command}`;

  try {
    // Kirim reaksi saat memproses
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const img = await q.download();
    const uploadRes = await (await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: new URLSearchParams({
        reqtype: 'fileupload',
        userhash: 'a', // Bisa dikosongkan
      }),
      files: {
        fileToUpload: {
          value: img,
          options: {
            filename: 'image.jpg',
            contentType: mime
          }
        }
      }
    })).json();

    const imgUrl = uploadRes.url || uploadRes;
    if (!imgUrl || !imgUrl.startsWith('https://')) throw '*Gagal mengunggah gambar ke Catbox!*';

    const api = `https://api.siputzx.my.id/api/tools/colorize?url=${encodeURIComponent(imgUrl)}`;
    const res = await fetch(api);

    if (!res.ok) throw '*Gagal memproses gambar.*';

    const buffer = await res.buffer();

    await conn.sendFile(m.chat, buffer, 'colorized.jpg', '*✅ Gambar berhasil diwarnai!*', m);
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    throw '*❌ Terjadi kesalahan saat memproses gambar.*';
  }
};

handler.help = ['colorize'].map(v => v + ' <reply gambar>');
handler.tags = ['tools', 'ai'];
handler.command = /^colorize$/i;

export default handler;