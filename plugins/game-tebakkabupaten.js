import * as cheerio from "cheerio";
import fetch from 'node-fetch';
import similarity from 'similarity';

let timeout = 120000;
let poin = 4999;
const threshold = 0.72;

let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebakkabupaten = conn.tebakkabupaten ? conn.tebakkabupaten : {};
    let id = m.chat;
    if (id in conn.tebakkabupaten) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkabupaten[id][0]);
        throw false;
    }
    
    let json = await getRandomKabupaten();
    if (!json) {
        return conn.reply(m.chat, '❌ Gagal mengambil data kabupaten. Silakan coba lagi nanti.', m);
    }
    
    let caption = `*${command.toUpperCase()}*
Kabupaten apakah ini?
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}hkab untuk bantuan
Bonus: ${poin} XP
    `.trim();
    
    conn.tebakkabupaten[id] = [
        await conn.sendFile(m.chat, json.url, '', caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tebakkabupaten[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.title}*`, conn.tebakkabupaten[id][0]);
            delete conn.tebakkabupaten[id];
        }, timeout)
    ];
};

handler.help = ['tebakkabupaten'];
handler.tags = ['game'];
handler.command = /^tebakkabupaten/i;

handler.before = async function (m, { conn }) {
    let id = m.chat;
    if (!m.text) return;
    this.tebakkabupaten = this.tebakkabupaten || {};
    if (!(id in this.tebakkabupaten)) return;
    
    let kuis = this.tebakkabupaten[id];
    
    // Periksa apakah pengguna menyerah
    let isSurrender = /^(me)?nyerah|surr?ender$/i.test(m.text);
    if (isSurrender) {
        clearTimeout(kuis[3]);
        delete this.tebakkabupaten[id];
        return m.reply('*Yah, menyerah :( !*');
    }

    let json = kuis[1];
    
    // Cek apakah jawaban pengguna benar
    if (m.text.toLowerCase().trim() === json.title.toLowerCase().trim()) {
        global.db.data.users[m.sender].exp += kuis[2];
        global.db.data.users[m.sender].limit += 2;
        conn.reply(m.chat, `✅ *Benar!*\n🎉 +${kuis[2]} XP\n🎁 +2 Limit`, m);
        clearTimeout(kuis[3]);
        delete this.tebakkabupaten[id];
    } else if (similarity(m.text.toLowerCase(), json.title.toLowerCase().trim()) >= threshold) {
        m.reply(`*Dikit lagi!*`);
    } else {
        m.reply(`*Salah!*`);
    }
};

export default handler;

const baseUrl = 'https://id.m.wikipedia.org';
async function getRandomKabupaten() {
  try {
    const response = await fetch(baseUrl + '/wiki/Daftar_kabupaten_di_Indonesia');
    const html = await response.text();
    const $ = cheerio.load(html);

    const kabupatenList = $('td a[href^="/wiki/Kabupaten"]').map((index, element) => ({
      link: baseUrl + $(element).attr('href'),
      name: $(element).attr('title')
    })).get().filter(item => item.link && item.name);

    if (kabupatenList.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * kabupatenList.length);
    const randomKabupaten = kabupatenList[randomIndex];

    const imageUrl = await fetchImageUrl(randomKabupaten.link);
    const judul = randomKabupaten.name;
    const judulBaru = judul.replace('Kabupaten ', '');
    const linkGambar = imageUrl;
    const ukuranBaru = linkGambar ? linkGambar.replace(/\/\d+px-/, '/1080px-') : null;

    return {
      link: randomKabupaten.link,
      title: judulBaru,
      url: ukuranBaru
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function fetchImageUrl(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const src = $('tr.mergedtoprow td.infobox-full-data.maptable div.ib-settlement-cols-row div.ib-settlement-cols-cell a.mw-file-description img.mw-file-element').attr('src');
    return src ? 'https:' + src : null;
  } catch (error) {
    return null;
  }
}