import * as cheerio from "cheerio";
import axios from 'axios';

async function mcpedl(mods) {
  try {
    const ress = await axios.get(`https://mcpedl.org/?s=${mods}`);
    const $ = cheerio.load(ress.data);

    const result = [];

    $('.g-block.size-20').first().each((_, element) => {
      const title = $(element).find('.entry-title a').text();
      const url = $(element).find('.entry-title a').attr('href');
      const imageUrl = $(element).find('.post-thumbnail img').attr('data-src');
      
      const ratingWidth = $(element).find('.rating-wrapper .rating-box .rating-subbox').attr('style');
      const rating = ratingWidth ? parseInt(ratingWidth.split(':')[1]) / 100 * 5 : 0;

      result.push({
        title,
        url,
        imageUrl,
        rating,
      });
    });

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('❗ Masukkan nama mod yang ingin dicari! Contoh: .mcpedl RTX');
  
  conn.sendMessage(m.chat, { react: { text: '🕓', key: m.key } });

  let mod = await mcpedl(text);
  if (!mod) return m.reply('❌ Mod tidak ditemukan.');

  let caption = `🔍 *${mod.title}*\n`;
  caption += `⭐ *Rating:* ${mod.rating}/5\n`;
  caption += `🌐 *Link:* ${mod.url}`;

  await conn.sendMessage(
    m.chat,
    {
      image: { url: mod.imageUrl },
      caption: caption,
      contextInfo: {
        externalAdReply: {
          title: `🔍 ${mod.title}`,
          body: `⭐ Rating: ${mod.rating}/5`,
          thumbnailUrl: mod.imageUrl,
          sourceUrl: mod.url,
        },
      },
    },
    { quoted: floc }
  );
  
  conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
};

handler.command = /^(mcpedl)$/i;
handler.tags = ['internet'];
handler.help = ['mcpedl'];
handler.limit = true;

export default handler;