import cp, { exec as _exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

let exec = promisify(_exec).bind(cp);

let handler = async (m, { conn, isROwner, usedPrefix, command, text }) => {
    // Tambahkan emoji saat memproses
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    if (!isROwner) {
        // Tambahkan emoji gagal jika bukan owner
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        return;
    }

    const pluginsDir = './plugins_tele';

    if (!fs.existsSync(pluginsDir)) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        throw `Folder '${pluginsDir}' tidak ditemukan.`;
    }

    let files = fs.readdirSync(pluginsDir);
    let plugins = files.filter(f => f.endsWith('.js') || f.endsWith('.cjs') || f.endsWith('.mjs'));
    let pluginsWithoutExt = plugins.map(f => path.basename(f, path.extname(f)));

    if (!text) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        throw `Nama pluginnya??\n\nContoh: ${usedPrefix}${command} tovid`;
    }

    if (!pluginsWithoutExt.includes(text)) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        return m.reply(`*Plugin tidak ditemukan*\n\nPlugin yang tersedia:\n${pluginsWithoutExt.map(v => ' ' + v).join`\n`}`);
    }

    const ext = ['.js', '.cjs', '.mjs'].find(e => plugins.includes(text + e)) || '.js';
    const filePath = path.join(pluginsDir, `${text}${ext}`);

    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        // Kirim konten file
        await conn.sendFile(m.chat, Buffer.from(fileContent), `${text}${ext}`, fileContent, m);
        // Tambahkan emoji sukses
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    } catch (e) {
        // Tambahkan emoji gagal
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        throw `❌ Gagal membaca file plugin: ${e.message}`;
    }
};

handler.help = ['gt'];
handler.tags = ['owner'];
handler.command = /^(gt)$/i;
handler.rowner = true;

export default handler;