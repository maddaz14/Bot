import fetch from 'node-fetch';

const API_URL = 'https://api.nekolabs.my.id/random/nsfwhub/anal';

let handler = async (m, { conn }) => {
    // Pengecekan premium akan dilakukan oleh kerangka kerja bot Anda
    
    try {
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        // 1. Ambil data (Buffer) dari API
        const response = await fetch(API_URL);

        if (!response.ok) {
            // Tangani status HTTP non-200
            let errorText = await response.text().catch(() => response.statusText);
            throw new Error(`Gagal mengambil gambar. Status: ${response.status} (${errorText})`);
        }

        // 2. Dapatkan Buffer gambar dari respon
        const imageBuffer = await response.buffer();
        
        // 3. Kirim Buffer gambar langsung
        await conn.sendMessage(m.chat, {
            image: imageBuffer,
            caption: '🔞 Gambar NSFW (Anal) siap! (via Nekolabs)'
        }, {
            quoted: m
        });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error('Error in nsfw-anal handler:', e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        await conn.reply(m.chat, `💥 Terjadi kesalahan: ${e.message}`, m);
    }
}

handler.help = ['analnsfw'];
handler.tags = ['nsfw']; 
handler.command = /^(analnsfw|anal)$/i;
handler.premium = true; // Fitur Premium

export default handler;