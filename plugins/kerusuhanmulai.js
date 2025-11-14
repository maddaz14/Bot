const handler = async (m, { conn, text, command }) => {
  const target = text.trim(); // Mendapatkan target dari buttonId
  if (!target) throw 'Target tidak ditemukan!';

  const teks = `🔥 Kerusuhan dimulai! Serangan bertubi-tubi sedang terjadi...`;

  const actions = ['Serang!', 'Tahan!', 'Serangan Balik!', 'Menghindar!'];
  const randomResult = actions[Math.floor(Math.random() * actions.length)];
  
  let result;
  if (randomResult === 'Serang!') {
    // Menang
    result = 'Kamu berhasil menyerang dan menang! 🎉';
    // Hadiah
    const money = Math.floor(Math.random() * 2000000) + 50000;
    const exp = Math.floor(Math.random() * 9900) + 100;
    const balance = Math.floor(Math.random() * 400) + 100;
    // Kirim hadiah
    await conn.sendMessage(m.chat, {
      text: `Kamu menang!\n\nHadiah:\n+${money} Money\n+${exp} Exp\n+${balance} Balance`
    });
  } else if (randomResult === 'Tahan!') {
    // Kalah
    result = 'Sayangnya kamu kalah... 😞';
    const lossMoney = Math.floor(Math.random() * 100000);
    const lossExp = Math.floor(Math.random() * 1000);
    await conn.sendMessage(m.chat, {
      text: `Kamu kalah... 😞\n\nKehilangan:\n-${lossMoney} Money\n-${lossExp} Exp`
    });
  } else {
    // Menghindar
    result = 'Kamu berhasil menghindari serangan!\nKerusuhan berlanjut...';
  }

  await conn.sendMessage(m.chat, {
    text: result,
    footer: 'ubed Bot - Kerusuhan 1vs1',
  });
};

handler.command = /^\kerusuhanmulai$/i;
handler.group = true;

export default handler;