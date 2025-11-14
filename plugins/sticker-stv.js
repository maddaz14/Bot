import fs from "fs";
import path from "path";
import axios from "axios";
import { execSync } from "child_process";

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh: ${usedPrefix + command} hai`);
  if (text.length > 300) return m.reply(`Karakter terbatas, max 300!`);

  // Reaction loading
  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

  const words = text.split(" ");
  const tempDir = path.resolve(process.cwd(), "lib");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
  const framePaths = [];

  try {
    for (let i = 0; i < words.length; i++) {
      const currentText = words.slice(0, i + 1).join(" ");
      const res = await axios.get(
        `https://api.botcahx.eu.org/api/ephoto/televisi?text=${encodeURIComponent(currentText)}&apikey=ubed2407`,
        { responseType: "arraybuffer" }
      );

      if (!res || res.status !== 200) {
        throw new Error("Gagal mendapatkan frame.");
      }

      const framePath = path.resolve(tempDir, `frame${i}.mp4`);
      fs.writeFileSync(framePath, res.data);
      framePaths.push(framePath);
    }

    const fileListPath = path.resolve(tempDir, "filelist.txt");
    let fileListContent = "";
    for (let i = 0; i < framePaths.length; i++) {
      fileListContent += `file '${framePaths[i]}'\n`;
      fileListContent += `duration 0.7\n`;
    }
    fileListContent += `file '${framePaths[framePaths.length - 1]}'\n`;
    fileListContent += `duration 2\n`;

    fs.writeFileSync(fileListPath, fileListContent);

    const outputStickerPath = path.resolve(tempDir, "sticker.webp");

    execSync(
      `ffmpeg -y -f concat -safe 0 -i ${fileListPath} -vf "fps=30,scale=512:512:force_original_aspect_ratio=decrease" -c:v libwebp -preset default -an -loop 0 -q:v 75 -pix_fmt yuv420p ${outputStickerPath}`
    );

    if (fs.existsSync(outputStickerPath)) {
      const stickerData = fs.readFileSync(outputStickerPath);
      await conn.sendMessage(m.chat, { sticker: stickerData }, { quoted: m });

      framePaths.forEach((frame) => {
        if (fs.existsSync(frame)) fs.unlinkSync(frame);
      });
      if (fs.existsSync(fileListPath)) fs.unlinkSync(fileListPath);
      if (fs.existsSync(outputStickerPath)) fs.unlinkSync(outputStickerPath);

      // Reaction success
      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } else {
      throw new Error("File stiker tidak ditemukan.");
    }
  } catch (e) {
    console.error(e);
    // Reaction error
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    m.reply("Terjadi kesalahan saat memproses stiker.");
  }
};

handler.help = ["STV"].map((v) => v + " *text*");
handler.tags = ["sticker"];
handler.command = ["stv"];

export default handler;