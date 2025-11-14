import fetch from 'node-fetch';
import { createCanvas, loadImage } from 'canvas';

let handler = async (m, { text, usedPrefix, command, conn }) => {
    let lat, lon, lokasi;

    // Jika user mengirim lokasi langsung (Live Location)
    if (m.message?.locationMessage) {
        lat = m.message.locationMessage.degreesLatitude;
        lon = m.message.locationMessage.degreesLongitude;
        lokasi = 'Lokasi Anda';
    } else if (text) {
        // Jika user mengirim nama lokasi
        let res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}`);
        let json = await res.json();
        if (!json.length) throw '⚠️ Lokasi tidak ditemukan!';
        lat = json[0].lat;
        lon = json[0].lon;
        lokasi = json[0].display_name;
    } else {
        throw `📍 Kirim lokasi atau gunakan perintah:\n${usedPrefix + command} <nama kota>`;
    }

    // Mengambil gambar dari Yandex Maps dengan mode satelit
    let mapUrl = `https://static-maps.yandex.ru/1.x/?lang=en-US&ll=${lon},${lat}&z=15&l=sat&size=650,450&pt=${lon},${lat},pm2rdm`;

    let canvas = createCanvas(650, 450);
    let ctx = canvas.getContext('2d');

    let img = await loadImage(mapUrl);
    ctx.drawImage(img, 0, 0, 650, 450);

    // Hapus Watermark Yandex
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 400, 650, 50); // Menutupi watermark

    // Tambahkan teks "ubed Bot"
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('ubed Bot', 10, 430);

    // Tambahkan Nama Lokasi
    ctx.fillStyle = 'white';
    ctx.font = '22px Arial';
    ctx.fillText(`📍 ${lokasi}`, 10, 30);

    let buffer = canvas.toBuffer();

    conn.sendMessage(m.chat, { image: buffer, caption: `🛰️ *Minimap Satelit*\n📍 ${lokasi}\n🌍 Koordinat: ${lat}, ${lon}` }, { quoted: m });
};

handler.help = ['lokask <lokasi>'];
handler.tags = ['tools'];
handler.command = /^lokasi$/i;

export default handler;