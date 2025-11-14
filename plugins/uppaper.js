import axios from 'axios';
import * as cheerio from "cheerio";

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`*Example :* ${usedPrefix + command} Anime,Jumlah (Opsional)`);
    
    let query, count;
    
    if (text.includes(',')) {
        const [queryText, countText] = text.split(',');
        query = queryText.trim();
        count = parseInt(countText.trim());
    } else {
        query = text.trim();
        count = null;
    }   
    
    try {
        const result = await getWallpaper(query);
        
        if (result.length === 0) {
            return m.reply(`Gak Nemu Untuk ${query}`);
        }
        
        const maxResults = count ? Math.min(result.length, count) : result.length;
        
        m.reply(`*Sebentar Yaa...*`);
        
        for (let i = 0; i < maxResults; i++) {
            const wallpaper = result[i];
            
            await conn.sendMessage(m.chat, { 
                image: { url: wallpaper.image },
                fileName: `wallpaper_${i+1}.jpg`,
            }, { quoted: m });
            
            if (i < maxResults - 1) await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
    } catch (error) {
        console.error(error);
        m.reply('Error fetching wallpapers. Please try again later.');
    }
};

async function getWallpaper(s) {
    try {
        const anu = `https://www.uhdpaper.com/search?q=${s}&by-date=true`;
        const { data } = await axios.get(anu, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
                "Accept": "*/*",
            },
        });
        const $ = cheerio.load(data);

        let result = [];

        $('.post-outer').each((_, el) => {
            const title = $(el).find('h2').text().trim();
            const resolution = $(el).find('b').text().trim();
            const image = $(el).find('img').attr('src');
            const description = $(el).find('p').text().trim();
            const source = $(el).find('a').text().trim();
            const link = $(el).find('a').attr('href');

            result.push({
                title,
                resolution,
                image,
                description,
                source,
                link
            });
        });

        return result;
    } catch (error) {
        throw error;
    }
}

handler.help = ['uhdpaper'];
handler.tags = ['downloader'];
handler.command = ['uhdpaper', 'wallpaper', 'uhd'];

export default handler;