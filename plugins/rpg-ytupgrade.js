let handler = async (m, { conn, text, usedPrefix }) => {
  const user = global.db.data.users[m.sender];
  const fkontak = {
    key: {
      participant: '0@s.whatsapp.net',
      remoteJid: "0@s.whatsapp.net",
      fromMe: false,
      id: "Halo",
    },
    message: {
      conversation: `Akun YT ${global.namebot || 'Bot'} 🪾`
    }
  };

  if (!user.youtube_account) {
    return conn.sendMessage(m.chat, {
      text: `Kamu belum punya akun YouTube.\nBuat dulu dengan: *${usedPrefix}ytcreate*`,
      contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: fkontak });
  }

  const tools = user.youtubeTools || {
    camera: 0,
    microphone: 0,
    editingSoftware: 0,
    internetSpeed: 0
  };

  const maxLevel = 5;
  const youtubeMoney = typeof user.youtubeMoney === 'number' ? user.youtubeMoney : 0;

  const formatNumber = (num) => {
    if (isNaN(num)) return '0';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'Jt';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
  };

  const upgradeCosts = {
    camera: [0, 1000, 3000, 9000, 25000],
    microphone: [0, 800, 2500, 7000, 18000],
    editingSoftware: [0, 1200, 4000, 10000, 22000],
    internetSpeed: [0, 700, 2000, 5000, 15000]
  };

  // Fungsi untuk dapatkan harga selanjutnya atau tulisan "Maksimal"
  const getNextCost = (tool, level) => {
    if (level >= maxLevel) return '✅ Maksimal';
    return formatNumber(upgradeCosts[tool][level] || 0);
  };

  let upgradeMenu = `
📹 *Upgrade Alat YouTube*

1. Kamera (Level ${tools.camera}/${maxLevel})
   💰 Harga selanjutnya: ${getNextCost('camera', tools.camera)}

2. Mikrofon (Level ${tools.microphone}/${maxLevel})
   💰 Harga selanjutnya: ${getNextCost('microphone', tools.microphone)}

3. Software Editing (Level ${tools.editingSoftware}/${maxLevel})
   💰 Harga selanjutnya: ${getNextCost('editingSoftware', tools.editingSoftware)}

4. Kecepatan Internet (Level ${tools.internetSpeed}/${maxLevel})
   💰 Harga selanjutnya: ${getNextCost('internetSpeed', tools.internetSpeed)}

Ketik: *${usedPrefix}ytupgrade [nama alat]*
Contoh: *${usedPrefix}ytupgrade kamera*

💰 *YT Money Anda:* ${formatNumber(youtubeMoney)}
`.trim();

  if (!text) {
    return conn.sendMessage(m.chat, {
      text: upgradeMenu
    }, { quoted: fkontak });
  }

  const input = text.toLowerCase().trim();
  let toolKey, toolDisplayName;

  switch (input) {
    case 'camera':
    case 'kamera':
      toolKey = 'camera';
      toolDisplayName = 'Kamera';
      break;
    case 'microphone':
    case 'mikrofon':
      toolKey = 'microphone';
      toolDisplayName = 'Mikrofon';
      break;
    case 'software':
    case 'editingsoftware':
    case 'software editing':
      toolKey = 'editingSoftware';
      toolDisplayName = 'Software Editing';
      break;
    case 'internet':
    case 'internetspeed':
    case 'kecepatan internet':
      toolKey = 'internetSpeed';
      toolDisplayName = 'Kecepatan Internet';
      break;
    default:
      return conn.sendMessage(m.chat, {
        text: `❌ Alat *"${text}"* tidak dikenali.\n\n${upgradeMenu}`
      }, { quoted: fkontak });
  }

  const currentLevel = tools[toolKey];
  const cost = upgradeCosts[toolKey][currentLevel];

  if (currentLevel >= maxLevel) {
    return conn.sendMessage(m.chat, {
      text: `🔝 *${toolDisplayName}* sudah mencapai level maksimal (${maxLevel}).`
    }, { quoted: fkontak });
  }

  if (youtubeMoney < cost) {
    return conn.sendMessage(m.chat, {
      text: `💸 *YT Money Anda tidak cukup* untuk upgrade *${toolDisplayName}* ke level ${currentLevel + 1}.\n\n` +
            `💰 Diperlukan: *${formatNumber(cost)}*\n` +
            `💼 Saldo Anda: *${formatNumber(youtubeMoney)}*`
    }, { quoted: fkontak });
  }

  // Proses upgrade
  user.youtubeMoney -= cost;
  tools[toolKey] += 1;

  return conn.sendMessage(m.chat, {
    text: `✅ *${toolDisplayName}* berhasil di-upgrade ke level *${tools[toolKey]}*!\n` +
          `💰 Sisa YT Money Anda: *${formatNumber(user.youtubeMoney)}*`
  }, { quoted: fkontak });
};

handler.help = ['ytupgrade [alat]'];
handler.tags = ['game'];
handler.command = /^(ytupgrade|youtuberupgrade|youtuber upgrade|yt upgrade|ytup)$/i;
handler.register = true;

export default handler;