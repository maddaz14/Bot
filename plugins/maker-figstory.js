import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply(`Format salah!\n\nContoh:\n.figstory <caption text>\n\n*Catatan: Username dan foto profil akan otomatis diambil dari akun WhatsApp Anda.*`);
  }

  const caption = text.trim();
  const username = m.pushName || 'Pengguna WhatsApp'; // Mengambil nama pengguna dari info pesan
  const photo = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://i.imgur.com/NwhpB37.jpg'); // Mengambil URL foto profil

  const api = `https://velyn.biz.id/api/maker/igstory?username=${encodeURIComponent(username)}&caption=${encodeURIComponent(caption)}&photo=${encodeURIComponent(photo)}&APIKEY=velyn`;

  try {
    const res = await fetch(api);
    if (!res.ok) throw await res.text();

    const buffer = await res.arrayBuffer();
    await conn.sendFile(m.chat, Buffer.from(buffer), 'igstory.jpg', 'done cuyy', m);
  } catch (err) {
    console.error(err);
    m.reply('❌ Gagal membuat IG Story. Pastikan parameter valid atau coba lagi nanti.');
  }
};

handler.command = ['figstory'];
handler.help = ['figstory <caption>'];
handler.tags = ['maker'];
handler.limit = true;

export default handler;