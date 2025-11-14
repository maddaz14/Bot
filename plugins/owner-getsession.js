import fs from 'fs';
import archiver from 'archiver'; // pastikan sudah diinstal
import path from 'path';

let handler = async (m, { conn }) => {
  const sessionsFolder = './sessions';
  const zipPath = './sessions.zip';

  // Kirim reaksi emoji proses
  await conn.sendMessage(m.chat, {
    react: {
      text: '📦',
      key: m.key
    }
  });

  // Cek folder sessions
  if (!fs.existsSync(sessionsFolder)) {
    return m.reply('❌ *Folder sessions tidak ditemukan!*');
  }

  // Buat ZIP dari folder sessions
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  archive.pipe(output);
  archive.directory(sessionsFolder, false);
  await archive.finalize();

  output.on('close', async () => {
    const zipBuffer = fs.readFileSync(zipPath);

    await conn.sendMessage(m.chat, {
      document: zipBuffer,
      fileName: 'sessions.zip',
      mimetype: 'application/zip'
    }, { quoted: m });

    // Hapus file zip setelah dikirim
    fs.unlinkSync(zipPath);
  });

  output.on('error', err => {
    console.error(err);
    m.reply('❌ *Gagal membuat file zip!*');
  });
};

handler.help = ['getsession'];
handler.tags = ['owner'];
handler.command = /^getsession$/i;
handler.owner = true;

export default handler;