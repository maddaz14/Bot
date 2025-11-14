import PhoneNumber from 'awesome-phonenumber';

let handler = async (m, { conn, participants, text }) => {
    let who;
    let debugPath = [];

    // Ambil dari tag atau reply (langkah awal)
    if (m.isGroup && m.mentionedJid?.length) {
        who = m.mentionedJid[0];
        debugPath.push('Source: Mention');
    } else if (m.isGroup && m.quoted?.sender) {
        who = m.quoted.sender;
        debugPath.push('Source: Reply');
    } else if (!m.isGroup) {
        who = m.sender;
        debugPath.push('Source: Private Chat');
    } else if (text) {
        debugPath.push('Source: Raw Text Input');
        debugPath.push(`Raw Text: ${text}`);

        let inputNum = text.replace(/[^0-9]/g, '');
        if (inputNum.startsWith('0')) inputNum = '62' + inputNum.slice(1);

        if (inputNum.length >= 9 && inputNum.length <= 15) {
            let jid = inputNum + '@s.whatsapp.net';
            let [res] = await conn.onWhatsApp(jid);
            if (res?.exists) {
                who = jid;
                debugPath.push(`Resolved from text: ${who}`);
            } else {
                throw `❌ Nomor *${text}* tidak terdaftar di WhatsApp.`;
            }
        } else {
            throw `❌ Format nomor salah. Gunakan format *628xxxxxx* atau tag orangnya.`;
        }
    }

    // Resolve @lid → nomor dari participants (jika ditemukan)
    if (m.isGroup && who?.endsWith('@lid')) {
        let resolved = participants.find(u => u.id === who || u.jid === who);
        if (resolved?.jid?.endsWith('@s.whatsapp.net')) {
            debugPath.push(`Resolved from participants: ${resolved.jid}`);
            who = resolved.jid;
        } else {
            throw `🚫 Tidak bisa menentukan nomor asli dari pengguna bertipe @lid. Suruh user kirim pesan ke bot di chat pribadi lebih dulu.`;
        }
    }

    if (!who) throw `❗ Tag atau balas orang yang ingin dijadikan owner!`;

    let number = who.split('@')[0];

    if (global.owner.some(([num]) => num === number)) {
        throw `⚠️ Nomor tersebut sudah menjadi owner!`;
    }

    global.owner.push([number, '', true]);

    await conn.sendMessage(m.chat, {
        text: `✅ @${number} sekarang sudah jadi *Owner*!`,
        mentions: [who]
    }, { quoted: m });

    console.log("\n[DEBUG AddOwner]");
    console.log("Path:", debugPath.join(" → "));
    console.log("Resolved JID:", who);
    console.log("Nomor:", number);
    console.log("----------------------------------\n");
};

handler.help = ['addowner <@tag/nomor>'];
handler.tags = ['owner'];
handler.command = /^(add|tambah|\+)owner$/i;
handler.owner = true;

export default handler;