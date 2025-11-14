import fs from 'fs';
import archiver from 'archiver';
import moment from 'moment-timezone';

const ownerID = ''; //global.nomorown + '@s.whatsapp.net';
const groupId = '120363306670071031@g.us'; // BACA PESAN INI = ID GRUP INI UNTUK MENGIRIM FILE BACKUP, JADI TOLONG JANGAN DI ISI PAKAI GRUP PUBLIK KALAU GAK ADA ID GRUP CUKUP KOSONGIN AJA ID GRUP NYA

let backupInterval = null;
let isBackupActive = false;

async function backupAndSend(conn) {
  try {
    let timestamp = moment().tz('Asia/Jakarta').format('YYYYMMDD-HHmmss');
    let waktuBackup = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    let namabot = 'YUE ARIFURETA';
    let backupName = `SC ${namabot} ${waktuBackup}.zip`;
    let output = fs.createWriteStream(backupName);
    let archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);

    archive.glob('**/*', {
      cwd: '/home/container',
      ignore: ['node_modules/**', 'sessions/', 'tmp/**', '.npm/**', backupName],
    });

    archive.finalize();

    output.on('close', async () => {
      let caption = `\`File Backup Bot Otomatis\`\n\n` +
                    `*🗂 Nama File*: ${backupName}\n` +
                    `*📊 Ukuran File*: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB\n` +
                    `*⏰ Waktu Backup*: ${waktuBackup}`;

      if (ownerID) {
        await conn.sendFile(ownerID, backupName, backupName, caption, null);
      }

      if (groupId) {
        await conn.sendFile(groupId, backupName, backupName, caption, null);
      }

      fs.unlinkSync(backupName);
    });

    archive.on('error', (err) => {
      console.error('Terjadi kesalahan saat membuat backup:', err);
    });
  } catch (error) {
    console.error('Error pada proses backup:', error);
  }
}

const handler = async (m, { conn, isROwner, command, args, chat }) => {
  const isEnable = /^(on)$/i.test(args[0]);
  const isDisable = /^(off)$/i.test(args[0]);

  if (!isROwner) {
    global.dfail('rowner', m, conn);
    throw false;
  }

  switch (command) {
    case 'autobackup':
      if (isEnable) {
        if (isBackupActive) {
          m.reply('Backup otomatis sudah aktif sebelumnya.');
          return;
        }
        isBackupActive = true;
        backupInterval = setInterval(() => {
          backupAndSend(conn);
        }, 1800000); //  30 menit
        m.reply('Backup otomatis telah diaktifkan');
      } else if (isDisable) {
        if (!isBackupActive) {
          m.reply('Backup otomatis tidak aktif.');
          return;
        }
        isBackupActive = false;
        clearInterval(backupInterval);
        m.reply('Backup otomatis telah dinonaktifkan.');
      } else {
        m.reply('Gunakan perintah:\n- *autobackup on* untuk mengaktifkan\n- *autobackup off* untuk menonaktifkan');
      }
      break;
    default:
      m.reply('Perintah tidak dikenal.');
      break;
  }
};

handler.help = ['autobackup'];
handler.tags = ['owner'];
handler.command = /^(autobackup)$/i;
handler.owner = true;

export default handler;