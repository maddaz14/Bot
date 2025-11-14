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
      text: `📛 Kamu belum punya akun YouTube.\nBuat dulu dengan: *${usedPrefix}ytcreate*`,
      contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: fkontak });
  }

  user.streaming = user.streaming || {};
  user.youtubeTools = user.youtubeTools || {
    camera: 1,
    internetSpeed: 1,
    microphone: 1
  };
  user.youtubeMoney = typeof user.youtubeMoney === 'number' ? user.youtubeMoney : 0;
  user.youtubeSubs = typeof user.youtubeSubs === 'number' ? user.youtubeSubs : 0;

  if (user.streaming.active) {
    const duration = Math.floor((Date.now() - user.streaming.startTime) / 60000);
    return conn.sendMessage(m.chat, {
      text: `📡 Kamu sedang live streaming!\n\n🎥 Judul: *${user.streaming.title}*\n👀 Penonton: *${user.streaming.currentViewers}*\n👍 Likes: *${user.streaming.currentLikes}*\n⏱️ Durasi: *${duration} menit*\n\n🔴 Untuk mengakhiri live: *${usedPrefix}ytcancel*`
    }, { quoted: fkontak });
  }

  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `🎬 Untuk memulai live streaming, berikan judulnya!\nContoh: *${usedPrefix}ytstream Review Game Baru*`
    }, { quoted: fkontak });
  }

  // Simulasi hasil awal berdasarkan tools
  const viewers = Math.floor(Math.random() * 50) + (user.youtubeTools.camera * 10) + (user.youtubeTools.internetSpeed * 5);
  const likes = Math.floor(Math.random() * 10) + (user.youtubeTools.microphone * 5);

  user.streaming = {
    active: true,
    title: text,
    startTime: Date.now(),
    currentViewers: viewers,
    currentLikes: likes
  };

  await conn.sendMessage(m.chat, {
    text: `✅ *Live streaming dimulai!*\n\n📺 Judul: *${text}*\n👥 Penonton awal: *${viewers}*\n👍 Likes awal: *${likes}*\n\n🕐 Tunggu 5 menit...`,
  }, { quoted: fkontak });

  // Setelah 5 menit, kirim hadiah otomatis
  setTimeout(async () => {
    const bonus = viewers * 10 + likes * 50;
    const subs = Math.floor(viewers / 2 + likes / 2);
    
    user.youtubeMoney += bonus;
    user.youtubeSubs += subs;
    user.streaming = {};

    await conn.sendMessage(m.chat, {
      text: `🎉 *Live Streaming Selesai!*\n\n📺 Judul: *${text}*\n👥 Total Penonton: *${viewers}*\n👍 Total Likes: *${likes}*\n\n🎁 Kamu mendapatkan:\n💰 YT Money: *+${bonus}*\n👤 Subscriber: *+${subs}*\n\nGunakan *${usedPrefix}ytstat* untuk cek statistikmu!`
    }, { quoted: fkontak });
  }, 5 * 60 * 1000); // 5 menit
};

handler.help = ['ytstream <judul>'];
handler.tags = ['game'];
handler.command = /^(ytstream|youtuberstream|youtuber streaming|yt streaming|ytlive)$/i;
handler.register = true;

export default handler;