const handler = async (m) => {
  const mundurText = `🛡️ Kamu memilih mundur dari pertempuran...\n\nTerkadang mundur bukan berarti kalah.`;
  await m.reply(mundurText);
};

handler.command = /^samuraimundur$/i;
handler.group = true;

export default handler;