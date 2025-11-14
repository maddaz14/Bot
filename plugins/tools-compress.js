// Plugin: .compress
// Dibuat oleh ubed - https://siputzx.my.id

import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  // Kirim emoji react ⏳ saat mulai
  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

  let imageUrl;

  // Cek jika reply ke gambar
  if (m.quoted && m.quoted.mtype === 'imageMessage') {
    const media = await m.quoted.download();
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', media, 'image.jpg');

    const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form });
    const url = await res.text();
    imageUrl = url.includes('https') ? url.trim() : null;
  } else if (args[0]?.startsWith('http')) {
    imageUrl = args[0];
  }

  if (!imageUrl) throw `*Contoh:* ${usedPrefix + command} <link gambar>\nAtau balas gambar dengan perintah: *${usedPrefix + command}*`;

  try {
    const api = `https://api.siputzx.my.id/api/iloveimg/compress?image=${encodeURIComponent(imageUrl)}`;
    const result = await fetch(api);

    if (!result.ok) throw '*Gagal memproses kompresi gambar!*';

    const buffer = await result.buffer();
    const mime = result.headers.get('content-type') || 'image/jpeg';

    await conn.sendFile(m.chat, buffer, 'compressed.jpg', '*Gambar berhasil dikompres!*', m, false, { mimetype: mime });
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    throw '*Terjadi kesalahan saat memproses kompresi.*';
  }
};

handler.help = ['compress'].map(v => v + ' <url|reply image>');
handler.tags = ['tools', 'image'];
handler.command = /^compress$/i;

export default handler;