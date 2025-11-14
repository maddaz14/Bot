import axios from 'axios';

/**
 * Endpoint API XNXX Search
 */
const API_URL = 'https://api.nekolabs.my.id/discovery/xnxx/search';

/**
 * Handler utama bot untuk mencari video XNXX.
 */
let handler = async (m, { conn, args, usedPrefix, command }) => {
    const query = args.join(' ').trim();
    
    // 1. Validasi Input
    if (!query) {
        return m.reply(`🔍 Mau cari video apa, Senpai? Masukkan kata kunci pencarian!\n\nContoh:\n*${usedPrefix}${command}* Hijab`);
    }

    // 2. Reaksi Emoji Saat Memproses
    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

    try {
        // 3. Buat URL Permintaan
        const encodedQuery = encodeURIComponent(query);
        const requestUrl = `${API_URL}?q=${encodedQuery}`;

        // 4. Kirim Permintaan ke API
        const response = await axios.get(requestUrl, {
            timeout: 15000 
        });

        const data = response.data;

        // 5. Validasi Respon API
        if (data && data.status === true && data.result && data.result.length > 0) {
            
            // Ambil maksimal 5 hasil pertama untuk menghindari pesan terlalu panjang
            const results = data.result.slice(0, 5); 
            
            let caption = `*--- 🎬 Hasil Pencarian XNXX ---*\n\nKata Kunci: *${query}*\n\n`;

            results.forEach((item, index) => {
                caption += `*${index + 1}. ${item.title}*\n`;
                caption += `  • Durasi: ${item.duration}\n`;
                caption += `  • Resolusi: ${item.resolution}\n`;
                caption += `  • Dilihat: ${item.views}\n`;
                caption += `  • URL: ${item.url}\n\n`;
            });

            caption += `_Menampilkan ${results.length} dari total ${data.result.length} hasil._`;

            // Hapus reaksi
            await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
            
            // Kirim gambar cover pertama sebagai preview (opsional)
            const firstCover = results[0].cover;

            await conn.sendFile(m.chat, firstCover, 'preview.jpg', caption, m);
            
        } else {
            // Kasus status: false atau tidak ditemukan
            const errorMessage = `Video dengan kata kunci *${query}* tidak ditemukan.`;
            throw new Error(errorMessage);
        }

    } catch (e) {
        // 6. Error Handling dan Hapus Reaksi
        await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
        
        let errorMessage = 'Terjadi kesalahan saat menghubungi server pencarian.';
        if (axios.isAxiosError(e) && e.response) {
            errorMessage = `Server API error: Status ${e.response.status}.`;
        } else if (e.message) {
            errorMessage = e.message;
        }

        console.error('Error XNXX Search:', e);
        m.reply(`⚠️ Waduh, ada masalah nih, Senpai:\n${errorMessage}`);
    }
};

handler.help = ['xnxxsearch <query>'];
handler.command = ['xnxxsearch', 'xnxxfetch'];
handler.tags = ['premium']; // Diubah menjadi kategori premium
handler.limit = true;
handler.premium = true; // Ditambahkan properti premium

export default handler;