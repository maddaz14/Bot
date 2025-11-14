import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix }) => {
  let [username, bio, colorPreference] = text.split('|').map(v => v.trim());

  if (!username || !bio) throw `Gunakan perintah ini dengan format: ${usedPrefix}faketiktok <username>|<bio>|[putih atau hitam]`;

  conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

  try {
    const name = m.pushName;
    const ppUrl = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://files.catbox.moe/ll9k0z.jpg');
    let apiUrl;

    if (!colorPreference || colorPreference.toLowerCase() === 'putih') {
      apiUrl = `https://api.ubed.my.id/tools/Fake-tiktok2?apikey=ubed2407&name=${encodeURIComponent(name)}&username=${encodeURIComponent(username)}&pp=${encodeURIComponent(ppUrl)}&bio=${encodeURIComponent(bio)}`;
    } else if (colorPreference.toLowerCase() === 'hitam') {
      apiUrl = `https://api.ubed.my.id/tools/Fake-tiktok?apikey=ubed2407&name=${encodeURIComponent(name)}&username=${encodeURIComponent(username)}&pp=${encodeURIComponent(ppUrl)}&bio=${encodeURIComponent(bio)}`;
    } else {
      throw `Pilihan warna tidak valid. Gunakan 'putih' atau 'hitam'. Contoh: ${usedPrefix}faketiktok <username>|<bio>|hitam`;
    }

    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

    await conn.sendMessage(m.chat, { image: response.data }, { quoted: m });
    await conn.sendMessage(m.chat, { react: { text: '🎉', key: m.key } });

  } catch (error) {
    console.error('Error:', error);
    await conn.reply(m.chat, `Maaf, terjadi kesalahan saat membuat fake profile TikTok. ${error}`, m);
  }
};

handler.help = ['faketiktok <username>|<bio>|[putih atau hitam]'];
handler.tags = ['tools'];
handler.command = /^faketiktok$/i;
handler.register = true;
handler.premium = false;

export default handler;