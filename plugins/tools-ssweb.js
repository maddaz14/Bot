import fetch from 'node-fetch';

let handler = async (m, { text }) => {
  if (!text) return m.reply('Masukkan URL yang ingin di-screenshot!');

  try {
    const apiUrl = `https://api.ubed.my.id/tools/ssweb?apikey=free1&url=${encodeURIComponent(text)}`;
    const response = await fetch(apiUrl);

    if (response.ok) {
      const buffer = await response.buffer();
      await conn.sendFile(m.chat, buffer, 'screenshot.png', `Screenshot dari: ${text}`, m);
    } else {
      const errorBody = await response.text();
      m.reply(`Gagal mengambil screenshot. Status: ${response.status} - ${response.statusText}\n\n${errorBody}`);
      console.error('Gagal mengambil screenshot:', response.status, response.statusText, errorBody);
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    m.reply('Terjadi kesalahan saat mengambil screenshot.');
  }
};

handler.help = ['ssweb <url>'];
handler.tags = ['tools'];
handler.command = /^ssweb$/i;

export default handler;