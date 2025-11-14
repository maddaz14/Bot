let handler = async (m, { conn, usedPrefix, text, args, command }) => {
  let monsters = [
    { area: 1, name: "Goblin" },
    { area: 1, name: "Slime" },
    { area: 1, name: "Wolf" },
    { area: 2, name: "Nymph" },
    { area: 2, name: "Skeleton" },
    { area: 2, name: "Wolf" },
    { area: 3, name: "Baby Demon" },
    { area: 3, name: "Ghost" },
    { area: 3, name: "Zombie" },
    { area: 4, name: "Imp" },
    { area: 4, name: "Witch" },
    { area: 4, name: "Zombie" },
    { area: 5, name: "Ghoul" },
    { area: 5, name: "Giant Scorpion" },
    { area: 5, name: "Unicorn" },
    { area: 6, name: "Baby Robot" },
    { area: 6, name: "Sorcerer" },
    { area: 6, name: "Unicorn" },
    { area: 7, name: "Cecaelia" },
    { area: 7, name: "Giant Piranha" },
    { area: 7, name: "Mermaid" },
    { area: 8, name: "Giant Crocodile" },
    { area: 8, name: "Nereid" },
    { area: 8, name: "Mermaid" },
    { area: 9, name: "Demon" },
    { area: 9, name: "Harpy" },
    { area: 9, name: "Killer Robot" },
    { area: 10, name: "Dullahan" },
    { area: 10, name: "Manticore" },
    { area: 10, name: "Killer Robot" },
    { area: 11, name: "Baby Dragon" },
    { area: 11, name: "Young Dragon" },
    { area: 11, name: "Scaled Baby Dragon" },
    { area: 12, name: "Kid Dragon" },
    { area: 12, name: "Not so young Dragon" },
    { area: 12, name: "Scaled Kid Dragon" },
    { area: 13, name: "Definitely not so young Dragon" },
    { area: 13, name: "Teen Dragon" },
    { area: 13, name: "Scaled Teen Dragon" },
  ];

  let player = global.db.data.users[m.sender];
  let pengirim = m.sender.split("@")[0];
  let __timers = (new Date - global.db.data.users[m.sender].lasthunt);
  let _timers = (1200000 - __timers);
  let timers = clockString(_timers);

  let area_monsters = monsters[Math.floor(Math.random() * monsters.length)];
  let monster = area_monsters.name;
  area_monsters = area_monsters.area;
  let monsterName = monster.toUpperCase();

  // Jika Stamina Habis
  if (player.stamina <= 25) {
    conn.reply(m.chat, '😓 Stamina Anda tidak cukup. Anda perlu memulihkan stamina Anda terlebih dahulu.\nExample .eat', m);
    return;
  }

  if (_timers <= 0) { 
    let coins = parseInt(Math.floor(Math.random() * 735758));
    let exp = parseInt(Math.floor(Math.random() * 10000));
    let _healing = Math.floor(Math.random() * 100);
    let _damage = Math.floor(Math.random() * 150);
    let _stamina = Math.floor(Math.random() * 100);
    let stamina = _stamina;
    let healing = _healing;
    let damage = _damage;

    player.health -= healing;
    player.stamina -= stamina;
    player.damage += damage;
    player.lasthunt = new Date * 1; // waktu hunt 20 menit

    if (player.health < 0) {
      let msg = `*@${pengirim}* Anda Mati Di Bunuh Oleh ${monsterName}`;
      // Logika ketika pemain mati
      player.health = 100;
      await conn.reply(m.chat, msg, m, { mentions: conn.parseMention(msg) });
      return;
    }

    player.money += coins;
    player.exp += exp;
    global.db.data.users[m.sender].tiketcoin += 1;

    let pesan = `Berhasil Menemukan *${monsterName}*\n*@${pengirim}* Kamu Sudah Membunuhnya\nMendapatkan:\n*💰 = [ ${new Intl.NumberFormat('en-US').format(coins)} ] Money*\n*⭐ = [ ${new Intl.NumberFormat('en-US').format(exp)} ] XP*\n\n*🔥 = [ ${damage} ] Damage*\n*🩸 = [ -${healing} ] Health* (Tersisa ${player.health} Health)\n*🌀 = [ -${stamina} ] Stamina* (Tersisa ${player.stamina} Stamina)\n\n+1 Tiketcoin`;
    await conn.reply(m.chat, pesan, m, { mentions: conn.parseMention(pesan) });

    // Kirim notifikasi ke pengguna jika cooldown selesai
    setTimeout(() => {
      conn.reply(m.chat, `*@${pengirim}*, sekarang kamu sudah bisa bermain hunter lagi!`, m);
    }, 1200000); // 20 menit dalam milidetik
  } else {
    conn.reply(m.chat, `Tunggu ${timers} untuk bermain hunter lagi`, m);
  }
};

handler.help = ['hunter'];
handler.tags = ['rpg'];
handler.command = /^hunter|hunt/i;
handler.limit = true;
handler.group = true;
handler.register = true;
handler.fail = null;

export default handler;

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return ['\n' + d, ' *Hari*\n ', h, ' *Jam*\n ', m, ' *Menit*\n ', s, ' *Detik* '].map(v => v.toString().padStart(2, 0)).join('');
}