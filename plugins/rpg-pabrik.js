let handler = async (m, {
  args,
  text,
  conn,
  usedPrefix,
  command,
}) => {
  let id = m.sender;
  let data = global.db.data.simulator;
  let _db = global.db.data.users;

  let type = (args[0] || '').toLowerCase();

  const harga = {
    emas: 800,
    mobil: 10000,
    perhiasan: 15000,
  };

  // Jika belum pernah daftar
  if (!data[id]) {
    data[id] = {
      login: false,
      emas_mu: 0,
      mobil_mu: 0,
      perhiasan_mu: 0,
    };
  }

  switch (type) {
    case 'signup':
      if (data[id].login !== false) return m.reply('Kamu sudah terdaftar dan login ✅');
      data[id].login = false;
      m.reply('📄 Berhasil daftar simulator!\nKetik *.pabrik login* untuk masuk');
      break;

    case 'login':
      if (data[id].login) return m.reply('Kamu sudah login ✅');
      data[id].login = true;
      m.reply('👋 Selamat datang kembali di Simulator Pabrik!');
      break;

    case 'logout':
      if (!data[id].login) return m.reply('Kamu belum login ❎');
      data[id].login = false;
      m.reply('🚪 Kamu telah logout dari simulator.');
      break;

    case 'beli':
    case 'buy':
      if (!data[id].login) return m.reply('❎ Kamu belum login\nSilakan ketik *.pabrik login*');

      let kurang;

      if (args[1] == 'emas') {
        if (!args[2]) return m.reply(`Mau beli berapa gram kak?\nContoh: */pabrik beli emas 20*`);
        kurang = (args[2] * harga.emas);
        if (kurang > _db[id].money) return m.reply(`Uang kamu kurang untuk membeli ${args[2]} gram emas`);
        _db[id].money -= kurang;
        data[id].emas_mu += Number(args[2]);
        m.reply('🛒 Kamu berhasil membeli emas!');

      } else if (args[1] == 'mobil') {
        if (!args[2]) return m.reply(`Mau beli berapa mobil kak?\nContoh: */pabrik beli mobil 1*`);
        kurang = (args[2] * harga.mobil);
        if (kurang > _db[id].money) return m.reply(`Uang kamu kurang untuk membeli ${args[2]} mobil`);
        if (data[id].emas_mu <= 1) return m.reply('Kamu tidak punya cukup emas untuk beli mobil!\nBeli emas dulu pakai */pabrik beli emas 20*');
        _db[id].money -= kurang;
        data[id].mobil_mu += Number(args[2]);
        m.reply('🛒 Kamu berhasil membeli mobil!');

      } else if (args[1] == 'perhiasan') {
        if (!args[2]) return m.reply(`Mau beli berapa perhiasan kak?\nContoh: */pabrik beli perhiasan 2*`);
        kurang = (args[2] * harga.perhiasan);
        if (kurang > _db[id].money) return m.reply(`Uang kamu kurang untuk membeli ${args[2]} perhiasan`);
        _db[id].money -= kurang;
        data[id].perhiasan_mu += Number(args[2]);
        m.reply('🛒 Kamu berhasil membeli perhiasan!');
      } else {
        m.reply('⚠️ Barang tidak tersedia!\nKetik *.pabrik* untuk melihat daftar barang.');
      }
      break;

    default:
      m.reply(`*🛠️ Pabrik Simulator v1.0 (Beta)*

🔑 *Login/SignUp*
- .pabrik signup
- .pabrik login
- .pabrik logout

🛒 *Cara beli:*
.pabrik beli [barang] [jumlah]
contoh: *.pabrik beli emas 20*

📦 *Barang tersedia:*
1. emas (Rp ${harga.emas}/gram)
2. mobil (Rp ${harga.mobil})
3. perhiasan (Rp ${harga.perhiasan})
`);
  }
};

handler.help = ['pabrik'];
handler.tags = ['rpg'];
handler.command = ['pabrik'];

export default handler;