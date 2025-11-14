import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";

  let defaultPrompt = `Ubah dada karakter dalam gambar ini agar terlihat lebih menonjol. Jangan ubah pakaian atau atribut lain. Fokus hanya pada bagian dan bentuk dada.`;

  if (!mime) return m.reply(`Kirim/reply gambar dengan caption *${usedPrefix + command}*`);
  if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Format ${mime} tidak didukung! Hanya jpeg/jpg/png.`);

  let promptText = text || defaultPrompt;

  m.reply("Sedang memproses agar karakter terlihat tobrut...");

  try {
    let imgData = await q.download();
    let genAI = new GoogleGenerativeAI("YOUR_API_KEY"); // ganti dengan apikey kamu
    const base64Image = imgData.toString("base64");

    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType: mime,
                data: base64Image
              }
            }
          ]
        }
      ]
    });

    let responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak ada respon dari AI.";
    m.reply(responseText);
  } catch (error) {
    console.error(error);
    m.reply(`Error: ${error.message}`);
  }
};

handler.help = ["tobrutkan"];
handler.tags = ["ai"];
handler.command = ["tobrutkan2"];

export default handler;