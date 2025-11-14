import fs from 'fs';
import archiver from 'archiver';
import path from 'path';
import moment from 'moment';

const handler = async (m, { conn }) => {
  m.reply('Sedang mempersiapkan backup...');
  let timestamp = moment().format('YYYYMMDD-HHmmss');
  let waktuBackup = moment().format('YYYY-MM-DD HH:mm:ss');
  let namabot = 'YUE ARIFURETA'
  let backupName = `SC ${namabot} ${waktuBackup}.zip`;
  let output = fs.createWriteStream(backupName);
  let archive = archiver('zip', { zlib: { level: 9 } });
  output.on('close', function () {
    let caption = `\`Berikut adalah file backup kode bot\`\n\n* Nama file: ${backupName}\n* Ukuran file: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`;
    // Kirim file backup ke grup ID tertentu
    let groupId = '120363306670071031@g.us'; // Ganti dengan ID grup yang diinginkan
    conn.sendFile(groupId, backupName, backupName, caption)
      .then(() => {
        fs.unlinkSync(backupName); 
      })
      .catch((err) => {
        throw err;
      });
  });

  archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
      console.warn(err);
    } else {
      throw err;
    }
  });

  archive.on('error', function (err) {
    throw err;
  });

  archive.pipe(output);
  archive.glob('**/*', {
    cwd: '/home/container',
    ignore: ['node_modules/**', 'sessions/', 'tmp/**', '.npm/**', backupName]
  });
  archive.finalize();
};

handler.help = ['backupsc'];
handler.tags = ['owner'];
handler.command = /^(lol)$/i;
handler.owner = true;
handler.private = true

export default handler;