import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const _fs = fs.promises;

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) {
        throw `
Penggunaan: ${usedPrefix}${command} <nama_file>
Contoh: ${usedPrefix}dt myplugin
`.trim();
    }

    let filename = text.trim();
    // Tambahkan ekstensi default jika tidak ada
    if (!filename.match(/\.(js|cjs|mjs)$/)) {
        filename += '.js';
    }

    const baseDir = path.resolve(process.cwd());
    // -- JALUR FOLDER YANG SUDAH DIPERBAIKI --
    const targetDir = path.join(baseDir, 'ubed_telegram', 'command', 'plugins_tele');
    const targetPath = path.join(targetDir, filename);

    try {
        if (!fs.existsSync(targetPath)) {
            throw `❌ File *${filename}* tidak ditemukan di folder *plugins_tele*.`;
        }

        await _fs.unlink(targetPath);

        m.reply(`🗑️ Plugin *${filename}* berhasil dihapus dari *plugins_tele*.`);
        console.log(chalk.yellow(`[HAPUS PLUGIN TELE] '${filename}' dihapus dari plugins_tele.`));
    } catch (e) {
        console.error(chalk.red(`[ERROR HAPUS PLUGIN TELE] ${filename}:`), e);
        throw `❌ Gagal menghapus file: ${e.message}`;
    }
};

handler.command = /^dt$/i;
handler.rowner = true;

export default handler;
