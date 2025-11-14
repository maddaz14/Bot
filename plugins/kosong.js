let handler = async (m, { conn }) => {
  const text = m.text.toLowerCase();

  if (/^(woy|hai+|hello+|admin)$/i.test(text)) {
    const balasan = [
      "Seperti Hiduplu"
    ];

    const emoji = ['🤖', '👋', '✨', '🫶', '💬', '🙌', '📡', '❤️'];

    await conn.reply(m.chat, balasan[Math.floor(Math.random() * balasan.length)], m);

    return conn.sendMessage(m.chat, {
      react: {
        text: emoji[Math.floor(Math.random() * emoji.length)],
        key: m.key,
      },
    });
  }
};

handler.customPrefix = /^(‎|‎‎)$/i;
handler.command = new RegExp();
handler.register = true;

export default handler;