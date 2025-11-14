const handler = async (m, { conn, text }) => {
    let user = global.db.data.users[m.sender];

    if (!user.tiktok) return conn.reply(m.chat, "⚠️ Kamu belum memiliki akun TikTok! Gunakan `.tiktokbuat` untuk membuat.", m);

    if (!text) return conn.reply(m.chat, "⚠️ Harap masukkan judul live!\nContoh: `.livetiktok Nonton bareng anime`", m);

    // Cooldown 10 menit
    if (user.livetiktokCooldown && Date.now() - user.livetiktokCooldown < 10 * 60 * 1000) {
        let remaining = (10 * 60 * 1000) - (Date.now() - user.livetiktokCooldown);
        let minutes = Math.floor(remaining / (60 * 1000));
        return conn.reply(m.chat, `⚠️ Kamu sudah melakukan Live TikTok! Coba lagi dalam *${minutes} menit*.`, m);
    }

    let waktuLive = Math.floor(Math.random() * (180 - 30 + 1)) + 30;
    let viewers = Math.floor(Math.random() * (100000 - 500 + 1)) + 500;
    let likes = Math.floor(Math.random() * (1000000 - 5000 + 1)) + 5000;
    let moneyEarned = Math.floor(Math.random() * (1000000 - 50000 + 1)) + 50000;
    let followersEarned = Math.floor(Math.random() * (5000 - 100 + 1)) + 100;
    let expEarned = Math.floor(Math.random() * (5000 - 500 + 1)) + 500;

    let sponsorChance = Math.random() < 0.1;
    let sponsorBonus = sponsorChance ? Math.floor(Math.random() * (500000 - 100000 + 1)) + 100000 : 0;

    let totalMoney = moneyEarned + sponsorBonus;
    
    user.tiktok.money += totalMoney;
    user.tiktok.exp += expEarned;
    user.tiktok.followers += followersEarned;
    user.tiktok.likes += likes;
    user.tiktok.lives += 1;
    user.livetiktokCooldown = Date.now();

    // Level Up System
    if (user.tiktok.followers >= 1000 && user.tiktok.level < 2) user.tiktok.level = 2;
    if (user.tiktok.followers >= 5000 && user.tiktok.level < 3) user.tiktok.level = 3;
    if (user.tiktok.followers >= 10000 && user.tiktok.level < 4) user.tiktok.level = 4;

    let result = `🎬 *Live TikTok Selesai!*\n\n`;
    result += `📝 *Judul Live:* ${text}\n`;
    result += `⏳ *Durasi Live:* ${waktuLive} menit\n`;
    result += `👥 *Penonton:* ${viewers.toLocaleString()} orang\n`;
    result += `💖 *Likes:* ${likes.toLocaleString()}\n`;
    result += `🎁 *Hadiah Gift:* +${moneyEarned.toLocaleString()} money\n`;
    result += `📈 *Followers Baru:* +${followersEarned}\n`;
    result += `🎮 *Exp:* +${expEarned}\n`;

    if (sponsorChance) {
        result += `\n🎉 *Sponsor!* Kamu mendapat bonus +${sponsorBonus.toLocaleString()} money dari sponsor!`;
    }

    conn.reply(m.chat, result, m);
};

handler.command = ['livetiktok','livett','ttlive'];
handler.help = ['livetiktok'];
handler.tags = ['game'];
handler.limit = true;
export default handler;