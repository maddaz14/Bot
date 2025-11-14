let handler = async (m, { conn, args }) => {
  let user = global.db.data.users[m.sender];

  // Inisialisasi user jika belum ada
  if (!user) {
    global.db.data.users[m.sender] = {
      money: 0,
      hp: 100,
    };
    user = global.db.data.users[m.sender];
  }

  // Daftar makanan
  const foodMenu = {
    nasi:       { harga: 100,  hp: 10 },
    roti:       { harga: 200,  hp: 20 },
    mie:        { harga: 300,  hp: 30 },
    sate:       { harga: 500,  hp: 50 },
    burger:     { harga: 600,  hp: 55 },
    pizza:      { harga: 700,  hp: 60 },
    rendang:    { harga: 1000, hp: 100 },
    steak:      { harga: 1500, hp: 120 },
    ayamgoreng: { harga: 800,  hp: 80 },
    bakso:      { harga: 450,  hp: 40 },
    soto:       { harga: 550,  hp: 50 },
    ramen:      { harga: 650,  hp: 65 },
    kebab:      { harga: 750,  hp: 70 },
    kentang:    { harga: 250,  hp: 20 },
    eskrim:     { harga: 300,  hp: 25 },
    // Menambahkan Lele Bakar di sini
    lelebakar:  { harga: 900,  hp: 90 } // Harga dan HP bisa disesuaikan
  };

  // Jika tanpa argumen, tampilkan menu makanan
  if (!args[0]) {
    let menu = '*🍱 MENU MAKANAN RPG:*\n\n' +
      Object.entries(foodMenu)
        .map(([nama, data]) => `🍽 *${nama.charAt(0).toUpperCase() + nama.slice(1)}* - Rp${data.harga} [+${data.hp} HP]`) // Mengubah nama agar huruf pertama kapital
        .join('\n') +
      `\n\nGunakan perintah: *.buyfood <nama_makanan>*\nContoh: *.buyfood nasi*`;
    
    return m.reply(menu);
  }

  let nama = args[0].toLowerCase();
  let item = foodMenu[nama];

  if (!item) {
    return m.reply(
      `⚠️ Makanan *${args[0]}* tidak tersedia!\n` +
      `Ketik *.buyfood* untuk melihat daftar makanan.`
    );
  }

  if (user.money < item.harga) {
    return m.reply(
      `💸 Uang kamu tidak cukup untuk membeli *${nama}*.\n` +
      `Harga: Rp${item.harga}\nSaldo: Rp${user.money}`
    );
  }

  user.money -= item.harga;
  user.hp = Math.min((user.hp || 100) + item.hp, 100); // HP maks 100

  return m.reply(
    `✅ Kamu membeli *${nama.charAt(0).toUpperCase() + nama.slice(1)}* seharga Rp${item.harga}.\n` +
    `❤️ HP bertambah +${item.hp}\n` +
    `📦 HP sekarang: *${user.hp}*\n` +
    `💰 Uang tersisa: *Rp${user.money}*`
  );
};

handler.help = ['buyfood [nama]'];
handler.tags = ['rpg'];
handler.command = /^buyfood$/i;

export default handler;