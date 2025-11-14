import axios from 'axios';

const handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply('Silakan masukkan kata kunci pencarian berita, contohnya: "negara terkaya".');
  }

  m.reply('Mencari berita...');

  const apiKey = '68d496b8bca54631ab08a18a6323c91d'; // Ganti dengan API Key Anda
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(text)}&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const articles = response.data.articles;

    if (articles.length === 0) {
      return m.reply('Tidak ada berita yang ditemukan untuk kata kunci tersebut.');
    }

    // Ambil hanya satu artikel pertama
    const article = articles[0];

    const caption = `*Judul:* ${article.title}\n\n*Deskripsi:* ${article.description || 'Tidak ada deskripsi.'}\n\n*Penulis:* ${article.author || 'Tidak diketahui'}\n*Tanggal:* ${new Date(article.publishedAt).toLocaleString()}\n*Link:* ${article.url}\n\n*Gambar:* ${article.urlToImage || 'Tidak ada gambar.'}`;

    conn.sendMessage(m.chat, { text: caption }, { quoted: m });
  } catch (error) {
    console.error(error);
    m.reply('Terjadi kesalahan saat mengambil berita. Silakan coba lagi nanti.');
  }
};

handler.help = ['news <query>'];
handler.tags = ['internet'];
handler.command = /^news$/i;

export default handler;