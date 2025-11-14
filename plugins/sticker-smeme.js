// Dibuat oleh ubed - Dilarang keras menyalin tanpa izin!
// --- Kode Plugin Dimulai di sini ---
import { Sticker } from 'wa-sticker-formatter';
import FormData from 'form-data';
import fetch from 'node-fetch';
import { fileTypeFromBuffer } from 'file-type';
import fakeUserAgent from 'fake-useragent';

const fkontak = {
    key: {
        participant: '0@s.whatsapp.net',
        remoteJid: '0@s.whatsapp.net',
        fromMe: false,
        id: 'Halo',
    },
    message: {
        conversation: `🌷 Buat Stiker Meme ${global.namebot || 'Bot'} ✨`,
    }
};

const handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        await conn.sendMessage(m.chat, { react: { text: '🌷', key: m.key } });

        if (!args[0]) {
            return conn.reply(m.chat, `🌸 Halo Kak! Mau buat stiker meme dengan teks apa nih? ✨\n\nContoh: *${usedPrefix + command} teks atas|teks bawah*\n\nMohon balas gambar dengan perintah ini ya! 🌷`, m, { quoted: fkontak });
        }

        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (!mime || !/image\/(jpeg|png|jpg)/.test(mime)) {
            return conn.reply(m.chat, '❌ Aduh, Kak! Kirim gambar dulu, format harus JPG/PNG.', m, { quoted: fkontak });
        }

        let media = await q.download();
        if (!media) throw '❌ Gagal mengunduh gambar, coba lagi.';

        const { ext, mime: mimetype } = await fileTypeFromBuffer(media) || {};
        const form = new FormData();
        form.append('files[]', media, {
            filename: 'meme.' + ext,
            contentType: mimetype
        });

        const res = await fetch('https://uguu.se/upload.php', {
            method: 'POST',
            body: form,
            headers: {
                'User-Agent': fakeUserAgent()
            }
        });

        const json = await res.json();
        const imageUrl = json?.files?.[0]?.url;
        if (!imageUrl) throw '❌ Gagal mengunggah gambar ke Uguu.';

        let [top = ' ', bottom = ' '] = args.join(' ').split('|').map(s => s.trim());
        top = encodeURIComponent(top || ' ');
        bottom = encodeURIComponent(bottom || ' ');

        let memeUrl = `https://api.memegen.link/images/custom/${top}/${bottom}.png?background=${imageUrl}`;
        let response = await fetch(memeUrl);
        if (!response.ok) throw `❌ Gagal membuat meme. Status: ${response.status}`;

        let buffer = Buffer.from(await response.arrayBuffer());
        const sticker = new Sticker(buffer, {
            pack: global.namebot || 'Nooriko Bot',
            author: m.name || 'User',
            quality: 50
        });

        const stickerBuffer = await sticker.toBuffer();
        await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: fkontak });
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error('Error in smeme handler:', e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        await conn.reply(m.chat, `❌ Terjadi kesalahan saat membuat stiker meme:\n${e.message || e}`, m, { quoted: fkontak });
    }
};

handler.help = ['smeme <teks_atas|teks_bawah>'];
handler.tags = ['sticker', 'maker'];
handler.command = /^(smeme)$/i;
handler.premium = false;
handler.register = true;

export default handler;