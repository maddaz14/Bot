const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": `mysteryshop ${global.namebot || 'Bot'} ✨`,
    }
};

const armorNames = {
    6: "Dragonplate",
    7: "Celestial",
    8: "Stormbringer"
};

const swordNames = {
    6: "Shadowbane",
    7: "Stormbringer",
    8: "Excalibur"
};

const armorPrices = {
    6: 25000000,
    7: 30000000,
    8: 35000000
};

const swordPrices = {
    6: 30000000,
    7: 35000000,
    8: 40000000
};

const DURABILITY_VALUE = 150;

let handler = async (m, { conn, command, args, usedPrefix }) => {
    const now = new Date();
    // getUTCHours() digunakan untuk waktu UTC, sementara instruksi Anda menyebut WIB.
    // Jika bot Anda berjalan di zona waktu WIB, cukup gunakan getHours().
    // Saya akan asumsikan getHours() lebih relevan untuk WIB lokal.
    const hour = now.getHours();
    const day = now.getDay(); // getDay() mengembalikan 0 (Minggu) sampai 6 (Sabtu)

    // Jam 00:00 sampai 20:00 WIB di hari Jumat (5), Minggu (0), sama Selasa (2).
    const isWithinTime = (day === 2 || day === 5 || day === 0) && hour >= 0 && hour < 20;

    if (!isWithinTime) {
        return conn.reply(m.chat, `⏰ Toko Misteri cuma buka jam 00:00 sampe 20:00 WIB di hari Jumat, Minggu, sama Selasa, Senpai!`, fkontak); // Menggunakan fkontak
    }

    const mysteryShopList = `
🎁 *Mystery Shop* 🎁
Pake perintah: \`${usedPrefix}mysteryshop <armor|sword>\` atau \`${usedPrefix}misterishop <armor|sword>\`

📌 *Contoh:* \`${usedPrefix}mysteryshop armor\`
*Catatan:* Harus punya Armor Netherite/Sword Netherite buat beli di sini!

============================

🛡️ *Armor Tersedia:*
1. ${armorNames[6]} - Rp${armorPrices[6].toLocaleString()}
2. ${armorNames[7]} - Rp${armorPrices[7].toLocaleString()}
3. ${armorNames[8]} - Rp${armorPrices[8].toLocaleString()}

============================

⚔️ *Pedang Tersedia:*
1. ${swordNames[6]} - Rp${swordPrices[6].toLocaleString()}
2. ${swordNames[7]} - Rp${swordPrices[7].toLocaleString()}
3. ${swordNames[8]} - Rp${swordPrices[8].toLocaleString()}
`.trim();

    try {
        if (!/mysteryshop|misterishop/i.test(command)) return;

        let itemType = args[0]?.toLowerCase();
        if (!itemType || (itemType !== 'armor' && itemType !== 'sword')) {
            return conn.reply(m.chat, mysteryShopList, fkontak); // Menggunakan fkontak
        }

        // Cek user data
        if (!global.db.data.users[m.sender]) {
            // PERUBAHAN: eris diubah menjadi money
            global.db.data.users[m.sender] = { money: 0, armor: 0, sword: 0, armorDurability: 0, swordDurability: 0 };
        }

        let user = global.db.data.users[m.sender];

        if (itemType === 'armor') {
            let currentArmorLevel = user.armor || 0;

            // Cek minimal Armor Netherite (level 5)
            if (currentArmorLevel < 5) {
                return conn.reply(m.chat, `❌ Senpai harus punya Armor Netherite dulu buat beli di sini!`, fkontak); // Menggunakan fkontak
            }

            let nextArmorLevel = currentArmorLevel + 1;

            if (currentArmorLevel >= 8) {
                return conn.reply(m.chat, `⚠️ Senpai udah punya ${armorNames[8]}, ga bisa beli armor lagi nih!`, fkontak); // Menggunakan fkontak
            }

            if (!armorPrices[nextArmorLevel]) {
                return conn.reply(m.chat, `⚠️ Armor level ${nextArmorLevel} ga ada di toko, Senpai!`, fkontak); // Menggunakan fkontak
            }

            let buyingPrice = armorPrices[nextArmorLevel];
            if (user.money < buyingPrice) { // PERUBAHAN: eris diubah menjadi money
                return conn.reply(m.chat, `❌ Duit Senpai kurang buat beli ${armorNames[nextArmorLevel]} (Rp${buyingPrice.toLocaleString()})!`, fkontak); // Menggunakan fkontak
            }

            // Proses pembelian
            user.money -= buyingPrice; // PERUBAHAN: eris diubah menjadi money
            user.armor = nextArmorLevel;
            user.armordurability = DURABILITY_VALUE; // Perbaikan: armorDurability menjadi armordurability
            conn.reply(m.chat, `✅ Sukses beli ${armorNames[nextArmorLevel]} seharga Rp${buyingPrice.toLocaleString()}.\n🛡️ Durability: ${DURABILITY_VALUE}`, fkontak); // Menggunakan fkontak

        } else if (itemType === 'sword') {
            let currentSwordLevel = user.sword || 0;

            // Cek minimal Sword Netherite (level 5)
            if (currentSwordLevel < 5) {
                return conn.reply(m.chat, `❌ Senpai harus punya Sword Netherite dulu buat beli di sini!`, fkontak); // Menggunakan fkontak
            }

            let nextSwordLevel = currentSwordLevel + 1;

            if (currentSwordLevel >= 8) {
                return conn.reply(m.chat, `⚠️ Senpai udah punya ${swordNames[8]}, ga bisa beli pedang lagi nih!`, fkontak); // Menggunakan fkontak
            }

            if (!swordPrices[nextSwordLevel]) {
                return conn.reply(m.chat, `⚠️ Pedang level ${nextSwordLevel} ga ada di toko, Senpai!`, fkontak); // Menggunakan fkontak
            }

            let buyingPrice = swordPrices[nextSwordLevel];
            if (user.money < buyingPrice) { // PERUBAHAN: eris diubah menjadi money
                return conn.reply(m.chat, `❌ Duit Senpai kurang buat beli ${swordNames[nextSwordLevel]} (Rp${buyingPrice.toLocaleString()})!`, fkontak); // Menggunakan fkontak
            }

            // Proses pembelian
            user.money -= buyingPrice; // PERUBAHAN: eris diubah menjadi money
            user.sword = nextSwordLevel;
            user.sworddurability = DURABILITY_VALUE; // Perbaikan: swordDurability menjadi sworddurability
            conn.reply(m.chat, `✅ Sukses beli ${swordNames[nextSwordLevel]} seharga Rp${buyingPrice.toLocaleString()}.\n⚔️ Durability: ${DURABILITY_VALUE}`, fkontak); // Menggunakan fkontak
        }

    } catch (e) {
        console.error(e);
        conn.reply(m.chat, `⚠️ Ada error nih, Senpai! Coba lagi ya, atau lapor ke Ponta. Listnya: \n${mysteryShopList}`, fkontak); // Menggunakan fkontak
    }
};

handler.help = ['mysteryshop'];
handler.tags = ['rpg'];
handler.command = /^(mysteryshop|misterishop)$/i;
handler.limit = true;
handler.group = true;

export default handler;