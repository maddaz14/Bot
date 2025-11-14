import axios from 'axios';
import * as cheerio from "cheerio";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/89.0',
];

const getRandomUserAgent = () => userAgents[Math.floor(Math.random() * userAgents.length)];

let cache = {};

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        throw `Contoh penggunaan: ${usedPrefix}${command} Xiaomi 14\n\nEh Senpai, jangan lupa kasih nama HP-nya ya, aku ga bisa nebak pikiranmu (belum bisa, hehe)!`;
    }

    let query = args.join(' ');
    if (cache[query]) {
        return await conn.sendFile(m.chat, cache[query].image, `${cache[query].title}.jpg`, cache[query].caption, m);
    }

    let searchUrl = `https://www.gsmarena.com/results.php3?sQuickSearch=yes&sName=${encodeURIComponent(query)}`;
    try {
        let searchResponse = await axios.get(searchUrl, {
            headers: { 'User-Agent': getRandomUserAgent() },
            timeout: 10000
        });
        let $ = cheerio.load(searchResponse.data);
        let firstPhoneLink = $('.makers a').first().attr('href');
        
        if (!firstPhoneLink) {
            throw `Yah, HP "${query}" kayaknya ga ketemu, Senpai. Coba cek lagi nama HP-nya, typo kali?`;
        }

        await sleep(3000);

        let detailUrl = `https://www.gsmarena.com/${firstPhoneLink}`;
        let detailResponse = await axios.get(detailUrl, {
            headers: { 'User-Agent': getRandomUserAgent() },
            timeout: 10000
        });
        $ = cheerio.load(detailResponse.data);

        let title = $('h1.specs-phone-name-title').text().trim() || 'Judul ga ketemu';
        let price = $('.price').text().trim() || 'Harga belum tersedia, cek toko terdekat ya Senpai!';
        let thumbnail = $('.specs-photo-main img').attr('src');
        let specs = {};

        $('#specs-list table').each((i, table) => {
            let category = $(table).find('th').first().text().trim();
            if (category) {
                specs[category] = {};
                $(table).find('tr').each((j, row) => {
                    let key = $(row).find('td.ttl').text().trim();
                    let value = $(row).find('td.nfo').text().trim();
                    if (key && value) specs[category][key] = value;
                });
                if (Object.keys(specs[category]).length === 0) delete specs[category];
            }
        });

        if (Object.keys(specs).length === 0) {
            throw `Spesifikasi kosong nih, Senpai. Kayaknya scrapingnya ga jalan, coba HP lain atau tunggu Alicia cek lagi!`;
        }

        let caption = `
*📱 ${title} - Spesifikasi Super Lengkap!*  
*💵 Harga:* ${price}  
*🔍 Spesifikasi Detail:*  
${Object.entries(specs).map(([category, details]) => `
*${category}:*  
${Object.entries(details).map(([key, val]) => `  • *${key}:* ${val}`).join('\n')}
`).join('\n')}  
*🔗 Link:* [Lihat Lengkap](${detailUrl})  

Senpai, ini HP kece abis, buruan beli sebelum kehabisan! 😎
        `.trim();

        await sleep(2000);

        let imageResponse = await axios.get(thumbnail, {
            headers: { 'User-Agent': getRandomUserAgent() },
            responseType: 'arraybuffer',
            timeout: 10000
        });
        let imageBuffer = Buffer.from(imageResponse.data, 'binary');

        cache[query] = { image: imageBuffer, title, caption };
        await conn.sendFile(m.chat, imageBuffer, `${title}.jpg`, caption, m);
    } catch (error) {
        m.reply(`Oops, ada error nih Senpai: ${error.message}. Sabar ya, aku coba bantu lagi kalau Senpai kasih info lebih jelas!`);
    }
};

handler.help = ['spekHp'].map(v => v + ' <query>');
handler.tags = ['tools'];
handler.command = /^(spekHp|spesifikasiHp|shp)$/i;
handler.limit = 1;

export default handler;