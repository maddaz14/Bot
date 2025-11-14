import fetch from 'node-fetch';
import * as cheerio from "cheerio";

let handler = async (m, { conn }) => {
  const url = 'https://myanimelist.net/anime/season';

  try {
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);

    let animeList = [];
    $('.seasonal-anime').each((i, elem) => {
      const title = $(elem).find('.title h2').text().trim();
      const image = $(elem).find('.image img').attr('data-src') || $(elem).find('.image img').attr('src') || '';
      const link = $(elem).find('.title a').attr('href') || '#';
      const score = $(elem).find('.score-label').text().trim() || 'N/A';
      const members = $(elem).find('.member').text().trim().replace(',', '') || 'N/A';
      const status = $(elem).find('.info .info2').text().trim() || 'Unknown';
      
      // Hanya menampilkan anime yang masih berjalan dan baru diperbarui
      if (!status.toLowerCase().includes('finished') && !status.toLowerCase().includes('tba')) {
        animeList.push({ title, image, link, score, members, status });
      }
    });

    if (animeList.length === 0) {
      return m.reply('🐱 Tidak ada anime baru yang diperbarui saat ini.');
    }

    let message = '📺 *Anime dengan Episode Baru:*\n\n';
    animeList.slice(0, 5).forEach((anime, index) => {
      message += `*${index + 1}. ${anime.title}*\n`;
      message += `👥 *Members*: ${anime.members}\n`;
      message += `⭐ *Score*: ${anime.score}\n`;
      message += `📅 *Status*: ${anime.status}\n`;
      message += `🔗 [Link](${anime.link})\n\n`;
    });

    let thumbnail = animeList[0]?.image || 'https://files.catbox.moe/mhdie5.jpg';
    let buffer = await fetch(thumbnail).then(res => res.buffer());

    await conn.sendMessage(m.chat, {
      text: message,
      contextInfo: {
        externalAdReply: {
          title: "LIST ANIME EPISODE BARU",
          thumbnail: buffer,
          sourceUrl: url,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    });

  } catch (e) {
    console.error(e);
    m.reply('🐱 Terjadi kesalahan saat mengambil data anime.');
  }
};

handler.help = ['myanimelist'];
handler.tags = ['anime'];
handler.command = /^myanimelist$/i;
handler.limit = 2;
handler.register = true;

export default handler;