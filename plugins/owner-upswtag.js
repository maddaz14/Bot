import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    
    // 1. Tentukan sumber media (quoted atau pesan saat ini)
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';
    
    // 2. Ambil teks (caption)
    const arg = args.join(" ");
    const cap = arg?.trim() || q.text; // Ambil dari argumen atau teks pesan yang di-reply/dikirim
    const jid = m.chat;

    // Fungsi untuk mengirim reaksi
    const react = (emoji) => conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } });

    // Validasi dasar grup
    if (!m.isGroup) {
        throw 'Perintah ini hanya bisa digunakan di dalam grup!';
    }
    
    await react("⏳");

    try {
        let sent = false;
        
        // --- LOGIKA MEDIA ---
        if (mime) {
            const buffer = await q.download();
            if (!buffer) throw new Error('Gagal mengunduh media.');
            
            if (/image/.test(mime)) {
                await conn.sendMessage(jid, {
                    groupStatusMessage: {
                        image: buffer,
                        caption: cap,
                    },
                });
                sent = true;
            } else if (/video/.test(mime)) {
                await conn.sendMessage(jid, {
                    groupStatusMessage: {
                        video: buffer,
                        caption: cap,
                    },
                });
                sent = true;
            } else if (/audio/.test(mime)) {
                await conn.sendMessage(jid, {
                    groupStatusMessage: {
                        audio: buffer,
                    },
                });
                sent = true;
            } else {
                // Jika MIME type tidak didukung (misal: dokumen, stiker webp)
                await conn.sendMessage(m.chat, {
                    text: `⚠️ Jenis media (*${mime}*) tidak didukung untuk status grup.`,
                }, { quoted: m });
                await react("❗");
                return;
            }
        
        // --- LOGIKA TEKS SAJA ---
        } else if (cap) {
            await conn.sendMessage(jid, {
                groupStatusMessage: {
                    text: cap,
                },
            });
            sent = true;
        }

        // --- KONFIRMASI DAN ERROR HANDLING ---
        if (sent) {
            await react("✅");
        } else {
            // Jika tidak ada media dan tidak ada caption
            await conn.sendMessage(m.chat, {
                text: `⚠️ Balas media atau tambahkan teks.\nContoh:\n${usedPrefix + command} (balas gambar/video/audio) hai ini saya`,
            }, { quoted: m });
            await react("❗");
        }

    } catch (err) {
        console.error("❌ Error di swgrup:", err);
        // Tangani error, kirim pesan ke user
        await conn.sendMessage(m.chat, { text: `💥 Terjadi kesalahan saat mengirim status!\n\nLog: ${err.message}` }, { quoted: m });
        await react("❌");
    }
};

handler.help = ['swgrup'];
handler.tags = ['group', 'tools'];
handler.command = /^(swgc|swgrup|swgroup|statusgrup|postgrup)$/i;
handler.admin = true; 
handler.group = true; 

export default handler;