const giveaway = {
  participants: [],
  isActive: false,
  hasSpun: false
};

let handler = async (m, { text, args, command, isOwner, participants }) => {
  if (!args[0]) {
    return m.reply(`
*Giveaway Bot Command Guide*

- *Giveaway join*: Bergabung dengan event giveaway jika ada event yang aktif.
- *Giveaway buat* (Owner only): Memulai event giveaway baru.
- *Giveaway list* (Owner only): Melihat daftar peserta giveaway.
- *Giveaway spin* (Owner only): Mengambil pemenang dari event giveaway.
- *Giveaway hapus* (Owner only): Menghapus event giveaway yang sedang berjalan.

Selamat mencoba!
    `.trim());
  }

  switch (args[0].toLowerCase()) {
    case 'join':
      if (!giveaway.isActive) throw 'Tidak ada event giveaway yang aktif saat ini.';
      if (giveaway.hasSpun) throw 'Pendaftaran untuk giveaway sudah ditutup, owner sedang melakukan spin peserta.';
      if (giveaway.participants.includes(m.sender)) throw 'Kamu sudah terdaftar dalam giveaway.';
      giveaway.participants.push(m.sender);
      m.reply('Kamu berhasil bergabung dalam event giveaway!');
      break;

    case 'buat':
      if (!isOwner) throw 'Hanya owner yang bisa membuat event giveaway.';
      if (giveaway.isActive) throw 'Event giveaway sudah berjalan.';
      giveaway.isActive = true;
      giveaway.hasSpun = false;
      giveaway.participants = [];

      // Dapatkan semua peserta grup
      let allMembers = participants.map(p => p.id);
      
      // Kirim pesan dengan mention ke semua anggota tanpa @
      m.reply('Event giveaway telah dibuka! Ketik .giveaway join untuk bergabung.', null, { mentions: allMembers });
      break;

    case 'list':
      if (!isOwner) throw 'Hanya owner yang bisa melihat peserta giveaway.';
      if (!giveaway.isActive) throw 'Tidak ada event giveaway yang aktif saat ini.';
      if (giveaway.participants.length === 0) throw 'Belum ada peserta yang bergabung.';
      m.reply(`Peserta Giveaway:\n${giveaway.participants.map((jid, i) => `${i + 1}. ${jid}`).join('\n')}`);
      break;

    case 'spin':
      if (!isOwner) throw 'Hanya owner yang bisa melakukan spin untuk giveaway.';
      if (!giveaway.isActive) throw 'Tidak ada event giveaway yang aktif saat ini.';
      if (giveaway.participants.length === 0) throw 'Belum ada peserta yang bergabung.';
      let winner = giveaway.participants[Math.floor(Math.random() * giveaway.participants.length)];
      giveaway.hasSpun = true;
      m.reply(`Pemenang Giveaway adalah @${winner.split('@')[0]}`, null, { mentions: [winner] });
      break;

    case 'hapus':
      if (!isOwner) throw 'Hanya owner yang bisa menghapus event giveaway.';
      if (!giveaway.isActive) throw 'Tidak ada event giveaway yang aktif saat ini.';
      
      // Kirim pesan konfirmasi
      let confirmationMessage = await m.reply('Apakah kamu yakin ingin menghapus event giveaway? Ketik "ya" untuk mengonfirmasi atau abaikan untuk membatalkan.');

      // Tunggu input konfirmasi dari owner
      handler.confirmation = async (reply) => {
        if (reply.text.toLowerCase() === 'ya' && reply.sender === m.sender) {
          giveaway.isActive = false;
          giveaway.participants = [];
          giveaway.hasSpun = false;
          m.reply('Event giveaway telah dihapus.');
        } else {
          m.reply('Penghapusan event giveaway dibatalkan.');
        }
        handler.confirmation = null; // Reset handler
      };
      break;

    default:
      m.reply('Perintah tidak dikenal.');
      break;
  }
};

// Buat handler untuk menangani konfirmasi
handler.confirmation = null;

handler.all = async (m) => {
  if (handler.confirmation) {
    await handler.confirmation(m); // Cek jika ada pesan konfirmasi yang sedang ditunggu
  }
};

handler.help = ['giveaway'];
handler.tags = ['rpg'];
handler.command = /^giveaway$/i;
handler.private = false;

export default handler;