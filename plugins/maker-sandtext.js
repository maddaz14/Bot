import axios from 'axios';

/**
 * Endpoint API Beach Sand Text (v2)
 */
const API_URL = 'https://api.nekolabs.my.id/ephoto/beach-sand-text/v2';

/**
 * Handler utama bot untuk membuat teks terukir di pasir.
 */
let handler = async (m, { conn, args, usedPrefix, command }) => {
    const text = args.join(' ').trim();
    const emoji = '🏖️';
    
    // 1. Validasi Input
    if (!text) {
        return m.reply(`${emoji} Untuk mengukir teks di pasir pantai, masukkan teks yang kamu inginkan!\n\nContoh:\n*${usedPrefix}${command}* Ubed Cinta Bot`);
    }

    // Batasi panjang teks (opsional, disesuaikan dengan limit API)
    const maxLength = 25; 
    if (text.length > maxLength) {
        return m.reply(`Teks terlalu panjang, Senpai! Maksimal ${maxLength} karakter.`);
    }

    // 2. Reaksi Emoji Saat Memproses
    await conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } });

    try {
        // 3. Buat URL Permintaan
        const encodedText = encodeURIComponent(text);
        const requestUrl = `${API_URL}?text=${encodedText}`;

        // 4. Kirim Permintaan ke API
        const response = await axios.get(requestUrl, {
            responseType: 'arraybuffer', // API mengembalikan gambar langsung sebagai buffer
            timeout: 20000 
        });

        const imageBuffer = Buffer.from(response.data);

        // 5. Kirim Hasil (Gambar)
        // Hapus reaksi sebelum mengirim gambar
        await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
        
        await conn.sendFile(m.chat, imageBuffer, 'beach_sand_text.png', `✅ Teks di pasir pantai berhasil dibuat:\n*${text}*`, m);
        
    } catch (e) {
        // 6. Error Handling dan Hapus Reaksi
        await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
        
        let errorMessage = 'Terjadi kesalahan saat membuat teks di pasir.';
        if (axios.isAxiosError(e)) {
            if (e.response) {
                // Respons API berupa error (bukan gambar)
                const errorData = e.response.data.toString(); 
                errorMessage = `API Error: Status ${e.response.status}. Pesan: ${errorData || 'Tidak ada pesan spesifik dari API.'}`;
            } else if (e.code === 'ECONNABORTED') {
                errorMessage = 'Permintaan ke API habis waktu (timeout). Coba lagi nanti.';
            } else {
                errorMessage = `Kesalahan jaringan atau lainnya: ${e.message}`;
            }
        } else if (e.message) {
            errorMessage = e.message;
        }

        console.error('Error Beach Sand Text Maker:', e);
        m.reply(`⚠️ Waduh, ada masalah nih, Senpai:\n${errorMessage}`);
    }
};

handler.help = ['sandtext <teks>'];
handler.command = ['sandtext', 'beachsand'];
handler.tags = ['ephoto', 'maker'];
handler.limit = true; 

export default handler;