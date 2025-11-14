import https from "https";
import { sticker } from "../lib/sticker.js";
import fetch from "node-fetch";
import FormData from "form-data";

async function uploadToCatbox(buffer) {
  let form = new FormData();
  form.append("reqtype", "fileupload");
  form.append("fileToUpload", buffer, { filename: "profile.jpg", contentType: "image/jpeg" });

  try {
    let res = await fetch("https://catbox.moe/user/api.php", { method: "POST", body: form });
    let url = await res.text();
    if (!url.startsWith("https://")) throw new Error("Upload ke Catbox gagal.");
    return url.trim();
  } catch (err) {
    console.error("Gagal mengunggah ke Catbox:", err);
    return null;
  }
}

let handler = async (m, { conn, text }) => {
    if (!text) throw `Gunakan: qc <teks>\n\nContoh: qc Assalamualaikum`;

    let name = m.pushName || 'User';
    let color_name = 'fb8500';
    let color_text = '003049';
    let size_name = 40;  // Ukuran nama lebih besar
    let size_text = 36;  // Ukuran teks lebih besar
    let ppUrl = "";

    try {
        let userPP = await conn.profilePictureUrl(m.sender, "image");
        ppUrl = userPP;
    } catch (e) {
        ppUrl = "https://telegra.ph/file/3ac8b7e8f52f62e189593.jpg";
    }

    let apiUrl = `https://api.autoresbot.com/api/maker/qc?apikey=afce4ffb1a6e4c4bc5a6d035&name=${encodeURIComponent(name)}&pp=${encodeURIComponent(ppUrl)}&text=${encodeURIComponent(text)}&color_name=${color_name}&color_text=${color_text}&size_name=${size_name}&size_text=${size_text}`;

    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    https.get(apiUrl, (res) => {
        let data = [];

        res.on("data", (chunk) => data.push(chunk));
        res.on("end", async () => {
            try {
                let buffer = Buffer.concat(data);
                let stickerBuffer = await sticker(buffer, false, "Quote", "AutoResBot");

                await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });
                await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
            } catch (err) {
                console.error("❌ ERROR:", err);
                await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                await conn.reply(m.chat, "❌ Terjadi kesalahan saat memproses sticker. Coba lagi nanti.", m);
            }
        });
    }).on("error", async (err) => {
        console.error("❌ ERROR:", err);
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        await conn.reply(m.chat, "❌ Terjadi kesalahan saat menghubungi API. Coba lagi nanti.", m);
    });
};

handler.help = ["qc7"];
handler.tags = ["sticker"];
handler.limit = false;
handler.premium = false;
handler.command = ["qc7"];

export default handler;