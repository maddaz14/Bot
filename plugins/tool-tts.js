import { fileURLToPath } from 'url';
import path from 'path';
import gtts from 'gtts';
import fs from 'fs/promises';
import { exec } from 'child_process';

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) throw `Contoh penggunaan: *${usedPrefix + command} <teks>*\n\nContoh: *${usedPrefix + command} Halo! Gimana kabarnya hari ini?*`;

    await conn.sendMessage(m.chat, { react: { text: '🎙️', key: m.key } });

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const tempFilePath = path.join(__dirname, '../tmp', `tts_${Date.now()}.mp3`);
    const outputFilePath = path.join(__dirname, '../tmp', `tts_final_${Date.now()}.mp3`);

    try {
        const tts = new gtts(text, 'id');
        tts.save(tempFilePath, async (err) => {
            if (err) throw `Gagal membuat TTS: ${err.message}`;

            // Atur kecepatan suara (1.0x lebih cepat)
            const speedFactor = 1.0; // Ubah nilai ini (misal: 0.8 = lebih lambat, 1.5 = lebih cepat)
            exec(`ffmpeg -i ${tempFilePath} -filter:a "atempo=${speedFactor}" -y ${outputFilePath}`, async (error) => {
                if (error) throw `Gagal mengubah speed: ${error.message}`;

                const audioData = await fs.readFile(outputFilePath);
                await conn.sendMessage(
                    m.chat,
                    {
                        audio: audioData,
                        mimetype: 'audio/mpeg',
                        fileName: `tts_audio.mp3`,
                    },
                    { quoted: m }
                );

                // Hapus file sementara
                await fs.unlink(tempFilePath);
                await fs.unlink(outputFilePath);
                await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            });
        });
    } catch (err) {
        throw `Terjadi kesalahan: ${err.message}`;
    }
};

handler.help = ['tts <teks>'];
handler.tags = ['tools'];
handler.command = ['tts', 'texttospeech'];
handler.limit = true;

export default handler;