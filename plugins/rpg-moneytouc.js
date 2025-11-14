const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": `moneytobalance ${global.namebot || 'Bot'} ✨`,
    }
};

let handler = async (m, { args, conn }) => {
  if (args.length !== 1) {
    return conn.reply(m.chat, 'Silakan masukkan jumlah uang yang ingin diubah menjadi balance! Contoh: .moneytobalance 1000', fkontak); // Menggunakan fkontak
  }

  let money = parseInt(args[0]);
  if (isNaN(money) || money <= 0) {
    return conn.reply(m.chat, 'Jumlah uang yang dimasukkan harus angka positif!', fkontak); // Menggunakan fkontak
  }

  let fee = Math.floor(money * 0.5);
  let balance = Math.floor(money * 0.5);

  let user = global.db.data.users[m.sender];

  if (!user) {
    user = { money: 0, balance: 0 }; // PERUBAHAN: eris diubah menjadi money
    global.db.data.users[m.sender] = user;
  }

  if ((user.money || 0) < money) { // PERUBAHAN: eris diubah menjadi money
    return conn.reply(m.chat, 'Uang kamu tidak cukup untuk dikonversi!', fkontak); // Menggunakan fkontak
  }

  user.money -= money; // PERUBAHAN: eris diubah menjadi money
  user.balance = (user.balance || 0) + balance;

  // global.db.write(); // Baris ini tidak perlu karena database biasanya otomatis disimpan

  let message = `• Kamu menconvert uang senilai Rp.${money.toLocaleString('en-US')}\n`;
  message += `• Dan kamu mendapatkan balance (ubed Coins) senilai ᴜ͢ᴄ.${balance.toLocaleString('en-US')}\n`;
  message += `• Biaya fee kamu adalah Rp.${fee.toLocaleString('en-US')}`;

  conn.reply(m.chat, message, fkontak); // Menggunakan fkontak
};

handler.help = ['moneytobalance *<amount>*'];
handler.tags = ['rpg'];
handler.command = /^moneytobalance$/i;
handler.register = true;
handler.limit = true;

export default handler;