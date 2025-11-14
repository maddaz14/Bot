import axios from 'axios';
import { Sticker } from 'wa-sticker-formatter';

let handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) {
        // Menggunakan conn.reply untuk pesan kesalahan
        return conn.reply(m.chat, `Gunakan perintah ini dengan format: ${usedPrefix}brat <teks>`, m);
    }

    try {
        // Kirim reaksi emoji '⏳' saat memproses
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        // URL API dikoreksi dengan tanda kutip
        const url = `https://brat.siputzx.my.id/gif?text=${encodeURIComponent(text)}&delay=500`;
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        // Pastikan response.data ada sebelum membuat stiker
        if (!response.data) {
            await conn.reply(m.chat, 'Maaf, API tidak memberikan data gambar stiker.', m);
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return;
        }

        const sticker = new Sticker(response.data, {
            pack: 'Stiker By', // Nama paket stiker
            author: 'ubed-MD', // Penulis stiker
            type: 'image/png', // Tipe stiker (image/png untuk non-animasi)
        });

        const stikerBuffer = await sticker.toBuffer();
        let sentMessage = await conn.sendMessage(m.chat, { sticker: stikerBuffer }, { quoted: m });
        
        // Kirim reaksi emoji '🎉' setelah stiker berhasil dikirim
        await conn.sendMessage(m.chat, { react: { text: '🎉', key: sentMessage.key } });

    } catch (error) {
        console.error('Error saat membuat stiker brat:', error);
        // Kirim reaksi emoji '❌' saat terjadi kesalahan
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        await conn.reply(m.chat, 'Maaf, terjadi kesalahan saat mencoba membuat stiker brat. Coba lagi nanti.', m);
    }
};

// Informasi handler untuk bot
handler.help = ['bratvideo <teks>']; // Contoh penggunaan di bantuan
handler.tags = ['sticker'];
handler.command = /^(bratvideo|bratvid)$/i; // Perintah untuk memanggil fitur
handler.limit = 5; // Batasan penggunaan (jika bot Anda memiliki sistem limit)
handler.register = true; // Fitur ini memerlukan registrasi (jika bot Anda memiliki sistem registrasi)
handler.premium = false; // Fitur ini tidak memerlukan status premium

export default handler;