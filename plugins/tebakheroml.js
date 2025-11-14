let handler = async (m, { conn, usedPrefix, command }) => {
  conn.tebakHeroML = conn.tebakHeroML || {};
  let id = m.chat;

  if (conn.tebakHeroML[id]) {
    return await m.reply('Masih ada soal belum terjawab!\nKetik *nyerah* untuk menyerah.');
  }

  const heroes = [
    'zilong', 'layla', 'tigreal', 'miya', 'nana',
    'alucard', 'gusion', 'ling', 'fanny', 'kagura',
    'hanabi', 'lancelot', 'esmeralda', 'xavier',
    'paquito', 'martis', 'karina', 'beatrix',
    'harith', 'valir'
  ];

  let hero = heroes[Math.floor(Math.random() * heroes.length)];
  let clue = acakKata(hero);

  conn.tebakHeroML[id] = {
    hero,
    clue,
    timeout: setTimeout(async () => {
      await m.reply(`⏰ Waktu habis!\nJawabannya adalah: *${hero}*`);
      delete conn.tebakHeroML[id];
    }, 60 * 1000) // 60 detik
  };

  await m.reply(`*TEBAK HERO MLBB*\n\nClue: ${clue}\n\nJawab dengan mengetik nama heronya!`);
};

handler.before = async function (m, { conn }) {
  conn.tebakHeroML = conn.tebakHeroML || {};
  let id = m.chat;
  if (!(id in conn.tebakHeroML)) return;

  let jawaban = m.text.toLowerCase().trim();
  let game = conn.tebakHeroML[id];

  if (jawaban === game.hero.toLowerCase()) {
    clearTimeout(game.timeout);
    delete conn.tebakHeroML[id];

    // Hadiah uang
    let hadiah = Math.floor(Math.random() * (1000000 - 50000 + 1)) + 50000;
    
    // Tambah EXP 800
    conn.exp = conn.exp || {};
    conn.exp[m.sender] = (conn.exp[m.sender] || 0) + 800;

    await m.reply(`✅ Jawaban benar!\nHero: *${game.hero}*\n🎉 Selamat! Anda mendapatkan hadiah uang sebesar: *Rp${hadiah.toLocaleString()}*\n⭐ EXP bertambah: *800*`);
  } else if (jawaban === 'nyerah') {
    clearTimeout(game.timeout);
    await m.reply(`❌ Kamu menyerah!\nJawaban yang benar adalah: *${game.hero}*`);
    delete conn.tebakHeroML[id];
  }
};

handler.help = ['tebakheroml'];
handler.tags = ['game'];
handler.command = /^tebakheroml$/i;
handler.group = true;

export default handler;

function acakKata(kata) {
  return kata.split('').sort(() => Math.random() - 0.5).join('').toLowerCase();
}