import axios from 'axios';
import * as cheerio from "cheerio";

const handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply('Silakan masukkan kata kunci pencarian Wikipedia, contohnya: "negara terkaya".');
  }

  m.reply('Mencari informasi di Wikipedia...');

  try {
    // Mencari URL pencarian di Wikipedia
    const searchUrl = `https://id.wikipedia.org/w/index.php?search=${encodeURIComponent(text)}`;
    const { data } = await axios.get(searchUrl);

    // Memuat data menggunakan cheerio
    const $ = cheerio.load(data);

    // Mengambil judul artikel dan tautan pertama
    const firstResult = $('ul.mw-search-results li').first();
    const title = firstResult.find('a').text();
    const link = `https://id.wikipedia.org${firstResult.find('a').attr('href')}`;

    // Mengambil ringkasan dari artikel
    const articlePage = await axios.get(link);
    const articleContent = cheerio.load(articlePage.data);
    const extract = articleContent('p').first().text(); // Mengambil paragraf pertama sebagai ringkasan

    const caption = `*Judul:* ${title}\n\n*Deskripsi:* ${extract}\n\n*Link:* ${link}`;
    
    conn.sendMessage(m.chat, { text: caption }, { quoted: m });
  } catch (error) {
    console.error(error);
    m.reply('Maaf, saya tidak dapat menemukan informasi untuk pencarian tersebut. Silakan coba lagi dengan kata kunci lain.');
  }
};

handler.help = ['wikipedia <query>'];
handler.tags = ['internet'];
handler.command = /^(wiki(pedia)?)$/i;

export default handler;