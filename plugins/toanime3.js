/*
Jangan Hapus Wm Bang 

*Toanime  Plugins Esm*

Ya begitulah Upload Gambar Pake uguu aj Soalnya Expired 3 Jam 

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Dev Api]*

https://whatsapp.com/channel/0029VapkSr45q08hPPPVqy26/362
*/

import axios from 'axios';
import FormData from 'form-data';

async function Uguu(buffer, filename) {
  const form = new FormData();
  form.append('files[]', buffer, { filename });

  const { data } = await axios.post('https://uguu.se/upload.php', form, {
    headers: form.getHeaders(),
  });

  if (!data.files || !data.files[0]) throw 'Upload gagal.';
  return data.files[0].url;
}

let handler = async (m, { conn, args }) => {
  try {
    let imageUrl = args[0];
    if (!imageUrl) {
      let q = m.quoted ? m.quoted : m;
      let mime = (q.msg || q).mimetype || '';
      if (!mime.startsWith('image/')) throw '*Kirim Atau Reply Gambar, Atau Masukkan Link Gambar*';
      let media = await q.download();
      let ext = mime.split('/')[1];
      imageUrl = await Uguu(media, `upload.${ext}`);
    }

    await conn.sendMessage(m.chat, {
      image: { url: `https://fgsi1-restapi.hf.space/api/ai/toAnime?url=${encodeURIComponent(imageUrl)}` }
    }, { quoted: m });

  } catch (e) {
    await conn.sendMessage(m.chat, { text: `${e}` }, { quoted: m });
  }
};

handler.help = ['toanime3 [url/gambar]'];
handler.tags = ['ai'];
handler.command = ['toanime3'];
handler.limit = false;

export default handler;