let handler = async (m, { conn, args, command }) => {
    let item = (args[0] || '').toLowerCase();
    let count = parseInt(args[1]);
    let user = global.db.data.users[m.sender];

    // Daftar harga jual item (setengah dari harga beli) — tanpa limit
    const sellPrices = {
        potion: 10000, diamond: 50000, common: 50000, 
        uncommon: 50000, mythic: 50000, legendary: 100000, sampah: 60,
        kayu: 500, botol: 150, kaleng: 200, kardus: 200, pisang: 2750, 
        mangga: 2300, jeruk: 3000, anggur: 2750, apel: 2750, bibitpisang: 275, 
        bibitmangga: 275, bibitjeruk: 275, bibitanggur: 275, bibitapel: 275, 
        gardenboxs: 32500, berlian: 75000, emasbatang: 125000, emasbiasa: 75000, 
        phonix: 500000000, griffin: 50000000, kyubi: 50000000, naga: 50000000, 
        centaur: 50000000, kuda: 25000000, rubah: 50000000, kucing: 2500000, 
        serigala: 25000000, makananpet: 25000, makananphonix: 40000, makanangriffin: 40000, 
        makanannaga: 75000, makanankyubi: 75000, makanancentaur: 75000, 
        healtmonster: 10000, pet: 75000, exp: 275, aqua: 2500, iron: 10000, 
        string: 25000, sword: 75000, umpan: 750, pancingan: 2500000, bensin: 10000, 
        weap: 75000, batu: 250, ketake: 7, tiketcoin: 250, koinexpg: 250000, 
        obat: 7500, eleksirb: 250, nStock: 4999, weapStock: 25
    };

    if (!item) {
        let itemList = Object.keys(sellPrices).map(i => `• *${i}* - 💰 Rp${sellPrices[i].toLocaleString()}`).join('\n');
        return conn.reply(m.chat, `🛒 *Daftar Item yang Bisa Dijual:*\n\n${itemList}\n\n📌 *Cara jual:* .jual <item> <jumlah>\n📌 *Contoh:* .jual potion 1`, m);
    }

    if (!args[1] || isNaN(count) || count < 1) {
        throw '*Contoh*: .jual potion 10';
    }

    if (!(item in sellPrices)) {
        return m.reply(`❌ *Item tidak bisa dijual!*\nKetik *.jual* untuk melihat daftar item yang bisa dijual.`);
    }

    if (!user[item] || user[item] < count) {
        return m.reply(`❌ Kamu tidak memiliki cukup ${item} untuk dijual.\n📦 Stok kamu: *${user[item] || 0}*`);
    }

    if (count > 1000) {
        return m.reply(`⚠️ *Bot sedang overlimit untuk memproses permintaan*.\nMaksimal penjualan per transaksi adalah 1000 item.`);
    }

    let sellPrice = sellPrices[item] * count;

    conn.sendMessage(m.chat, { react: { text: '💰', key: m.key } });

    user[item] -= count;
    user.money += sellPrice;

    conn.reply(m.chat, `✅ *Berhasil!*\nKamu telah menjual ${count} ${item} dan mendapatkan ${sellPrice.toLocaleString()} money.`, m);
};

handler.help = ['sell <item> <jumlah>', 'jual'];
handler.tags = ['rpg'];
handler.command = ['sell', 'jual'];
handler.register = true;
handler.limit = false;

export default handler;