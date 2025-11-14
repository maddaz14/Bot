import axios from 'axios';

// Endpoint API
const API_SEARCH = 'https://api.nekolabs.my.id/discovery/xnxx/search';
const API_DOWNLOAD = 'https://api.nekolabs.my.id/downloader/xnxx';

/**
 * Handler utama bot untuk mencari atau mengunduh video XNXX.
 */
let handler = async (m, { conn, args, usedPrefix, command }) => {
    const input = args.join(' ').trim();
    
    // 1. Validasi Input
    if (!input) {
        return m.reply(`🔍 Mau cari atau download, Senpai? Masukkan kata kunci atau URL XNXX!\n\nContoh Pencarian:\n*${usedPrefix}${command}* Hijab\n\nContoh Download:\n*${usedPrefix}${command}* https://www.xnxx.com/video-xxxxxx/judul_video`);
    }

    // 2. Tentukan Mode (Download atau Search)
    const isUrl = input.match(/^https?:\/\/(www\.)?xnxx\.com\//i);
    const mode = isUrl ? 'DOWNLOAD' : 'SEARCH';

    // 3. Reaksi Emoji Saat Memproses
    await conn.sendMessage(m.chat, { react: { text: mode === 'SEARCH' ? '🔍' : '📥', key: m.key } });

    try {
        if (mode === 'DOWNLOAD') {
            // --- MODE DOWNLOAD ---
            const encodedUrl = encodeURIComponent(input);
            const requestUrl = `${API_DOWNLOAD}?url=${encodedUrl}`;
            
            m.reply(`📥 Mencoba mengunduh video dari URL:\n${input}`);

            const response = await axios.get(requestUrl, { timeout: 30000 });
            const data = response.data;

            if (data && data.status === true && data.result && data.result.videos.high) {
                const highQualityUrl = data.result.videos.high;
                
                // Hapus reaksi
                await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
                
                m.reply('✅ Video ditemukan. Mengirim file...');
                
                // Kirim video. Kita gunakan kualitas 'high'.
                await conn.sendFile(m.chat, highQualityUrl, 'video.mp4', `*--- 🎞️ XNXX DOWNLOADER ---*\n\nBerhasil mengunduh video.`, m, false, {
                    // Tambahkan opsi untuk kirim video
                    mimetype: 'video/mp4' 
                });

            } else {
                throw new Error(data.message || 'Gagal mendapatkan tautan download dari API.');
            }

        } else {
            // --- MODE SEARCH ---
            const encodedQuery = encodeURIComponent(input);
            const requestUrl = `${API_SEARCH}?q=${encodedQuery}`;

            const response = await axios.get(requestUrl, { timeout: 15000 });
            const data = response.data;

            if (data && data.status === true && data.result && data.result.length > 0) {
                
                const results = data.result.slice(0, 5); 
                
                let caption = `*--- 🎬 Hasil Pencarian XNXX ---*\n\nKata Kunci: *${input}*\n\n`;

                results.forEach((item, index) => {
                    caption += `*${index + 1}. ${item.title}*\n`;
                    caption += `  • Durasi: ${item.duration}\n`;
                    caption += `  • Resolusi: ${item.resolution}\n`;
                    caption += `  • URL: ${item.url}\n\n`;
                });

                caption += `_Menampilkan ${results.length} dari total ${data.result.length} hasil._\n\nUntuk mengunduh, gunakan URL tersebut:\n*${usedPrefix}${command}* <URL>`;

                // Hapus reaksi
                await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
                
                // Kirim gambar cover pertama sebagai preview
                const firstCover = results[0].cover;

                await conn.sendFile(m.chat, firstCover, 'preview.jpg', caption, m);
                
            } else {
                throw new Error(`Video dengan kata kunci *${input}* tidak ditemukan.`);
            }
        }

    } catch (e) {
        // 4. Error Handling dan Hapus Reaksi
        await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
        
        let errorMessage = 'Terjadi kesalahan saat memproses permintaan.';
        if (axios.isAxiosError(e) && e.response) {
            errorMessage = `Server API error: Status ${e.response.status}.`;
        } else if (e.message) {
            errorMessage = e.message;
        }

        console.error(`Error XNXX ${mode}:`, e);
        m.reply(`⚠️ Waduh, ada masalah nih, Senpai:\n${errorMessage}`);
    }
};

handler.help = ['xnxx <query/url>'];
handler.command = ['xnxx'];
handler.tags = ['premium'];
handler.limit = true;
handler.premium = true;

export default handler;