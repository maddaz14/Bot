import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

let handler = async (m, { conn, participants }) => {
    let user = global.db.data.users[m.sender];
    if (!user.isMarried || !user.pasangan)
        return m.reply('⚠️ Kamu harus menikah terlebih dahulu untuk memiliki kartu keluarga!');
    
    let pasangan = global.db.data.users[user.pasangan];
    let anakList = user.anak || [];
    let nomorKK = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
    let nikKepala = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
    let nikPasangan = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
    let tanggal = new Date().toISOString().split('T')[0];

    const canvas = createCanvas(1000, 700);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 30px Arial';
    ctx.fillText('KARTU KELUARGA', 350, 50);

    ctx.font = 'bold 25px Arial';
    ctx.fillText(`No. ${nomorKK}`, 350, 85);

    ctx.font = '18px Arial';
    ctx.fillText(`Nama Kepala Keluarga: ${m.pushName}`, 50, 120);
    ctx.fillText(`NIK: ${nikKepala}`, 50, 150);
    ctx.fillText(`Nama Pasangan: ${conn.getName(user.pasangan)}`, 50, 180);
    ctx.fillText(`NIK: ${nikPasangan}`, 50, 210);
    
    ctx.beginPath();
    ctx.moveTo(30, 240);
    ctx.lineTo(970, 240);
    ctx.stroke();

    ctx.font = 'bold 18px Arial';
    ctx.fillText('Daftar Anggota Keluarga:', 50, 270);
    ctx.fillText('Nama', 50, 300);
    ctx.fillText('NIK', 300, 300);
    ctx.fillText('Hubungan', 600, 300);
    
    let posY = 330;
    ctx.font = '16px Arial';
    ctx.fillText(m.pushName, 50, posY);
    ctx.fillText(nikKepala, 300, posY);
    ctx.fillText('Kepala Keluarga', 600, posY);
    
    posY += 30;
    ctx.fillText(conn.getName(user.pasangan), 50, posY);
    ctx.fillText(nikPasangan, 300, posY);
    ctx.fillText('Istri/Suami', 600, posY);
    
    anakList.forEach((anak, i) => {
        posY += 30;
        let nikAnak = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
        ctx.fillText(conn.getName(anak), 50, posY);
        ctx.fillText(nikAnak, 300, posY);
        ctx.fillText('Anak', 600, posY);
    });
    
    ctx.beginPath();
    ctx.moveTo(30, posY + 20);
    ctx.lineTo(970, posY + 20);
    ctx.stroke();

    ctx.font = 'bold 16px Arial';
    ctx.fillText(`Dikeluarkan tanggal: ${tanggal}`, 50, posY + 50);
    ctx.fillText('Kepala Keluarga', 50, posY + 100);
    ctx.fillText('ubed (Owner)', 750, posY + 100);
    
    let buffer = canvas.toBuffer('image/png');
    let filePath = `./tmp/kartu_keluarga_${m.sender}.png`;
    fs.writeFileSync(filePath, buffer);
    
    await conn.sendMessage(m.chat, { image: fs.readFileSync(filePath), caption: 'Berikut adalah kartu keluarga Anda!' });
}

handler.help = ['kartu keluarga'];
handler.tags = ['rpg'];
handler.command = /^(kartukeluarga|kk)$/i;

export default handler;