import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
    try {
        await m.reply('🔍 Sedang mencari video bocil random...');

        let apiUrl = 'https://api.botcahx.eu.org/api/asupan/bocil?apikey=jagaamanah';
        let res = await fetch(apiUrl);

        if (!res.ok) throw `❌ Gagal mengambil video. Status: ${res.status}`;

        let buffer = await res.buffer(); // Mengambil video sebagai buffer

        console.log('Video fetched successfully'); // Debugging

        await conn.sendFile(m.chat, buffer, 'bocil.mp4', '✨ Nih video bocil random untukmu!', m);

    } catch (error) {
        console.error('Error:', error);
        m.reply(`❌ Terjadi kesalahan: ${error}`);
    }
}

handler.help = ['bocil'];
handler.tags = ['video'];
handler.limit = false;
handler.command = /^(bocil)$/i;

export default handler;