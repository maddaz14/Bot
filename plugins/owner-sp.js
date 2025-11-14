import fs from 'fs';
import syntaxError from 'syntax-error';
import path from 'path';
import util from 'util';
import chalk from 'chalk';

const _fs = fs.promises;

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) {
        throw `
Penggunaan: ${usedPrefix}${command} <nama_file>
Contoh: ${usedPrefix}sp myplugin
`.trim();
    }

    if (!m.quoted || !m.quoted.text) {
        throw `Balas (reply) kode yang ingin Anda simpan!`;
    }

    const fileContent = m.quoted.text;
    let filename = text.trim();
    let fileExtension = '';

    const isESM = /import\s+.*?from\s+['"].*?['"]|export\s+(default|const|function|class)/.test(fileContent);
    const isCJS = /require\s*\(\s*['"].*?['"]\s*\)|module\.exports|exports\./.test(fileContent);

    if (isESM && !filename.endsWith('.mjs') && !filename.endsWith('.js')) {
        fileExtension = '.js';
    } else if (isCJS && !filename.endsWith('.cjs') && !filename.endsWith('.js')) {
        fileExtension = '.cjs';
    } else if (!isESM && !isCJS && !filename.match(/\.(js|cjs|mjs)$/)) {
        fileExtension = '.js';
    }

    if (!filename.match(/\.(js|cjs|mjs)$/)) {
        filename += fileExtension;
    }

    const baseDir = path.resolve(process.cwd());
    const targetPath = path.join(baseDir, 'plugins', filename);

    try {
        syntaxError(fileContent, filename, {
            sourceType: isESM ? 'module' : 'script',
            allowReturnOutsideFunction: true,
            allowAwaitOutsideFunction: true
        });
    } catch (e) {
        throw `❌ Syntax Error:\n\n${e.message}`;
    }

    try {
        const dir = path.dirname(targetPath);
        if (!fs.existsSync(dir)) {
            await _fs.mkdir(dir, { recursive: true });
        }

        await _fs.writeFile(targetPath, fileContent);
        m.reply(
            `✅ Plugin disimpan:\n` +
            `Nama: *${filename}*\n` +
            `Lokasi: *plugins/${filename}*\n` +
            `Tipe: *${isESM ? 'ES Module' : isCJS ? 'CommonJS' : 'Unknown'}*`
        );
        console.log(chalk.green(`[SAVE PLUGIN] '${filename}' disimpan.`));
    } catch (e) {
        console.error(chalk.red(`[SAVE PLUGIN ERROR] ${filename}:`), e);
        throw `Gagal menyimpan file: ${e.message}`;
    }
};

handler.command = /^(sp|saveplugin)$/i;
handler.rowner = true;

export default handler;