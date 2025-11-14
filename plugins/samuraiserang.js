const handler = async (m, { conn, args }) => {
  const target = args[0];
  if (!target) throw 'Tidak ada target serangan!';

  const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const cerita = [
    'Kamu melompat ke arah musuh dengan pedang terhunus!',
    'Serangan kilatmu hampir mengenai lawan!',
    'Kamu berhasil menebas pundak musuh!',
    'Musuh membalas dengan serangan balik!',
    'Seranganmu meleset, musuh tertawa sinis!',
    'Kamu terpeleset, tapi berhasil menghindar!',
    'Seranganmu menembus pertahanan musuh!'
  ];

  for (let i = 0; i < 3; i++) {
    await conn.sendMessage(m.chat, { text: `▶️ ${cerita[Math.floor(Math.random() * cerita.length)]}` }, { quoted: m });
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  const menang = Math.random() < 0.5;

  if (menang) {
    const uang = getRandom(10000, 1000000);
    const exp = getRandom(49, 4999);
    const balance = getRandom(20, 150);
    await conn.sendMessage(m.chat, {
      text: `✅ Kamu MENANG!\n\n+💰 Uang: ${uang}\n+⭐ Exp: ${exp}\n+💳 Balance: ${balance}`
    }, { quoted: m });
    // Tambahkan logika update ke database kalau kamu pakai DB
  } else {
    const uang = getRandom(10000, 50000);
    const exp = getRandom(50, 500);
    await conn.sendMessage(m.chat, {
      text: `❌ Kamu KALAH!\n\n-💰 Uang: ${uang}\n-⭐ Exp: ${exp}`
    }, { quoted: m });
    // Update juga untuk pengurangan
  }
};

handler.command = /^samuraiserang$/i;
handler.group = true;

export default handler;