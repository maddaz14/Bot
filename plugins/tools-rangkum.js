import axios from 'axios';
import FormData from 'form-data';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || '';
  
  if (!mime.includes('image')) throw `Balas gambar dengan caption *${usedPrefix + command}*`;

  m.reply('⏳ Menyaring inti teks dari gambar...');

  try {
    const img = await q.download();
    const formUpload = new FormData();
    formUpload.append('reqtype', 'fileupload');
    formUpload.append('fileToUpload', img, 'image.jpg');

    const catbox = await axios.post('https://catbox.moe/user/api.php', formUpload, {
      headers: formUpload.getHeaders()
    });

    if (!catbox.data || !catbox.data.includes('https')) throw 'Gagal upload gambar ke Catbox';

    const imageUrl = catbox.data.trim();

    // Gunakan prompt yang spesifik untuk meringkas ke inti saja tanpa penjelasan
    const apiUrl = `https://api.maelyn.sbs/api/gemini/image?q=Ringkas%20ke%20inti%20terpenting%20dari%20teks%20dalam%20gambar%2C%20tanpa%20penjelasan&url=${encodeURIComponent(imageUrl)}&apikey=ubed2407`;
    const result = await axios.get(apiUrl);

    if (result.data.status !== 'Success') throw 'Gagal meringkas teks dari gambar.';

    m.reply(`Inti teks dalam gambar:\n\n${result.data.result}`);
  } catch (e) {
    console.error(e);
    m.reply('Terjadi kesalahan saat memproses gambar.');
  }
};

handler.help = ['rangkum'];
handler.tags = ['tools'];
handler.command = /^rangkum$/i;

export default handler;