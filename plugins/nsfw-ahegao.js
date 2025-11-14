import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    await conn.sendMessage(m.chat, { react: { text: '🔞', key: m.key } });

    // Panggil API yang langsung kembalikan buffer gambar
    const response = await axios.get('https://api.lolhuman.xyz/api/random/nsfw/ahegao?apikey=ubed2407', {
      responseType: 'arraybuffer'
    });

    const buffer = response.data;

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: '🔞 Nih Ahegao-nya...',
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error(error);
    await conn.reply(m.chat, '❌ Gagal mengambil gambar Ahegao.', m);
  }
};

handler.command = /^(ahegao)$/i;
handler.tags = ['nsfw'];
handler.help = ['ahegao'];
handler.limit = 3;
handler.premium = true;
handler.register = true;
handler.nsfw = true;

export default handler;