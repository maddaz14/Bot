const fs = require('fs');
const { promises: fsPromises } = fs;
const path = require('path');
const { join } = path;

let handler = async (m, { conn }) => {
  try {
    // --- Baca package.json
    const packageJsonPath = path.join(__dirname, '../../package.json');
    let packageJsonObj = { name: 'Unknown', version: 'Unknown', description: 'Unknown' };

    try {
      const packageJsonData = await fsPromises.readFile(packageJsonPath, 'utf-8');
      packageJsonObj = JSON.parse(packageJsonData);
    } catch (err) {
      console.error('[WARN] Tidak bisa membaca package.json:', err.message);
    }

    // --- Siapkan data global fallback
    const botName = global.botname || packageJsonObj.name;
    const botVersion = global.version || packageJsonObj.version;
    const totalPlugins = global.plugins ? Object.keys(global.plugins).length : 0;
    const foto = global.foto || 'https://i.ibb.co/8zsrjV9/default.jpg';

    // --- Susun pesan
    const versionMessage = `*I N F O R M A T I O N*\n\n` +
      `┌  ◦ *ɴᴀᴍᴇ*: ${botName}\n` +
      `│  ◦ *ᴠᴇʀѕɪᴏɴ*: ${botVersion}\n` +
      `└  ◦ *ᴛᴏᴛᴀʟ ᴘʟᴜɢɪɴѕ*: ${totalPlugins} Plugins\n`;

    // --- Kirim pesan
    await conn.sendMessage(m.chat, {
      text: versionMessage,
      contextInfo: {
        externalAdReply: {
          title: 'ʙ ᴏ ᴛ ѕ ᴄ ʀ ɪ ᴘ ᴛ - ɪ ɴ ꜰ ᴏ ʀ ᴍ ᴀ ᴛ ɪ ᴏ ɴ',
          body: botName,
          thumbnailUrl: foto,
          sourceUrl: foto,
          renderLargerThumbnail: true,
          mediaType: 1,
        },
      },
    }, { quoted: m });
  } catch (err) {
    console.error('[ERROR]', err);
    await m.reply(`❌ Gagal menampilkan informasi bot.\n\n${err.message}`);
  }
};

handler.help = ['version'];
handler.tags = ['info'];
handler.command = /^(version|ver)$/i;

module.exports = handler;