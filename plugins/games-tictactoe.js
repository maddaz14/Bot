// plugins/tictactoe.js
// Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): 2025-07-31 06:22:18
// Current User's Login: obet24077

// Dibuat oleh ubed - Dilarang keras menyalin tanpa izin!
// Plugin ini adalah game "Tic-Tac-Toe (XOX)".

import TicTacToe from '../lib/tictactoe.js'; // PASTIKAN PATH DAN EKSPOR INI BENAR

// Objek fkontak untuk konsistensi tampilan pesan.
const fkontak = {
  "key": {
    "participant": '0@s.whatsapp.net',
    "remoteJid": "0@s.whatsapp.net",
    "fromMe": false,
    "id": "Halo",
  },
  "message": {
    "conversation": `🎮 Tic-Tac-Toe ${global.namebot || 'Bot'} ✨`,
  }
};

const gameTimeout = 120000; // 2 menit timeout untuk menemukan partner atau membatalkan game

let handler = async (m, {
  conn,
  usedPrefix,
  command,
  text,
  args
}) => {
  conn.game = conn.game || {}; // Inisialisasi state game
  const chatID = m.chat; // Menggunakan chat ID sebagai identifikasi room

  // Fungsi helper untuk mendapatkan room yang valid di chat ini
  const getRoomInChat = () => {
    const roomKeys = Object.keys(conn.game);
    for (const key of roomKeys) {
      const r = conn.game[key];
      if (r.id && r.id.startsWith('tictactoe-') && r.id.split('-')[1] === chatID.split('@')[0]) {
        // Saat mengambil room, pastikan `game` adalah instance dari `TicTacToe`
        if (!(r.game instanceof TicTacToe)) {
          // Jika bukan instance, re-instantiate dari data yang ada di r.game
          try {
            const newGameInstance = new TicTacToe(r.game.playerX, r.game.playerO);
            // Transfer state bitmasking
            newGameInstance._x = r.game._x;
            newGameInstance._o = r.game._o;
            newGameInstance._currentTurn = r.game._currentTurn;
            newGameInstance.turns = r.game.turns; // Penting untuk cek seri

            r.game = newGameInstance; // Ganti dengan instance yang benar
            conn.logger.warn(`TicTacToe instance fixed for room ${r.id}`); // Log perbaikan
          } catch (e) {
            conn.logger.error(`Failed to fix TicTacToe instance for room ${r.id}: ${e}`);
            delete conn.game[key]; // Hapus room jika gagal diperbaiki
            return null;
          }
        }
        return r;
      }
    }
    return null;
  };

  let room = getRoomInChat();

  // Jika pemain sudah di dalam game di chat LAIN
  if (Object.values(conn.game).some(r =>
      r.id && r.id.startsWith('tictactoe-') &&
      r.id.split('-')[1] !== chatID.split('@')[0] && // Bukan di chat ini
      (r.game.playerX === m.sender || r.game.playerO === m.sender)
    )) {
    return conn.reply(m.chat, '❌ Kamu masih di dalam game Tic-Tac-Toe yang sedang berlangsung di chat lain. Selesaikan dulu game-mu saat ini!', m, {
      quoted: fkontak
    });
  }

  const input = args[0] ? args[0].toLowerCase().trim() : '';
  const isPlaying = room && room.state === 'PLAYING';
  const isWaiting = room && room.state === 'WAITING';

  // --- Logika Menyerah / Membatalkan Game ---
  const surrenderCommands = ['menyerah', 'nyerah', 'cancel', 'batal'];
  if (surrenderCommands.includes(input)) {
    if (!room) {
      return conn.reply(m.chat, `❌ Kamu tidak sedang dalam game Tic-Tac-Toe yang aktif di chat ini.`, m, {
        quoted: fkontak
      });
    }

    // Batalkan game jika masih menunggu dan playerX yang membatalkan
    if (isWaiting && room.game.playerX === m.sender) {
      clearTimeout(room._timeout);
      delete conn.game[room.id];
      return conn.reply(m.chat, '✅ Game Tic-Tac-Toe berhasil dibatalkan.', m, {
        quoted: fkontak
      });
    }

    // Menyerah dalam game yang sedang bermain
    if (isPlaying && (room.game.playerX === m.sender || room.game.playerO === m.sender)) {
      let opponent = (room.game.playerX === m.sender) ? room.game.playerO : room.game.playerX;

      conn.reply(room.x, `😭 *@${m.sender.split('@')[0]}* menyerah!\nGame dibatalkan.`, m, {
        mentions: conn.parseMention(m.sender),
        quoted: fkontak
      });
      if (opponent && opponent !== room.x) {
        conn.reply(room.o, `🥳 Lawanmu (*@${m.sender.split('@')[0]}*) memenangkan game ini secara otomatis.`, m, {
          mentions: conn.parseMention(m.sender),
          quoted: fkontak
        });
      }
      delete conn.game[room.id];
      return;
    }

    return conn.reply(m.chat, `❗ Untuk menyerah, kamu harus berada dalam game yang sedang berlangsung atau menjadi pembuat room yang masih menunggu.`, m, {
      quoted: fkontak
    });
  }

  // --- Logika Melangkah (jika game sedang PLAYING) ---
  const cellNumber = parseInt(input);
  if (isPlaying) {
    if (isNaN(cellNumber) || cellNumber < 1 || cellNumber > 9) {
      return conn.reply(m.chat, `❗ Untuk melangkah, gunakan: *${usedPrefix}${command} <nomor_kotak>*\nContoh: *${usedPrefix}${command} 5*`, m, {
        quoted: fkontak
      });
    }

    // Tentukan 'player' untuk method turn (0 untuk X, 1 untuk O)
    const playerTurn = (room.game.currentTurn === room.game.playerX) ? 0 : 1;
    const playerSender = m.sender;

    // Pastikan ini giliran pemain yang mengirim pesan
    // Karena `currentTurn` di TicTacToe Anda mengembalikan ID pemain, ini bisa langsung dipakai
    if (room.game.currentTurn !== playerSender) {
      return conn.reply(m.chat, `❌ Ini bukan giliranmu! Giliran *@${room.game.currentTurn.split('@')[0]}*.`, m, {
        mentions: conn.parseMention(room.game.currentTurn),
        quoted: fkontak
      });
    }

    try {
      // Panggil method `turn` dari kelas TicTacToe Anda
      const result = room.game.turn(playerTurn, cellNumber - 1); // cellNumber - 1 karena turn mengambil index 0-8

      if (result === -3) { // Game Ended
        // Harusnya sudah tertangani oleh winner/isDraw setelah ini, tapi sebagai jaga-jaga
        return conn.reply(m.chat, 'Game sudah selesai!', m, {
          quoted: fkontak
        });
      } else if (result === -2) { // Invalid (bukan giliran)
        return conn.reply(m.chat, `❌ Ini bukan giliranmu! Giliran *@${room.game.currentTurn.split('@')[0]}*.`, m, {
          mentions: conn.parseMention(room.game.currentTurn),
          quoted: fkontak
        });
      } else if (result === -1) { // Invalid Position
        return conn.reply(m.chat, '❌ Nomor kotak tidak valid. Pilih angka dari 1 sampai 9!', m, {
          quoted: fkontak
        });
      } else if (result === 0) { // Position Occupied
        return conn.reply(m.chat, '❌ Kotak itu sudah terisi. Pilih kotak lain yang kosong!', m, {
          quoted: fkontak
        });
      }
      // Jika result === 1 (Success), lanjutkan

      let arr = room.game.render().map(v => ({
        X: '❌',
        O: '⭕',
        1: '1️⃣',
        2: '2️⃣',
        3: '3️⃣',
        4: '4️⃣',
        5: '5️⃣',
        6: '6️⃣',
        7: '7️⃣',
        8: '8️⃣',
        9: '9️⃣'
      }[v]));

      let str = `
🎮 *TIC-TAC-TOE* 🎮
Room ID: *${room.id.replace('tictactoe-', '')}*
Mode: ${room.name ? `Private Room (*${room.name}*)` : 'Public Match'}

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}
`.trim();

      const winnerId = room.game.winner; // winner akan mengembalikan playerX atau playerO atau false
      const isDraw = room.game.board === 511 && !winnerId; // Cek seri: papan penuh dan tidak ada pemenang

      if (winnerId) {
        str += `\n\n🎉 *Game Selesai!* 🎉\nPemenang: *@${winnerId.split('@')[0]}*! Selamat!`;

        if (global.db && global.db.data && global.db.data.users) {
          global.db.data.users[winnerId].exp = (global.db.data.users[winnerId].exp || 0) + 7500;
          str += `\n✨ Mendapatkan *+7500 XP*!`;
        }

        await conn.reply(room.x, str, m, {
          mentions: conn.parseMention(str),
          quoted: fkontak
        });
        if (room.o && room.o !== room.x) {
          await conn.reply(room.o, str, m, {
            mentions: conn.parseMention(str),
            quoted: fkontak
          });
        }
        delete conn.game[room.id];
      } else if (isDraw) {
        str += `\n\n🤝 *Game Selesai!* 🤝\nPermainan berakhir Seri!`;
        if (global.db && global.db.data && global.db.data.users) {
          global.db.data.users[room.game.playerX].exp = (global.db.data.users[room.game.playerX].exp || 0) + 2000;
          global.db.data.users[room.game.playerO].exp = (global.db.data.users[room.game.playerO].exp || 0) + 2000;
          str += `\n✨ Masing-masing mendapatkan *+2000 XP*!`;
        }

        await conn.reply(room.x, str, m, {
          mentions: conn.parseMention(str),
          quoted: fkontak
        });
        if (room.o && room.o !== room.x) {
          await conn.reply(room.o, str, m, {
            mentions: conn.parseMention(str),
            quoted: fkontak
          });
        }
        delete conn.game[room.id];
      } else {
        str += `\nGiliran: *@${room.game.currentTurn.split('@')[0]}*`;

        await conn.reply(room.x, str, m, {
          mentions: conn.parseMention(str),
          quoted: fkontak
        });
        if (room.o && room.o !== room.x) {
          await conn.reply(room.o, str, m, {
            mentions: conn.parseMention(str),
            quoted: fkontak
          });
        }
      }
    } catch (e) {
      console.error('Error in TicTacToe play/turn:', e);
      conn.reply(m.chat, `⚠️ Terjadi kesalahan saat bermain: ${e.message || e}. Coba lagi.`, m, {
        quoted: fkontak
      });
    }
    return; // Keluar dari handler setelah memproses langkah
  }

  // --- Logika Pembuatan/Gabung Room (jika pemain belum di dalam game aktif atau sedang WAITING) ---
  let targetRoomName = text ? text.toLowerCase().trim() : ''; // Nama room jika ada argumen

  // Cari room yang sedang WAITING di chat ini
  room = Object.values(conn.game).find(r =>
    r.state === 'WAITING' &&
    r.id && r.id.startsWith('tictactoe-') &&
    r.id.split('-')[1] === chatID.split('@')[0] && // Hanya room di chat ini
    (targetRoomName ? r.name === targetRoomName : true) && // Filter berdasarkan nama room jika ada
    r.game.playerX !== m.sender // Pastikan tidak join room sendiri
  );

  // Jika room belum ada atau pemain ingin membuat room baru dengan nama spesifik
  if (!room) {
    // Buat room baru
    room = {
      // ID room unik menggunakan chat ID untuk memastikan room per chat
      id: `tictactoe-${chatID.split('@')[0]}`,
      x: m.chat,
      o: '',
      game: new TicTacToe(m.sender, 'o'), // playerX selalu m.sender. playerO akan diisi saat join.
      state: 'WAITING',
      name: targetRoomName
    };
    room.game.playerX = m.sender; // Simpan playerX di room object juga

    conn.game[room.id] = room;

    let waitMessage = `
⏳ *TIC-TAC-TOE* - Menunggu Partner! ⏳
Room ID: *${room.id.replace('tictactoe-', '')}*
Mode: ${room.name ? `Private Room (*${room.name}*)` : 'Public Match'}

Jika kamu ingin partner bergabung ke room ini, minta mereka ketik:
*${usedPrefix}${command} ${room.name || ''}*

Jika partner lain mengetik *${usedPrefix}${command}* tanpa nama room, mereka akan bergabung ke room publik yang tersedia di chat ini.
Waktu tunggu maksimal *${(gameTimeout / 1000).toFixed(0)} detik*.

Ketik *${usedPrefix}${command} batal* (atau *${usedPrefix}${command} nyerah*) untuk membatalkan game.
`.trim();

    conn.reply(m.chat, waitMessage, m, {
      quoted: fkontak
    });

    room._timeout = setTimeout(() => {
      if (conn.game[room.id] && conn.game[room.id].state === 'WAITING') {
        let msg = '⏰ *Waktu habis!* Tidak ada partner yang bergabung. Game Tic-Tac-Toe dibatalkan.';
        conn.reply(room.x, msg, m, {
          quoted: fkontak
        });
        delete conn.game[room.id];
      }
    }, gameTimeout);

  } else { // --- Jika room ditemukan dan WAITING (join room) ---
    // Jika pemain yang mencoba bergabung adalah pemain X (sudah ada di room)
    if (room.game.playerX === m.sender) {
      return conn.reply(m.chat, 'Kamu adalah pembuat room ini. Tunggu partner bergabung, atau buat room baru dengan nama berbeda.', m, {
        quoted: fkontak
      });
    }

    room.o = m.chat;
    room.game.playerO = m.sender; // Set playerO di room object
    // Penting: Inisialisasi ulang game dengan kedua pemain agar `playerO` di objek game terupdate.
    // Atau, lebih baik modifikasi properti `playerO` di instance game yang sudah ada.
    // Kita akan langsung set `playerO` di instance game yang sudah ada
    room.game.playerO = m.sender;
    room.state = 'PLAYING';

    let arr = room.game.render().map(v => ({
      X: '❌',
      O: '⭕',
      1: '1️⃣',
      2: '2️⃣',
      3: '3️⃣',
      4: '4️⃣',
      5: '5️⃣',
      6: '6️⃣',
      7: '7️⃣',
      8: '8️⃣',
      9: '9️⃣'
    }[v]));

    let str = `
🎮 *TIC-TAC-TOE DIMULAI!* 🎮
Room ID: *${room.id.replace('tictactoe-', '')}*
Mode: ${room.name ? `Private Room (*${room.name}*)` : 'Public Match'}

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

Giliran: *@${room.game.currentTurn.split('@')[0]}* (Pembuat Room)
Untuk melangkah, gunakan *${usedPrefix}${command} <nomor_kotak>*. Contoh: *${usedPrefix}${command} 5*
Untuk menyerah, ketik *${usedPrefix}${command} batal* (atau *${usedPrefix}${command} nyerah*).
`.trim();

    await conn.reply(room.x, str, m, {
      mentions: conn.parseMention(str),
      quoted: fkontak
    });
    await conn.reply(room.o, str, m, {
      mentions: conn.parseMention(str),
      quoted: fkontak
    });

    if (room._timeout) {
      clearTimeout(room._timeout);
      delete room._timeout;
    }
  }
};

handler.help = ['tictactoe [nama_room]', 'ttt [nama_room]', 'ttt <nomor_kotak>', 'ttt batal/nyerah'];
handler.tags = ['game'];
handler.command = /^(tictactoe|t{3})$/i; // Hanya satu command utama
handler.group = true;
handler.private = false;
handler.limit = true;

export default handler;