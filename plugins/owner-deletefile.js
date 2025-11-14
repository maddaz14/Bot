import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const _fs = fs.promises;

// Lokasi file plugin
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) {
        throw `
📂 *Hapus Plugin*

Penggunaan: 
${usedPrefix}${command} <nama_file>

Contoh: 
${usedPrefix}df myplugin

_(Tidak perlu menulis .js di belakangnya)_
`.trim();
    }

    let filename = text.trim();

    // keamanan biar gak bisa hapus di luar folder
    if (filename.includes('..') || path.isAbsolute(filename)) {
        throw '❌ Nama file tidak valid. Hanya bisa hapus file di folder plugins.';
    }

    let targetPath;
    let resolvedFilename = filename;

    // Deteksi ekstensi otomatis
    if (!filename.match(/\.(js|cjs|mjs)$/)) {
        let pathWithJs = path.join(__dirname, `${filename}.js`);
        if (fs.existsSync(pathWithJs)) {
            targetPath = pathWithJs;
            resolvedFilename = `${filename}.js`;
        } else {
            let pathWithCjs = path.join(__dirname, `${filename}.cjs`);
            if (fs.existsSync(pathWithCjs)) {
                targetPath = pathWithCjs;
                resolvedFilename = `${filename}.cjs`;
            } else {
                targetPath = path.join(__dirname, filename);
            }
        }
    } else {
        targetPath = path.join(__dirname, filename);
    }

    try {
        if (!fs.existsSync(targetPath)) {
            // Kalau file tidak ketemu → kasih suggestion list file
            let files = fs.readdirSync(__dirname).filter(f => f.endsWith('.js') || f.endsWith('.cjs') || f.endsWith('.mjs'));
            throw `
❌ File tidak ditemukan: *${resolvedFilename}*

📂 Daftar file yang tersedia di *plugins*:
${files.map(f => `- ${f}`).join('\n')}
`.trim();
        }

        await _fs.unlink(targetPath);
        m.reply(`✅ File berhasil dihapus: *${resolvedFilename}*`);
        console.log(chalk.green(`[DELETE PLUGIN] File '${resolvedFilename}' berhasil dihapus.`));
    } catch (e) {
        console.error(chalk.red(`[DELETE PLUGIN ERROR] ${resolvedFilename}:`), e);
        throw `⚠️ Gagal menghapus file: ${e.message}`;
    }
};

handler.command = /^(df|deletefile)$/i;
handler.rowner = true;

export default handler;