import fs from 'fs';
import path from 'path';

const _fs = fs.promises;

let handler = async (m, { usedPrefix, command }) => {
    if (!m.quoted) throw `Reply file yang ingin disimpan!`;

    // Get the original filename from the quoted message
    const quotedMessage = m.quoted;
    const originalFileName = quotedMessage.fileName || `file_${Date.now()}`; // Default filename if not available
    const filePath = path.join('scraper', originalFileName);

    if (quotedMessage.mediaMessage) {
        // Download the media
        const media = await quotedMessage.download();

        // Save the media file in the 'scraper' directory
        await _fs.writeFile(filePath, media);
        m.reply(`Sukses menyimpan di *${filePath}*`);
    } else {
        throw 'Hanya mendukung file media!';
    }
}

handler.help = ['savescraper'];
handler.tags = ['owner']
handler.command = /^(save(scraper|scrape)?)$/i; // Adjust the command trigger as needed
handler.rowner = true; // Ensures only the owner can use this command

export default handler;