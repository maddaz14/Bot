import fs from 'fs';
import { createCanvas } from 'canvas';
import { exec } from 'child_process';

let handler = async (m, { conn, text, command }) => {
    if (!text) return m.reply('⚠️ Masukkan teks untuk dijadikan stiker!');

    let imagePath = './temp_text.png';
    let stickerPath = './temp_text.webp';

    // Mapping warna berdasarkan command
    let colors = {
        stext3: { bg: '#FF0000', text: '#000000' }, // Merah (Text Hitam)
        stext4: { bg: '#0000FF', text: '#000000' }, // Biru (Text Hitam)
        stext5: { bg: '#008000', text: '#000000' }, // Hijau (Text Hitam)
        stext6: { bg: '#FFC0CB', text: '#000000' }, // Pink (Text Hitam)
        stext7: { bg: '#8B4513', text: '#FFFFFF' }, // Coklat (Text Putih)
        stext8: { bg: '#808080', text: '#FFFFFF' }, // Abu-abu (Text Putih)
        stext9: { bg: '#800080', text: '#000000' }, // Ungu (Text Hitam)
        stext10: { bg: '#FFFF00', text: '#000000' } // Kuning (Text Hitam)
    };

    let { bg, text: textColor } = colors[command] || { bg: '#FFFFFF', text: '#000000' };

    // Buat Canvas
    let canvas = createCanvas(512, 512);
    let ctx = canvas.getContext('2d');

    // Background warna sesuai command
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gaya teks
    ctx.font = 'bold 50px Arial';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Fungsi untuk memecah teks ke dalam beberapa baris
    function wrapText(ctx, text, maxWidth) {
        let words = text.split(' ');
        let lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            let testLine = currentLine + ' ' + words[i];
            let testWidth = ctx.measureText(testLine).width;
            if (testWidth > maxWidth) {
                lines.push(currentLine);
                currentLine = words[i];
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    // Atur posisi teks agar selalu di tengah
    let maxWidth = 480;
    let lineHeight = 60;
    let lines = wrapText(ctx, text, maxWidth);
    let startY = (canvas.height - lines.length * lineHeight) / 2;

    // Gambar teks di canvas
    lines.forEach((line, i) => {
        ctx.fillText(line, canvas.width / 2, startY + i * lineHeight);
    });

    // Simpan gambar
    fs.writeFileSync(imagePath, canvas.toBuffer());

    // Konversi ke WebP (stiker)
    exec(`ffmpeg -i ${imagePath} -vf "scale=512:512:force_original_aspect_ratio=decrease" -c:v libwebp -lossless 1 -q:v 80 -preset default -y ${stickerPath}`, async (err) => {
        if (err) return m.reply('⚠️ Gagal membuat stiker!');
        conn.sendMessage(m.chat, { sticker: fs.readFileSync(stickerPath) }, { quoted: m });

        // Hapus file sementara
        fs.unlinkSync(imagePath);
        fs.unlinkSync(stickerPath);
    });
};

// Daftar perintah dengan warna yang berbeda
handler.command = /^stext3|stext4|stext5|stext6|stext7|stext8|stext9|stext10$/i;

handler.help = [
    "stext3 <teks>", 
    "stext4 <teks>", 
    "stext5 <teks>", 
    "stext6 <teks>", 
    "stext7 <teks>", 
    "stext8 <teks>", 
    "stext9 <teks>", 
    "stext10 <teks>"
];

handler.tags = ["sticker"];

export default handler;