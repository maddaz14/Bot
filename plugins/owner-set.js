let handler = async (m, { conn, text, command, isAdmin, isBotAdmin, isGroup }) => {
  switch (command) {
    case 'setbotbio': {
      // handler.owner = true sudah di-set di bawah
      if (!text) return m.reply(`Dimana teksnya?\nContoh: ${command} ubed`);
      await conn.updateProfileStatus(text);
      m.reply(`Success in changing the bio of bot's number`);
      break;
    }
    case 'setnamegc':
    case 'setgroupname':
    case 'setsubject': {
      if (!text) return m.reply('Teks tidak boleh kosong!');
      await conn.groupUpdateSubject(m.chat, text);
      m.reply('Sukses kak!');
      break;
    }
  }
};

handler.help = ['setbotbio', 'setnamegc', 'setgroupname', 'setsubject'];
handler.tags = ['owner', 'group'];
handler.command = /^(setbotbio|setnamegc|setgroupname|setsubject)$/i;
handler.owner = true; // untuk setbotbio
handler.group = true; // untuk group commands
handler.admin = true; // untuk group commands harus admin
handler.botAdmin = true; // bot harus admin di group

export default handler;