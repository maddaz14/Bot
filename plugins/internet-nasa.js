import axios from 'axios';
import * as cheerio from "cheerio";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const userAgent = 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0';

let cache = {};

const handler = async (m, { conn, args, usedPrefix, command }) => {
    let query = args.join(' ') || 'latest';
    let cacheKey = `${command}_${query}`;

    if (cache[cacheKey]) {
        return await conn.reply(m.chat, cache[cacheKey], m);
    }

    const url = 'https://www.nasa.gov/news/all-news/';
    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': userAgent },
            timeout: 15000
        });
        
        const $ = cheerio.load(response.data);
        
        const latestNews = [];
        $('article, .item, .news-item, .content').each((i, element) => {
            const title = $(element).find('h1, h2, h3, .title').text().trim();
            const link = $(element).find('a').attr('href') || '';
            let date = $(element).find('time, .date, .meta, .timestamp, .publish-date, [datetime]').text().trim() ||
                       $(element).find('[datetime]').attr('datetime') || 
                       $(element).text().match(/\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},\s+\d{4}\b/)?.[0] || 
                       'Tanggal ga ketemu';
            const excerpt = $(element).find('p, .excerpt, .summary').text().trim() || 'Deskripsi ga ada';

            if (title && link) {
                latestNews.push({
                    title: title,
                    link: link.startsWith('http') ? link : `https://www.nasa.gov${link}`,
                    date: date,
                    excerpt: excerpt
                });
            }
        });

        if (latestNews.length === 0) {
            throw 'Yah, Senpai, ga nemu berita sama sekali. Kayanya situs NASA lagi bermasalah!';
        }

        let replyText = `*Berita Terbaru dari NASA, Senpai!* 🚀\n`;
        replyText += '====================================\n';
        latestNews.slice(0, 3).forEach((news, index) => {
            replyText += `${index + 1}. *${news.title}*\n`;
            replyText += `   Tanggal: ${news.date}\n`;
            replyText += `   Deskripsi: ${news.excerpt}\n`;
            replyText += `   Link: [Klik di Sini](${news.link})\n`;
            replyText += '--------------------------------\n';
        });
        replyText += `Senpai, mau tahu lebih banyak? Coba lagi nanti ya, aku cariin yang terbaru! 😎`;

        cache[cacheKey] = replyText;

        await conn.reply(m.chat, replyText, m);

    } catch (error) {
        await conn.reply(m.chat, `Oops, ada error nih Senpai: ${error.message}. Sabar ya, aku coba bantu lagi nanti!`, m);
    }
};

handler.help = ['nasa'].map(v => v + ' - Dapatkan berita terbaru dari NASA!');
handler.tags = ['internet'];
handler.command = /^(nasanews|nasa)$/i;
handler.limit = 1;

export default handler;