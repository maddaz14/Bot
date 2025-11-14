import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) throw `Gunakan perintah ini dengan format: ${usedPrefix}cekdana <nomor_dana>`;

  const nomorDana = text.trim();

  conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

  try {
    const apiUrl = `https://api.ubed.my.id/tools/Dana?apikey=ubed2407&nomer=${encodeURIComponent(nomorDana)}`;
    const response = await axios.get(apiUrl);
    const { status, creator, data } = response.data;

    if (status) {
      const message = `
*STATUS:* ${status ? 'AKTIF' : 'TIDAK AKTIF'}
*CREATOR:* ${creator}
*NOMOR DANA:* ${data.account_number}
*NAMA AKUN:* ${data.account_holder}
*BANK:* ${data.account_bank}
      `;
      await conn.reply(m.chat, message, m);
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    } else {
      await conn.reply(m.chat, `Nomor DANA tidak ditemukan atau terjadi kesalahan.`, m);
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    }
  } catch (error) {
    console.error('Error:', error);
    await conn.reply(m.chat, `Maaf, terjadi kesalahan saat memeriksa nomor DANA.`, m);
    await conn.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
  }
};

handler.help = ['cekdana <nomor>'];
handler.tags = ['tools'];
handler.command = /^cekdana$/i;
handler.limit = 1;
handler.register = true;

export default handler;