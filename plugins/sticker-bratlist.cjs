// Dibuat oleh U
//                  B
//                      E
//                         D - Dilarang keras menyalin tanpa izin!
// --- Kode Plugin Dimulai di sini ---

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const sharp = require('sharp');

const fkontak = {
  key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
  message: { conversation: `🌷 Stiker Brat ${global.namebot || 'Bot'} ✨` }
};

async function BratGenerator(teks, bgColor, textColor) {
  const width = 512, height = 512, margin = 20;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  let fontSize = 80;
  ctx.font = `${fontSize}px 'Arial Narrow', sans-serif`;
  ctx.fillStyle = textColor;
  ctx.textBaseline = 'top';

  let x = margin;
  let y = margin;
  const lineHeight = fontSize * 1.4;

  const chars = Array.from(teks.trim());

  for (let char of chars) {
    const code = Array.from(char).map(c => c.codePointAt(0).toString(16)).join('-');
    const emojiPath = path.join(__dirname, '../emoji', `${code}.png`);

    if (fs.existsSync(emojiPath)) {
      const img = await loadImage(emojiPath);
      const size = fontSize + 20;
      if (x + size > width - margin) {
        x = margin;
        y += lineHeight;
      }
      ctx.drawImage(img, x, y, size, size);
      x += size;
    } else {
      const charWidth = ctx.measureText(char).width;
      if (x + charWidth > width - margin) {
        x = margin;
        y += lineHeight;
      }
      ctx.fillText(char, x, y);
      x += charWidth;
    }
  }

  const buffer = canvas.toBuffer('image/png');
  return await sharp(buffer).webp({ quality: 90 }).toBuffer();
}

const colorsConfig = {
  brat1: { bg: '#FF0000', text: '#FFFFFF', name: 'Merah Putih' },
  brat2: { bg: '#00FF00', text: '#000000', name: 'Hijau Cerah Hitam' },
  brat3: { bg: '#0000FF', text: '#FFFFFF', name: 'Biru Putih' },
  brat4: { bg: '#FFFF00', text: '#000000', name: 'Kuning Hitam' },
  brat5: { bg: '#800080', text: '#FFFFFF', name: 'Ungu Putih' },
  brat6: { bg: '#FF0000', text: '#FFFFFF', name: 'Merah' },
  brat7: { bg: '#0000FF', text: '#FFFFFF', name: 'Biru' },
  brat8: { bg: '#008000', text: '#000000', name: 'Hijau' },
  brat9: { bg: '#800080', text: '#FFFFFF', name: 'Ungu' },
  brat10: { bg: '#FFFF00', text: '#000000', name: 'Kuning' },
  brat11: { bg: '#FFA500', text: '#000000', name: 'Oranye' },
  brat12: { bg: '#FFC0CB', text: '#000000', name: 'Pink' },
  brat13: { bg: '#8B4513', text: '#FFFFFF', name: 'Coklat' },
  brat14: { bg: '#808080', text: '#FFFFFF', name: 'Abu-abu' },
  brat15: { bg: '#00FFFF', text: '#000000', name: 'Cyan' },
  brat16: { bg: '#4B0082', text: '#FFFFFF', name: 'Indigo' },
  brat17: { bg: '#FFD700', text: '#000000', name: 'Emas' },
  brat18: { bg: '#ADFF2F', text: '#000000', name: 'Hijau Lemon' },
  brat19: { bg: '#E6E6FA', text: '#000000', name: 'Lavender' },
  brat20: { bg: '#8B0000', text: '#FFFFFF', name: 'Merah Gelap' },
  brat21: { bg: '#4682B4', text: '#FFFFFF', name: 'Biru Baja' },
  brat22: { bg: '#654321', text: '#FFFFFF', name: 'Coklat Tua' },
  brat23: { bg: '#FF6347', text: '#000000', name: 'Tomat' },
  brat24: { bg: '#2E8B57', text: '#FFFFFF', name: 'Sea Green' },
  brat25: { bg: '#B22222', text: '#FFFFFF', name: 'Merah Bata' },
  brat26: { bg: '#FF0000', text: '#000000', name: 'Merah Hitam' },
  brat27: { bg: '#0000FF', text: '#000000', name: 'Biru Hitam' },
  brat28: { bg: '#008000', text: '#FFFFFF', name: 'Hijau Putih' },
  brat29: { bg: '#800080', text: '#FFFFFF', name: 'Ungu Putih' },
  brat30: { bg: '#FFFF00', text: '#000000', name: 'Kuning Hitam' },
  brat31: { bg: '#000000', text: '#FFFFFF', name: 'Hitam Putih' },
  brat32: { bg: '#FFFFFF', text: '#FF00FF', name: 'Putih Magenta' },
  brat33: { bg: '#FFFFFF', text: '#000000', name: 'Putih Hitam' },
  brat34: { bg: '#000000', text: '#FF69B4', name: 'Hitam Pink' },
  brat35: { bg: 'transparent', text: '#FFFFFF', name: 'Transparan Putih' },
  brat36: { bg: 'transparent', text: '#000000', name: 'Transparan Hitam' },
  brat37: { bg: 'transparent', text: '#FF0000', name: 'Transparan Merah' },
  brat38: { bg: 'transparent', text: '#FFFF00', name: 'Transparan Kuning' },
  brat39: { bg: 'transparent', text: '#0000FF', name: 'Transparan Biru' },
  brat40: { bg: 'transparent', text: '#00FF00', name: 'Transparan Hijau' },
};

let handler = async (m, { text, conn, command, usedPrefix }) => {
  if (command === 'bratlist') {
    let listText = `🌷 *DAFTAR WARNA STIKER BRAT!* 🌷\n\n✨ Pilih kombinasi warna favoritmu:\n\n`;
    for (let i = 1; i <= 40; i++) {
      let cmd = `brat${i}`;
      if (colorsConfig[cmd]) {
        listText += `• *${usedPrefix}${cmd}*: ${colorsConfig[cmd].name}\n`;
      }
    }
    listText += `\nContoh: *${usedPrefix}brat1 Halo 🥰🍎*\n\n> © ${global.namebot || 'Bot'} 2025 ✨`;
    return conn.reply(m.chat, listText.trim(), m, { quoted: fkontak });
  }

  const colorConfig = colorsConfig[command];
  if (!colorConfig) return conn.reply(m.chat, `❌ Perintah tidak valid. Ketik *${usedPrefix}bratlist* untuk melihat semua warna.`, m, { quoted: fkontak });
  if (!text) return conn.reply(m.chat, `🌸 Kamu pilih warna *${colorConfig.name}*.\nSekarang kirim teks untuk stikernya ya!\n\nContoh: *${usedPrefix}${command} Hai 🥰*`, m, { quoted: fkontak });

  await conn.sendMessage(m.chat, { react: { text: '🎨', key: m.key } });
  await conn.reply(m.chat, `🌸 Sedang membuat stiker Bratmu... ✨`, m, { quoted: fkontak });

  try {
    const webpBuffer = await BratGenerator(text, colorConfig.bg, colorConfig.text);
    await conn.sendMessage(m.chat, { sticker: webpBuffer }, { quoted: fkontak });
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.reply(m.chat, `❌ Terjadi kesalahan saat membuat stiker Brat.\n\n*Detail:* ${e.message}`, m, { quoted: fkontak });
  }
};

handler.command = [/^brat(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40)$/i, /^bratlist$/i];
handler.tags = ['sticker'];
handler.help = ['bratlist', 'brat<nomor> <teks>'];
handler.register = true;
handler.limit = true;

module.exports = handler;