let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];

  const categories = {
    '🍎 Buahan': {
      pisang: '🍌', mangga: '🥭', jeruk: '🍊', anggur: '🍇', apel: '🍎'
    },
    '🌱 Bibit': {
      bibitpisang: '🌱🍌', bibitmangga: '🌱🥭', bibitjeruk: '🌱🍊', bibitanggur: '🌱🍇', bibitapel: '🌱🍎'
    },
    '🧃 Item RPG': {
      potion: '🧪', diamond: '💎', common: '📦', uncommon: '🎁', mythic: '⚗️', legendary: '🏆', exp: '⭐'
    },
    '⚙️ Material': {
      kayu: '🪵', batu: '🪨', iron: '⛓️', string: '🧵', aqua: '💧', emasbatang: '🟡', emasbiasa: '🪙', berlian: '🔷'
    },
    '♻️ Sampah': {
      sampah: '🗑️', botol: '🍾', kaleng: '🥫', kardus: '📦'
    },
    '🐾 Pet': {
      phonix: '🔥🐦', griffin: '🦅🦁', kyubi: '🦊✨', naga: '🐉', centaur: '🐎🏹',
      kuda: '🐎', rubah: '🦊', kucing: '🐱', serigala: '🐺', pet: '🐾'
    },
    '🍖 Makanan Pet': {
      makananpet: '🍖', makananphonix: '🔥🍗', makanangriffin: '🦅🍗', makanannaga: '🐉🍖',
      makanankyubi: '🦊🍖', makanancentaur: '🏹🍗'
    },
    '⚒️ Peralatan': {
      sword: '🗡️', pancingan: '🎣', bensin: '⛽', weap: '🔫', weapStock: '🔧', kolam: '🏞️'
    },
    '🎟️ Tiket & Barang Khusus': {
      tiketcoin: '🎫', koinexpg: '🪙✨', gardenboxs: '🪴', ketake: '🍄', eleksirb: '⚗️', obat: '💊', nStock: '📈'
    },
    '🪱 Pancing': {
      umpan: '🪱'
    },
    '❤️ Lainnya': {
      healtmonster: '❤️‍🩹'
    }
  };

  let output = '╭───〔  *INVENTORY MU*  〕───⬣\n';

  for (const [category, items] of Object.entries(categories)) {
    let section = Object.entries(items)
      .filter(([item]) => user[item] && user[item] > 0)
      .map(([item, emoji]) => `${emoji} *${item}* : ${user[item].toLocaleString()}`)
      .join('\n');

    if (section) {
      output += `\n${category}\n${section}\n`;
    }
  }

  // Bagian inventori kolam
  let {
    paus, kepiting, gurita, cumi, buntal, dory,
    lumba, lobster, hiu, udang, ikan, orca,
    pancingan, anakpancingan
  } = user;

  let levelPancing = pancingan == 0 ? 'Tidak Punya'
    : pancingan == 1 ? 'Level 1'
    : pancingan == 2 ? 'Level 2'
    : pancingan == 3 ? 'Level 3'
    : pancingan == 4 ? 'Level 4'
    : 'Level MAX';

  let expProgress = pancingan < 5 ? `Exp *${anakpancingan}* → *${pancingan * 10000}*` : '';
  let levelInfo = pancingan > 0 ? `🎣 ${levelPancing} ${pancingan < 5 ? `→ Level *${pancingan + 1}*` : ''}` : '❌ Tidak Punya Pancingan';

  let kolamIkan = `
🐟 *Ikan Kolammu:*
🦈 Hiu        : ${hiu}
🐟 Ikan       : ${ikan}
🐠 Dory       : ${dory}
🐋 Orca       : ${orca}
🐳 Paus       : ${paus}
🦑 Cumi       : ${cumi}
🐙 Gurita     : ${gurita}
🐡 Buntal     : ${buntal}
🦐 Udang      : ${udang}
🐬 Lumba²     : ${lumba}
🦞 Lobster    : ${lobster}
🦀 Kepiting   : ${kepiting}

🎣 *Level Pancingan:*
${levelInfo}
${pancingan < 5 ? `📊 ${expProgress}` : ''}
`.trim();

  output += `\n╭───〔  *INVENTORY KOLAM IKAN*  〕───⬣\n${kolamIkan}\n╰────────────────────────⬣`;

  if (output.trim() === '╭───〔  *INVENTORY MU*  〕───⬣\n╰────────────────────────⬣') {
    return m.reply('📦 Kamu belum memiliki item apa pun di inventori.');
  }

  m.reply(output);
};

handler.help = ['inventory1', 'inv1'];
handler.tags = ['rpg'];
handler.command = ['inventory1', 'inv1'];
handler.register = true;

export default handler;