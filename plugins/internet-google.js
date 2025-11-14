import axios from 'axios';

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (error) {
    return false;
  }
};

const handler = async (m, { text, conn }) => {
  if (!text) throw 'Silakan masukkan kueri pencarian atau URL. Contoh: !google https://www.example.com atau !google openai';

  if (isValidUrl(text)) {
    let link = text.trim();
    link = link.replace(/^(https?:\/\/)?(https?:\/\/)/, '');
    link = /^(https?:\/\/)/.test(link) ? link : "https://" + link;

    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    try {
      const res = `https://skizoasia.xyz/api/ssweb?apikey=Twelve&url=${encodeURIComponent(link)}&type=&language=&fullpage=1&width=&height=`;
      const response = await axios.get(res, { responseType: 'arraybuffer' });

      await conn.sendMessage(m.chat, {
        image: Buffer.from(response.data),
        caption: `🖼️ Berikut adalah tangkapan layar dari halaman: ${link}`,
        contextInfo: {
          externalAdReply: {
            title: "🔍 SCREENSHOT RESULT",
            thumbnailUrl: "https://files.catbox.moe/yzvtil.jpg",
            sourceUrl: link,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: floc });

      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
      await conn.sendMessage(m.chat, { react: { text: "🔴", key: m.key } });
      m.reply('*⚠️ Gagal mengambil tangkapan layar dari URL.*');
    }
    return;
  }

  const query = encodeURIComponent(text);
  const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${global.GoogleApi}&cx=${global.GoogleCx}&q=${query}`;

  try {
    const { data } = await axios.get(apiUrl);

    if (!data.items || data.items.length === 0) {
      m.reply('Tidak ada hasil yang ditemukan.');
      return;
    }

    const results = data.items.slice(0, 5).map((item, index) => {
      return `🔎 *Hasil ${index + 1}*\n` +
             `📌 *Judul*: ${item.title}\n` +
             `🌐 *Link*: ${item.link}\n` +
             `📄 *Deskripsi*: ${item.snippet}\n`;
    }).join('\n\n');

    const ponta = `🔍 *Hasil Pencarian untuk*: ${text}\n\n${results}`;

    await conn.sendMessage(m.chat, {
      text: ponta,
      contextInfo: {
        externalAdReply: {
          title: "🔍 GOOGLE SEARCH",
          thumbnailUrl: "https://files.catbox.moe/yzvtil.jpg",
          sourceUrl: "",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: floc });

  } catch (error) {
    console.error('Error saat pencarian:', error);
    m.reply('*⚠️ Terjadi kesalahan saat melakukan pencarian. Coba lagi nanti.*');
  }
};

handler.command = ['google', 'search'];
handler.tags = ['internet'];
handler.help = ['google'];
handler.limit = 1;

export default handler;