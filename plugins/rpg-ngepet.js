let handler = async function (m, { conn, args, participants, usedPrefix, command }) {
  let user = global.db.data.users[m.sender];
  if (!user) return m.reply('⚠️ Data pengguna tidak ditemukan.');

  const cooldownTime = 1000 * 60 * 30; // 30 menit
  const now = Date.now();
  const lastNgepet = user.lastNgepet || 0;

  // Tag teman (jika ada)
  let partner = m.mentionedJid?.[0];
  let partnerUser = partner ? global.db.data.users[partner] : null;

  // Cooldown untuk pengirim
  if (now - lastNgepet < cooldownTime) {
    let sisaMs = cooldownTime - (now - lastNgepet);
    let mnt = Math.floor(sisaMs / 60000);
    let dtk = Math.floor((sisaMs % 60000) / 1000);
    return m.reply(`⏳ Kamu terlalu lelah ngepet...\nCoba lagi dalam *${mnt} menit ${dtk} detik*.`);
  }

  // Cooldown untuk partner
  if (partner) {
    if (!partnerUser) return m.reply('⚠️ Data partner tidak ditemukan.');
    const partnerCooldown = partnerUser.lastNgepet || 0;
    if (now - partnerCooldown < cooldownTime) {
      let sisaMs = cooldownTime - (now - partnerCooldown);
      let mnt = Math.floor(sisaMs / 60000);
      let dtk = Math.floor((sisaMs % 60000) / 1000);
      return m.reply(`👥 Partner kamu masih cooldown ngepet!\nTunggu *${mnt} menit ${dtk} detik* lagi.`);
    }
  }

  // Hitung harian
  let today = new Date().toLocaleDateString();
  if (user.lastNgepetDate !== today) {
    user.lastNgepetDate = today;
    user.ngepetCountToday = 0;
  }
  user.ngepetCountToday = (user.ngepetCountToday || 0) + 1;
  user.lastNgepet = now;

  if (partner) {
    if (partnerUser.lastNgepetDate !== today) {
      partnerUser.lastNgepetDate = today;
      partnerUser.ngepetCountToday = 0;
    }
    partnerUser.ngepetCountToday = (partnerUser.ngepetCountToday || 0) + 1;
    partnerUser.lastNgepet = now;
  }

  // Hitung peluang gagal
  let failChance = 0.4 + (user.ngepetCountToday - 1) * 0.1;
  if (partner) failChance += (partnerUser.ngepetCountToday - 1) * 0.1;
  if (failChance > 0.8) failChance = 0.8;

  // Jubah Gaib (bonus)
  if (user.jubahGaib) failChance -= 0.2;
  if (partner && partnerUser.jubahGaib) failChance -= 0.2;
  if (failChance < 0.1) failChance = 0.1;

  let sukses = Math.random() > failChance;

  if (sukses) {
    let totalUang = Math.floor(Math.random() * 7000001 + 3000000);
    let hasilPerOrang = partner ? Math.floor(totalUang / 2) : totalUang;

    user.money = (user.money || 0) + hasilPerOrang;
    if (partner) partnerUser.money = (partnerUser.money || 0) + hasilPerOrang;

    return m.reply(
      `🐷 *Aksi ngepet berhasil!*\n` +
      `💰 Total uang: *Rp${totalUang.toLocaleString('id-ID')}*\n` +
      `👤 Dibagi: *Rp${hasilPerOrang.toLocaleString('id-ID')}* per orang\n` +
      (partner ? `👥 Bersama: @${partner.split('@')[0]}\n` : '') +
      `📦 Saldo kamu: *Rp${user.money.toLocaleString('id-ID')}*\n` +
      (partner ? `📦 Saldo partner: *Rp${partnerUser.money.toLocaleString('id-ID')}*` : '') +
      `\n🔁 Total ngepet hari ini: *${user.ngepetCountToday}x*`
    );
  } else {
    let denda = Math.floor(Math.random() * 301 + 100);
    user.money = Math.max(0, (user.money || 0) - denda);
    if (partner) partnerUser.money = Math.max(0, (partnerUser.money || 0) - denda);

    return m.reply(
      `🚨 *Kamu ${partner ? 'dan temanmu ' : ''}ketahuan warga saat ngepet!*\n` +
      `💸 Denda: *Rp${denda.toLocaleString('id-ID')}* per orang\n` +
      `📦 Saldo kamu: *Rp${user.money.toLocaleString('id-ID')}*\n` +
      (partner ? `📦 Saldo partner: *Rp${partnerUser.money.toLocaleString('id-ID')}*` : '') +
      `\n⚠️ Warga makin curiga karena ngepet sudah *${user.ngepetCountToday}x* hari ini!`
    );
  }
};

handler.help = ['ngepet [@tag]'];
handler.tags = ['rpg', 'fun'];
handler.command = /^ngepet$/i;

export default handler;