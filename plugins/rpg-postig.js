const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": `instagram ${global.namebot || 'Bot'} ✨`, // Menggunakan nama fitur "instagram"
    }
};

let handler = async (m, { conn, command, args }) => {
  let user = global.db.data.users[m.sender];
  const tag = '@' + m.sender.split`@`[0];

  try {
    if (command === 'createig') {
      const accountName = args.join(' ');
      if (!accountName) {
        return conn.reply(m.chat, `${tag} Silakan berikan nama untuk akun Instagram Anda.\n* .createig [nama akun]`, fkontak); // Menggunakan fkontak
      }
      user.instagram_account = accountName;
      user.followers2 = 0;
      user.likes2 = 0;
      user.comments2 = 0;
      user.shares2 = 0;
      user.posts = []; // Initialize an array to store posts
      return conn.reply(m.chat, `🎉 Akun Instagram ${tag} berhasil dibuat dengan nama: *${accountName}*!`, fkontak); // Menggunakan fkontak
    }

    if (command === 'post' || command === 'posting') {
      if (!user.instagram_account) {
        return conn.reply(m.chat, `Hey Kamu Iya Kamu ${tag}\nBuat akun Instagram terlebih dahulu\nKetik: .createig [nama akun]`, fkontak); // Menggunakan fkontak
      }

      let caption = args.join(' ');
      
      if (!caption) {
        return conn.reply(m.chat, `${tag} Silakan berikan judul untuk postingan Anda.`, fkontak); // Menggunakan fkontak
      }

      if (caption.length < 5) {
        return conn.reply(m.chat, `Caption terlalu pendek minimal 5 huruf.`, fkontak); // Menggunakan fkontak
      }
      if (caption.length > 100) {
        return conn.reply(m.chat, `Caption terlalu panjang maksimal 100 huruf.`, fkontak); // Menggunakan fkontak
      }

      const cooldownTime = 1500000; // 25 minutes
      const lastPostTime = user.lastPostTime || 0;
      const timeSinceLastPost = new Date() - lastPostTime;

      if (timeSinceLastPost < cooldownTime) {
        const remainingCooldown = cooldownTime - timeSinceLastPost;
        const formattedCooldown = msToTime(remainingCooldown);
        return conn.reply(m.chat, `Kamu sudah memposting baru-baru ini. Tunggu selama\n${formattedCooldown} sebelum bisa memposting lagi.`, fkontak); // Menggunakan fkontak
      }
      setTimeout(() => {
        conn.reply(m.chat, `👋 Hai Kak ${tag}, Sudah waktunya memposting instagram!`, fkontak); // Menggunakan fkontak
      }, cooldownTime);

      const randomLikes = Math.floor(Math.random() * (5000 - 100 + 1)) + 100;
      const randomFollowers = Math.floor(Math.random() * (500 - 10 + 1)) + 50;
      const randomComments = Math.floor(Math.random() * (500 - 10 + 1)) + 10;
      const randomShares = Math.floor(Math.random() * (300 - 5 + 1)) + 5;
      const randomMoney = Math.floor(Math.random() * (3000000 - 100000 + 1)) + 100000; 
      
      user.likes2 += randomLikes;
      user.followers2 += randomFollowers
      user.comments2 += randomComments;
      user.shares2 += randomShares;
      user.money += randomMoney; // eris diubah menjadi money
      user.lastPostTime = new Date();

      // Add post to user's posts array
      user.posts.push({ caption, money: randomMoney, followers: randomFollowers, likes: randomLikes, comments: randomComments, shares: randomShares, time: new Date() });
      if (user.posts.length > 5) user.posts.shift(); // Keep only the last 5 posts

      conn.reply(m.chat, `*\`AKUN INSTAGRAM\`*\n
🧑🏻‍💻 *Pengguna:* ${tag}
📝 *Caption:* ${caption}
👤 *Followers Baru:* +${formatNumber(randomFollowers)}
👍🏻 *Like Baru:* +${formatNumber(randomLikes)}
💰 *Hadiah:* Rp.${formatNumber(randomMoney)}
💬 *Komentar Baru:* +${formatNumber(randomComments)}
🔗 *Bagikan Baru:* +${formatNumber(randomShares)}

> Cek Progresmu: .akunig`, fkontak); // Menggunakan fkontak
    }

    if (command === 'akunig') {
      if (!user.instagram_account) {
        return conn.reply(m.chat, `Hey Kamu Iya Kamu ${tag}\nBuat akun Instagram terlebih dahulu\nKetik: .createig [nama akun]`, fkontak); // Menggunakan fkontak
      }

      let postList = user.posts.map((post, index) => {
        return `\n${index + 1}. *Caption:* ${post.caption}\n> *Likes:* ${formatNumber(post.likes)}\n> *Komentar:* ${formatNumber(post.comments)}\n> *Shares:* ${formatNumber(post.shares)}\n> *Waktu:* ${post.time.toLocaleString()}`;
      }).join('');

      conn.reply(m.chat, `*\`AKUN INSTAGRAM\`*\n
📸 *Akun Instagram ${tag}*
👨🏻‍💻 *Nama Akun:* ${user.instagram_account}
👤 *Followers Total:* ${formatNumber(user.followers2)}
❤️ *Likes Total:* ${formatNumber(user.likes2)}
💬 *Komentar Total:* ${formatNumber(user.comments2)}
🔗 *Shares Total:* ${formatNumber(user.shares2)}
📊 *Jumlah Postingan:* ${user.posts.length}

*Top 5 Postingan Terakhir:*
${postList}

> Cek Progresmu: .akunig`, fkontak); // Menggunakan fkontak
    }
  } catch (err) {
    m.reply("📢: " + err);
  }
};

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  const formattedTime = [];
  if (hours > 0) {
    formattedTime.push(`${hours} jam`);
  }
  if (minutes > 0) {
    formattedTime.push(`${minutes} menit`);
  }
  if (seconds > 0 || (hours === 0 && minutes === 0)) {
    formattedTime.push(`${seconds} detik`);
  }

  return formattedTime.join(' ');
}

function formatNumber(num) {
    if (num >= 100000000) return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'T'; 
    if (num >= 10000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'; 
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'JT'; 
    if (num >= 100000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'; 
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k'; 
    return num.toString();
}

handler.help = ['posting'];
handler.tags = ['rpg'];
handler.command = /^(post|akunig|igpost|createig|postinstagram|posting)$/i;
handler.register = true;
handler.group = true;
handler.limit = 1;

export default handler;