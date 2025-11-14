import fs from 'fs/promises';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted) throw `Reply ke audio atau video dengan perintah *${usedPrefix + command}* untuk mengonversinya ke MP3.`;

  await conn.sendMessage(m.chat, { react: { text: '🕑', key: m.key } });

  const q = m.quoted || m;
  const mime = (q.mimetype || '').toLowerCase();

  // Cek apakah file adalah video atau audio yang umum
  if (!/(video\/(mp4|webm|ogg|quicktime|3gpp|mpeg))|(audio\/(mpeg|ogg|opus|wav|webm|mp3))/.test(mime)) {
    throw `File yang di-reply harus berupa audio atau video. Contoh: mp4, mpeg, ogg, opus, wav.`;
  }

  const media = await q.download();
  if (!media) throw `Gagal mengunduh file. Pastikan kamu membalas pesan yang berisi audio/video.`;

  // Pastikan folder ./tmp ada
  await fs.mkdir('./tmp', { recursive: true });

  // Ext video atau audio, tapi kita paksa outputnya .mp3
  const tempInputPath = path.join('./tmp', `input_${Date.now()}.${mime.includes('video') ? 'mp4' : 'audio'}`);
  await fs.writeFile(tempInputPath, media);

  const tempOutputPath = path.join('./tmp', `output_${Date.now()}.mp3`);

  try {
    await new Promise((resolve, reject) => {
      ffmpeg(tempInputPath)
        .setFfmpegPath(ffmpegStatic)
        .noVideo() // hilangkan video jika ada
        .audioCodec('libmp3lame')
        .format('mp3')
        .output(tempOutputPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });

    const audioData = await fs.readFile(tempOutputPath);

    await conn.sendMessage(
      m.chat,
      {
        audio: audioData,
        mimetype: 'audio/mpeg',
        fileName: `converted_audio.mp3`,
      },
      { quoted: m }
    );

    // Bersihkan file temporer
    await fs.unlink(tempInputPath).catch(() => {});
    await fs.unlink(tempOutputPath).catch(() => {});

    await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
  } catch (err) {
    await fs.unlink(tempInputPath).catch(() => {});
    await fs.unlink(tempOutputPath).catch(() => {});
    throw `❌ Terjadi kesalahan saat mengonversi file ke MP3: ${err.message}`;
  }
};

handler.help = ['tomp3 (reply audio/video)'];
handler.tags = ['tools'];
handler.command = ['tomp3'];
handler.limit = true;
handler.register = true;

export default handler;