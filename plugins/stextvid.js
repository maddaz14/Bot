import fs from 'fs';
import { createCanvas } from 'canvas';
import { exec } from 'child_process';

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('⚠️ Masukkan teks untuk dijadikan stiker!');

    let outputPath = './animated_text.webp';
    let frameDir = './frames';
    if (!fs.existsSync(frameDir)) fs.mkdirSync(frameDir); // Buat folder jika belum ada

    let frames = await generateFrames(text, 512, 512);
    let frameFiles = [];

    // Simpan setiap frame sebagai PNG
    for (let i = 0; i < frames.length; i++) {
        let framePath = `${frameDir}/frame_${i}.png`;
        fs.writeFileSync(framePath, frames[i]);
        frameFiles.push(framePath);
    }

    // Konversi frame menjadi animasi WebP
    let ffmpegCommand = `ffmpeg -y -framerate 1 -i ${frameDir}/frame_%d.png -vf "scale=512:512:force_original_aspect_ratio=decrease" -c:v libwebp -loop 0 -q:v 80 -preset default ${outputPath}`;
    exec(ffmpegCommand, async (err) => {
        if (err) return m.reply('⚠️ Gagal membuat stiker animasi!');
        
        conn.sendMessage(m.chat, { sticker: fs.readFileSync(outputPath) }, { quoted: m });

        // Hapus file sementara
        frameFiles.forEach(f => fs.unlinkSync(f));
        fs.unlinkSync(outputPath);
    });
};

// 🔹 Fungsi untuk membuat frame animasi dengan teks yang rapi
async function generateFrames(text, width, height) {
    let frames = [];
    let words = text.split(' ');
    let currentText = '';

    for (let i = 0; i < words.length; i++) {
        currentText += words[i] + ' ';
        let canvas = createCanvas(width, height);
        let ctx = canvas.getContext('2d');

        // 🔹 Background hitam
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // 🔹 Set font dan warna teks
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 🔹 Word wrapping otomatis agar teks tetap di dalam batas gambar
        let lines = wrapText(ctx, currentText.trim(), width - 40, 50);
        let startY = height / 2 - (lines.length * 30) / 2; // Agar teks tetap di tengah

        // 🔹 Tampilkan teks dalam beberapa baris
        for (let j = 0; j < lines.length; j++) {
            ctx.fillText(lines[j], width / 2, startY + j * 50);
        }

        frames.push(canvas.toBuffer());

        // 🔹 Delay 1 detik sebelum menambahkan frame berikutnya
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return frames;
}

// 🔹 Fungsi untuk membungkus teks agar tetap rapi di dalam gambar
function wrapText(ctx, text, maxWidth, fontSize) {
    ctx.font = `bold ${fontSize}px Arial`;
    let words = text.split(' ');
    let lines = [];
    let line = '';

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
    return lines;
}

handler.command = /^stextvid$/i;

export default handler;