const rooms = {}; // Menyimpan pertandingan
const clubs = {}; // Menyimpan data klub

const handler = async (m, { conn, args }) => {
    let user = global.db.data.users[m.sender];
    if (!user) return m.reply("❌ Kamu belum terdaftar dalam sistem.");

    let roomId = m.chat;
    let subCommand = args[0];
    let taruhan = parseInt(args[1]);

    switch (subCommand) {
        case 'klub':
            if (!args[1]) return m.reply("⚽ Ketik: *.sepakbola klub <nama_klub>*");
            let clubName = args.slice(1).join(" ");

            clubs[m.sender] = { name: clubName, wins: 0, losses: 0 };
            return m.reply(`✅ Klub berhasil dibuat!\n🏆 Nama Klub: *${clubName}*`);

        case 'buat':
            if (!clubs[m.sender]) return m.reply("⚠️ Kamu belum memiliki klub! Ketik: *.sepakbola klub <nama_klub>*");
            if (rooms[roomId]) return m.reply("⚠️ Sudah ada pertandingan yang berlangsung di grup ini!");
            if (isNaN(taruhan) || taruhan < 1000) return m.reply("⚠️ Minimal taruhan adalah 1000 money!");
            if (user.money < taruhan) return m.reply("💸 Uangmu tidak cukup untuk bertaruh sebesar itu!");

            rooms[roomId] = {
                host: m.sender,
                players: [m.sender],
                clubs: { [m.sender]: clubs[m.sender] },
                bet: taruhan,
                status: "waiting"
            };

            return m.reply(`⚽ *Game Sepakbola Dimulai!* ⚽\n💰 Taruhan: *${taruhan} money*\n🏆 Klub: *${clubs[m.sender].name}*\n🔹 Ketik *.sepakbola join* untuk ikut! (Max 5 pemain)\n🔹 Ketik *.sepakbola mulai* untuk memulai jika ada minimal 2 pemain.\n🔹 Ketik *.sepakbola out* untuk keluar.`);

        case 'join':
            if (!rooms[roomId]) return m.reply("⚠️ Tidak ada pertandingan yang sedang berlangsung!");
            if (!clubs[m.sender]) return m.reply("⚠️ Kamu belum memiliki klub! Ketik: *.sepakbola klub <nama_klub>*");
            if (rooms[roomId].players.includes(m.sender)) return m.reply("⚠️ Kamu sudah ikut!");
            if (rooms[roomId].players.length >= 5) return m.reply("⚠️ Maksimal 5 pemain!");
            if (user.money < rooms[roomId].bet) return m.reply("💸 Uangmu tidak cukup!");

            rooms[roomId].players.push(m.sender);
            rooms[roomId].clubs[m.sender] = clubs[m.sender];

            return m.reply(`✅ *${m.sender.split('@')[0]} telah bergabung!*\n🏆 Klub: *${clubs[m.sender].name}*\n🔹 Ketik *.sepakbola mulai* untuk memulai pertandingan.`);

        case 'mulai':
            if (!rooms[roomId]) return m.reply("⚠️ Tidak ada pertandingan yang sedang berlangsung!");
            if (rooms[roomId].players.length < 2) return m.reply("⚠️ Minimal 2 pemain untuk memulai!");

            let players = [...rooms[roomId].players]; // Salin daftar pemain
            let betAmount = rooms[roomId].bet;

            // Cek apakah semua pemain memiliki cukup uang
            for (let p of players) {
                if (global.db.data.users[p].money < betAmount) {
                    delete rooms[roomId];
                    return m.reply("⚠️ Ada pemain yang tidak cukup uang. Pertandingan dibatalkan.");
                }
            }

            // Generate skor acak
            let scores = players.reduce((acc, p) => {
                acc[p] = Math.floor(Math.random() * 5);
                return acc;
            }, {});

            // Cari pemenang
            let winner = players.reduce((max, p) => (scores[p] > scores[max] ? p : max), players[0]);

            // Transfer money
            global.db.data.users[winner].money += betAmount * (players.length - 1);
            players.forEach(p => {
                if (p !== winner) global.db.data.users[p].money -= betAmount;
            });

            // Update statistik klub
            clubs[winner].wins += 1;
            players.forEach(p => {
                if (p !== winner) clubs[p].losses += 1;
            });

            // Ambil klub pemenang
            let winnerClub = clubs[winner].name;

            let scoreMessage = players.map(p => `⚽ ${clubs[p].name}: ${scores[p]} Skor`).join("\n");

            // Pastikan `rooms[roomId]` tidak dihapus sebelum pengiriman pesan
            let finalMessage = `⚽ *Pertandingan Selesai!* ⚽\n\n🏆 *Skor Akhir:*\n${scoreMessage}\n\n🎉 Pemenang: *${winnerClub}*\n💸 Hadiah: *${betAmount * (players.length - 1)} money*\n📈 Statistik:\n` +
                players.map(p => `🔹 ${clubs[p].name}: ${clubs[p].wins} Menang | ${clubs[p].losses} Kalah`).join("\n");

            delete rooms[roomId]; // Hapus room setelah pertandingan selesai
            return m.reply(finalMessage);

        case 'out':
            if (!rooms[roomId]) return m.reply("⚠️ Tidak ada pertandingan yang sedang berlangsung!");
            if (!rooms[roomId].players.includes(m.sender)) return m.reply("⚠️ Kamu bukan bagian dari pertandingan ini!");

            rooms[roomId].players = rooms[roomId].players.filter(p => p !== m.sender);
            delete rooms[roomId].clubs[m.sender];

            if (rooms[roomId].players.length === 0) delete rooms[roomId];

            return m.reply("❌ Kamu keluar dari pertandingan. Jika semua keluar, pertandingan dibatalkan.");

        default:
            return m.reply("⚠️ Format salah! Gunakan perintah:\n🔹 *.sepakbola klub <nama>*\n🔹 *.sepakbola buat <jumlah>*\n🔹 *.sepakbola join*\n🔹 *.sepakbola mulai*\n🔹 *.sepakbola out*");
    }
};

// Konfigurasi handler
handler.command = ['sepakbola'];
handler.help = ['sepakbola klub <nama>', 'sepakbola buat <jumlah>', 'sepakbola join', 'sepakbola mulai', 'sepakbola out'];
handler.tags = ['game'];

export default handler;