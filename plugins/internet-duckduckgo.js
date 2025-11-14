import axios from 'axios';

const handler = async (m, { text, conn }) => {
  if (!text) throw 'Eh Senpai, kasih aku kueri dong! Misal: !duckduckgo kucing lucu';

  const query = encodeURIComponent(text);
  const apiUrl = `https://api.duckduckgo.com/?q=${query}&format=json&no_html=1&skip_disambig=1`;

  try {
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    const { data } = await axios.get(apiUrl);

    if (!data.RelatedTopics || data.RelatedTopics.length === 0) {
      await conn.sendMessage(m.chat, { react: { text: "🔴", key: m.key } });
      m.reply('Waduh Senpai, aku cari-cari kok ga nemu apa-apa. Coba kueri lain deh!');
      return;
    }

    const results = data.RelatedTopics.slice(0, 5)
      .filter(item => item.Text && item.FirstURL) // Filter biar ga ada yang kosong
      .map((item, index) => {
        return `🦆 *Hasil ${index + 1}*\n` +
               `📌 *Judul*: ${item.Text.split(' - ')[0]}\n` +
               `🌐 *Link*: ${item.FirstURL}\n` +
               `📄 *Deskripsi*: ${item.Text}\n`;
      }).join('\n\n');

    const ponta = `🔍 *Hasil Pencarian DuckDuckGo untuk*: ${text}\n\n${results}\n\nKeren kan, Senpai? Aku cari pake DuckDuckGo biar lebih privat!`;

    await conn.sendMessage(m.chat, {
      text: ponta,
      contextInfo: {
        externalAdReply: {
          title: "🦆 DUCKDUCKGO SEARCH",
          thumbnailUrl: "https://files.catbox.moe/yzvtil.jpg",
          sourceUrl: "",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error('Error bro:', error);
    await conn.sendMessage(m.chat, { react: { text: "🔴", key: m.key } });
    m.reply('*⚠️ Aduh Senpai, ada error nih. Sabar ya, aku coba benerin dulu!*');
  }
};

handler.command = ['duckduckgo', 'ddg'];
handler.tags = ['internet'];
handler.help = ['duckduckgo <kueri>', 'ddg <kueri>'];
handler.limit = 1;

export default handler;