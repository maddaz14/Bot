import axios from 'axios';

let handler = async (m, { conn, text, args, command, usedPrefix }) => {
  if (args.length < 2)
    return m.reply(`⚠️ Contoh penggunaan:\n${usedPrefix + command} ubed bot\n\nGunakan 2 kata:\n📌 *Teks kiri* dan *Teks kanan*`);

  // Tambahkan reaksi saat memproses
  await conn.sendMessage(m.chat, {
    react: { text: '🍏', key: m.key }
  });

  let [textL, textR] = args;
  let apiUrl = `https://api.nekorinn.my.id/maker/ba-logo?textL=${encodeURIComponent(textL)}&textR=${encodeURIComponent(textR)}`;

  try {
    let res = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    let buffer = Buffer.from(res.data, 'binary');

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: `✅ *Berhasil membuat logo!*\n\n🅰️ Teks kiri: *${textL}*\n🅱️ Teks kanan: *${textR}*`
    }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply('❌ Gagal mengambil data dari API. Coba lagi nanti.');
  }
};

handler.help = ['buatlogo <teks1> <teks2>', 'blog <teks1> <teks2>'];
handler.tags = ['tools', 'maker'];
handler.command = /^(buatlogo|blog)$/i;

export default handler;