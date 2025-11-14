const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": `uc2money ${global.namebot || 'Bot'} ✨`,
    }
};

let handler = async (m, { args, conn }) => {
  if (args.length !== 1) {
    return conn.reply(m.chat, 'Silakan masukkan jumlah balance (ᴜ͢ᴄ) yang ingin diubah menjadi uang! Contoh: .uc2money 1000', fkontak);
  }

  let balance = parseInt(args[0]);
  if (isNaN(balance) || balance <= 0) {
    return conn.reply(m.chat, 'Jumlah balance yang dimasukkan harus angka positif!', fkontak);
  }

  let fee = Math.floor(balance * 0.5);
  let money = Math.floor(balance * 0.5);

  let user = global.db.data.users[m.sender];

  if (!user) {
    user = { money: 0, balance: 0 }; // PERUBAHAN: eris diubah menjadi money
    global.db.data.users[m.sender] = user;
  }

  if ((user.balance || 0) < balance) {
    return conn.reply(m.chat, 'Balance kamu tidak cukup untuk dikonversi!', fkontak);
  }

  user.balance -= balance;
  user.money = (user.money || 0) + money; // PERUBAHAN: eris diubah menjadi money

  // global.db.write(); // Baris ini biasanya tidak diperlukan jika database otomatis disimpan

  let message = `• Kamu menconvert balance senilai ᴜ͢ᴄ.${balance.toLocaleString('en-US')}\n`;
  message += `• Dan kamu mendapatkan uang sebesar Rp.${money.toLocaleString('en-US')}\n`;
  message += `• Biaya fee kamu adalah ᴜ͢ᴄ.${fee.toLocaleString('en-US')}`;

  conn.reply(m.chat, message, fkontak);
};

handler.help = ['uc2money *<amount>*'];
handler.tags = ['rpg'];
handler.command = /^uc2money$/i;
handler.register = true;
handler.limit = true;

export default handler;