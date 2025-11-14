import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

let handler = async (m, { conn, usedPrefix, command }) => {
    const notImageMessage = `Reply to an image with the command *${usedPrefix + command}* to check its information.`;

    // Check if the user is replying to a message
    if (!m.quoted) throw notImageMessage;

    // Send a reaction emoji to indicate the bot is processing
    await conn.sendMessage(m.chat, { react: { text: '🕑', key: m.key } });

    // Get the replied message
    const q = m.quoted || m;

    // Check the MIME type of the file
    const mime = (q.mimetype || '');
    if (!/image\/(jpeg|png|gif|webp|jpg)/.test(mime)) throw notImageMessage;

    // Download the image
    const media = await q.download();
    if (!media) throw `Failed to download the image. Make sure you're replying to an image with this command.`;

    // Generate a temporary file name for storage
    const tempFileName = path.join('./tmp', `image_${Date.now()}.png`);
    await fs.writeFile(tempFileName, media);

    try {
        // Analyze image metadata using sharp
        const metadata = await sharp(media).metadata();

        // Convert size to appropriate units (KB, MB, GB)
        const fileSize = media.length;
        let sizeFormatted;
        if (fileSize >= 1e9) {
            sizeFormatted = `${(fileSize / 1e9).toFixed(2)} GB`;
        } else if (fileSize >= 1e6) {
            sizeFormatted = `${(fileSize / 1e6).toFixed(2)} MB`;
        } else {
            sizeFormatted = `${(fileSize / 1e3).toFixed(2)} KB`;
        }

        // Save the processed image (optional: convert to PNG)
        const processedFileName = path.join('./tmp', `processed_image_${Date.now()}.png`);
        await sharp(media).toFile(processedFileName);

        // Collect file information
        const fileInfo = {
            'File Name': q.filename || 'Not available',
            'File Type': mime,
            'File Size': sizeFormatted,
            'Resolution': `${metadata.width || 'Unknown'} x ${metadata.height || 'Unknown'}`,
            'Format': metadata.format || 'Unknown',
            'Saved File': tempFileName,
            'Processed File': processedFileName,
            'Date': new Date().toLocaleString(),
        };

        // Send image information to the user
        let infoMessage = '📄 *Image Information*:\n\n';
        for (const [key, value] of Object.entries(fileInfo)) {
            infoMessage += `- *${key}*: ${value}\n`;
        }

        await conn.reply(m.chat, infoMessage, m);
        await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
    } catch (err) {
        throw `An error occurred while processing the image: ${err.message}`;
    }
};

handler.help = ['infoimage (reply)'];
handler.tags = ['tools'];
handler.command = ['cekimage', 'imageinfo'];
handler.limit = true;

export default handler;