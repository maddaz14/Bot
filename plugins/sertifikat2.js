import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import axios from 'axios';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!m.quoted || !/image/.test(m.quoted.mimetype)) {
        return conn.reply(m.chat, `⚠️ Kirim gambar lalu balas gambar tersebut dengan perintah:\n\n*${usedPrefix + command} Nama Tim*`, m);
    }

    let name = args.join(' ').trim(); // Nama tim
    if (!name) return conn.reply(m.chat, `⚠️ Masukkan nama tim!\n\nContoh: *${usedPrefix + command} Tim Garuda*`, m);

    let width = 1280;
    let height = 720;
    let canvas = createCanvas(width, height);
    let ctx = canvas.getContext('2d');

    // 🔹 Unduh Background dari Catbox
    let bgUrl = 'https://files.catbox.moe/pfj4e2.jpg';
    let bgImage;

    try {
        let response = await axios.get(bgUrl, { responseType: 'arraybuffer' });
        let buffer = Buffer.from(response.data);
        bgImage = await loadImage(buffer);
    } catch (error) {
        console.error('❌ Gagal mengunduh background:', error);
        return conn.reply(m.chat, '⚠️ Gagal memuat background. Coba lagi nanti.', m);
    }

    // 🔹 Unduh Gambar yang Dikirim Pengguna
    let imgPath = `./logo_${Date.now()}.jpg`;
    let buffer = await m.quoted.download();
    fs.writeFileSync(imgPath, buffer);

    let logoImage;

    try {
        logoImage = await loadImage(imgPath);
    } catch (error) {
        console.error('❌ Gagal memuat logo:', error);
        return conn.reply(m.chat, '⚠️ Gagal mengambil gambar. Coba lagi nanti.', m);
    }

    // 🔹 Gambar Background
    ctx.drawImage(bgImage, 0, 0, width, height);

    // 🔹 Gambar Logo (Bulat di Tengah)
    let logoSize = 200; // Ukuran logo
    let logoX = width / 2 - logoSize / 2;
    let logoY = 200;

    ctx.save();
    ctx.beginPath();
    ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
    ctx.restore();

    // 🔹 Judul Sertifikat
    ctx.font = 'bold 70px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('ㅤ', width / 2, 130);

    // 🔹 Subjudul
    ctx.font = 'italic 40px Arial';
    ctx.fillText('ㅤ', width / 2, 180);

    // 🔹 Nama Tim di Bawah Logo
    ctx.font = 'bold 60px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText(name.toUpperCase(), width / 2, logoY + logoSize + 60);

    // 🔹 Deskripsi
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    let description = 'ㅤ';
    let descY = 550;
    wrapText(ctx, description, width / 2, descY, width - 100, 40);

    // 🔹 Tanda Tangan
    ctx.font = 'italic 40px Arial';
    ctx.fillText('ㅤ', width / 2, 650);
    ctx.fillText('ㅤ', width / 2, 700);

    // 🔹 Simpan ke File
    let outputPath = `./sertifikat_${Date.now()}.png`;
    fs.writeFileSync(outputPath, canvas.toBuffer());

    // 🔹 Kirim Gambar
    conn.sendMessage(m.chat, { image: fs.readFileSync(outputPath), caption: `🎖 Sertifikat untuk *${name}*` }, { quoted: m });

    // 🔹 Hapus File Setelah Dikirim
    fs.unlinkSync(outputPath);
    fs.unlinkSync(imgPath);
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
handler.command = /^sertifikatfreefire|stkff|sertifikatff$/i;
handler.help = ['stkff <nama tim>'];
handler.tags = ['tools'];

export default handler;