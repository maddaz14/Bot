import fs from 'fs'
import fetch from 'node-fetch' // Tambahkan import fetch
import moment from 'moment-timezone'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    
    // Pastikan global.plugins dimuat oleh handler.js core Anda
    const plugins = global.plugins || {}; 
    
    // Hitung total fitur yang valid (memiliki property help dan tidak disabled)
    let fitur = Object.values(plugins).filter(v => v.help && !v.disabled).map(v => v.help).flat(1);
    let totalFeatures = fitur.length;

    // Tentukan pengirim untuk context info (jika diperlukan)
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let name = await conn.getName(who);
    
    // --- PERUBAHAN KRITIS: Menggunakan global.foto ---
    let thumbnailBuffer;
    try {
        // Ambil global.foto (URL) atau gunakan URL fallback
        const imageUrl = global.foto || 'https://files.catbox.moe/bu4mtb.jpg';
        thumbnailBuffer = await (await fetch(imageUrl)).buffer();
    } catch (e) {
        // Fallback jika fetch gagal (gunakan buffer kosong atau fallback image jika ada)
        console.error("Gagal mengambil global.foto:", e);
        // Membuat buffer kosong sebagai fallback agar bot tidak crash
        thumbnailBuffer = Buffer.alloc(0); 
    }
    // ----------------------------------------------------

    // Konten Order Message
    const orderMessageContent = {
        itemCount: totalFeatures, // Jumlah fitur
        message: `ᴛᴏᴛᴀʟ ꜰᴇᴀᴛᴜʀᴇ ${totalFeatures}`,
        orderTitle: 'ᴜʙᴇᴅ ʙᴏᴛ ꜰᴇᴀᴛᴜʀᴇꜱ',
        sellerJid: '6285248500955@s.whatsapp.net', // Ganti dengan JID Bot atau Owner yang valid
        totalAmount1000: 50000, // Total biaya (dalam format 1000)
        
        contextInfo: {
            externalAdReply: {
                 showAdAttribution: true,
                 renderLargerThumbnail: true,
                 sourceUrl: 'https://linkbio.co/Ubedbot', // Opsional
                 title: 'Total Fitur Bot Saat Ini',
                 body: `${totalFeatures} Fitur tersedia!`,
                 thumbnail: thumbnailBuffer // Menggunakan buffer dari global.foto
            }
        }
    };
    
    // Kirim Order Message menggunakan conn.sendMessage
    await conn.sendMessage(m.chat, {
        order: orderMessageContent
    }, { quoted: m });
    
    // Opsional: Reaksi sukses
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
}

handler.help = ['totalfeature']
handler.tags = ['main']
handler.command = /^(feature|totalfeature|totalfitur)$/i
handler.limit = true

export default handler