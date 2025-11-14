import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
    try {
        await m.reply('🔍 Sedang mencari foto cecan Indonesia random...');

        let imageUrl = 'https://api.botcahx.eu.org/api/cecan/indonesia?apikey=jagaamanah';
        let res = await fetch(imageUrl);
        
        if (!res.ok) throw `❌ Gagal mengambil gambar. Status: ${res.status}`;

        let buffer = await res.buffer(); // Mengambil gambar sebagai buffer

        console.log('Image fetched successfully'); // Debugging

        await conn.sendFile(m.chat, buffer, 'cecanindo.jpg', '✨ Nih cecan Indonesia random untukmu!', m);

    } catch (error) {
        console.error('Error:', error);
        m.reply(`❌ Terjadi kesalahan: ${error}`);
    }
}

handler.help = ['cecanindo'];
handler.tags = ['random'];
handler.limit = false;
handler.command = /^(cecanindo)$/i;

export default handler;