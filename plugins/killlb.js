import fs from 'fs';

// Path database
const killerDatabasePath = './database/killerDatabase.json';
const victimDatabasePath = './database/victimDatabase.json';

// Fungsi untuk memuat data dari file JSON
function loadData(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath);
            return JSON.parse(data);
        }
    } catch (error) {
        console.error(`Gagal memuat data dari ${filePath}:`, error);
    }
    return {}; // Jika error, kembalikan objek kosong
}

// Fungsi untuk mendapatkan nama pengguna tanpa tag
const getUserName = (jid) => {
    const user = global.db.data.users[jid] || {};
    return user.name || jid.split('@')[0]; // Ambil nama atau JID tanpa @
};

let handler = async (m, { conn }) => {
    let killerDatabase = loadData(killerDatabasePath);
    let victimDatabase = loadData(victimDatabasePath);

    // **Leaderboard untuk pembunuh (Top Killer)**
    let killerLeaderboard = Object.entries(killerDatabase)
        .map(([jid, data]) => ({ jid, kills: data.kills }))
        .sort((a, b) => b.kills - a.kills)
        .slice(0, 10);

    let killerLbMessage = "*🏆 Leaderboard Top Killer 🏆*\n";
    if (killerLeaderboard.length === 0) {
        killerLbMessage += "Belum ada pembunuh.\n";
    } else {
        for (let i = 0; i < killerLeaderboard.length; i++) {
            let username = getUserName(killerLeaderboard[i].jid);
            killerLbMessage += `${i + 1}. ${username} - ${killerLeaderboard[i].kills} kills\n`;
        }
    }

    // **Leaderboard untuk korban terbanyak (Top Victim)**
    let victimLeaderboard = Object.entries(victimDatabase)
        .map(([jid, data]) => ({ jid, killed: data.killed }))
        .sort((a, b) => b.killed - a.killed)
        .slice(0, 10);

    let victimLbMessage = "\n*💀 Leaderboard Top Victim 💀*\n";
    if (victimLeaderboard.length === 0) {
        victimLbMessage += "Belum ada korban terbunuh.\n";
    } else {
        for (let i = 0; i < victimLeaderboard.length; i++) {
            let username = getUserName(victimLeaderboard[i].jid);
            victimLbMessage += `${i + 1}. ${username} - ${victimLeaderboard[i].killed} deaths\n`;
        }
    }

    // Kirim pesan leaderboard dengan gambar
    await conn.sendMessage(m.chat, { 
        image: { url: 'https://files.catbox.moe/q2kdo5.jpg' }, 
        caption: killerLbMessage + victimLbMessage
    }, { quoted: m });
};

handler.help = ['lbkill'];
handler.tags = ['fun'];
handler.command = /^(killlb|leaderboardkill)$/i;

export default handler;