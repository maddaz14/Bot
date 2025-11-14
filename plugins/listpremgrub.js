let handler = async (m, { conn }) => {
    const chats = global.db.data.chats;
    const premiumGroups = [];
    
    // Iterasi semua chat di database untuk mencari grup premium
    for (let chatId in chats) {
        const chat = chats[chatId];
        // Cek apakah chat adalah grup premium dan masa aktifnya belum habis
        if (chat.isPremiumGroup && chat.premiumGroupExpire && chat.premiumGroupExpire > Date.now()) {
            const groupName = (await conn.getName(chatId)) || 'Nama tidak ditemukan';
            const remainingTime = chat.premiumGroupExpire - Date.now();
            premiumGroups.push({ name: groupName, time: remainingTime });
        }
    }

    if (premiumGroups.length === 0) {
        return conn.reply(m.chat, `❌ Saat ini tidak ada grup yang berstatus premium.`, m);
    }

    let list = `✨ *Daftar Grup Premium Aktif* ✨\n\n`;
    for (let i = 0; i < premiumGroups.length; i++) {
        const group = premiumGroups[i];
        list += `*${i + 1}.* ${group.name}\n`;
        list += `   - Sisa Waktu: ${clockString(group.time)}\n\n`;
    }

    conn.reply(m.chat, list.trim(), m);
};

handler.help = ['listpremgrub'];
handler.tags = ['owner'];
handler.command = /^(listpremgrub|daftarpremgrub)$/i;
handler.owner = true; // Menggunakan properti ini untuk pengecekan owner

export default handler;

// Fungsi untuk ubah milidetik ke format waktu (hari, jam, menit, detik)
function clockString(ms) {
    if (isNaN(ms)) return '--';
    let d = Math.floor(ms / 86400000);
    let h = Math.floor(ms / 3600000) % 24;
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return `${d} hari, ${h} jam, ${m} menit, ${s} detik`;
}