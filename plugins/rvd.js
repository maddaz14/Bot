const handler = async (m, { conn, isAdmin, isBotAdmin }) => {
    const ownerNumbers = [(conn.user?.jid || '').replace(/[^0-9]/g, '')];
    const isOwner = ownerNumbers.includes(m.sender.replace(/[^0-9]/g, ''));

    if (!m.isGroup) return conn.reply(m.chat, 'Perintah ini hanya bisa digunakan di dalam grup!', m);
    if (!isAdmin && !isOwner) return conn.reply(m.chat, 'Perintah ini hanya bisa digunakan oleh admin grup!', m);

    if (!m.quoted) return conn.reply(m.chat, `Reply pesan view once atau dokumen gambarnya!`, m);

    let msg = m.quoted;
    let type = msg.mtype || '';

    // Tangani view once
    if (/viewOnce/.test(type) || msg.viewOnce) {
        let buffer = await msg.download();
        if (/video/.test(type)) {
            return conn.sendFile(m.chat, buffer, 'media.mp4', msg.text || '', m);
        } else if (/image/.test(type)) {
            return conn.sendFile(m.chat, buffer, 'media.jpg', msg.text || '', m);
        } else {
            return conn.reply(m.chat, 'Pesan view once tidak dikenali!', m);
        }
    }

    // Tangani dokumen yang berupa gambar
    if (msg.mtype === 'documentMessage' && msg.mimetype?.startsWith('image/')) {
        let buffer = await msg.download();
        return conn.sendFile(m.chat, buffer, 'image.jpg', msg.text || '', m, false, { asDocument: false });
    }

    return conn.reply(m.chat, 'Pesan yang direply bukan view once atau dokumen gambar!', m);
};

handler.help = ['rvd'];
handler.tags = ['tools'];
handler.command = /^rvd|readviewdokumen$/i;
handler.group = true;

export default handler;