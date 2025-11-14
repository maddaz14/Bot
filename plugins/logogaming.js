import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => { if (!text) return m.reply('Masukkan teks untuk logo gaming!');

const apiKey = 'RyAPI';
const apiUrl = `https://api.lolhuman.xyz/api/ephoto1/logogaming?apikey=${apiKey}&text=${encodeURIComponent(text)}`;

try {
    await conn.sendFile(m.chat, apiUrl, 'logogaming.jpg', `✅ Logo gaming untuk: *${text}*`, m);
} catch (e) {
    m.reply('❌ Terjadi kesalahan, coba lagi nanti.');
}

};

handler.command = /^logogaming$/i; handler.tags = ['logo']; handler.help = ['logogaming <teks>'];

export default handler;