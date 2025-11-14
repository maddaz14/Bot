import axios from 'axios';

// Fungsi untuk membuat paste unlisted tanpa expired
async function createPasteUnlisted(content, title = 'Untitled') {
  const apiKey = 'EkuAJ3E7KLAcgzdcl4TZPO1SGX5eiPoL'; // Ganti dengan API Key Pastebin Anda
  const pasteUrl = 'https://pastebin.com/api/api_post.php';

  try {
    const response = await axios.post(pasteUrl, new URLSearchParams({
      api_dev_key: apiKey,
      api_option: 'paste',
      api_paste_code: content,
      api_paste_name: title,
      api_paste_expire_date: 'N', // 'N' untuk tanpa kedaluwarsa
      api_paste_private: '1', // 1 = Unlisted
    }));

    return response.data; // Mengembalikan URL paste
  } catch (error) {
    console.error('Error creating paste:', error.message);
    return null;
  }
}

// Command handler
let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply('❗ Masukkan teks dalam format:\n`.pastebin <judul>|<kode>`\nContoh: `.pastebin Hello World|console.log("Hello World");`');
  }

  // Memisahkan judul dan kode
  const [title, content] = text.split('|');
  if (!content) {
    return m.reply('❗ Pastikan format benar: `.pastebin <judul>|<kode>`.\nContoh: `.pastebin Hello World|console.log("Hello World");`');
  }

  conn.sendMessage(m.chat, { react: { text: '🕓', key: m.key } });

  const pasteUrl = await createPasteUnlisted(content, title || 'Untitled');

  if (!pasteUrl || pasteUrl.startsWith('Bad API request')) {
    return m.reply('❌ Gagal membuat paste. Pastikan API Key Anda benar.');
  }

  m.reply(`✅ Paste berhasil dibuat!\n🌐 *Link:* ${pasteUrl}`);
};

handler.command = /^(pastebin)$/i;
handler.tags = ['owner'];
handler.help = ['pastebin <judul>|<kode>'];
handler.owner = true;

export default handler;