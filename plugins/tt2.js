import axios from "axios";
import * as cheerio from "cheerio";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const ponta = {
    "key": {
      "participant": '6285147777105@s.whatsapp.net',
      "remoteJid": "6285147777105@s.whatsapp.net",
      "fromMe": false,
      "id": "Halo",
    },
    "message": {
      "conversation": m.text
    }
  };

  if (!text) {
    return conn.reply(
      m.chat,
      `Link nya mana, Senpai?\nContoh: ${usedPrefix + command} https://vt.tiktok.com/xoxoxox/`,
      ponta
    );
  }

  await conn.sendMessage(m.chat, { react: { text: '🍞', key: m.key } });

  try {
    const videoResult = await tiktokScraper(text);
    const { video_no_watermark, audio, slide_photos } = videoResult;

    let caption = `🍏 Tiktok Download ubed Bot`.trim();

    if (slide_photos && slide_photos.length > 0) {
      for (let slide of slide_photos) {
        await conn.sendFile(m.sender, slide.link, `slide-${slide.label}.jpg`, "", ponta);
      }
      conn.reply(m.chat, "Slide gambar udah dikirim ke chat pribadi ya, Senpai!", ponta);
    } else if (video_no_watermark) {
      await conn.sendFile(m.chat, video_no_watermark, "tiktok.mp4", caption, ponta);
    } else {
      conn.reply(m.chat, "Gagal ambil video tanpa watermark, coba link lain ya, Senpai!", ponta);
    }

    if (audio) {
      await conn.sendFile(m.chat, audio, "tiktok.mp3", "", ponta, null, { mimetype: 'audio/mpeg' });
    }

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, "Waduh, error nih, Senpai! Sabar ya, cek linknya bener apa nggak, trus coba lagi. Kalau masih error, aku kasih pelukan virtual biar nggak sedih! 🤗", ponta);
  }
};

handler.help = ["tiktok <link>"];
handler.tags = ["downloader"];
handler.command = ["tiktok2", "tiktokdl2", "tt2"];
handler.limit = 3;
handler.register = true;

export default handler;

async function video(url) {
  try {
    const { data: html } = await axios({
      url: "https://ttsave.app/download",
      method: "post",
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36",
        "Referer": "https://ttsave.app/id",
      },
      data: { query: url },
    });

    const $ = cheerio.load(html);
    return {
      video_no_watermark: $('a[type="no-watermark"]').attr("href") || null,
      video_watermark: $('a[type="watermark"]').attr("href") || null,
      audio: $('a[type="audio"]').attr("href") || null,
      profile_picture: $('a[type="profile"]').attr("href") || null,
      video_cover: $('a[type="cover"]').attr("href") || null,
    };
  } catch (error) {
    console.error("Error di video scraper:", error.message);
    return null;
  }
}

async function slide(url) {
  try {
    const { data: html } = await axios({
      url: "https://ttsave.app/download",
      method: "post",
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36",
        "Referer": "https://ttsave.app/id/slide",
      },
      data: { query: url, language_id: "2" },
    });

    const $ = cheerio.load(html);
    const slidePhotos = [];
    $('a[type="slide"]').each((i, el) => {
      const link = $(el).attr("href");
      const label = $(el).find("span").text().trim() || `slide-${i + 1}`;
      slidePhotos.push({ label, link });
    });
    return slidePhotos;
  } catch (error) {
    console.error("Error di slide scraper:", error.message);
    return null;
  }
}

async function tiktokScraper(url) {
  const downloadData = await video(url);
  const slideData = await slide(url);
  return {
    ...downloadData,
    slide_photos: slideData && slideData.length > 0 ? slideData : null,
  };
}