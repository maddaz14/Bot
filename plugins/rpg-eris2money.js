const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": `eris2money ${global.namebot || 'Bot'} ✨`,
    }
};

let handler = async (m, { conn, args }) => {
    if (args.length !== 1) {
        return conn.reply(m.chat, 'Gunakan format: *.eris2money <jumlah>*\nContoh: *.eris2money 1000*', fkontak);
    }

    let amountToTransfer = parseInt(args[0]);

    if (isNaN(amountToTransfer) || amountToTransfer <= 0) {
        return conn.reply(m.chat, 'Jumlah yang dimasukkan harus angka positif!', fkontak);
    }

    let user = global.db.data.users[m.sender];

    // Pastikan user memiliki properti eris dan money
    user.eris = user.eris || 0;
    user.money = user.money || 0;

    if (user.eris < amountToTransfer) {
        return conn.reply(m.chat, `Kamu tidak memiliki cukup Eris (${user.eris.toLocaleString()}) untuk ditransfer.`, fkontak);
    }

    const feePercentage = 0.05; // 5% biaya
    const fee = Math.floor(amountToTransfer * feePercentage);
    const netMoneyReceived = amountToTransfer - fee;

    user.eris -= amountToTransfer;
    user.money += netMoneyReceived;

    let message = `*Konversi Berhasil!* ✨\n\n` +
                  `Kamu mengonversi *${amountToTransfer.toLocaleString()} Eris*.\n` +
                  `Dikenakan biaya: *${fee.toLocaleString()} Eris* (5%).\n` +
                  `Kamu mendapatkan: *${netMoneyReceived.toLocaleString()} Money*.\n\n` +
                  `Sisa Eris-mu: ${user.eris.toLocaleString()}\n` +
                  `Total Money-mu: ${user.money.toLocaleString()}`;

    conn.reply(m.chat, message, fkontak);
};

handler.help = ['eris2money <jumlah>'];
handler.tags = ['rpg'];
handler.command = /^(eris2money|eristomoney)$/i;
handler.register = true;
handler.limit = true;
handler.group = true;

export default handler;