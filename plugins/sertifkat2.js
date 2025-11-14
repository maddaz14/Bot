import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import axios from 'axios';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    let name = args.join(' ').trim();
    if (!name) return conn.reply(m.chat, `⚠️ Masukkan nama untuk sertifikat!\n\nContoh: *${usedPrefix + command} John Doe*`, m);

    let width = 1280;
    let height = 720;
    let canvas = createCanvas(width, height);
    let ctx = canvas.getContext('2d');

    // 🔹 Unduh Background dari Catbox
    let bgUrl = 'https://files.catbox.moe/5au1o3.jpg';
    let bgImage;
    
    try {
        let response = await axios.get(bgUrl, { responseType: 'arraybuffer' });
        let buffer = Buffer.from(response.data);
        bgImage = await loadImage(buffer);
    } catch (error) {
        console.error('❌ Gagal mengunduh background:', error);
        return conn.reply(m.chat, '⚠️ Gagal memuat background. Coba lagi nanti.', m);
    }

    // Gambar Background
    ctx.drawImage(bgImage, 0, 0, width, height);

    // Judul Sertifikat
    ctx.font = 'bold 70px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('', width / 2, 130);

    // Subjudul
    ctx.font = 'italic 40px Arial';
    ctx.fillText('', width / 2, 230);

    // Nama Penerima
    ctx.font = 'bold 100px Arial';
    ctx.fillStyle = 'blue';
    ctx.fillText(name.toUpperCase(), width / 2, 340);

    // Deskripsi
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    let description = 'Selamat Kamu juara Bertahan FFLC.';
    let descY = 440;
    wrapText(ctx, description, width / 2, descY, width - 100, 40);

    // Tanda Tangan
    ctx.font = 'italic 40px Arial';
    ctx.fillText('_________________', width / 2, 600);
    ctx.fillText('ubed Bot', width / 2, 650);

    // Simpan ke File
    let outputPath = `./sertifikat_${Date.now()}.png`;
    fs.writeFileSync(outputPath, canvas.toBuffer());

    // Kirim Gambar
    conn.sendMessage(m.chat, { image: fs.readFileSync(outputPath), caption: `🎖 Sertifikat untuk *${name}*` }, { quoted: m });

    // Hapus File Setelah Dikirim
    fs.unlinkSync(outputPath);
};

// 🔹 Fungsi untuk menyesuaikan teks agar tidak terpotong
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    let words = text.split(' ');
    let line = '';
    let lines = [];

    for (let word of words) {
        let testLine = line + word + ' ';
        let testWidth = ctx.measureText(testLine).width;

        if (testWidth > maxWidth && line !== '') {
            lines.push(line);
            line = word + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    let totalHeight = lines.length * lineHeight;
    let startY = y - totalHeight / 2; // Posisi tengah vertikal

    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], x, startY + i * lineHeight);
    }
}

// 🔹 Perintah untuk memanggil sertifikat
handler.command = /^sertifikat2$/i;
handler.help = ['sertifikat <nama>'];
handler.tags = ['tools'];

export default handler;