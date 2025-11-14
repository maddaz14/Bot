let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Masukkan ID grup!\nContoh: 628xxx-xxxxx@g.us');

  try {
    const messages = await conn.loadMessages(text, 1); // ambil 1 chat terakhir
    let lastMsg = messages[0];
    let teks = `*Chat terakhir di grup ${text}:*\n\n${lastMsg.message?.conversation || '[Non-text message]'}`;
    m.reply(teks);
  } catch (e) {
    m.reply('Gagal ambil chat. Pastikan bot sudah join grup dan ID benar.');
    console.log(e);
  }
};

handler.command = ['lastchat'];
handler.help = ['lastchat <idgrup>'];
handler.tags = ['tools'];
handler.owner = true; // hanya bisa oleh owner

export default handler;