// Plugin: .lahelu
// Dibuat oleh ubed - https://siputzx.my.id

import fetch from 'node-fetch';
import { format } from 'util';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `*Contoh:* ${usedPrefix + command} https://lahelu.com/post/PMujNAfxy`;

  try {
    // Reaksi saat memproses
    await conn.sendReact(m.chat, '⏳', m.key);

    const url = `https://api.siputzx.my.id/api/d/lahelu?url=${encodeURIComponent(args[0])}`;
    const res = await fetch(url);
    const json = await res.json();

    if (!json.status || !json.result) throw '*Gagal mengambil data Lahelu!*';

    const r = json.result;
    const user = r.userInfo || {};
    const topic = r.topicInfo || {};

    const caption = `
🎵 *${r.title}*
👤 *${user.username}*
🆔 Post ID: ${r.postId}
📥 Upvotes: ${r.totalUpvotes} | 👎 Downvotes: ${r.totalDownvotes} | 💬 Komentar: ${r.totalComments}
🏷️ Hashtags: ${r.hashtags.map(v => `#${v}`).join(', ')}

📚 *Topik:* ${topic.title}
👤 Admin Topik: ${topic.adminIds?.length || 0} orang
📌 Deskripsi:
${topic.description || '-'}

📣 *Deskripsi Pengguna:*
${user.description || '-'}

🌍 Negara: ${r.country}
`.trim();

    const mediaUrl = r.media;

    await conn.sendFile(m.chat, mediaUrl, 'lahelu.mp4', caption, m);
  } catch (err) {
    console.error(err);
    throw '*Terjadi kesalahan saat mengambil postingan Lahelu.*';
  }
};

handler.help = ['lahelu'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.command = /^lahelu$/i;

export default handler;