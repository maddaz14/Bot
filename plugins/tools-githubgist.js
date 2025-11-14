// Plugin: .githubgist
// Dibuat oleh ubed - https://siputzx.my.id

import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `*Contoh:* ${usedPrefix + command} https://gist.github.com/siputzx/966268a3aa3c14695e80cc9f30da8e9f`;
  }

  try {
    const url = `https://api.siputzx.my.id/api/d/github?url=${encodeURIComponent(args[0])}`;
    const res = await fetch(url);
    const json = await res.json();

    if (!json?.files || json.files.length === 0) {
      throw '*Gagal mengambil file dari gist!*';
    }

    const { owner, gist_id, description, files } = json;
    const text = `
📦 *Gist ID:* ${gist_id}
👤 *Owner:* ${owner}
📝 *Deskripsi:* ${description || '-'}
📄 *Total File:* ${files.length}

${files.map((f, i) => `📁 *${f.name}* (${f.language || 'Unknown'})\n🔗 ${f.raw_url}`).join('\n\n')}
    `.trim();

    await conn.reply(m.chat, text, m);
  } catch (err) {
    console.error(err);
    throw '*Terjadi kesalahan saat mengambil gist.*';
  }
};

handler.help = ['githubgist'].map(v => v + ' <url>');
handler.tags = ['tools'];
handler.command = /^githubgist$/i;

export default handler;