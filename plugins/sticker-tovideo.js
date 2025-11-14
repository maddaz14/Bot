import fetch from 'node-fetch';
import { sticker } from '../lib/sticker.js';
import uploadFile from '../lib/uploadFile.js';
import uploadImage from '../lib/uploadImage.js';
import { webp2png, webp2mp4 } from '../lib/webp2mp4.js';
import { Sticker, StickerTypes } from 'wa-sticker-formatter';
import { ffmpeg } from '../lib/converter.js';
import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Tambahkan emoji saat memproses
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key }});

    let who = m.mentionedJid && m.mentionedJid[0]
        ? m.mentionedJid[0]
        : m.fromMe
        ? conn.user.jid
        : m.sender;

    let pp = await conn.profilePictureUrl(who).catch(_ => '');
    let name = await conn.getName(who);
    let stiker = false;
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!m.quoted) {
        // Tambahkan emoji gagal jika tidak ada balasan
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key }});
        throw `Balas stiker/audio yang ingin diubah menjadi video dengan perintah ${usedPrefix + command}`;
    }

    let img = await q.download?.();
    let out;
    let tempFilePath;

    try {
        if (/webp/g.test(mime)) {
            // Simpan sementara ke folder tmp
            tempFilePath = path.join('tmp', `tovid-${Date.now()}.mp4`);
            if (!fs.existsSync('tmp')) {
                fs.mkdirSync('tmp');
            }
            out = await webp2mp4(img, tempFilePath);
        } else if (/image/g.test(mime)) {
            out = await uploadImage(img);
        } else if (/video/g.test(mime)) {
            out = await uploadFile(img);
        } else if (/audio/g.test(mime)) {
            tempFilePath = path.join('tmp', `tovid-${Date.now()}.mp4`);
            if (!fs.existsSync('tmp')) {
                fs.mkdirSync('tmp');
            }
            out = await ffmpeg(img, [
                '-filter_complex', 'color=s=1280x720:c=black:d=1',
                '-pix_fmt', 'yuv420p',
                '-crf', '51',
                '-c:a', 'copy',
                '-shortest'
            ], 'mp3', tempFilePath);
        }

        // Jika out adalah path file lokal, kirim file tersebut
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            await conn.sendFile(m.chat, tempFilePath, 'tovid.mp4', '✅ Sticker telah diubah menjadi video', m);
        } else if (typeof out === 'string') {
            await conn.sendFile(m.chat, out, 'tovid.mp4', '✅ Sticker telah diubah menjadi video', m);
        } else {
            // Tambahkan emoji gagal jika terjadi error
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key }});
            throw 'Gagal mengonversi sticker menjadi video.';
        }

    } catch (e) {
        // Tambahkan emoji gagal jika terjadi error
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key }});
        // Pastikan file sementara dihapus jika ada
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
        throw `❌ Gagal mengonversi: ${e.message}`;
    } finally {
        // Hapus file sementara setelah selesai
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
    }
};

handler.help = ['tovideo'];
handler.tags = ['tools'];
handler.command = /^t(o(vid(eos?|s)?|mp4)|vid(eos?|s)?|mp4)$/i;

export default handler;