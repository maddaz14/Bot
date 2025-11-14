let handler = async (m, { conn, command }) => {
  conn._tebakJepang = conn._tebakJepang || {};
  let id = m.chat;

  if (conn._tebakJepang[id]) {
    return m.reply('❗ Masih ada soal yang belum dijawab.\nKetik *nyerah* untuk menyerah.');
  }

  let kosakata = [
    { kanji: 'ねこ', romaji: 'neko', arti: 'kucing' },
    { kanji: 'いぬ', romaji: 'inu', arti: 'anjing' },
    { kanji: 'みず', romaji: 'mizu', arti: 'air' },
    { kanji: 'たべる', romaji: 'taberu', arti: 'makan' },
    { kanji: 'のむ', romaji: 'nomu', arti: 'minum' },
    { kanji: 'せんせい', romaji: 'sensei', arti: 'guru' },
    { kanji: 'ともだち', romaji: 'tomodachi', arti: 'teman' },
    { kanji: 'くるま', romaji: 'kuruma', arti: 'mobil' },
    { kanji: 'でんしゃ', romaji: 'densha', arti: 'kereta' },
    { kanji: 'やま', romaji: 'yama', arti: 'gunung' },
    { kanji: 'かわ', romaji: 'kawa', arti: 'sungai' },
    { kanji: 'ほん', romaji: 'hon', arti: 'buku' },
    { kanji: 'じしょ', romaji: 'jisho', arti: 'kamus' },
    { kanji: 'てがみ', romaji: 'tegami', arti: 'surat' },
    { kanji: 'おちゃ', romaji: 'ocha', arti: 'teh' },
    { kanji: 'りんご', romaji: 'ringo', arti: 'apel' },
    { kanji: 'ばなな', romaji: 'banana', arti: 'pisang' },
    { kanji: 'すいか', romaji: 'suika', arti: 'semangka' },
    { kanji: 'さかな', romaji: 'sakana', arti: 'ikan' },
    { kanji: 'とり', romaji: 'tori', arti: 'burung' },
    { kanji: 'そら', romaji: 'sora', arti: 'langit' },
    { kanji: 'うみ', romaji: 'umi', arti: 'laut' },
    { kanji: 'はな', romaji: 'hana', arti: 'bunga' },
    { kanji: 'き', romaji: 'ki', arti: 'pohon' },
    { kanji: 'くも', romaji: 'kumo', arti: 'awan' },
    { kanji: 'ひ', romaji: 'hi', arti: 'matahari' },
    { kanji: 'つき', romaji: 'tsuki', arti: 'bulan' },
    { kanji: 'かぜ', romaji: 'kaze', arti: 'angin' },
    { kanji: 'ゆき', romaji: 'yuki', arti: 'salju' },
    { kanji: 'はし', romaji: 'hashi', arti: 'jembatan' },
    { kanji: 'みち', romaji: 'michi', arti: 'jalan' },
    { kanji: 'いえ', romaji: 'ie', arti: 'rumah' },
    { kanji: 'まど', romaji: 'mado', arti: 'jendela' },
    { kanji: 'いす', romaji: 'isu', arti: 'kursi' },
    { kanji: 'つくえ', romaji: 'tsukue', arti: 'meja' },
    { kanji: 'でんき', romaji: 'denki', arti: 'listrik' },
    { kanji: 'ほんだな', romaji: 'hondana', arti: 'rak buku' },
    { kanji: 'かさ', romaji: 'kasa', arti: 'payung' },
    { kanji: 'くつ', romaji: 'kutsu', arti: 'sepatu' },
    { kanji: 'かみ', romaji: 'kami', arti: 'kertas' },
    { kanji: 'ペン', romaji: 'pen', arti: 'pena' },
    { kanji: 'とけい', romaji: 'tokei', arti: 'jam' },
    { kanji: 'でんわ', romaji: 'denwa', arti: 'telepon' }
  ];

  let item = kosakata[Math.floor(Math.random() * kosakata.length)];

  conn._tebakJepang[id] = {
    jawaban: item.arti.toLowerCase(),
    timeout: setTimeout(() => {
      if (conn._tebakJepang[id]) {
        m.reply(`⏰ Waktu habis!\nJawaban yang benar adalah: *${item.arti}*`);
        delete conn._tebakJepang[id];
      }
    }, 60000)
  };

  m.reply(
    `🎌 *Tebak Kosakata Jepang!*\n\n` +
    `Kanji: *${item.kanji}*\n` +
    `Romaji: *${item.romaji}*\n` +
    `Balas dengan arti dalam Bahasa Indonesia.\n` +
    `⏱️ Batas waktu: 60 detik`
  );
};

// Cek jawaban atau nyerah
handler.before = async function (m, { conn }) {
  conn._tebakJepang = conn._tebakJepang || {};
  let id = m.chat;

  if (!(id in conn._tebakJepang)) return;

  let game = conn._tebakJepang[id];
  let input = m.text.toLowerCase().trim();

  if (input === 'nyerah') {
    clearTimeout(game.timeout);
    m.reply(`👋 Menyerah ya?\nJawaban yang benar adalah: *${game.jawaban}*`);
    delete conn._tebakJepang[id];
    return;
  }

  if (input === game.jawaban) {
    clearTimeout(game.timeout);
    delete conn._tebakJepang[id];

    let user = global.db.data.users[m.sender];
    user.money = (user.money || 0) + 1000;
    user.exp = (user.exp || 0) + 150;

    m.reply(`✅ *Benar!*\n+ Rp1000\n+ 150 XP`);
  }
};

handler.help = ['tebakkosakatajepang'];
handler.tags = ['game', 'edukasi', 'jepang'];
handler.command = /^tebakkosakatajepang$/i;

export default handler;