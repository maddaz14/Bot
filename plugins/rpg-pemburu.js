import fs from 'fs';

const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": `pemburu ${global.namebot || 'Bot'} ✨`,
    }
};

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
  let player = global.db.data.users[m.sender];
  let mentionedJid = [m.sender];
  let pengirim = m.sender.split("@")[0];
  let __timers = (new Date - player.lastpemburu);
  let _timers = (1800000 - __timers);
  let timers = clockString(_timers);

  if (args[0] === "profile") {
    if (!player.pemburuLevel) player.pemburuLevel = 1;
    if (!player.pemburuProgres) player.pemburuProgres = 0;
    if (!player.pemburuTargetKilled) player.pemburuTargetKilled = 0;
    if (!player.pemburuTargetLoss) player.pemburuTargetLoss = 0;

    let profileMessage = `📊 *PROFIL PEMBURU*\n\n` +
      `👤 *Player*: @${pengirim}\n\n` +
      `🎯 *Jumlah Target Terbunuh*: ${player.pemburuTargetKilled}\n` +
      `❌ *Jumlah Target yang Kabur*: ${player.pemburuTargetLoss}\n\n` +
      `🎖️ *Level Pemburu*: ${player.pemburuLevel}\n` +
      `📊 *Progres Level*: ${player.pemburuProgres}%\n\n` +
      `_Teruslah berburu, Pemburu!_`;
    conn.sendMessage(m.chat, {
      document: fs.readFileSync("./thumbnail.jpg"),
      fileName: `- Pemburu By ${global.author} -`,
      fileLength: '1',
      mimetype: 'application/msword',
      jpegThumbnail: await conn.resize(fs.readFileSync('./src/bahan/ytta.jpg'), 350, 190),
      caption: profileMessage,
      contextInfo: {
        mentionedJid,
        forwardingScore: 99999999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363199602506586@newsletter',
          serverMessageId: null,
          newsletterName: `© ${global.namebot} || ${global.author}`
        }
      }
    }, { quoted: fkontak }); // Menggunakan fkontak
    return;
  }

  if (_timers > 0 && !player.pemburuTarget) {
    let cooldownMessage = `⏳ *Cooldown Aktif!*\n\nAnda harus menunggu ${timers} sebelum bisa menggunakan fitur pemburu lagi.\n\n_Sabar ya, Pemburu sejati selalu menunggu waktu yang tepat!_`;
    conn.sendMessage(m.chat, {
      document: fs.readFileSync("./thumbnail.jpg"),
      fileName: `- Pemburu By ${global.author} -`,
      fileLength: '1',
      mimetype: 'application/msword',
      jpegThumbnail: await conn.resize(fs.readFileSync('./src/bahan/ytta.jpg'), 350, 190),
      caption: cooldownMessage,
      contextInfo: {
        mentionedJid,
        forwardingScore: 99999999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363199602506586@newsletter',
          serverMessageId: null,
          newsletterName: `© ${global.namebot} || ${global.author}`
        }
      }
    }, { quoted: fkontak }); // Menggunakan fkontak
    return;
  }

  if (!args[0]) {
    if (!player.pemburuTarget) {
      let targetList = [
        "Bandit", "Pencuri", "Pembunuh", "Mafia", "Teroris", "Perampok", "Penyelundup", "Hacker", "Penipu", "Penjahat",
        "Koruptor", "Pengedar Narkoba", "Penculik", "Peretas Sistem", "Penjahat Cyber", "Pemalsu Dokumen", "Penjahat Keuangan",
        "Perusuh", "Penjahat Perang", "Pelaku Kekerasan Domestik", "Penjahat Lingkungan", "Pencuri Identitas", "Penjahat Organisasi",
        "Pedagang Manusia", "Penjahat Jalanan", "Pelaku Penyerangan", "Penjahat Bersenjata", "Pemeras", "Penjahat Internasional",
        "Penipu Online", "Goblin", "Orc", "Slime", "Dragon", "Demon", "Skeleton", "Zombie", "Werewolf", "Vampire", "Ghoul",
        "Lich", "Kraken", "Minotaur", "Cyclops", "Harpy", "Chimera", "Basilisk", "Wyvern", "Gargoyle", "Banshee", "Wight",
        "Specter", "Wraith", "Doppelganger", "Troll", "Ogre", "Giant", "Elemental", "Necromancer", "Dark Knight", "Shadow Beast",
        "Hellhound", "Cerberus", "Phoenix", "Griffin", "Manticore", "Hydra", "Behemoth", "Leviathan", "Fenrir", "Jormungandr",
        "Kitsune", "Oni", "Tengu", "Yokai", "Kappa", "Roc", "Cockatrice", "Gorgon", "Medusa", "Siren", "Kraken", "Fomorians",
        "Dark Elf", "Fallen Angel", "Archdemon", "Demon Lord", "Abyssal Horror", "Eldritch Abomination", "Cursed Spirit",
        "Plague Bearer", "Frost Giant", "Fire Giant", "Storm Giant", "Cloud Giant", "Stone Giant", "Flesh Golem", "Iron Golem",
        "Clay Golem", "Wood Golem", "Death Knight", "Shadow Assassin", "Blood Mage", "Soul Reaper", "Chaos Beast", "Void Creature"
      ];
      let target = targetList[Math.floor(Math.random() * targetList.length)];
      let coordinates = [
        { x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100), z: Math.floor(Math.random() * 100) },
        { x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100), z: Math.floor(Math.random() * 100) },
        { x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100), z: Math.floor(Math.random() * 100) }
      ];
      let correctIndex = Math.floor(Math.random() * 3);
      player.pemburuTarget = {
        name: target,
        coordinates: coordinates,
        correctCoordinate: correctIndex
      };
      player.lastpemburu = new Date * 1;

      let pesan = `🎯 *TARGET DITEMUKAN!*\n\n` +
        `🔫 *Nama Target*: ${target}\n\n` +
        `📍 *Koordinat Target*: \n` +
        `X: ${coordinates[correctIndex].x}\n` +
        `Y: ${coordinates[correctIndex].y}\n` +
        `Z: ${coordinates[correctIndex].z}\n\n` +
        `🗺️ *Koordinat yang Tersedia*:\n` +
        `1. X: ${coordinates[0].x} | Y: ${coordinates[0].y} | Z: ${coordinates[0].z}\n` +
        `2. X: ${coordinates[1].x} | Y: ${coordinates[1].y} | Z: ${coordinates[1].z}\n` +
        `3. X: ${coordinates[2].x} | Y: ${coordinates[2].y} | Z: ${coordinates[2].z}\n\nPilih Kordinat Yang Benar!`;
      conn.sendMessage(m.chat, {
        document: fs.readFileSync("./thumbnail.jpg"),
        fileName: `- Pemburu By ${global.author} -`,
        fileLength: '1',
        mimetype: 'application/msword',
        jpegThumbnail: await conn.resize(fs.readFileSync('./src/bahan/ytta.jpg'), 350, 190),
        caption: pesan,
        footer: `${global.namebot} || ${global.author}`,
        buttons: [
          {
            buttonId: 'action',
            buttonText: { displayText: 'CLICK' },
            type: 4,
            nativeFlowInfo: {
              name: 'single_select',
              paramsJson: JSON.stringify({
                title: 'Kordinat',
                sections: [
                  {
                    title: 'Title',
                    highlight_label: '',
                    rows: [
                      {
                        header: '',
                        title: 'Kordinat Pertama',
                        description: `X: ${coordinates[0].x} | Y: ${coordinates[0].y} | Z: ${coordinates[0].z}`,
                        id: '.pemburu tembak 1',
                      },
                      {
                        header: '',
                        title: 'Kordinat Kedua',
                        description: `X: ${coordinates[1].x} | Y: ${coordinates[1].y} | Z: ${coordinates[1].z}`,
                        id: '.pemburu tembak 2',
                      },
                      {
                        header: '',
                        title: 'Kordinat Ketiga',
                        description: `X: ${coordinates[2].x} | Y: ${coordinates[2].y} | Z: ${coordinates[2].z}`,
                        id: '.pemburu tembak 3',
                      },
                    ],
                  },
                ],
              }),
            },
          },
        ],
        headerType: 1,
        viewOnce: true,
        contextInfo: {
          mentionedJid,
          forwardingScore: 99999999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363199602506586@newsletter',
            serverMessageId: null,
            newsletterName: `© ${global.namebot} || ${global.author}`
          }
        }
      }, { quoted: fkontak }); // Menggunakan fkontak

      player.pemburuTimeout = setTimeout(() => {
        if (player.pemburuTarget) {
          player.pemburuTarget = null;
          conn.reply(m.chat, `⏳ *Waktu Habis!*\n\nAnda tidak memilih koordinat dalam waktu 2 menit. Target telah kabur.\n\n_Coba lagi lain kali!_`, fkontak); // Menggunakan fkontak
        }
      }, 120000);
    } else {
      conn.reply(m.chat, `🎯 *Target Aktif!*\n\nAnda sudah memiliki target aktif. Gunakan command *${usedPrefix}pemburu tembak <nomor koordinat>* untuk menembak.\n\n_Jangan biarkan targetmu kabur!_`, fkontak); // Menggunakan fkontak
      return;
    }
  }

  if (args[0] === "tembak" && args[1]) {
    if (!player.pemburuTarget) {
      conn.reply(m.chat, "🎯 *Tidak Ada Target!*\n\nAnda tidak memiliki target aktif. Gunakan command *pemburu* untuk memulai.\n\n_Ayo, temukan targetmu!_", fkontak); // Menggunakan fkontak
      return;
    }

    clearTimeout(player.pemburuTimeout);

    let selectedCoordinate = parseInt(args[1]) - 1;
    if (isNaN(selectedCoordinate) || selectedCoordinate < 0 || selectedCoordinate > 2) {
      conn.reply(m.chat, "❌ *Koordinat Tidak Valid!*\n\nPilih koordinat yang valid (1, 2, atau 3).\n\n_Coba lagi, Pemburu!_", fkontak); // Menggunakan fkontak
      return;
    }

    if (selectedCoordinate === player.pemburuTarget.correctCoordinate) {
      let rewardCoins = Math.floor(Math.random() * 1000000) + 10000;
      let rewardExp = Math.floor(Math.random() * 1000) + 100;
      let rewardWood = Math.floor(Math.random() * 300) + 50;
      let rewardString = Math.floor(Math.random() * 300) + 50;
      let rewardBalance = Math.floor(Math.random() * 10) + 5;
      player.money += rewardCoins; // PERUBAHAN: eris diubah menjadi money
      player.exp += rewardExp;
      player.wood += rewardWood;
      player.string += rewardString;
      player.balance += rewardBalance;

      if (!player.pemburuLevel) player.pemburuLevel = 1;
      if (!player.pemburuProgres) player.pemburuProgres = 0;
      player.pemburuProgres += 1;

      if (!player.pemburuTargetKilled) player.pemburuTargetKilled = 0;
      player.pemburuTargetKilled += 1;

      if (player.pemburuProgres >= 100) {
        player.pemburuLevel += 1;
        player.pemburuProgres = 0;
        let bonusCoins = Math.floor(Math.random() * 5000000) + 20000;
        let bonusExp = Math.floor(Math.random() * 5000) + 500;
        let bonusWood = Math.floor(Math.random() * 700) + 50;
        let bonusString = Math.floor(Math.random() * 600) + 50;
        let bonusBalance = Math.floor(Math.random() * 50) + 5;
        player.money += bonusCoins; // PERUBAHAN: eris diubah menjadi money
        player.exp += bonusExp;
        player.wood += bonusWood;
        player.string += bonusString;
        player.balance += bonusBalance;

        let levelUpMessage = `🎉 *LEVEL UP!*\n\n` +
          `🎖️ *Level Baru*: ${player.pemburuLevel}\n\n` +
          `💎 *Bonus yang Didapatkan*:\n` +
          `💰 *${formatNumber(bonusCoins)} Money*\n` +
          `⭐ *${formatNumber(bonusExp)} XP*\n` +
          `🪵 *${formatNumber(bonusWood)} Kayu*\n` +
          `🕸️ *${formatNumber(bonusString)} String*\n` +
          `🪙 *${formatNumber(bonusBalance)} Balance*\n\n` +
          `_Selamat, Pemburu! Kamu semakin kuat!_`;
        conn.sendMessage(m.chat, {
          document: fs.readFileSync("./thumbnail.jpg"),
          fileName: `- Pemburu By ${global.author} -`,
          fileLength: '1',
          mimetype: 'application/msword',
          jpegThumbnail: await conn.resize(fs.readFileSync('./src/bahan/ytta.jpg'), 350, 190),
          caption: levelUpMessage,
          buttons: [
            { buttonId: `.pemburu profile`, buttonText: { displayText: '🪦 Profile' }, type: 1 }
          ],
          headerType: 1,
          viewOnce: true,
          contextInfo: {
            mentionedJid,
            forwardingScore: 99999999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363199602506586@newsletter',
              serverMessageId: null,
              newsletterName: `© ${global.namebot} || ${global.author}`
            }
          }
        }, { quoted: fkontak }); // Menggunakan fkontak
      }

      let pesan = `🎉 *TARGET TERBUNUH!*\n\n` +
        `🔫 *Nama Target*: ${player.pemburuTarget.name}\n\n` +
        `📍 *Koordinat Target*: \n` +
        `X: ${player.pemburuTarget.coordinates[selectedCoordinate].x}\n` +
        `Y: ${player.pemburuTarget.coordinates[selectedCoordinate].y}\n` +
        `Z: ${player.pemburuTarget.coordinates[selectedCoordinate].z}\n\n` +
        `💎 *Reward yang Didapatkan*:\n` +
        `💰 *${formatNumber(rewardCoins)} Money*\n` +
        `⭐ *${formatNumber(rewardExp)} XP*\n` +
        `🪵 *${formatNumber(rewardWood)} Kayu*\n` +
        `🕸️ *${formatNumber(rewardString)} String*\n` +
        `🪙 *${formatNumber(rewardBalance)} Balance*\n\n` +
        `🎖️ *Level Pemburu*: ${player.pemburuLevel}\n` +
        `📊 *Progres Level*: ${player.pemburuProgres}%\n\n` +
        `_Selamat, Pemburu! Kamu hebat!_`;
      conn.sendMessage(m.chat, {
        document: fs.readFileSync("./thumbnail.jpg"),
        fileName: `- Pemburu By ${global.author} -`,
        fileLength: '1',
        mimetype: 'application/msword',
        jpegThumbnail: await conn.resize(fs.readFileSync('./src/bahan/ytta.jpg'), 350, 190),
        caption: pesan,
        buttons: [
          { buttonId: `.pemburu profile`, buttonText: { displayText: '🪦 Profile' }, type: 1 }
        ],
        headerType: 1,
        viewOnce: true,
        contextInfo: {
          mentionedJid,
          forwardingScore: 99999999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363199602506586@newsletter',
            serverMessageId: null,
            newsletterName: `© ${global.namebot} || ${global.author}`
          }
        }
      }, { quoted: fkontak }); // Menggunakan fkontak

      player.pemburuTarget = null;
    } else {
      let penaltyCooldown = 3600000;
      player.lastpemburu = new Date * 1 + penaltyCooldown;

      if (!player.pemburuTargetLoss) player.pemburuTargetLoss = 0;
      player.pemburuTargetLoss += 1;

      let pesan = `❌ *GAGAL!*\n\n` +
        `🔫 *Nama Target*: ${player.pemburuTarget.name}\n\n` +
        `📍 *Koordinat Target yang Benar*: \n` +
        `X: ${player.pemburuTarget.coordinates[player.pemburuTarget.correctCoordinate].x}\n` +
        `Y: ${player.pemburuTarget.coordinates[player.pemburuTarget.correctCoordinate].y}\n` +
        `Z: ${player.pemburuTarget.coordinates[player.pemburuTarget.correctCoordinate].z}\n\n` +
        `Anda memilih koordinat yang salah. Target berhasil melarikan diri.\n\n` +
        `⏳ *Hukuman Cooldown*: 1 jam\n\n` +
        `_Jangan menyerah, Pemburu! Coba lagi nanti._`;
      conn.sendMessage(m.chat, {
        document: fs.readFileSync("./thumbnail.jpg"),
        fileName: `- Pemburu By ${global.author} -`,
        fileLength: '1',
        mimetype: 'application/msword',
        jpegThumbnail: await conn.resize(fs.readFileSync('./src/bahan/ytta.jpg'), 350, 190),
        caption: pesan,
        buttons: [
          { buttonId: `.pemburu profile`, buttonText: { displayText: '🪦 Profile' }, type: 1 }
        ],
        headerType: 1,
        viewOnce: true,
        contextInfo: {
          mentionedJid,
          forwardingScore: 99999999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363199602506586@newsletter',
            serverMessageId: null,
            newsletterName: `© ${global.namebot} || ${global.author}`
          }
        }
      }, { quoted: fkontak }); // Menggunakan fkontak

      player.pemburuTarget = null;
    }
  }
};

handler.help = ['pemburu'];
handler.tags = ['rpg'];
handler.command = /^(pemburu)$/i;
handler.limit = 3;
handler.group = true;
handler.register = true;
handler.fail = null;

export default handler;

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [d, ' *Hari* ', h, ' *Jam* ', m, ' *Menit* ', s, ' *Detik*'].map(v => v.toString().padStart(2, 0)).join('');
}

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}