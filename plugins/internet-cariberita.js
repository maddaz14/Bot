import fetch from 'node-fetch';
import * as cheerio from "cheerio";

async function scrapeDetik(kataKunci) {
  try {
    const url = `https://www.detik.com/search/searchall?query=${kataKunci}`;
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const hasil = [];

    $('.list-content__item').each((i, el) => {
      const judul = $(el).find('.media__title').text().trim();
      const deskripsi = $(el).find('.media__content').text().trim();
      const link = $(el).find('a').attr('href');

      hasil.push({
        sumber: "DETIK.COM",
        judul: judul,
        deskripsi: deskripsi,
        url: link,
      });
    });

    return hasil;
  } catch (error) {
    console.error("Error scraping Detik.com:", error);
    return [];
  }
}

async function handler(m, { text, command }) {
  if (!text) {
    return m.reply("Masukan kata kunci pencarian.");
  }

  const hasilPencarian = await scrapeDetik(text);

  if (hasilPencarian.length === 0) {
    return m.reply("Tidak ada berita yang ditemukan.");
  }

  let pesan = "Hasil Pencarian Berita:\n\n";
  hasilPencarian.forEach((berita, index) => {
    pesan += `[${index + 1}] ${berita.sumber}\n`;
    pesan += `Judul: ${berita.judul}\n`;
    pesan += `Deskripsi: ${berita.deskripsi}\n`;
    pesan += `URL: ${berita.url}\n\n`;
  });

  m.reply(pesan);
}

handler.help = ['cariberita <keyword>'];
handler.tags = ['internet'];
handler.command = /^cariberita$/i;
handler.register = true;
handler.limit = 1;

export default handler;