import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const _fs = fs.promises;

// Mendapatkan jalur absolut ke folder plugins
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) {
        throw `
Penggunaan: ${usedPrefix}${command} <nama_file>
Contoh: ${usedPrefix}df myplugin
(Tidak perlu menulis .js di belakangnya)
`.trim();
    }

    let filename = text.trim();

    // Pencegahan keamanan: Pastikan file yang dihapus tidak di luar folder plugins
    if (filename.includes('..') || path.isAbsolute(filename)) {
        throw '❌ Nama file tidak valid. Hanya izinkan menghapus file di dalam folder plugins.';
    }

    // --- LOGIKA BARU UNTUK MENDETEKSI EKSTENSI ---
    let targetPath;
    let resolvedFilename = filename;

    // Cek apakah nama file sudah memiliki ekstensi
    if (!filename.match(/\.(js|cjs|mjs)$/)) {
        // Jika tidak ada ekstensi, coba tambahkan .js
        let pathWithJs = path.join(__dirname, `${filename}.js`);
        if (fs.existsSync(pathWithJs)) {
            targetPath = pathWithJs;
            resolvedFilename = `${filename}.js`;
        } else {
            // Jika .js tidak ada, coba tambahkan .cjs
            let pathWithCjs = path.join(__dirname, `${filename}.cjs`);
            if (fs.existsSync(pathWithCjs)) {
                targetPath = pathWithCjs;
                resolvedFilename = `${filename}.cjs`;
            } else {
                // Jika tidak ada yang cocok, gunakan nama asli dan biarkan error
                targetPath = path.join(__dirname, filename);
            }
        }
    } else {
        // Jika sudah ada ekstensi, gunakan nama asli
        targetPath = path.join(__dirname, filename);
    }
    // --- AKHIR LOGIKA BARU ---

    try {
        if (!fs.existsSync(targetPath)) {
            throw `File tidak ditemukan: *${resolvedFilename}*`;
        }

        await _fs.unlink(targetPath);
        m.reply(`✅ File berhasil dihapus: *${resolvedFilename}*`);
        console.log(chalk.green(`[DELETE PLUGIN] File '${resolvedFilename}' berhasil dihapus.`));
    } catch (e) {
        console.error(chalk.red(`[DELETE PLUGIN ERROR] ${resolvedFilename}:`), e);
        throw `Gagal menghapus file: ${e.message}`;
    }
};

handler.command = /^(df|deletefile)$/i;
handler.rowner = true;

export default handler;