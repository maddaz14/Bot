import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Validasi input: name|quote
  if (!text || !text.includes('|')) {
    return m.reply(`❌ Format salah!\nContoh: *${usedPrefix + command} ubed|Aku kangen kamu*`);
  }

  const [name, ...restText] = text.split('|');
  const quote = restText.join(' ').trim();

  if (!name || !quote) {
    return m.reply(`❌ Pastikan kamu mengisi *nama* dan *quote* dengan benar.\nContoh: *${usedPrefix + command} ubed|Aku kangen kamu*`);
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const apiUrl = `https://api.siputzx.my.id/api/canvas/fake-xnxx?apikey=${global.ubed}&name=${encodeURIComponent(name)}&quote=${encodeURIComponent(quote)}&likes=2&dislikes=0`;

    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

    await conn.sendMessage(m.chat, {
      image: response.data,
      caption: `✅ Berhasil membuat gambar Fake XNXX\n👤 Nama: *${name}*\n💬 Quote: *${quote}*`
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (error) {
    console.error('Error API:', error.response?.data || error.message);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply('❌ Gagal memproses gambar. Coba lagi nanti atau cek format input.');
  }
};

handler.command = ['fakexnxx'];
handler.help = ['fakexnxx <nama|quote>'];
handler.tags = ['tools', 'image'];
handler.limit = 5;
handler.register = true;
handler.premium = false;

export default handler;