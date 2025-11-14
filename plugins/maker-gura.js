import axios from 'axios';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

/**
 * Endpoint API Gawr Gura Effect
 */
const API_URL = 'https://api.nekolabs.my.id/canvas/gura';

/**
 * Fungsi untuk mengunggah Buffer ke Catbox.moe
 * @param {Buffer} buffer - Buffer gambar yang akan diunggah.
 * @returns {Promise<string>} URL publik dari Catbox.
 */
async function catboxUpload(buffer) {
  const fileInfo = await fileTypeFromBuffer(buffer) || { ext: 'bin', mime: 'application/octet-stream' };
  const { ext, mime } = fileInfo;
  
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', buffer, { filename: `file.${ext}`, contentType: mime });

  const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form });
  
  const responseText = await res.text();
  
  if (!res.ok || responseText.startsWith('Error')) {
    throw new Error(`Gagal mengunggah file ke Catbox: ${responseText.trim()}`);
  }
  
  return responseText.trim();
}

/**
 * Handler utama bot untuk memberikan efek Gawr Gura pada gambar.
 */
let handler = async (m, { conn, usedPrefix, command }) => {
    const quoted = m.quoted;
    const mime = quoted?.mimetype || '';
    
    // 1. Validasi Input (Harus membalas gambar)
    if (!quoted || !/image/.test(mime)) {
        return m.reply(`🦈 Balas gambar yang ingin diberi efek Gura, Senpai!\n\nContoh:\nBalas gambar, lalu ketik *${usedPrefix}${command}*`);
    }

    // 2. Reaksi Emoji Saat Memproses (Mulai)
    await conn.sendMessage(m.chat, { react: { text: '🦈', key: m.key } });

    try {
        // 3. Download Gambar
        const media = await quoted.download();
        if (!media) throw new Error('Gagal mendownload media yang dibalas.');
        
        // 4. Upload Gambar ke Catbox
        const imageUrl = await catboxUpload(media); 

        if (!imageUrl) {
            throw new Error('Gagal mendapatkan URL gambar setelah upload.');
        }

        // 5. Buat URL Permintaan Gura
        const encodedImageUrl = encodeURIComponent(imageUrl);
        const requestUrl = `${API_URL}?imageUrl=${encodedImageUrl}`;

        // 6. Kirim Permintaan ke API Canvas Gura
        const guraResponse = await axios.get(requestUrl, {
            responseType: 'arraybuffer', // API mengembalikan gambar langsung sebagai buffer
            timeout: 30000 
        });

        const imageBuffer = Buffer.from(guraResponse.data);

        // 7. Kirim Hasil (Gambar)
        
        // Hapus reaksi (Selesai)
        await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
        
        await conn.sendFile(m.chat, imageBuffer, 'gura_effect.png', '✅ Gambar Gura berhasil dibuat!', m);
        
    } catch (e) {
        // 8. Error Handling dan Hapus Reaksi
        // Pastikan reaksi dihapus saat terjadi error
        await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
        
        let errorMessage = 'Terjadi kesalahan saat memproses gambar Gura.';
        if (e.message) {
            errorMessage = e.message;
        } else if (axios.isAxiosError(e)) {
            if (e.response) {
                errorMessage = `API Gura Error: Status ${e.response.status}.`;
            } else if (e.code === 'ECONNABORTED') {
                errorMessage = 'Permintaan ke API habis waktu (timeout). Coba lagi nanti.';
            }
        }

        console.error('Error Gura Maker:', e);
        m.reply(`⚠️ Waduh, ada masalah nih, Senpai:\n${errorMessage}`);
    }
};

handler.help = ['gura'];
handler.command = ['gura'];
handler.tags = ['maker'];
handler.limit = true; 

export default handler;