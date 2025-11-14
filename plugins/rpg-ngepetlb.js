let handler = async function (m, { conn }) {
  let users = Object.entries(global.db.data.users)
    .filter(([_, u]) => u.totalNgepetMoney)
    .sort((a, b) => (b[1].totalNgepetMoney || 0) - (a[1].totalNgepetMoney || 0))
    .slice(0, 10);

  if (!users.length) return m.reply('🏆 Belum ada yang ngepet nih!');

  let teks = `🏆 *Top 10 Ngepet Leaderboard*\n\n`;
  for (let i = 0; i < users.length; i++) {
    let [jid, user] = users[i];
    teks += `${i + 1}. @${jid.split('@')[0]}\n   💰 Rp${(user.totalNgepetMoney || 0).toLocaleString('id-ID')}\n`;
  }

  m.reply(teks, null, {
    mentions: users.map(([jid]) => jid)
  });
};

handler.help = ['leaderboardngepet', 'ngepetlb'];
handler.tags = ['rpg', 'info'];
handler.command = /^(leaderboardngepet|ngepetlb)$/i;

export default handler;