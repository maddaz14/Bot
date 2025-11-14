let handler = async (m, { conn }) => {
  const text = m.text.toLowerCase();

  if (/^(makasih|terimakasih)$/i.test(text)) {
    const balasan = [
      "Sama-sama yaa!",
      "Iyaaa, makasih juga udah jadi kamu~",
      "You're welcome!",
      "Terima kasih kembali, yang manis!",
      "Sama-sama, semoga harimu indah!",
      "Apa pun untuk kamu~",
      "Udah, gak usah makasih, yang penting kamu bahagia.",
      "Sama-sama cintaa~",
      "Sama-sama, semangat terus ya!",
      "Iyaaa, jangan lupa senyum hari ini ya!"
    ];

    const emoji = ['❤️', '😊', '💖', '🥰', '✨', '🌸'];

    // Kirim balasan acak
    await conn.reply(m.chat, balasan[Math.floor(Math.random() * balasan.length)], m);

    // Kirim reaksi acak
    return conn.sendMessage(m.chat, {
      react: {
        text: emoji[Math.floor(Math.random() * emoji.length)],
        key: m.key,
      },
    });
  }
};

handler.customPrefix = /^(makasih|terimakasih)$/i;
handler.command = new RegExp();
handler.register = true;

export default handler;