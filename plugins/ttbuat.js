const handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];

    if (user.tiktok) return m.reply("⚠️ Kamu sudah memiliki akun TikTok!");

    user.tiktok = {
        username: `@${m.sender.split('@')[0]}`,
        followers: 0,
        likes: 0,
        lives: 0,
        money: 0,
        exp: 0,
        level: 1
    };

    m.reply(`✅ *Akun TikTok Berhasil Dibuat!*\n👤 Username: ${user.tiktok.username}\n📊 Followers: 0\n💖 Likes: 0`);
};

handler.command = ['tiktokbuat','ttbuat'];
handler.help = ['tiktokbuat'];
handler.tags = ['game'];
export default handler;