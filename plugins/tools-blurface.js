// Plugin: .blurface
// Dibuat oleh ubed - https://siputzx.my.id

import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  // Kirim reaksi saat mulai memproses
  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

  let imageUrl;

  // Jika ada reply gambar
  if (m.quoted && m.quoted.mtype === 'imageMessage') {
    const media = await m.quoted.download();
    const upload = await (await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: (() => {
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', media, 'image.jpg');
        return form;
      })(),
    })).text();
    imageUrl = upload.includes('https') ? upload.trim() : null;
  } else if (args[0]?.startsWith('http')) {
    imageUrl = args[0];
  }

  if (!imageUrl) throw `*Contoh:* ${usedPrefix + command} <link gambar>\nAtau balas gambar dengan perintah: *${usedPrefix + command}*`;

  try {
    const api = `https://api.siputzx.my.id/api/iloveimg/blurface?image=${encodeURIComponent(imageUrl)}`;
    const res = await fetch(api);

    if (!res.ok) throw '*Gagal memproses gambar!*';

    const buffer = await res.buffer();
    const mime = res.headers.get('content-type') || 'image/jpeg';

    await conn.sendFile(m.chat, buffer, 'blurface.jpg', '*Berhasil diblur!*', m, false, { mimetype: mime });
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    throw '*Terjadi kesalahan saat memproses gambar.*';
  }
};

handler.help = ['blurface'].map(v => v + ' <url|reply image>');
handler.tags = ['tools', 'image'];
handler.command = /^blurface$/i;

export default handler;