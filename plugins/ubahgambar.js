import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";

  if (!mime) return m.reply(`Kirim atau reply gambar dengan caption *${usedPrefix + command} [prompt]*\n\nContoh:\n${usedPrefix + command} Tambahkan sorban putih pada orang di gambar ini.`);
  if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Format *${mime}* tidak didukung! Hanya jpeg/jpg/png.`);
  if (!text) return m.reply(`Prompt tidak boleh kosong!\nContoh:\n${usedPrefix + command} Ubah menjadi gaya anime fantasy dengan pedang dan jubah.`);

  m.reply("⏳ Sedang diproses, mohon tunggu...");

  try {
    let imgData = await q.download();
    let genAI = new GoogleGenerativeAI("AIzaSyDGKKLqFglsXuW8fv64qbkMjlG1i6t_AIU");

    const base64Image = imgData.toString("base64");

    const contents = [
      { text: text },
      {
        inlineData: {
          mimeType: mime,
          data: base64Image
        }
      }
    ];

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ["Text", "Image"]
      },
    });

    const response = await model.generateContent(contents);

    let resultImage;
    for (const part of response.response.candidates[0].content.parts) {
      if (part.inlineData) {
        resultImage = Buffer.from(part.inlineData.data, "base64");
      }
    }

    if (resultImage) {
      const tempPath = path.join(process.cwd(), "tmp", `gemini_${Date.now()}.png`);
      fs.writeFileSync(tempPath, resultImage);

      await conn.sendMessage(m.chat, {
        image: { url: tempPath },
        caption: `*Berhasil diproses dengan prompt:*\n${text}`
      }, { quoted: m });

      setTimeout(() => {
        try { fs.unlinkSync(tempPath); } catch {}
      }, 30000);
    } else {
      m.reply("Gagal menghasilkan gambar. Coba ubah prompt atau coba lagi nanti.");
    }
  } catch (error) {
    console.error(error);
    m.reply(`Terjadi error:\n${error.message}`);
  }
};

handler.help = ["ubahgambar <prompt>"];
handler.tags = ["ai"];
handler.command = ["ubahgambar"];

export default handler;