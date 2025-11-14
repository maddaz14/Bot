let handler = async (m, { conn }) => {
    let who = m.isGroup ? (m.mentionedJid[0] || m.sender) : m.sender;

    if (typeof db.data.users[who] === 'undefined') throw '❌ Pengguna tidak ditemukan dalam database.';

    // Gambar profil (optional)
    await conn.profilePictureUrl(who, 'image').catch(_ => null);

    // Daftar Owner
    const ownerJid = ['6285147777105', '6285248500955']; // Ganti sesuai kebutuhan

    // Ambil data user dan grup
    let user = db.data.users[who];
    let chatData = db.data.chats[m.chat] || {};
    let limit = user.limit || 0;

    let isOwner = ownerJid.includes(who);
    let isPremiumUser = user.premium || false;
    let isPremiumGroup = m.isGroup && chatData.isPremiumGroup && Date.now() < chatData.premiumGroupExpire;

    // Pemrosesan limit
    if (isOwner || isPremiumUser || isPremiumGroup) {
        limit = '∞';
    } else {
        if (limit > 10_000) {
            db.data.users[who].limit = 9999;
            limit = 9999;
        }
        limit = Math.min(limit, 10_000);
    }

    // Status pengguna
    let status = isOwner
        ? 'Owner'
        : isPremiumUser
        ? 'Premium User'
        : isPremiumGroup
        ? 'Premium Group Member'
        : 'Reguler';

    let premiumGroupStatus = isPremiumGroup ? '✅ Yes' : '❌ No';

    // Format teks akhir
    let caption = `
🎟️ *Y O U R   L I M I T*

🧑‍💼 *Pengguna:* @${who.split('@')[0]}
💎 *Status:* ${status}
📊 *Limit:* ${limit}
🏷️ *Group Premium:* ${premiumGroupStatus}

📌 Gunakan limitmu dengan bijak ya~!
`.trim();

    conn.sendMessage(m.chat, {
        text: caption,
        mentions: [who]
    }, { quoted: m });
};

handler.help = ['limit <@user>'];
handler.tags = ['main'];
handler.command = /^(limit|ceklimit)$/i;
handler.register = true;

export default handler;