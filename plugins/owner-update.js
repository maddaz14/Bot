import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const _fs = fs.promises;

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0] || !args[0].startsWith('https://')) {
        throw `Kasih URL file yang mau diupdate, Senpai! Contoh: ${usedPrefix}${command} https://raw.githubusercontent.com/undefined/ngetes/main/tmp/_note.javascript`;
    }

    const url = args[0];

    try {
        await conn.sendMessage(m.chat, { react: { text: '📥', key: m.key } });

        const urlParts = url.split('/');
        let fileName = urlParts[urlParts.length - 1].split('?')[0];
        if (fileName.endsWith('.javascript')) {
            fileName = fileName.replace('.javascript', '.js');
        }
        const filePath = path.join('plugins', fileName);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Gagal ambil file: ${response.status} - ${response.statusText}`);
        }

        const fileBuffer = await response.buffer();

        await _fs.writeFile(filePath, fileBuffer);
        
        await conn.sendMessage(m.chat, { text: `File dari ${url} berhasil diupdate ke *${filePath}*, Senpai!` }, { quoted: m });
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('Error updating file:', error.message);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(`Waduh, ada masalah nih, Senpai: ${error.message}`);
    }
};

handler.help = ['update <url>'];
handler.tags = ['owner'];
handler.command = /^(update)$/i;
handler.owner = true;

export default handler;