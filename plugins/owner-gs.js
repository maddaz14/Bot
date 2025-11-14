import fs from 'fs/promises';
import path from 'path';

let handler = async (m, { conn, isROwner, text }) => {
    await conn.sendMessage(m.chat, { react: { text: '🕓', key: m.key } });
    if (!isROwner) return;

    // Path folder scraper
    let folderPath = path.resolve('scraper');
    try {
        // Ambil daftar file di folder scraper
        let files = await fs.readdir(folderPath);
        let ar = files.filter(v => v.endsWith('.js')); // Hanya file .js

        if (!text) {
            // Tampilkan daftar file dengan angka
            let fileList = ar.map((v, i) => `${i + 1}. ${v.replace('.js', '')}`).join('\n');
            return m.reply(`Pilih file dengan mengetikkan:\n\n*getscrape <nomor>*\n\nDaftar file:\n${fileList}`);
        }

        // Konversi input ke nomor
        let index = parseInt(text) - 1;
        if (isNaN(index) || index < 0 || index >= ar.length) {
            let fileList = ar.map((v, i) => `${i + 1}. ${v.replace('.js', '')}`).join('\n');
            return m.reply(`Nomor tidak valid. Silakan pilih dari daftar berikut:\n\n${fileList}`);
        }

        // Ambil file berdasarkan nomor
        let fileName = ar[index];
        let filePath = path.join(folderPath, fileName);
        let fileBuffer = await fs.readFile(filePath);

        // Kirim file sebagai dokumen
        await conn.sendMessage(m.chat, {
            document: fileBuffer,
            mimetype: 'application/javascript',
            fileName: fileName
        });

        await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
    } catch (e) {
        m.reply(`Gagal: ${e.message}`);
    }
};

handler.help = ['getscrape'];
handler.tags = ['owner'];
handler.command = /^(getscrape|gs)$/i;
handler.rowner = true;

export default handler;