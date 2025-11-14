import axios from 'axios';
import FormData from 'form-data';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || '';
  
  // Pastikan pesan yang dibalas adalah gambar
  if (!mime.includes('image')) throw `Balas gambar dengan caption *${usedPrefix + command}*`;

  m.reply('⏳ Mengambil teks dari gambar...');

  try {
    // Ambil buffer gambar dari pesan yang dibalas
    const img = await q.download();
    const formUpload = new FormData();
    formUpload.append('reqtype', 'fileupload');
    formUpload.append('fileToUpload', img, 'image.jpg');

    // Upload ke Catbox untuk mendapatkan URL gambar
    const catbox = await axios.post('https://catbox.moe/user/api.php', formUpload, {
      headers: formUpload.getHeaders()
    });

    if (!catbox.data || !catbox.data.includes('https')) throw 'Gagal upload gambar ke Catbox';

    const imageUrl = catbox.data.trim();

    // Mengirim gambar ke API Maelyn untuk mengambil teks
    const apiUrl = `https://api.maelyn.sbs/api/gemini/image?q=Ambil%20text%20digambar&url=${encodeURIComponent(imageUrl)}&apikey=zahra999`;
    const result = await axios.get(apiUrl);

    if (result.data.status !== 'Success') throw 'Gagal mengambil teks dari gambar.';

    // Mengirimkan hasil teks kepada pengguna
    m.reply(result.data.result);
  } catch (e) {
    console.error(e);
    m.reply('Gagal memproses gambar. Pastikan gambar valid dan coba lagi.');
  }
};

handler.help = ['copytext'];
handler.tags = ['tools'];
handler.command = /^copytext$/i;

export default handler;