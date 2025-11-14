import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const handler = async (m) => {
  try {
    const pluginsDir = __dirname; // Ambil direktori plugin
    const files = await fs.readdir(pluginsDir);
    const gameCommands = [];

    for (const file of files) {
      if (file.endsWith('.js')) {
        try {
          const modulePath = pathToFileURL(path.join(pluginsDir, file)).href;
          const { default: plugin } = await import(modulePath);

          if (plugin?.tags?.includes('game') && plugin?.command) {
            if (Array.isArray(plugin.command)) {
              gameCommands.push(
                ...plugin.command.map((cmd) => 
                  typeof cmd === 'string'
                    ? cmd
                    : cmd.source.replace(/[\^\/\$]/g, '') // Menghapus ^, (), $, dan /
                )
              );
            } else {
              gameCommands.push(
                typeof plugin.command === 'string'
                  ? plugin.command
                  : plugin.command.source.replace(/[\^\/\$]/g, '') // Menghapus ^, (), $, dan /
              );
            }
          }
        } catch (err) {
          console.error(`❌ Gagal mengimpor plugin ${file}:`, err.message);
        }
      }
    }

    if (gameCommands.length === 0) {
      return m.reply('⚠️ Tidak ada game yang tersedia saat ini.');
    }

    let response = `┏━🎮 *Daftar Game Tersedia* 🎮━┓\n`;
    response += gameCommands.map((cmd, index) => `┃ ${index + 1}. *${cmd.trim()}*`).join('\n');
    response += `\n┗━━━━━━━━━━━━━━━━━━┛\n\n`;
    response += `💡 *Cara Bermain:* Ketik \`.namagame\` untuk mulai bermain!`;

    m.reply(response);
  } catch (error) {
    console.error('❌ Kesalahan dalam membaca daftar game:', error.message);
    m.reply('⚠️ Terjadi kesalahan dalam membaca daftar game.');
  }
};

handler.command = ['gamelist', 'listgame'];
handler.help = ['gamelist'];
handler.tags = ['game'];

export default handler;