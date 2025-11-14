const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": `warewolf ${global.namebot || 'Bot'} ✨`,
    }
};

const roles = ["warewolf", "manusia"];

let handler = async (m, { conn, command, usedPrefix, text }) => {
  const maxPlayers = 3; // Batas maksimal pemain. Jika Anda ingin 8, ubah ini.
  conn.warewolf = conn.warewolf || {};

  const input = text.trim().split(" ");
  const inputcmd = input[0].toLowerCase();
  const targetNumber = input[1] || '';

  const groupId = m.chat;
  conn.warewolf[groupId] = conn.warewolf[groupId] || { players: [], started: false };
  const { players, started } = conn.warewolf[groupId];

  if (inputcmd === "start") {
    if (started) return conn.reply(m.chat, "😅 Permainan sudah dimulai.", fkontak); // Menggunakan fkontak
    if (players.length < 2) return conn.reply(m.chat, "😅 Jumlah pemain belum mencukupi. Minimal 2 pemain diperlukan untuk memulai permainan.", fkontak); // Menggunakan fkontak
    if (players.length > maxPlayers) return conn.reply(m.chat, `😅 Jumlah pemain melebihi batas maksimal (${maxPlayers} pemain).`, fkontak); // Menggunakan fkontak

    conn.warewolf[groupId].started = true;

    // Tetapkan peran untuk semua pemain yang bergabung di awal
    assignRoles(players);

    conn.reply(m.chat, "Permainan sudah dimulai. Selamat bermain!", fkontak); // Menggunakan fkontak
  } else if (inputcmd === "join") {
    if (started) return conn.reply(m.chat, "😅 Permainan sudah dimulai, tidak bisa bergabung lagi.", fkontak); // Menggunakan fkontak
    if (players.length >= maxPlayers) return conn.reply(m.chat, `😅 Jumlah pemain sudah mencapai batas maksimal (${maxPlayers} pemain). Permainan bisa dimulai dengan mengetik *${usedPrefix}warewolf start*`, fkontak); // Menggunakan fkontak
    
    const playerName = m.name;
    if (players.some((player) => player.sender === m.sender)) return conn.reply(m.chat, "😅 Kamu sudah bergabung dalam permainan.", fkontak); // Menggunakan fkontak

    const money = global.db.data.users[m.sender].money || 0; // Menggunakan money
    players.push({ name: playerName, money, sender: m.sender, role: "manusia" }); // Default role manusia

    conn.reply(m.chat, `✅ Pemain Manusia ${playerName} telah bergabung dalam permainan. Total pemain: ${players.length}/${maxPlayers}`, fkontak); // Menggunakan fkontak
  } else if (inputcmd === "cek") {
    if (!started) return conn.reply(m.chat, "😅 Permainan belum dimulai.", fkontak); // Menggunakan fkontak
    if (players.length === 0) return conn.reply(m.chat, "😅 Belum ada pemain yang bergabung dalam permainan.", fkontak); // Menggunakan fkontak

    const warewolf = findWarewolf(players); // Pastikan ini tidak null
    conn.reply(m.chat, `🐺 Siapakah Warewolf dalam permainan ini?\n\nPilih salah satu angka:\n${players.map((player, index) => `${index + 1}. ${player.name}`).join("\n")}`, fkontak); // Menggunakan fkontak
  } else if (inputcmd === "tebak") {
    if (!started) return conn.reply(m.chat, "😅 Permainan belum dimulai.", fkontak); // Menggunakan fkontak
    if (players.length < 2) return conn.reply(m.chat, "😅 Jumlah pemain belum mencukupi. Minimal 2 pemain diperlukan untuk memulai permainan.", fkontak); // Menggunakan fkontak

    const playerIndex = +targetNumber - 1;
    if (playerIndex < 0 || playerIndex >= players.length) return conn.reply(m.chat, "😅 Pilih player yang ada saja.", fkontak); // Menggunakan fkontak
    
    const warewolf = findWarewolf(players);
    if (!warewolf) { // Handle case if warewolf somehow isn't assigned
        return conn.reply(m.chat, "Terjadi kesalahan dalam penetapan peran. Silakan mulai ulang permainan.", fkontak);
    }

    if (players[playerIndex].role === "warewolf") {
      conn.reply(m.chat, `🎉 Selamat! ${players[playerIndex].name} adalah Warewolf! Permainan berakhir.`, fkontak); // Menggunakan fkontak
      // Tambahkan logika untuk menghapus sesi permainan warewolf
      delete conn.warewolf[groupId];
    } else {
      conn.reply(m.chat, `😔 Tebakanmu salah! ${players[playerIndex].name} adalah Manusia. Coba lagi.`, fkontak); // Menggunakan fkontak
    }
  } else {
    conn.reply(m.chat, `❌ Perintah tidak dikenali. Gunakan salah satu perintah berikut:\n${usedPrefix}warewolf join\n${usedPrefix}warewolf start\n${usedPrefix}warewolf cek\n${usedPrefix}warewolf tebak`, fkontak); // Menggunakan fkontak
  }
};

handler.help = ['warewolf'];
handler.tags = ['rpg'];
handler.command = ['warewolf'];
handler.group = true; // Ditambahkan
handler.register = true; // Ditambahkan
handler.limit = true; // Ditambahkan
export default handler;

// Helper Functions
function assignRoles(playersArray) {
    // Reset semua peran ke manusia
    playersArray.forEach(p => p.role = "manusia");

    // Pilih secara acak satu pemain untuk menjadi warewolf
    const randomIndex = Math.floor(Math.random() * playersArray.length);
    playersArray[randomIndex].role = "warewolf";
}

function findWarewolf(playersArray) {
  return playersArray.find((player) => player.role === "warewolf");
}

function getRandomPlayer(playersArray) { // Tidak terpakai lagi setelah perbaikan assignRoles
  return playersArray[Math.floor(Math.random() * playersArray.length)];
}