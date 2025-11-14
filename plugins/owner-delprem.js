let handler = async (m, { conn, text, participants }) => {
    if (!text && !m.mentionedJid?.length && !m.quoted) {
        throw '❌ Siapa yang mau dicabut Premium-nya? Gunakan tag, reply, atau ketik nomornya.';
    }

    let who;
    let debug = [];

    // 1. Dari tag
    if (m.isGroup && m.mentionedJid?.length) {
        who = m.mentionedJid[0];
        debug.push('Source: Mention');
    }

    // 2. Dari reply
    else if (m.isGroup && m.quoted?.sender) {
        who = m.quoted.sender;
        debug.push('Source: Reply');
    }

    // 3. Dari text langsung (nomor)
    else if (text) {
        let input = text.trim().split(' ')[0].replace(/\D/g, '');
        if (input.startsWith('0')) input = '62' + input.slice(1);
        if (input.length < 9 || input.length > 15) throw '❌ Format nomor salah.';
        who = input + '@s.whatsapp.net';
        debug.push('Source: Raw Number');
    }

    if (!who) throw '❌ Tidak bisa mengenali target.';

    // 4. Resolve jika @lid
    if (who.endsWith('@lid') && m.isGroup) {
        let resolved = participants.find(p => p.id === who || p.jid === who);
        if (resolved?.jid?.endsWith('@s.whatsapp.net')) {
            who = resolved.jid;
            debug.push('Resolved @lid → JID');
        } else {
            throw '⚠️ Gagal resolve ID @lid ke JID asli. Suruh target kirim pesan dulu.';
        }
    }

    if (!who.endsWith('@s.whatsapp.net')) {
        throw '❌ Gagal, JID tidak valid.';
    }

    let users = global.db.data.users;

    if (!users[who]) {
        throw '❌ User tidak ditemukan dalam database.';
    }

    users[who].premium = false;
    users[who].premiumTime = 0;

    await conn.reply(m.chat, `✅ Premium untuk @${who.split('@')[0]} telah dicabut.`, m, {
        mentions: [who]
    });

    console.log('\n[DEBUG delprem]');
    console.log('Target:', who);
    console.log('Source Path:', debug.join(' → '));
    console.log('---------------------------\n');
};

handler.help = ['delprem <@user|nomor|reply>'];
handler.tags = ['owner'];
handler.command = /^delprem(user)?$/i;
handler.rowner = true;

export default handler;