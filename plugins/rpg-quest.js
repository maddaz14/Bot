const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(num);

const REWARDS = {
  hunt: { money: 11646, exp: 828 },
  duel: { money: 25530, exp: 1348 },
  craft: { money: 17570, exp: 887 },
};

const CRAFT_ITEMS = {
  potion: 1,
  herbs: 3,
};

let handler = async (m, { conn, command, args, usedPrefix }) => {
  let user = global.db.data.users[m.sender];

  // Inisialisasi misi harian jika belum ada
  if (!user.dailyQuest) {
    user.dailyQuest = {
      lastReset: Date.now(),
      quests: {
        hunt: { progress: 0, target: 6, completed: false, claimed: false },
        duel: { progress: 0, target: 2, completed: false, claimed: false },
        craft: { progress: 0, target: 1, completed: false, claimed: false },
      }
    };
  }

  // Reset setiap 24 jam
  const resetInterval = 86400000;
  if (Date.now() - user.dailyQuest.lastReset >= resetInterval) {
    user.dailyQuest.lastReset = Date.now();
    for (let q in user.dailyQuest.quests) {
      user.dailyQuest.quests[q] = { progress: 0, target: user.dailyQuest.quests[q].target, completed: false, claimed: false };
    }
    m.reply('🕒 Misi harian Anda telah direset!');
  }

  let [action, questId] = args;

  if (!action) {
    let timeLeft = user.dailyQuest.lastReset + resetInterval - Date.now();
    let hours = Math.floor(timeLeft / 3600000);
    let minutes = Math.floor((timeLeft % 3600000) / 60000);
    let seconds = Math.floor((timeLeft % 60000) / 1000);

    const q = user.dailyQuest.quests;
    let status = `
📜 *Misi Harian*

Berikut adalah misi Anda hari ini:

🔹 *[Q1] Berburu di hutan*
   - ${q.hunt.progress}/${q.hunt.target} ${q.hunt.completed ? (q.hunt.claimed ? '(✅ Selesai)' : '(🎁 Klaim)') : ''}
   - 🎁 Rp ${formatNumber(REWARDS.hunt.money)}, ${REWARDS.hunt.exp} XP

🔹 *[Q2] Menang duel*
   - ${q.duel.progress}/${q.duel.target} ${q.duel.completed ? (q.duel.claimed ? '(✅ Selesai)' : '(🎁 Klaim)') : ''}
   - 🎁 Rp ${formatNumber(REWARDS.duel.money)}, ${REWARDS.duel.exp} XP

🔹 *[Q3] Craft item*
   - ${q.craft.progress}/${q.craft.target} ${q.craft.completed ? (q.craft.claimed ? '(✅ Selesai)' : '(🎁 Klaim)') : ''}
   - 🎁 Rp ${formatNumber(REWARDS.craft.money)}, ${REWARDS.craft.exp} XP

📝 Gunakan \`${usedPrefix}quest klaim <ID>\` untuk klaim hadiah.
⏳ Reset dalam: ${hours} jam ${minutes} menit ${seconds} detik.
`.trim();
    return m.reply(status);
  }

  if (action === 'klaim') {
    if (!questId) return m.reply(`Gunakan:\n${usedPrefix}quest klaim <ID>\nContoh: ${usedPrefix}quest klaim Q1`);

    const id = questId.toUpperCase();
    const map = { Q1: 'hunt', Q2: 'duel', Q3: 'craft' };
    const key = map[id];

    if (!key) return m.reply('ID misi tidak valid. Gunakan Q1, Q2, atau Q3.');

    const quest = user.dailyQuest.quests[key];
    if (!quest.completed) return m.reply('Misi ini belum selesai.');
    if (quest.claimed) return m.reply('Hadiah sudah diklaim.');

    user.money += REWARDS[key].money;
    user.exp += REWARDS[key].exp;
    quest.claimed = true;

    return m.reply(`🎉 Selamat! Anda mengklaim hadiah untuk ${id}:\n+ Rp ${formatNumber(REWARDS[key].money)}\n+ ${REWARDS[key].exp} XP`);
  }

  if (action === 'update') {
    const questType = args[1];
    const amount = parseInt(args[2]) || 1;

    if (!user.dailyQuest.quests[questType]) return m.reply('Tipe misi tidak valid.');

    const quest = user.dailyQuest.quests[questType];
    if (quest.completed) return m.reply(`Misi "${questType}" sudah selesai.`);

    quest.progress += amount;
    if (quest.progress >= quest.target) {
      quest.progress = quest.target;
      quest.completed = true;
      quest.claimed = false;
      return m.reply(`✅ Misi "${questType}" selesai! Silakan klaim hadiahnya.`);
    } else {
      return m.reply(`📊 Kemajuan "${questType}": ${quest.progress}/${quest.target}`);
    }
  }

  return m.reply('Perintah tidak valid. Gunakan `.quest`, `.quest klaim <ID>`, atau `.quest update <type> [jumlah]`.');
};

handler.help = ['quest', 'quest klaim <ID>', 'quest update <type> [jumlah]'];
handler.tags = ['rpg'];
handler.command = /^quest$/i;
handler.register = true;

export default handler;