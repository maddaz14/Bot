let handler = async (m, { conn, text, args, participants }) => {
    if (!text) throw 'Masukkan jumlah cupon dan target user.\nContoh: *.addcupon 5 @user*'

    let who;
    let jumlah = parseInt(args[0]?.replace(/[^0-9]/g, ''));
    let debug = [];

    if (!jumlah || isNaN(jumlah)) throw '❌ Jumlah cupon tidak valid!';
    if (jumlah < 1) throw '❌ Minimal tambah 1 cupon ya!';

    // === 1. Cari Target ===
    // a. Tag
    if (m.isGroup && m.mentionedJid?.length) {
        who = m.mentionedJid[0];
        debug.push('Source: Mention');
    }

    // b. Reply
    else if (m.quoted?.sender) {
        who = m.quoted.sender;
        debug.push('Source: Reply');
    }

    // c. Nomor dari argumen kedua
    else if (args[1]) {
        let input = args[1].replace(/\D/g, '');
        if (input.startsWith('0')) input = '62' + input.slice(1);
        if (input.length < 9 || input.length > 15) throw '❌ Format nomor salah!';
        who = input + '@s.whatsapp.net';
        debug.push('Source: Raw Number');
    }

    // d. Default ke pengirim
    else {
        who = m.sender;
        debug.push('Source: Default Sender');
    }

    // === 2. Resolve jika @lid ===
    if (who.endsWith('@lid') && m.isGroup) {
        if (!participants) participants = (await conn.groupMetadata(m.chat)).participants;
        let resolved = participants.find(p => p.id === who || p.jid === who);
        if (resolved?.jid?.endsWith('@s.whatsapp.net')) {
            who = resolved.jid;
            debug.push('Resolved @lid → JID');
        } else {
            return m.reply('⚠️ Tidak bisa resolve JID dari @lid. Suruh user kirim pesan dulu.');
        }
    }

    // === 3. Tambahkan cupon ===
    if (!global.db.data.users[who]) global.db.data.users[who] = { cupon: 0 };

    let user = global.db.data.users[who];
    user.cupon = (user.cupon || 0) + jumlah;

    await conn.reply(m.chat, `🎉 Selamat @${who.split('@')[0]}!\nKamu mendapat +${jumlah} Cupon dari Owner.`, m, {
        mentions: [who]
    });

    // Debug log (optional)
    console.log('\n[DEBUG addcupon]');
    console.log('Target:', who);
    console.log('Jumlah:', jumlah);
    console.log('Debug:', debug.join(' → '));
    console.log('-------------------------\n');
};

handler.help = ['addcupon <jumlah> [@user|nomor|reply]'];
handler.tags = ['owner'];
handler.command = /^addcupon$/i;
handler.owner = true;

export default handler;