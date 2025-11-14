let handler = async (m, { conn, args, usedPrefix, command }) => {
  global.db.data.users = global.db.data.users || {};
  let user = global.db.data.users[m.sender];

  if (!user) {
    global.db.data.users[m.sender] = {
      money: 0, exp: 0,
      batu: 0, emas: 0, berlian: 0,
      lastMining: 0, level: 1
    };
    user = global.db.data.users[m.sender];
  }

  let cooldown = 10 * 60 * 1000; // 10 menit
  let now = Date.now();

  if (user.lastMining && now - user.lastMining < cooldown) {
    let sisaMs = cooldown - (now - user.lastMining);
    let mnt = Math.floor(sisaMs / 60000);
    let dtk = Math.floor((sisaMs % 60000) / 1000);
    return m.reply(`⛏️ Kamu sudah menambang!\nTunggu *${mnt} menit ${dtk} detik* lagi.`);
  }

  // Cek jenis tambang
  const type = args[0]?.toLowerCase();
  if (!['gunung', 'gua', 'sungai'].includes(type)) {
    return m.reply(`Pilih jenis tambang:\n\n${usedPrefix + command} gunung\n${usedPrefix + command} gua\n${usedPrefix + command} sungai`);
  }

  await m.reply(`⛏️ Menambang di *${type.toUpperCase()}*...`);
  await new Promise(r => setTimeout(r, 2000));

  let chance = Math.random();
  if (chance < 0.05) {
    user.lastMining = now;
    return m.reply(`Sayang sekali, kamu tidak menemukan apapun saat menambang di *${type}*.`);
  }

  let lucky = chance > 0.90;
  let multiplier = 1 + (user.level || 1) * 0.05;

  // Base hasil
  let batu = Math.floor(Math.random() * 10 * multiplier);
  let emas = Math.floor(Math.random() * 5 * multiplier);
  let berlian = Math.floor(Math.random() * 3 * multiplier);

  // Modifikasi sesuai jenis tambang
  switch (type) {
    case 'gunung':
      batu += Math.floor(Math.random() * 5 + 5);
      break;
    case 'gua':
      berlian += Math.floor(Math.random() * 2 + 2);
      break;
    case 'sungai':
      emas += Math.floor(Math.random() * 3 + 2);
      break;
  }

  if (lucky) {
    batu += 5;
    emas += 3;
    berlian += 2;
  }

  user.batu += batu;
  user.emas += emas;
  user.berlian += berlian;
  user.exp += 500;
  user.lastMining = now;

  let hasil = `*⛏️ MINING DI ${type.toUpperCase()} SELESAI!*\n\n`;
  hasil += `🪨 Batu: +${batu}\n`;
  hasil += `🥇 Emas: +${emas}\n`;
  hasil += `💎 Berlian: +${berlian}\n`;
  hasil += `⭐ EXP: +500\n`;

  if (lucky) hasil += `\n✨ *KAMU BERUNTUNG!* Bonus hasil tambang!`;

  await m.reply(hasil);
};

handler.help = ['mining <jenis>'];
handler.tags = ['rpg'];
handler.command = /^mining$/i;
handler.group = true;

export default handler;