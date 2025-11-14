let handler = async (m, { conn, text, participants }) => {
    let who;
    let debugPath = [];

    // Resolve target (who)
    if (m.isGroup) {
        if (m.mentionedJid?.length) {
            who = m.mentionedJid[0];
            debugPath.push('Source: Mention');
        } else if (m.quoted?.sender) {
            who = m.quoted.sender;
            debugPath.push('Source: Reply');
        } else if (text) {
            let input = text.split(' ')[0].replace(/\D/g, '');
            if (input.startsWith('0')) input = '62' + input.slice(1);
            if (input.length >= 9 && input.length <= 15) {
                who = input + '@s.whatsapp.net';
                debugPath.push('Source: Raw Number');
            } else {
                throw `Format nomor salah, Senpai! Contoh: 628123456789 atau @user`;
            }
        } else {
            throw `Tag seseorang atau masukin nomornya, Senpai!`;
        }
    } else {
        who = m.chat;
        debugPath.push('Source: Private chat');
    }

    // Resolve jika @lid
    if (m.isGroup && who.endsWith('@lid')) {
        const resolved = participants.find(p => p.id === who || p.jid === who);
        if (resolved?.jid?.endsWith('@s.whatsapp.net')) {
            who = resolved.jid;
            debugPath.push('Resolved @lid → @s.whatsapp.net');
        } else {
            throw '⚠️ Gagal mengubah ID @lid ke nomor asli. Suruh target kirim pesan dulu ke bot.';
        }
    }

    if (!who.endsWith('@s.whatsapp.net')) throw 'Nomor tidak valid, Senpai!';

    // Inisialisasi user jika belum ada
    if (!db.data.users[who]) {
        db.data.users[who] = {
            name: '',
            premium: false,
            premiumTime: 0,
            // Tambahkan data default lainnya jika perlu
        };
    }

    let user = db.data.users[who];
    let args = text.trim().split(' ').slice(1); // ambil setelah nomor
    let jumlahWaktu = parseInt(args[0]);
    let satuanWaktu = args[1] ? args[1].toLowerCase() : 'hari';
    let now = Date.now();

    if (isNaN(jumlahWaktu)) {
        user.premium = true;
        user.premiumTime = Infinity;
        return m.reply(`✅ Sukses, Senpai!\n*Nomor:* ${who.split('@')[0]}\n*Durasi:* PERMANEN\nSekarang dia Premium!`);
    }

    // Konversi durasi ke ms
    let durasi;
    switch (satuanWaktu) {
        case 'jam': durasi = jumlahWaktu * 3600000; break;
        case 'hari': durasi = jumlahWaktu * 86400000; break;
        case 'minggu': durasi = jumlahWaktu * 7 * 86400000; break;
        case 'bulan': durasi = jumlahWaktu * 30 * 86400000; break;
        case 'tahun': durasi = jumlahWaktu * 365 * 86400000; break;
        default:
            throw `❌ Satuan waktu salah, Senpai!\nGunakan: jam, hari, minggu, bulan, atau tahun`;
    }

    user.premium = true;
    user.premiumTime = user.premiumTime > now ? user.premiumTime + durasi : now + durasi;

    m.reply(`✅ Sukses, Senpai!\n*Nomor:* ${who.split('@')[0]}\n*Durasi:* ${jumlahWaktu} ${satuanWaktu}\nSekarang dia Premium!`);

    // Optional Debug Log
    console.log('\n[DEBUG addprem]');
    console.log('Source Path:', debugPath.join(' → '));
    console.log('Resolved JID:', who);
    console.log('User Premium Time:', new Date(user.premiumTime).toLocaleString());
    console.log('--------------------------------------\n');
};

handler.help = ['addprem <@user|nomor> <jumlah> <jam/hari/minggu/bulan/tahun>'];
handler.tags = ['owner'];
handler.command = /^(add|tambah|\+)p(rem)?$/i;
handler.group = false;
handler.owner = true;

export default handler;