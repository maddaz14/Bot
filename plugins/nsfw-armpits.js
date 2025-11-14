import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    await conn.sendMessage(m.chat, { react: { text: '🔞', key: m.key } });

    // Ambil buffer gambar langsung dari endpoint API
    const response = await axios.get('https://api.lolhuman.xyz/api/random/nsfw/armpits?apikey=ubed2407', {
      responseType: 'arraybuffer'
    });

    const buffer = response.data;

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: '🔞 Nih Armpits-nya...',
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error(error);
    await conn.reply(m.chat, '❌ Gagal mengambil gambar Armpits.', m);
  }
};

handler.command = /^(armpits)$/i;
handler.tags = ['nsfw'];
handler.help = ['armpits'];
handler.limit = 3;
handler.premium = true;
handler.register = true;
handler.nsfw = true;

export default handler;