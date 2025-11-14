import axios from 'axios';
import FormData from 'form-data';
import { Readable } from 'stream'; // Untuk mengelola buffer gambar

const handler = async (m, { conn, text, usedPrefix, command }) => {
    // Daftar style yang didukung oleh API Maelyn
    const styles = [
        'black', 'pink', 'green', 'blue', 'purple', 'red', 'gold', 'silver', 'brown', 'orange'
    ];

    let imageUrl = null;
    let selectedStyle = null;

    // Ambil domain dan API Key Maelyn dari global.maelyn di config.js
    const maelynDomain = global.maelyn.domain;
    const maelynApiKey = global.maelyn.key;

    // Lakukan validasi dasar untuk memastikan konfigurasi ada
    if (!maelynDomain || !maelynApiKey) {
        throw 'API Key atau Domain Maelyn belum diatur di config.js! Mohon hubungi pemilik bot.';
    }

    // --- LOGIC UNTUK MENDAPATKAN GAMBAR URL DAN STYLE ---
    // Parsing input: [style] | [url_gambar] atau [url_gambar] [style]
    // Atau hanya [style] jika reply gambar
    
    // Default style jika tidak disebutkan atau tidak valid
    selectedStyle = styles[0]; // Default ke 'black'

    if (text) {
        const parts = text.split(' ').map(s => s.trim());
        const lastPart = parts[parts.length - 1]; // Bagian terakhir mungkin style
        const firstPart = parts[0]; // Bagian pertama mungkin style

        // Coba deteksi style dari bagian terakhir atau pertama
        if (styles.includes(lastPart.toLowerCase())) {
            selectedStyle = lastPart.toLowerCase();
            // Jika style ada di akhir, sisa teks adalah URL jika ada
            if (parts.length > 1) imageUrl = parts.slice(0, -1).join(' ');
        } else if (styles.includes(firstPart.toLowerCase())) {
            selectedStyle = firstPart.toLowerCase();
            // Jika style ada di awal, sisa teks adalah URL jika ada
            if (parts.length > 1) imageUrl = parts.slice(1).join(' ');
        } else {
            // Jika tidak ada style yang terdeteksi, anggap seluruh teks adalah URL
            imageUrl = text;
        }

        // Jika ada URL di teks, validasi URL
        if (imageUrl && !/^https?:\/\/.+\.(jpe?g|png)$/i.test(imageUrl)) {
             imageUrl = null; // Reset jika bukan URL valid
        }
    }

    // Cek apakah ada reply gambar
    if (m.quoted && /image\/(jpe?g|png)/.test(m.quoted.mimetype)) {
        const quotedImage = m.quoted;
        try {
            const buffer = await quotedImage.download();
            const stream = Readable.from(buffer);

            const formData = new FormData();
            formData.append('reqtype', 'fileupload');
            formData.append('fileToUpload', stream, {
                filename: 'image.png',
                contentType: quotedImage.mimetype,
            });

            const catboxResponse = await axios.post('https://catbox.moe/user/api.php', formData, {
                headers: formData.getHeaders(),
            });

            imageUrl = catboxResponse.data;
            if (!imageUrl || !imageUrl.includes('catbox.moe')) {
                await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                throw 'Gagal mengunggah gambar ke Catbox untuk diproses.';
            }
        } catch (e) {
            console.error('Error saat memproses atau mengunggah gambar yang direply:', e);
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            throw `Gagal memproses gambar yang direply: ${e.message}`;
        }
    }

    // Jika tidak ada URL gambar sama sekali setelah semua pemeriksaan
    if (!imageUrl) {
        throw `Usage:
*Reply gambar dengan caption:*
*${usedPrefix}${command} [style]*
contoh: *${usedPrefix}${command} pink*

*Atau kirim command dengan URL gambar:*
*${usedPrefix}${command} [URL_Gambar] [style]*
contoh: *${usedPrefix}${command} https://example.com/anime.jpg pink*

*Pilihan Style:* ${styles.join(', ')}
(Default: ${styles[0]})
`;
    }

    await conn.sendMessage(m.chat, { react: { text: '🍏', key: m.key } }); // Reaksi loading

    try {
        // Encode URL gambar dan style
        const encodedImageUrl = encodeURIComponent(imageUrl);
        const encodedStyle = encodeURIComponent(selectedStyle);

        // Bangun URL API
        const apiUrl = `${maelynDomain}/api/img2img/skinswap?url=${encodedImageUrl}&style=${encodedStyle}&apikey=${maelynApiKey}`;

        // Kirim permintaan GET ke Maelyn API
        const response = await axios.get(apiUrl);
        const { status, result, code, message } = response.data;

        if (status === 'Success' && code === 200 && result?.url) {
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); // Reaksi sukses
            await conn.sendMessage(m.chat, { 
                image: { url: result.url },
                caption: `🎨 *Skin Swap Berhasil!*
Style: ${result.style}
Ukuran: ${result.size}
Pesan: ${message || 'Tidak ada pesan.'}
`
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi gagal
            m.reply(`❌ Gagal memproses skin swap. Respon API: ${JSON.stringify(response.data)}`);
        }
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi error
        m.reply(`Terjadi kesalahan saat menghubungi Skin Swap API: ${e.message}`);
    }
};

handler.help = ['skinswap'];
handler.tags = ['maker', 'ai'];
handler.command = /^(skinswap)$/i;
handler.limit = true;
handler.premium = false;

export default handler;