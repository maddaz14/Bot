import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';

const balapanRooms = {};
const delay = ms => new Promise(res => setTimeout(res, ms));
const pickRandom = list => list[Math.floor(Math.random() * list.length)];

const handler = async (m, { command, conn }) => {
  const roomId = m.chat;
  if (!balapanRooms[roomId]) {
    balapanRooms[roomId] = { owner: '', players: [], started: false };
  }
  let room = balapanRooms[roomId];

  if (/^balapan$/.test(command)) {
    const teks = `╭─── *[🏁 Tutorial Balapan]* ───╮
│
│ 1. Ketik *.balapanbuat* untuk membuat arena.
│ 2. Pemain lain ikut dengan *.balapanjoin*
│ 3. Maksimal 5 pemain, minimal 2.
│ 4. Mulai balapan dengan *.balapanstart*
│ 5. Pemenang akan mendapat hadiah menarik!
│
╰────────────────────────────╯`;
    return m.reply(teks);
  }

  if (/buat/i.test(command)) {
    if (room.owner && room.owner !== m.sender) return m.reply('Room sudah dibuat, tunggu hingga selesai.');
    room.owner = m.sender;
    room.players = [m.sender];
    room.started = false;

    return conn.sendMessage(m.chat, {
      image: { url: 'https://files.catbox.moe/eotucw.jpg' },
      caption: '*[🏎️] Arena Balapan Telah Dibuka!*\n\nBergabunglah dengan mengetik *.balapanjoin*\n\nMax: 5 Orang | Min: 2 Orang'
    }, { quoted: m });
  }

  if (/join/i.test(command)) {
    if (!room.owner) return m.reply('Room belum dibuat. Gunakan *.balapanbuat* untuk membuat.');
    if (room.started) return m.reply('Balapan sudah dimulai.');
    if (room.players.includes(m.sender)) return m.reply('Kamu sudah bergabung.');
    if (room.players.length >= 5) return m.reply('Room sudah penuh.');
    room.players.push(m.sender);
    return m.reply(`Kamu telah bergabung! Total pemain: ${room.players.length}`);
  }

  if (/start/i.test(command)) {
    if (!room.owner || room.owner !== m.sender) return m.reply('Hanya pembuat room yang bisa memulai.');
    if (room.players.length < 2) return m.reply('Minimal 2 pemain untuk mulai.');
    if (room.started) return m.reply('Balapan sedang berlangsung.');

    room.started = true;

    await conn.sendMessage(m.chat, {
      image: { url: 'https://files.catbox.moe/ml85o4.jpg' },
      caption: '*[🏁] Balapan Dimulai!*\n\nSemua peserta bersiap di garis start!'
    }, { quoted: m });

    await delay(3000);
    await conn.sendMessage(m.chat, {
      text: '*[🏎️💨] Semua peserta melaju kencang di lintasan...*'
    });

    await delay(3000);
    if (room.players.length > 2 && Math.random() < 0.5) {
      let jatuh = pickRandom(room.players);
      room.players = room.players.filter(p => p !== jatuh);
      await conn.sendMessage(m.chat, {
        image: { url: 'https://files.catbox.moe/px7lwd.jpg' },
        caption: `*[💥] ${await conn.getName(jatuh)} tergelincir di tikungan dan keluar dari balapan!*`
      });
    }

    await delay(3000);
    const finishLine = `╭───────✦✧✦───────╮\n       *🏁 GARIS FINISH 🏁*\n╰───────✦✧✦───────╯`;
    await conn.sendMessage(m.chat, { text: finishLine });

    await delay(3000);
    const pemenang = pickRandom(room.players);
    const hadiah = {
      coins: Math.floor(Math.random() * 246) + 5,
      money: Math.floor(Math.random() * 500001) + 10000,
      exp: Math.floor(Math.random() * 4990) + 10
    };

    await conn.sendMessage(m.chat, {
      text: `*[🏆] Selamat ${await conn.getName(pemenang)}!*\n\nKamu memenangkan balapan dan mendapatkan:\n🪙 *ubed Coins:* _ᴜ͢ᴄ.${hadiah.coins.toLocaleString('en-US')}_\n💰 *Money:* Rp${hadiah.money.toLocaleString('id-ID')}\n✨ *Exp:* ${hadiah.exp} XP`
    });

    // Leaderboard Canvas
    const canvas = createCanvas(700, 400);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#101820';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Judul
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('LEADERBOARD BALAPAN', canvas.width / 2, 60);

    // Kotak pemain
    ctx.textAlign = 'left';
    for (let i = 0; i < room.players.length; i++) {
      const nama = await conn.getName(room.players[i]);
      ctx.fillStyle = '#1e1e1e';
      ctx.fillRect(70, 100 + i * 55, 560, 40);
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px Sans-serif';
      ctx.fillText(`${i + 1}. ${nama}`, 85, 128 + i * 55);
    }

    const buffer = canvas.toBuffer();
    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: 'Hasil Akhir Balapan'
    });

    delete balapanRooms[roomId];
  }

  if (/hapus/i.test(command)) {
    if (!room.owner) return m.reply('Tidak ada room untuk dihapus.');
    if (room.owner !== m.sender) return m.reply('Hanya pembuat room yang dapat menghapus.');
    delete balapanRooms[roomId];
    return m.reply('*[🗑️] Room balapan berhasil dihapus.*');
  }
};

handler.help = ['balapan', 'balapanbuat', 'balapanjoin', 'balapanstart', 'balapanhapus'];
handler.tags = ['rpg'];
handler.command = /^balapan(?:buat|join|start|hapus)?$/i;
handler.limit = true;

export default handler;