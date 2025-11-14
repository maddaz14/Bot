// Plugin: .ghstalk
// Dibuat oleh ubed - https://siputzx.my.id

import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `*Contoh:* ${usedPrefix + command} octocat`;

  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

  try {
    const api = `https://api.siputzx.my.id/api/stalk/github?user=${encodeURIComponent(args[0])}`;
    const res = await fetch(api);
    const json = await res.json();

    if (!json.status || !json.data) throw '*Gagal mengambil data pengguna GitHub!*';

    const data = json.data;
    const caption = `
👤 *GitHub Stalker*

• 🆔 Username: ${data.username}
• 🧑 Nama: ${data.nickname || '-'}
• 🏢 Perusahaan: ${data.company || '-'}
• 🌍 Lokasi: ${data.location || '-'}
• 📮 Blog: ${data.blog || '-'}
• 📦 Repos Publik: ${data.public_repo}
• 🧾 Gists Publik: ${data.public_gists}
• 👥 Pengikut: ${data.followers}
• 👤 Mengikuti: ${data.following}
• 🗓️ Dibuat: ${data.created_at}
• ♻️ Diupdate: ${data.updated_at}
• 🔗 URL: ${data.url}
    `.trim();

    await conn.sendFile(m.chat, data.profile_pic, 'profile.jpg', caption, m);
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    throw '*Terjadi kesalahan saat mengambil data GitHub!*';
  }
};

handler.help = ['ghstalk'].map(v => v + ' <username>');
handler.tags = ['stalker'];
handler.command = /^ghstalk|githubstalk$/i;

export default handler;