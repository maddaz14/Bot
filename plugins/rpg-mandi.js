let handler = async (m, { conn }) => {
  global.db.data.users = global.db.data.users || {};
  let user = global.db.data.users[m.sender];

  if (!user) {
    global.db.data.users[m.sender] = { money: 0, exp: 0, lastMandi: 0, kebersihan: 50, inventory: [] };
    user = global.db.data.users[m.sender];
  }

  let now = Date.now();
  let cooldown = 30 * 60 * 1000; // 30 menit

  if (user.lastMandi && now - user.lastMandi < cooldown) {
    let sisa = cooldown - (now - user.lastMandi);
    let menit = Math.floor(sisa / 60000);
    let detik = ((sisa % 60000) / 1000).toFixed(0);
    return m.reply(`🚿 Kamu sudah mandi.\nTunggu *${menit} menit ${detik} detik* lagi untuk mandi lagi.`);
  }

  user.lastMandi = now;

  // Hadiah acak
  let exp = Math.floor(Math.random() * 300) + 500;        // 500 - 800 EXP
  let money = Math.floor(Math.random() * 10000) + 5000;   // 5.000 - 15.000 uang
  user.exp += exp;
  user.money += money;

  // Kebersihan bertambah
  user.kebersihan = Math.min((user.kebersihan || 50) + 30, 100);

  // Peluang dapat item langka
  let dapatItem = Math.random() < 0.1; // 10% peluang
  let itemLangka = 'Sabun Legendaris';

  if (dapatItem && !(user.inventory || []).includes(itemLangka)) {
    user.inventory = user.inventory || [];
    user.inventory.push(itemLangka);
  }

  // Ucapan acak
  let ucapan = [
    'Kamu mandi pakai sabun wangi!',
    'Airnya segar banget ya!',
    'Kamu selesai mandi dan merasa segar.',
    'Kamu nyanyi di kamar mandi tadi ya?',
    'Jangan lupa sikat gigi juga!',
    'Seekor kucing nyelonong masuk kamar mandi!',
    'Sabunmu licin banget sampai hampir jatuh!'
  ];
  let randomUcapan = ucapan[Math.floor(Math.random() * ucapan.length)];

  let teks = `🛁 ${randomUcapan}\n\n💰 Uang: Rp${money.toLocaleString()}\n⭐ EXP: +${exp}\n🧼 Kebersihan: ${user.kebersihan}%`;

  if (dapatItem) teks += `\n🎁 Kamu menemukan item langka: *${itemLangka}*!`;

  await m.reply(teks);
};

handler.help = ['mandi'];
handler.tags = ['rpg', 'fun'];
handler.command = /^mandi$/i;
handler.group = true;

export default handler;