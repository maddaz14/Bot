import axios from 'axios';
import FormData from 'form-data';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || '';
  
  // Pastikan pesan yang dibalas adalah gambar
  if (!mime.includes('image')) throw `Balas gambar dengan caption *${usedPrefix + command}*`;

  m.reply('⏳ Menerjemahkan teks dalam gambar ke Bahasa Indonesia...');

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

    // Mengirim gambar ke API Maelyn untuk menerjemahkan teks ke Bahasa Indonesia
    const apiUrl = `https://api.maelyn.sbs/api/gemini/image?q=Translate%20to%20Indonesian&url=${encodeURIComponent(imageUrl)}&apikey=zahra999`;
    const result = await axios.get(apiUrl);

    if (result.data.status !== 'Success') throw 'Gagal menerjemahkan teks dari gambar.';

    // Mengirimkan hasil terjemahan kepada pengguna
    m.reply(`Teks dalam gambar telah diterjemahkan ke Bahasa Indonesia:\n\n${result.data.result}`);
  } catch (e) {
    console.error(e);
    m.reply('Gagal memproses gambar. Pastikan gambar valid dan coba lagi.');
  }
};

handler.help = ['translateimg'];
handler.tags = ['tools'];
handler.command = /^translateimg$/i;

export default handler;