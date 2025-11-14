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

// Fungsi untuk menyimpan data ke dalam file JSON
function saveData(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Gagal menyimpan data ke ${filePath}:`, error);
    }
}

// Fungsi untuk mendapatkan nama pengguna tanpa tag
const getUserName = (jid) => {
    const user = global.db.data.users[jid] || {};
    return user.name || jid.split('@')[0]; // Ambil nama atau JID tanpa @
};

// **Daftar Owner (Ganti dengan nomor owner dalam format WhatsApp)**
const ownerJid = ['6285147777105@s.whatsapp.net', '6281399172380@s.whatsapp.net'];

let handler = async (m, { conn }) => {
    if (!m.mentionedJid || m.mentionedJid.length === 0) return m.reply('Tag pengguna yang ingin Anda "kill".');
    
    const target = m.mentionedJid[0];
    if (!target || target === m.sender) return m.reply("Kamu tidak bisa membunuh diri sendiri!");

    // Memuat database killer dan victim
    let killerDatabase = loadData(killerDatabasePath);
    let victimDatabase = loadData(victimDatabasePath);

    // Waktu cooldown dalam milidetik (2 menit)
    const cooldown = 2 * 60 * 1000;
    const currentTime = Date.now();

    // Jika pengirim belum ada di database, tambahkan
    if (!killerDatabase[m.sender]) {
        killerDatabase[m.sender] = { kills: 0, lastKill: 0 };
    }
    if (!victimDatabase[target]) {
        victimDatabase[target] = { killed: 0 };
    }

    // Cek cooldown
    if (currentTime - killerDatabase[m.sender].lastKill < cooldown) {
        const timeLeft = Math.ceil((cooldown - (currentTime - killerDatabase[m.sender].lastKill)) / 1000);
        return m.reply(`Anda harus menunggu ${timeLeft} detik lagi untuk melakukan kill berikutnya.`);
    }

    // Pastikan user terdaftar di database global sebelum melakukan aksi
    if (!global.db.data.users[m.sender]) return m.reply("Kamu belum terdaftar dalam database bot.");
    if (!global.db.data.users[target]) return m.reply("Target tidak terdaftar dalam database bot.");

    // **Cooldown Langsung Aktif**
    killerDatabase[m.sender].lastKill = currentTime;
    saveData(killerDatabasePath, killerDatabase);

    // **Sistem Defense Owner (80% chance)**
    let defendChance = ownerJid.includes(target) ? 0.9 : 0.5;
    const counterAttackChance = Math.random(); // Kesempatan perlawanan balik

    if (Math.random() < defendChance) {
        let defendMessages = [
            `🛡️ *${getUserName(target)} berhasil menghindari seranganmu!* Dia dengan cepat menangkis serangan dan melarikan diri!`,
            `🛡️ *${getUserName(target)} menggunakan jurus bayangan* dan tiba-tiba menghilang dalam kegelapan! Kamu kehilangan jejaknya.`,
            `🛡️ *${getUserName(target)} melawan balik dengan pisau kecil!* Kamu terkena serangan balik dan terpaksa melarikan diri!`,
            `🛡️ *${getUserName(target)} berteriak minta tolong!* Warga sekitar datang membantu dan kamu terpaksa kabur!`,
            `🛡️ *${getUserName(target)} dengan cepat bersembunyi di balik bayangan!* Kamu gagal menemukannya dalam kegelapan malam.`,
        ];

        // **Jika menyerang owner, kemungkinan besar akan mati balik (50%)**
        if (ownerJid.includes(target) && counterAttackChance > 0.9) {
            killerDatabase[m.sender].kills -= 1; // Kurangi kill attacker
            victimDatabase[m.sender] = victimDatabase[m.sender] || { killed: 0 };
            victimDatabase[m.sender].killed += 1; // Tambahkan korban pembunuh

            saveData(killerDatabasePath, killerDatabase);
            saveData(victimDatabasePath, victimDatabase);

            return m.reply(`👑 *Kamu mencoba membunuh sang Raja ${getUserName(target)}!* Tapi para prajuritnya menangkapmu dan *KAMU TERBUNUH!*`);
        }

        return m.reply(defendMessages[Math.floor(Math.random() * defendMessages.length)]);
    }

    // **Jika Defends Gagal, Target Terbunuh**
    killerDatabase[m.sender].kills += 1;
    victimDatabase[target].killed += 1;

    // Simpan database
    saveData(killerDatabasePath, killerDatabase);
    saveData(victimDatabasePath, victimDatabase);

    // **Hadiah Tambahan**
    let rewardMoney = 100000;
    let rewardLimit = 3;
    let rewardExp = 5000;

    global.db.data.users[m.sender].money += rewardMoney;
    global.db.data.users[m.sender].limit += rewardLimit;
    global.db.data.users[m.sender].exp += rewardExp;

    // **Caption Membunuh yang Dramatis**
    let killCaptions = [
        `🗡️ *${getUserName(target)} berusaha melawan, tapi usahanya sia-sia! Kamu menghabisinya tanpa belas kasihan! 💀*`,
        `🔪 *Darah berceceran di tanah, ${getUserName(target)} menghembuskan napas terakhirnya. Kamu telah menang! 💀*`,
        `🔥 *Api kemarahanmu membara! Kamu menghabisi ${getUserName(target)} tanpa ampun! 💀*`,
        `🕶️ *Dengan langkah dingin, kamu mendekati ${getUserName(target)} dan mengeksekusinya dalam sekejap mata! 💀*`,
        `⚔️ *Duel sengit terjadi, tapi pada akhirnya kamu menang! ${getUserName(target)} jatuh tak berdaya! 💀*`
    ];
    let killMessage = killCaptions[Math.floor(Math.random() * killCaptions.length)];

    // **Leaderboard Top Killer & Top Victim**
    let killerLbMessage = "*🏆 Leaderboard Top Killer 🏆*\n" + Object.entries(killerDatabase)
        .sort((a, b) => b[1].kills - a[1].kills)
        .slice(0, 5)
        .map((v, i) => `${i + 1}. ${getUserName(v[0])} - ${v[1].kills} kills`).join("\n") || "Belum ada pembunuh.";

    let victimLbMessage = "\n*💀 Leaderboard Top Victim 💀*\n" + Object.entries(victimDatabase)
        .sort((a, b) => b[1].killed - a[1].killed)
        .slice(0, 5)
        .map((v, i) => `${i + 1}. ${getUserName(v[0])} - ${v[1].killed} deaths`).join("\n") || "Belum ada korban terbunuh.";

    await conn.sendMessage(m.chat, { 
    video: { url: 'https://files.catbox.moe/icdzbo.mp4' },  // Menggunakan 'video' bukan 'image'
    caption: `${killMessage}\n\n🎁 *Hadiah:*\n💰 *+${rewardMoney} Money*\n🎟️ *+${rewardLimit} Limit*\n⭐ *+${rewardExp} Exp*\n\n${killerLbMessage}${victimLbMessage}`
});
};

handler.help = ['kill'];
handler.tags = ['fun'];
handler.command = /^(kill|membunuh)$/i;

export default handler;