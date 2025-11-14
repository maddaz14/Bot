let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    react: {
      text: '🟥🟨🟩🟦🟪🟧✨🔥⚡💥💫', // banyak emoji
      key: m.key,
    }
  });
};

handler.command = ['react2'];
handler.tags = ['fun'];
handler.help = ['react2'];
handler.register = true;

export default handler;