import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
    try {
        await m.reply('🔍 Sedang mencari foto cecan random...');

        let imageUrl = 'https://api.botcahx.eu.org/api/asupan/cecan?apikey=jagaamanah';
        let res = await fetch(imageUrl);
        
        if (!res.ok) throw `❌ Gagal mengambil gambar. Status: ${res.status}`;

        let buffer = await res.buffer(); // Mengambil gambar sebagai buffer

        console.log('Image fetched successfully'); // Debugging

        await conn.sendFile(m.chat, buffer, 'cecan.jpg', '✨ Nih cecan random untukmu!', m);

    } catch (error) {
        console.error('Error:', error);
        m.reply(`❌ Terjadi kesalahan: ${error}`);
    }
}

handler.help = ['cecan'];
handler.tags = ['random'];
handler.limit = false;
handler.command = /^(cecan)$/i;

export default handler;