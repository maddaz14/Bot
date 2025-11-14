import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const handler = async (m) => {
  try {
    const pluginsDir = __dirname; // Ambil direktori plugin
    const files = await fs.readdir(pluginsDir);
    const rpgCommands = [];

    for (const file of files) {
      if (file.endsWith('.js')) {
        try {
          const modulePath = pathToFileURL(path.join(pluginsDir, file)).href;
          const { default: plugin } = await import(modulePath);

          if (plugin?.tags?.includes('rpg') && plugin?.help) {
            if (Array.isArray(plugin.help)) {
              rpgCommands.push(...plugin.help);
            } else {
              rpgCommands.push(plugin.help);
            }
          }
        } catch (err) {
          console.error(`❌ Gagal mengimpor plugin ${file}:`, err.message);
        }
      }
    }

    if (rpgCommands.length === 0) {
      return m.reply('⚠️ Tidak ada perintah RPG yang tersedia saat ini.');
    }

    let response = `┏━⚔️ *Daftar RPG* ⚔️━┓\n`;
    response += rpgCommands.map((cmd, index) => `┃ ${index + 1}. *${cmd.trim()}*`).join('\n');
    response += `\n┗━━━━━━━━━━━━━━━━━━┛\n\n`;
    response += `📌 *Gunakan:* Ketik \`.nama_perintah\` untuk memainkan game RPG!`;

    m.reply(response);
  } catch (error) {
    console.error('❌ Kesalahan dalam membaca daftar RPG:', error.message);
    m.reply('⚠️ Terjadi kesalahan dalam membaca daftar RPG.');
  }
};

handler.command = ['rpglist'];
handler.help = ['rpglist'];
handler.tags = ['rpg'];

export default handler;