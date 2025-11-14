import fetch from "node-fetch";

let handler = async ({ conn, m, args }) => {
    const text = args.join(' ');
    if (!text) {
        return conn.sendMessage(m.chat.id, `Tolong berikan teks yang ingin Anda jadikan logo. Contoh: */createlogo* YourTextHere`, {
            reply_to_message_id: m.message_id,
            parse_mode: 'Markdown'
        });
    }
    
    const loadingMessage = await conn.sendMessage(m.chat.id, '⏳ Sedang membuat logo, tunggu sebentar...', {
        reply_to_message_id: m.message_id
    });

    try {
        const url = `https://flamingtext.com/net-fu/proxy_form.cgi?script=fluffy-logo&text=${encodeURIComponent(text)}&imageoutput=true&output=direct&doScale=true&scaleWidth=676&scaleHeight=359`;

        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Gagal membuat logo.');
        
        const imageBuffer = await response.buffer();
        
        await conn.sendPhoto(m.chat.id, imageBuffer, {
            caption: `Ini logo Anda dengan teks: ${text}`,
            reply_to_message_id: m.message_id
        });
        
        await conn.deleteMessage(m.chat.id, loadingMessage.message_id);

    } catch (e) {
        console.error(e);
        await conn.deleteMessage(m.chat.id, loadingMessage.message_id);
        conn.sendMessage(m.chat.id, `❌ Maaf, terjadi kesalahan saat membuat logo.`, {
            reply_to_message_id: m.message_id
        });
    }
};

handler.help = ['createlogo'];
handler.tags = ['tools'];
handler.command = ['createlogo'];
handler.limit = true;

export default handler;