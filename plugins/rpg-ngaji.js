let handler = async (m, { command }) => {
  const cooldown = 14400000; // 4 jam

  if (!db.data.erpg) db.data.erpg = {};
  if (!db.data.erpg[m.sender]) db.data.erpg[m.sender] = { lastngaji: 0 };
  if (!db.data.users[m.sender]) db.data.users[m.sender] = { saldo: 0, exp: 0 };

  let last = db.data.erpg[m.sender].lastngaji;
  let now = new Date() * 1;
  let remaining = cooldown - (now - last);

  if (remaining > 0)
    return m.reply(`🕐 Kamu baru saja ${command}, tunggu *${clockString(remaining)}* lagi.`);

  const uang = randomNomor(3000, 6000);
  const expget = randomNomor(3000, 5000);

  await m.reply('🔎 Mencari guru ngaji...');
  await sleep(7000);
  await m.reply('🕌 Ketemu ustadz...');
  await sleep(4000);
  await m.reply('📖 Diajarin tajwid...');
  await sleep(3000);
  await m.reply('🗣️ Dikasih tau kalau *qalqalah* itu dipantulkan...');
  await sleep(3000);

  let hasil = `*—[ 📚 Hasil Mengaji ]—*\n`;
  hasil += `➕💹 Uang jajan: ${uang}\n`;
  hasil += `➕✨ Exp: ${expget}\n`;
  hasil += `➕🤬 Dimarahin: -1`;
  m.reply(hasil);

  db.data.users[m.sender].saldo += uang;
  db.data.users[m.sender].exp += expget;
  db.data.erpg[m.sender].lastngaji = now;
};

handler.help = ['ngaji', 'mengaji'];
handler.tags = ['rpg'];
handler.command = /^(ngaji|mengaji)$/i;
handler.register = true;

export default handler;

// Helpers
function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return `${h} jam ${m} menit ${s} detik`;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomNomor(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}