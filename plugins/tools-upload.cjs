const axios = require("axios");
const FormData = require("form-data");
const fileType = require("file-type"); // ✅ CJS style

const handler = async (m, { conn }) => {
  const q = m.quoted || m;
  const mime = (q.msg || q).mimetype || "";

  if (!mime) return m.reply("📎 Balas media (foto/gambar) dengan perintah *.tourl*");

  try {
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    const media = await q.download();
    const { ext } = (await fileType.fromBuffer(media)) || { ext: "jpg" };

    const form = new FormData();
    form.append("image", media, {
      filename: `upload.${ext}`,
      contentType: mime,
    });

    const { data } = await axios.post(
      "https://rxtwjeencinjzsjacwci.supabase.co/functions/v1/upload-image",
      form,
      { headers: form.getHeaders() }
    );

    if (!data?.url || !data?.original_url) {
      throw new Error("Gagal mengunggah gambar.");
    }

    const teks = `✅ *Berhasil Upload!*\n\n🔗 Short URL:\n${data.url}\n\n📎 Original URL:\n${data.original_url}`;

    const interactiveMessage = {
      interactiveMessage: {
        body: { text: teks },
        footer: { text: "© Nooriko Bot - Ubed Upload" },
        nativeFlowMessage: {
          buttons: [
            {
              name: "cta_copy",
              buttonParamsJson: JSON.stringify({
                display_text: "📋 Salin Short URL",
                copy_code: data.url,
              }),
            },
            {
              name: "cta_copy",
              buttonParamsJson: JSON.stringify({
                display_text: "📋 Salin Original URL",
                copy_code: data.original_url,
              }),
            },
          ],
        },
      },
    };

    await conn.relayMessage(
      m.chat,
      { viewOnceMessage: { message: interactiveMessage } },
      {}
    );
  } catch (e) {
    console.error(e);
    m.reply("❌ Gagal mengunggah gambar ke server.\nPastikan file berupa gambar JPG/PNG/GIF/WebP <10MB.");
  }
};

handler.help = ["fuxxyupload"];
handler.tags = ["tools"];
handler.command = /^fuxxyupload$/i;
handler.register = true;

module.exports = handler; // ✅ kalau pakai require, harus pakai exports gaya CJS juga