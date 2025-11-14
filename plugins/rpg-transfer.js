import PhoneNumber from 'awesome-phonenumber';

let handler = async (m, { conn, args, usedPrefix, DevMode, participants }) => {
    // Validasi jumlah argumen
    if (args.length < 3) {
        return conn.reply(m.chat, `*Format Salah!*
Contoh: *${usedPrefix}transfer money 100 @tag*
    
*Daftar yang bisa ditransfer:*
• Money
• Tabungan
• Potion
• Trash
• Diamond
• Common
• Uncommon
• Mythic
• Legendary
• String
• Wood
• Rock
• Iron`.trim(), m);
    }

    try {
        let type = (args[0] || '').toLowerCase();
        let count = args[1] && args[1].length > 0 ? Math.min(99999999999999999999999, Math.max(parseInt(args[1]), 1)) : 1;

        let who;

        // Mendapatkan ID pengguna dari mention, reply, atau teks
        if (m.mentionedJid?.length) {
            who = m.mentionedJid[0];
        } else if (m.quoted?.sender) {
            who = m.quoted.sender;
        } else if (args[2]) {
            let inputNum = args[2].replace(/[^0-9]/g, '');
            if (inputNum.startsWith('0')) inputNum = '62' + inputNum.slice(1);
            who = inputNum + '@s.whatsapp.net';
        }
        
        // --- Penanganan ID @lid ---
        if (m.isGroup && who?.endsWith('@lid')) {
            let resolved = participants.find(u => u.id === who || u.jid === who);
            if (resolved?.jid?.endsWith('@s.whatsapp.net')) {
                who = resolved.jid;
            } else {
                return conn.reply(m.chat, `🚫 *Tidak dapat menemukan nomor asli dari pengguna bertipe @lid ini.*
Minta pengguna tersebut untuk mengirim pesan ke bot di chat pribadi terlebih dahulu.`, m);
            }
        }
        // --- Akhir Penanganan ID @lid ---
        
        if (!who || !global.db.data.users[who]) {
            return conn.reply(m.chat, `❗ *Pengguna tidak valid atau tidak terdaftar dalam database bot.*
Pastikan Anda men-tag atau membalas pesan pengguna yang benar.`, m);
        }

        let users = global.db.data.users;
        let sender = users[m.sender];
        let target = users[who];

        if (sender === target) {
            return conn.reply(m.chat, `🚫 *Anda tidak bisa mentransfer ke diri sendiri!*`, m);
        }

        const items = {
            'money': 'Money', 'tabungan': 'Tabungan', 'limit': 'Limit', 'potion': 'Potion', 'trash': 'Trash',
            'diamond': 'Diamond', 'common': 'Common Crate', 'uncommon': 'Uncommon Crate', 'mythic': 'Mythic Crate',
            'legendary': 'Legendary Crate', 'string': 'String', 'wood': 'Wood', 'rock': 'Rock', 'iron': 'Iron'
        };

        if (!Object.keys(items).includes(type)) {
            return conn.reply(m.chat, `*Format Salah!*
Contoh: *${usedPrefix}transfer money 100 @tag*
    
*Daftar yang bisa ditransfer:*
• Money
• Tabungan
• Potion
• Trash
• Diamond
• Common
• Uncommon
• Mythic
• Legendary
• String
• Wood
• Rock
• Iron`.trim(), m);
        }

        if (sender[type] < count) {
            return conn.reply(m.chat, `❌ *${items[type]}* kamu tidak mencukupi untuk mentransfer *${count} ${items[type]}*`, m);
        }
        
        sender[type] -= count;
        target[type] += count;

        conn.sendMessage(m.chat, {
            text: `✅ Berhasil mentransfer *${count} ${items[type]}* ke @${who.split('@')[0]}`,
            mentions: [who]
        }, { quoted: m });
    
    } catch (e) {
        conn.reply(m.chat, `*Terjadi kesalahan.* Pastikan format perintah sudah benar: *${usedPrefix}transfer money 100 @tag*`, m);
        console.error(e);
        if (DevMode) {
            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                conn.reply(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', m);
            }
        }
    }
}

handler.help = ['transfer'];
handler.tags = ['rpg'];
handler.command = /^(transfer|tf)$/i;
handler.owner = false;
handler.mods = false;
handler.premium = false;
handler.register = true;
handler.group = true;
handler.private = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;

export default handler;