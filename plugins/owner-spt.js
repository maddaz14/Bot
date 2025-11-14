import fs from 'fs';
import syntaxError from 'syntax-error';
import path from 'path';
import chalk from 'chalk';

const _fs = fs.promises;

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) {
        throw `
Penggunaan: ${usedPrefix}${command} <nama_file>
Contoh: ${usedPrefix}${command} myplugin
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
    } else if (!filename.match(/\.(js|cjs|mjs)$/)) {
        fileExtension = '.js';
    }

    if (!filename.match(/\.(js|cjs|mjs)$/)) {
        filename += fileExtension;
    }

    const baseDir = path.resolve(process.cwd());
    const targetDir = path.join(baseDir, 'plugins_tele');
    const targetPath = path.join(targetDir, filename);

    try {
        syntaxError(fileContent, filename, {
            sourceType: isESM ? 'module' : 'script',
            allowReturnOutsideFunction: true,
            allowAwaitOutsideFunction: true
        });
    } catch (e) {
        throw `❌ *Syntax Error:*\n\n${e.message}`;
    }

    try {
        if (!fs.existsSync(targetDir)) {
            await _fs.mkdir(targetDir, { recursive: true });
        }

        await _fs.writeFile(targetPath, fileContent);
        m.reply(
            `✅ Plugin berhasil disimpan:\n` +
            `📄 Nama: *${filename}*\n` +
            `📁 Lokasi: *plugins_tele/${filename}*\n` +
            `📦 Tipe: *${isESM ? 'ES Module' : isCJS ? 'CommonJS' : 'Unknown'}*`
        );
        console.log(chalk.green(`[SIMPAN PLUGIN TELE] '${filename}' disimpan ke plugins_tele.`));
    } catch (e) {
        console.error(chalk.red(`[ERROR SIMPAN PLUGIN TELE] ${filename}:`), e);
        throw `❌ Gagal menyimpan file: ${e.message}`;
    }
};

handler.command = /^spt$/i;
handler.rowner = true;

export default handler;