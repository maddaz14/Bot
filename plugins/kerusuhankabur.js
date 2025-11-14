const handler = async (m, { conn }) => {
  const teks = `Kamu berhasil melarikan diri dari kerusuhan... 😅`;

  // Kirim pesan bahwa pemain mundur
  await conn.sendMessage(m.chat, {
    text: teks,
    footer: 'ubed Bot - Kerusuhan 1vs1',
  });
};

handler.command = /^\kerusuhankabur$/i;
handler.group = true;

export default handler;