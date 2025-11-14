//FAKE DISCORD
//SUMBER SCRAPER: https://whatsapp.com/channel/0029Vaf07jKCBtxAsekFFk3i/3939

import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMP_DIR = path.join(__dirname, 'temp_discord_messages');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

async function saveBufferToTempFile(buffer, filename, mimeType = 'image/png') {
    const ext = mimeType.split('/')[1] || 'png';
    const filePath = path.join(TEMP_DIR, `${filename}.${ext}`);
    await fs.promises.writeFile(filePath, buffer);
    return filePath;
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

async function generateMessageDiscord({ username, avatar = "https://cdn.discordapp.com/embed/avatars/0.png", message }) {
  
  if (message.length > 298) {
    throw new Error('Pesan terlalu panjang (maks. 298 karakter)');
  }
  
  if (!message) {
    throw new Error('Tidak memiliki message.');
  }
  
  if (!username) {
    throw new Error('Tidak memiliki username.');
  }

  const width = 512;
  const height = 512;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const profileUrl = avatar;
  const now = new Date();

  const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const time = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const timestamp = `${date} ${time}`;

  ctx.fillStyle = '#313338';
  ctx.fillRect(0, 0, width, height);

  try {
    const avatarImg = await loadImage(profileUrl);

    const avatarSize = 96;
    const contentPaddingLeft = 30;
    const contentPaddingRight = 30;
    const avatarMarginRight = 20;
    
    const avatarX = contentPaddingLeft;
    
    ctx.font = '28px sans-serif'; 
    const maxMessageWidth = width - (avatarX + avatarSize + avatarMarginRight) - contentPaddingRight;
    const messageLines = wrapText(ctx, message, maxMessageWidth);
    const lineHeight = 36;
    const messageHeight = messageLines.length * lineHeight;

    const contentHeight = Math.max(avatarSize, 36 + messageHeight);
    let avatarY = (height - contentHeight) / 2;

    const minTopPadding = 20;
    if (avatarY < minTopPadding) avatarY = minTopPadding;

    ctx.save();
    ctx.beginPath();
    ctx.arc(
      avatarX + avatarSize / 2,
      avatarY + avatarSize / 2,
      avatarSize / 2,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();

    const textX = avatarX + avatarSize + avatarMarginRight;
    const usernameY = avatarY + 36;

    ctx.font = 'bold 32px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(username, textX, usernameY);

    const usernameWidth = ctx.measureText(username).width;

    ctx.font = '22px sans-serif';
    ctx.fillStyle = '#b5bac1';
    ctx.fillText(timestamp, textX + usernameWidth + 20, usernameY);

    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#dcddde';
    messageLines.forEach((line, i) => {
      ctx.fillText(line, textX, usernameY + 44 + i * lineHeight);
    });

    return canvas.toBuffer('image/png');
  } catch (err) {
    console.error('Error generating Discord message image:', err.message);
    throw new Error('Gagal membuat gambar pesan Discord: ' + err.message);
  }
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const fullQuery = args.join(' ').trim();
  let username = '';
  let message = '';
  let avatarUrl = 'https://cdn.discordapp.com/embed/avatars/0.png';
  let tempAvatarPath = null;
  let tempOutputPath = null;

  const parts = fullQuery.split(' ');
  if (parts.length < 2) {
    return m.reply(
      `*Buat Pesan Discord Palsu:*\n\n` +
      `\`${usedPrefix + command} [username] [pesan Anda] [opsional: URL avatar]\`\n` +
      `Atau balas *gambar* dengan \`${usedPrefix + command} [username] [pesan Anda]\`\n\n` +
      `*Contoh:*\n` +
      `\`${usedPrefix + command} BotGanteng Halo semua! Apa kabar?\`\n` +
      `\`${usedPrefix + command} UserTest ini pesanku https://example.com/myavatar.jpg\`\n` +
      `Balas gambar dengan \`${usedPrefix + command} AdminBot Selamat datang!\``
    );
  }

  username = parts[0];
  message = parts.slice(1).join(' ');

  const urlRegex = /(https?:\/\/[^\s]+?\.(?:png|jpe?g|gif|webp))$/i;
  const urlMatch = message.match(urlRegex);
  if (urlMatch) {
      avatarUrl = urlMatch[1];
      message = message.replace(urlRegex, '').trim();
  }

  const quoted = m.quoted ? m.quoted : m;
  const mime = (quoted.msg || quoted).mimetype || '';
  if (/image/.test(mime) && quoted.download) {
      const buffer = await quoted.download();
      const filename = `avatar_${Date.now()}.${mime.split('/')[1] || 'jpg'}`;
      tempAvatarPath = await saveBufferToTempFile(buffer, filename, mime);
      avatarUrl = tempAvatarPath;
  }

  if (!username || !message) {
      return m.reply("Username dan pesan tidak boleh kosong.");
  }
  if (message.length > 298) {
      return m.reply("Pesan terlalu panjang (maks. 298 karakter).");
  }

  await conn.sendMessage(m.chat, { react: { text: `🕒`, key: m.key } });

  try {
    const resultBuffer = await generateMessageDiscord({
        username,
        avatar: avatarUrl,
        message
    });

    tempOutputPath = await saveBufferToTempFile(resultBuffer, `discord_msg_${Date.now()}`, 'image/png');

    await conn.sendFile(
        m.chat,
        tempOutputPath,
        'discord_message.png',
        null,
        m,
        false,
        { mimetype: 'image/png', asSticker: false }
    );

    await conn.sendMessage(m.chat, { react: { text: `✅`, key: m.key } });

  } catch (e) {
    console.error("Error Discord Message Handler:", e);
    await conn.sendMessage(m.chat, { react: { text: `❌`, key: m.key } });
    m.reply(`Maaf, terjadi kesalahan saat membuat pesan Discord: ${e.message}.`);
  } finally {
    if (tempAvatarPath && fs.existsSync(tempAvatarPath)) {
      try {
        fs.unlinkSync(tempAvatarPath);
      } catch (unlinkError) {
        console.error(`[DiscordMsg] Gagal menghapus file avatar sementara ${tempAvatarPath}: ${unlinkError.message}`);
      }
    }
    if (tempOutputPath && fs.existsSync(tempOutputPath)) {
      try {
        fs.unlinkSync(tempOutputPath);
      } catch (unlinkError) {
        console.error(`[DiscordMsg] Gagal menghapus file output sementara ${tempOutputPath}: ${unlinkError.message}`);
      }
    }
  }
};

handler.help = ['fakediscord <username> <message> [reply_image/url]'];
handler.tags = ['maker'];
handler.command = /^(fakediscord|discordmsg|discordmessage)$/i;
handler.limit = true;
handler.premium = false;
handler.register = false;

export default handler;