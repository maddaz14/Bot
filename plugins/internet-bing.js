import axios from 'axios';
import * as cheerio from "cheerio";

async function BingImages(query) {
  const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2&first=1&tsc=ImageBasicHover`;
  const imageUrls = [];

  try {
    const { data } = await axios.get(searchUrl);
    const $ = cheerio.load(data);

    $('a.iusc').each((i, el) => {
      const m = $(el).attr('m');
      if (m) {
        const match = m.match(/"murl":"(.*?)"/);
        if (match && match[1]) {
          imageUrls.push(match[1]);
        }
      }
    });

    return imageUrls;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

// Handler untuk bot WhatsApp
let handler = async (m, { text, conn }) => {
  if (!text) throw 'Kirimkan teks pencarian!\nContoh: .bing monster';

  m.reply('🔍 Mencari gambar di Bing...');

  const results = await BingImages(text);

  if (results.length === 0) {
    m.reply('Gagal menemukan gambar. Coba kata kunci lain.');
    return;
  }

  // Kirim gambar pertama (atau bisa random)
  await conn.sendFile(m.chat, results[0], 'image.jpg', `Hasil pencarian Bing untuk: *${text}*`, m);
};

handler.command = ['bing'];
handler.help = ['bing <query>'];
handler.tags = ['internet'];
handler.register = true;

export default handler;