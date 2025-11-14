import * as jimp from "jimp";
import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const text = args.join(' ');
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || q.mediaType || '';

  if (!mime || !/image\/(jpe?g|png)/.test(mime)) {
    return m.reply(`Reply gambar dengan caption:\n*${usedPrefix + command} [quotes]*`);
  }

  if (!text) return m.reply(`Teks quotes-nya mana?\nContoh:\n*${usedPrefix + command} Hidup itu lucu, kalau gak ketawa ya sedih*`);

  const name = m.name || 'Anon';
  const username = m.sender?.split('@')[0] || '';
  const imgBuffer = await q.download();

  const tmpDir = './tmp';
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

  const resultPath = await makeQuoteImage(imgBuffer, text, name, username, tmpDir);
  await conn.sendFile(m.chat, resultPath, 'quote.png', '', m);

  fs.unlinkSync(resultPath);
};

handler.help = ['quoteimg <teks>'];
handler.tags = ['tools'];
handler.command = /^(quoteimg|quotepic)$/i;
handler.limit = true;

export default handler;

async function makeQuoteImage(imgBuffer, quoteText, name, username, outputDir) {
  const userImg = await jimp.read(imgBuffer);
  const canvas = new jimp(1200, 630, '#000000');

  userImg.resize(400, jimp.AUTO);
  const mask = await jimp.read(await makeRoundedMask(400, userImg.bitmap.height, 40));
  userImg.mask(mask, 0, 0);

  const feather = userImg.clone().blur(15).opacity(0.6);
  canvas.composite(feather, 0, (canvas.bitmap.height - userImg.bitmap.height) / 2);
  canvas.composite(userImg, 0, (canvas.bitmap.height - userImg.bitmap.height) / 2);

  const fontPaths = [
    jimp.FONT_SANS_64_WHITE,
    jimp.FONT_SANS_32_WHITE,
    jimp.FONT_SANS_16_WHITE
  ];
  const fontSizes = [64, 32, 16]; // Untuk info kalau mau logika tambahan

  let selectedFont = await jimp.loadFont(jimp.FONT_SANS_64_WHITE);
  const maxWidth = 650;
  const maxHeight = 300;

  for (let i = 0; i < fontPaths.length; i++) {
    const fontTest = await jimp.loadFont(fontPaths[i]);
    const textHeight = jimp.measureTextHeight(fontTest, quoteText, maxWidth);
    if (textHeight <= maxHeight) {
      selectedFont = fontTest;
      break;
    }
  }

  canvas.print(selectedFont, 480, 150, {
    text: quoteText,
    alignmentX: jimp.HORIZONTAL_ALIGN_LEFT,
    alignmentY: jimp.VERTICAL_ALIGN_TOP
  }, maxWidth, maxHeight);

  const fontItalic = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);
  const fontSmall = await jimp.loadFont(jimp.FONT_SANS_16_WHITE);

  canvas.print(fontItalic, 480, 460, `- ${name}`, 650);

  const watermark = '© ubed Bot';
  const watermarkWidth = jimp.measureText(fontSmall, watermark);
  const watermarkHeight = jimp.measureTextHeight(fontSmall, watermark, 1200);
  canvas.print(fontSmall, canvas.bitmap.width - watermarkWidth - 10, canvas.bitmap.height - watermarkHeight - 10, watermark);

  const outputPath = path.join(outputDir, `quote_${Date.now()}.png`);
  await canvas.writeAsync(outputPath);
  return outputPath;
}

async function makeRoundedMask(width, height, radius) {
  const mask = new jimp(width, height, 0x00000000);
  const white = jimp.rgbaToInt(255, 255, 255, 255);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x < radius ? radius - x : (x >= width - radius ? x - (width - radius - 1) : 0);
      const dy = y < radius ? radius - y : (y >= height - radius ? y - (height - radius - 1) : 0);
      if (dx * dx + dy * dy <= radius * radius) {
        mask.setPixelColor(white, x, y);
      }
    }
  }

  return await mask.getBufferAsync(jimp.MIME_PNG);
}