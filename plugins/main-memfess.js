let handler = async (m, { conn, text, usedPrefix, command, namebot }) => {
    conn.menfess = conn.menfess || {}
    if (!text) throw `*Cara penggunaan :*\n\n${usedPrefix + command} nomor|nama pengirim|pesan\n\n*Note:* nama pengirim boleh nama samaran atau anonymous.\n\n*Contoh:* ${usedPrefix + command} ${m.sender.split`@`[0]}|${namebot}|Halo.`;
    
    let [jid, name, pesan] = text.split('|');
    if (!jid || !name || !pesan) throw `*Cara penggunaan :*\n\n${usedPrefix + command} nomor|nama pengirim|pesan\n\n*Note:* nama pengirim boleh nama samaran atau anonymous.\n\n*Contoh:* ${usedPrefix + command} ${m.sender.split`@`[0]}|${namebot}|Halo.`;

    jid = jid.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    let data = (await conn.onWhatsApp(jid))[0] || {};
    if (!data.exists) throw 'Nomer tidak terdaftar di WhatsApp.';
    
    let mf = Object.values(conn.menfess).find(mf => mf.status === true)
    if (mf) return !0
    
    try {
        let id = + new Date;
        let txt = `Hai @${data.jid.split('@')[0]}, kamu menerima pesan Menfess nih.\n\nDari: *${name}*\nPesan: \n${pesan}\n\nMau balas pesan ini? Bisa kak, nanti saya sampaikan ke *${name}*.`.trim();
        
        // Kirim pesan **tanpa reply ke m**, supaya penerima tidak melihat nomor kita
        await conn.sendMessage(data.jid, { text: txt });

        m.reply('Berhasil mengirim pesan menfess.')
        conn.menfess[id] = {
            id,
            dari: m.sender,
            nama: name,
            penerima: data.jid,
            pesan: pesan,
            status: false
        }
        return !0
    } catch (e) {
        console.log(e)
        m.reply('Terjadi error saat mengirim pesan.')
    }
}

handler.help = ['menfess']
handler.tags = ['main']
handler.command = /^(mfs|menfess|menfes|confes)$/i
handler.register = true
handler.private = true

export default handler