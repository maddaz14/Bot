import fs from 'fs/promises';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

let handler = async (m, { conn, usedPrefix, command, args, participants }) => {
  const teks = args.join(" ") || '';

  const fkontak = {
    key: {
      participant: '0@s.whatsapp.net',
      remoteJid: "0@s.whatsapp.net",
      fromMe: false,
      id: "Halo",
    },
    message: {
      conversation: "Nih hasil konversi audio dari ubed🍏"
    }
  };

  if (!m.quoted) throw `Reply ke audio atau video dengan perintah *${usedPrefix + command}* untuk mengonversinya ke MP3.`;

  await conn.sendMessage(m.chat, { react: { text: '🕑', key: m.key } });

  const q = m.quoted || m;
  const mime = (q.mimetype || '').toLowerCase();

  if (!/(video\/(mp4|webm|ogg|quicktime|3gpp|mpeg))|(audio\/(mpeg|ogg|opus|wav|webm|mp3))/.test(mime)) {
    throw `File yang di-reply harus berupa audio atau video. Contoh: mp4, mpeg, ogg, opus, wav.`;
  }

  const media = await q.download();
  if (!media) throw `Gagal mengunduh file. Pastikan kamu membalas pesan yang berisi audio/video.`;

  await fs.mkdir('./tmp', { recursive: true });

  const tempInputPath = path.join('./tmp', `input_${Date.now()}.${mime.includes('video') ? 'mp4' : 'audio'}`);
  await fs.writeFile(tempInputPath, media);

  const tempOutputPath = path.join('./tmp', `output_${Date.now()}.mp3`);

  try {
    await new Promise((resolve, reject) => {
      ffmpeg(tempInputPath)
        .setFfmpegPath(ffmpegStatic)
        .noVideo()
        .audioCodec('libmp3lame')
        .format('mp3')
        .output(tempOutputPath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

    const audioData = await fs.readFile(tempOutputPath);
    const isPTT = command === 'tovn';

    await conn.sendMessage(
      m.chat,
      {
        audio: audioData,
        mimetype: 'audio/mpeg',
        fileName: `converted_audio.mp3`,
        ptt: isPTT,
        caption: teks
      },
      { quoted: fkontak }
    );

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    throw `❌ Terjadi kesalahan saat mengonversi file ke MP3: ${err.message}`;
  } finally {
    await fs.unlink(tempInputPath).catch(() => {});
    await fs.unlink(tempOutputPath).catch(() => {});
  }
};

handler.help = ['tomp3 (audio biasa)', 'tovn (voice note/PTT)'];
handler.tags = ['tools'];
handler.command = ['tomp3', 'tovn'];
handler.limit = true;
handler.register = true;

export default handler;