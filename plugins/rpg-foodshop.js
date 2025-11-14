// plugins/fooshop.js

const handler = async (m, { command, args }) => {
  let user = global.db.data.users[m.sender];

  const shopItems = {
    '🍖 Ayambakar': 1200,
    '🍖 Ikanbakar': 1000,
    '🍖 Lelebakar': 950,
    '🍖 Nilabakar': 1100,
    '🍖 Bawalbakar': 1150,
    '🍖 Udangbakar': 1300,
    '🍖 Pausbakar': 2000,
    '🍖 Kepitingbakar': 1600,
    '🍗 Ayamgoreng': 1000,
    '🥘 Rendang': 1500,
    '🥩 Steak': 1800,
    '🥠 Babipanggang': 1700,
    '🍲 Gulaiayam': 1200,
    '🍜 Oporayam': 1100,
    '🍞 Roti': 500,
    '🍣 Sushi': 1400,
    '🍷 Vodka': 3000,
    '💉 Bandage': 2500,
    '☘️ Ganja': 5000,
    '🍺 Soda': 700
  };

  // Buat alias item tanpa emoji untuk pencocokan dari input user
  const itemAlias = {};
  for (const name in shopItems) {
    const clean = name.replace(/[\p{Emoji}\uFE0F]/gu, '').trim().toLowerCase();
    itemAlias[clean] = name;
  }

  if (command === 'fooshop') {
    let teks = '╭───〔  *FOOD & HEALING SHOP*  〕───⬣\n';
    for (const [name, price] of Object.entries(shopItems)) {
      teks += `│ ${name} : ${price.toLocaleString()} money\n`;
    }
    teks += `╰── Ketik *.foobuy <item> <jumlah>* untuk membeli.`;
    return m.reply(teks);
  }

  if (command === 'foobuy') {
    if (args.length < 2) return m.reply(`Contoh penggunaan:\n${usedPrefix}foobuy ayambakar 3`);

    const namaInput = args[0].toLowerCase();
    const jumlah = parseInt(args[1]);
    if (isNaN(jumlah) || jumlah <= 0) return m.reply('Jumlah harus berupa angka dan lebih dari 0.');

    const namaItem = itemAlias[namaInput];
    if (!namaItem) return m.reply('Item tidak ditemukan di toko.');

    const harga = shopItems[namaItem];
    const totalHarga = harga * jumlah;

    if (user.money < totalHarga) return m.reply(`Uangmu tidak cukup. Butuh ${totalHarga.toLocaleString()} money.`);

    // Nama properti di database, misalnya ayambakar, lelebakar, vodka, dll
    const properti = namaInput;

    user.money -= totalHarga;
    user[properti] = (user[properti] || 0) + jumlah;

    return m.reply(`Kamu berhasil membeli ${jumlah} ${namaItem} seharga ${totalHarga.toLocaleString()} money.`);
  }
};

export default handler;

handler.help = ['fooshop', 'foobuy <item> <jumlah>'];
handler.tags = ['rpg'];
handler.command = ['fooshop', 'foobuy'];
handler.register = true;