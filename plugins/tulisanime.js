import fs from "fs";
import path from "path";
import axios from "axios";
import * as jimp from "jimp";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Sticker } from "wa-sticker-formatter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply("Masukkan teks untuk tulisan anime.");

  m.reply("Sedang diproses...");

  try {
    const imageUrl = "https://files.catbox.moe/wftnwc.jpg";
    const imagePath = path.join(__dirname, "gambar_anime.jpg");

    const response = await axios({ url: imageUrl, responseType: "arraybuffer" });
    fs.writeFileSync(imagePath, Buffer.from(response.data, "binary"));

    const image = await Jimp.read(imagePath);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

    const x = 243, y = 750, maxWidth = 600;
    image.print(font, x, y, { text, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE }, maxWidth);

    const outputPath = path.join(__dirname, "hasil.png");
    await image.writeAsync(outputPath);

    const sticker = new Sticker(fs.readFileSync(outputPath), {
      pack: "Stiker By",
      author: "Takashi - Bell",
      type: "image/png",
    });

    const stickerBuffer = await sticker.toBuffer();
    await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });

    fs.unlinkSync(imagePath);
    fs.unlinkSync(outputPath);
  } catch (e) {
    console.error(e);
    m.reply("Terjadi kesalahan saat memproses stiker.");
  }
};

handler.help = ["tulisanime"];
handler.command = ["tulisanime"];
handler.tags = ["sticker"];

export default handler;