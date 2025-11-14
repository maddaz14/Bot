import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var handler = async (m, { conn, args }) => {
    if (!args[0] || isNaN(args[0])) throw 'Contoh: .setfps 24 (angka 1-120)';
    
    const fps = parseInt(args[0]);
    if (fps < 1 || fps > 120) throw 'FPS harus 1-120!';

    try {
        const { quoted } = m;
        const videoMessage = quoted || m;
        
        if (!videoMessage?.video) throw 'Reply/send video!';
        
        const inputPath = path.join(__dirname, `temp_${m.id}.mp4`);
        const outputPath = path.join(__dirname, `output_${m.id}.mp4`);
        
        const videoBuffer = await videoMessage.download();
        await fs.promises.writeFile(inputPath, videoBuffer);

        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .outputOptions([
                    '-r ' + fps,
                    '-c:v libx264',
                    '-preset veryfast',
                    '-crf 23',
                    '-movflags +faststart'
                ])
                .save(outputPath)
                .on('end', resolve)
                .on('error', reject);
        });

        await conn.sendFile(m.chat, outputPath, 'video.mp4', `FPS: ${fps}`, m);
        
        // Cleanup
        await fs.promises.unlink(inputPath);
        await fs.promises.unlink(outputPath);

    } catch (error) {
        console.error(error);
        conn.reply(m.chat, `Error: ${error.message}`, m);
    }
};

handler.help = ['setfps <fps>'];
handler.tags = ['tools'];
handler.command = /^setfps$/i;
handler.limit = true;

export default handler;