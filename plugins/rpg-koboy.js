const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": `koboy ${global.namebot || 'Bot'} ✨`,
    }
};

let handler = async (m, { conn }) => {
  conn.koboy = conn.koboy || {};
  conn.koboyCooldown = conn.koboyCooldown || {};

  const playerCooldown = conn.koboyCooldown[m.sender];
  if (playerCooldown && playerCooldown > Date.now()) {
    const remainingTime = (playerCooldown - Date.now()) / 1000;
    return conn.reply(m.chat, `Maaf, Anda harus menunggu ${remainingTime.toFixed(0)} detik sebelum dapat memulai permainan lagi.`, fkontak); // Menggunakan fkontak
  }

  if (conn.koboy[m.chat]) return conn.reply(m.chat, 'Kamu sedang bermain game Koboy!', fkontak); // Menggunakan fkontak

  let playerPosition, criminalPosition;
  do {
    playerPosition = Math.floor(Math.random() * 6);
    criminalPosition = Math.floor(Math.random() * 6);
  } while (playerPosition === criminalPosition);

  let gameState = `🤠 Koboy Mengejar Penjahat 🥷

Wilayah saya:
${"・".repeat(playerPosition)}🤠${"・".repeat(5 - playerPosition)}
Wilayah penjahat:
${"・".repeat(criminalPosition)}🥷${"・".repeat(5 - criminalPosition)}
Ketik *'kanan'* untuk bergerak ke kanan.
Ketik *'kiri'* untuk bergerak ke kiri.`;

  let { key } = await conn.reply(m.chat, gameState, m);

  conn.koboy[m.chat] = {
    playerPosition,
    criminalPosition,
    key,
    oldkey: key,
    earnedExp: 10000,
    earnedMoney: 1000000, // PERUBAHAN: earnederis diubah menjadi earnedMoney
    sender: m.sender,
    moveCount: 0,
    maxMoves: 5,
    roomId: m.chat,
    timeout: setTimeout(() => {
      if (conn.koboy && conn.koboy[m.chat] && conn.koboy[m.chat].roomId === m.chat) {
        conn.sendMessage(m.chat, { delete: key });
        delete conn.koboy[m.chat];
      }
    }, 60000 * 2), // Timeout 2 menit untuk permainan
  };

  const cooldownDuration = 900000; // Durasi cooldown 15 menit dalam milidetik (900.000 milidetik)
  conn.koboyCooldown[m.sender] = Date.now() + cooldownDuration; // Set waktu cooldown untuk pemain
};

handler.before = async (m, { conn }) => {
  conn.koboy = conn.koboy || {};
  let user = global.db.data.users[m.sender];
  if (!conn.koboy[m.chat] || conn.koboy[m.chat].roomId !== m.chat || !['kiri', 'kanan'].includes(m.text.toLowerCase())) return;

  let gameData = conn.koboy[m.chat];
  let { playerPosition, criminalPosition, key, oldkey, moveCount, maxMoves, timeout, earnedExp, earnedMoney, sender } = gameData; // PERUBAHAN: earnederis diubah menjadi earnedMoney
  
  if (m.quoted || m.quoted.id == key) {
    if (m.text.toLowerCase() === 'kiri') {
      if (playerPosition > 0) {
        playerPosition--;
        moveCount++;
      } else {
        return conn.reply(m.chat, 'Anda sudah berada di batas kiri!', fkontak); // Menggunakan fkontak
      }
    } else if (m.text.toLowerCase() === 'kanan') {
      if (playerPosition < 5) {
        playerPosition++;
        moveCount++;
      } else {
        return conn.reply(m.chat, 'Anda sudah berada di batas kanan!', fkontak); // Menggunakan fkontak
      }
    }

    if (playerPosition === criminalPosition) {
      conn.sendMessage(m.chat, { delete: oldkey });
      let earnedMoneys = randomeris(earnedMoney, 1); // PERUBAHAN: earnederis diubah menjadi earnedMoney
      let earnedExps = randomeris(earnedExp, 1);
      user.money = (user.money || 0) + earnedMoneys; // PERUBAHAN: eris diubah menjadi money
      user.exp = (user.exp || 0) + earnedExps;
      delete conn.koboy[m.chat];
      clearTimeout(timeout); // Hentikan timeout jika permainan selesai
      const cooldownDuration = 900000; // Durasi cooldown 15 menit dalam milidetik (900.000 milidetik)
      conn.koboyCooldown[m.sender] = Date.now() + cooldownDuration; // Set waktu cooldown untuk pemain
      return conn.reply(m.chat, `🎉 Selamat! @${sender.split('@')[0]} berhasil mengejar penjahat! 🎉\n\n💰 Mendapatkan uang senilai *${formatRupiah(earnedMoneys)}*\n🔼 Dapatkan *${earnedExps}* EXP\n`, m, { mentions: [sender] });
    } else if (moveCount === maxMoves) {
      conn.sendMessage(m.chat, { delete: oldkey });
      delete conn.koboy[m.chat];
      clearTimeout(timeout); // Hentikan timeout jika permainan selesai
      const cooldownDuration = 900000; // Durasi cooldown 15 menit dalam milidetik (900.000 milidetik)
      conn.koboyCooldown[m.sender] = Date.now() + cooldownDuration; // Set waktu cooldown untuk pemain
      return conn.reply(m.chat, `😔 Kamu kalah! @${sender.split('@')[0]} sudah mencapai batas maksimum gerakan.`, m, { mentions: [sender] });
    }

    let gameState = `🤠 Koboy Mengejar Penjahat 🥷

Wilayah saya:
${"・".repeat(playerPosition)}🤠${"・".repeat(5 - playerPosition)}
Wilayah penjahat:
${"・".repeat(criminalPosition)}🥷${"・".repeat(5 - criminalPosition)}
Ketik *'kanan'* untuk bergerak ke kanan.
Ketik *'kiri'* untuk bergerak ke kiri.`;

    let msg = await conn.relayMessage(m.chat, {
      protocolMessage: {
        key: key,
        type: 14,
        editedMessage: {
          conversation: gameState
        }
      }
    }, {});

    let additionalData = {
      ...gameData,
      playerPosition,
      moveCount,
      key: { id: msg }
    };

    conn.koboy[m.chat] = Object.assign({}, conn.koboy[m.chat], additionalData);
  }
};

handler.help = ['koboy'];
handler.tags = ['rpg'];
handler.command = /^(koboy)$/i;
handler.disabled = false;

// Fungsi untuk menghasilkan angka acak dalam rentang tertentu
function randomeris(max, min) { // PERUBAHAN: randomeris diubah menjadi randomReward (nama yang lebih umum)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fungsi untuk memformat angka menjadi format mata uang Rupiah
function formatRupiah(number) {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  return formatter.format(number);
}

// Export handler sebagai default
export default handler;