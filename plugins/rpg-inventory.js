// Dibuat oleh ubed - Dilarang keras menyalin tanpa izin!
// --- Kode Plugin Dimulai di sini ---

// Objek fkontak untuk tampilan pesan yang dikutip
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": ` Inventori ${global.namebot || 'Bot'} ✨`,
    }
};

let handler = async (m, { conn, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];

    // --- PENTING: Inisialisasi properti user (pastikan semua terdefinisi) ---
    user.health = user.health || 100;
    user.balance = user.balance || 0;
    user.armor = user.armor || 0;
    user.armordurability = user.armordurability || 0;
    user.viewers = user.viewers || 0;
    user.like = user.like || 0;
    user.subscribers = user.subscribers || 0;
    user.tiketcn = user.tiketcn || 0;
    user.pistol = user.pistol || 0;
    user.peluru = user.peluru || 0;
    user.sworddurability = user.sworddurability || 0;
    user.katanadurability = user.katanadurability || 0;
    user.katana = user.katana || 0;
    user.pet = user.pet || 0;
    user.kucing = user.kucing || 0;
    user.anakkucing = user.anakkucing || 0;
    user.rubah = user.rubah || 0;
    user.anakrubah = user.anakrubah || 0;
    user.serigala = user.serigala || 0;
    user.anakserigala = user.anakserigala || 0;
    user.naga = user.naga || 0;
    user.anaknaga = user.anaknaga || 0;
    user.anjing = user.anjing || 0;
    user.anakanjing = user.anakanjing || 0;
    user.kuda = user.kuda || 0;
    user.anakkuda = user.anakkuda || 0;
    user.phonix = user.phonix || 0;
    user.anakphonix = user.anakphonix || 0;
    user.griffin = user.griffin || 0;
    user.anakgriffin = user.anakgriffin || 0;
    user.kyubi = user.kyubi || 0;
    user.anakkyubi = user.anakkyubi || 0;
    user.centaur = user.centaur || 0;
    user.anakcentaur = user.anakcentaur || 0;
    user.warn = user.warn || 0;
    user.diamond = user.diamond || 0;
    user.trash = user.trash || 0;
    user.ayambakar = user.ayambakar || 0;
    user.lelebakar = user.lelebakar || 0;
    user.aqua = user.aqua || 0;
    user.ayamgoreng = user.ayamgoreng || 0;
    user.rendang = user.rendang || 0;
    user.steak = user.steak || 0;
    user.babipanggang = user.babipanggang || 0;
    user.gulaiayam = user.gulaiayam || 0;
    user.oporayam = user.oporayam || 0;
    user.vodka = user.vodka || 0;
    user.sushi = user.sushi || 0;
    user.bandage = user.bandage || 0;
    user.ganja = user.ganja || 0;
    user.soda = user.soda || 0;
    user.roti = user.roti || 0;
    user.ikanbakar = user.ikanbakar || 0;
    user.nilabakar = user.nilabakar || 0;
    user.bawalbakar = user.bawalbakar || 0;
    user.udangbakar = user.udangbakar || 0;
    user.pausbakar = user.pausbakar || 0;
    user.kepitingbakar = user.kepitingbakar || 0;
    user.wood = user.wood || 0;
    user.coal = user.coal || 0;
    user.rock = user.rock || 0;
    user.emerald = user.emerald || 0;
    user.gold = user.gold || 0;
    user.potion = user.potion || 0;
    user.common = user.common || 0;
    user.uncommon = user.uncommon || 0;
    user.mythic = user.mythic || 0;
    user.petfood = user.petfood || 0;
    user.legendary = user.legendary || 0;
    user.gardenboxs = user.gardenboxs || 0;
    user.superior = user.superior || 0;
    user.cupon = user.cupon || 0;
    user.stamina = user.stamina || 0;
    user.level = user.level || 0;
    user.money = user.money || 0;
    user.exp = user.exp || 0;
    user.atm = user.atm || 0;
    user.arlok = user.arlok || 0;
    user.limit = user.limit || 0;
    user.glimit = user.glimit || 0;
    user.sampah = user.sampah || 0;
    user.iron = user.iron || 0;
    user.sword = user.sword || 0;
    user.string = user.string || 0;
    user.umpan = user.umpan || 0;
    user.apel = user.apel || 0;
    user.jeruk = user.jeruk || 0;
    user.anggur = user.anggur || 0;
    user.mangga = user.mangga || 0;
    user.pisang = user.pisang || 0;
    user.banteng = user.banteng || 0;
    user.harimau = user.harimau || 0;
    user.gajah = user.gajah || 0;
    user.kambing = user.kambing || 0;
    user.panda = user.panda || 0;
    user.buaya = user.buaya || 0;
    user.kerbau = user.kerbau || 0;
    user.sapi = user.sapi || 0;
    user.monyet = user.monyet || 0;
    user.babihutan = user.babihutan || 0;
    user.babi = user.babi || 0;
    user.ayam = user.ayam || 0;
    user.bibitapel = user.bibitapel || 0;
    user.bibitjeruk = user.bibitjeruk || 0;
    user.bibitpisang = user.bibitpisang || 0;
    user.bibitanggur = user.bibitanggur || 0;
    user.bibitmangga = user.bibitmangga || 0;
    user.hiu = user.hiu || 0;
    user.paus = user.paus || 0;
    user.orca = user.orca || 0;
    user.dory = user.dory || 0;
    user.lumba = user.lumba || 0;
    user.fruits = user.fruits || 0;
    user.buntal = user.buntal || 0;
    user.gurita = user.gurita || 0;
    user.cumi = user.cumi || 0;
    user.udang = user.udang || 0;
    user.lobster = user.lobster || 0;
    user.kepiting = user.kepiting || 0;
    user.tiketcoin = user.tiketcoin || 0;
    user.tiketm = user.tiketm || 0;
    user.hero = user.hero || 0;
    user.exphero = user.exphero || 0;
    user.botol = user.botol || 0;
    user.aerozine = user.aerozine || 0;
    user.kaleng = user.kaleng || 0;
    user.kardus = user.kardus || 0;
    user.gelas = user.gelas || 0;
    user.plastik = user.plastik || 0;
    user.ramuan = user.ramuan || 0;
    user.pancingan = user.pancingan || 0;
    user.pickaxe = user.pickaxe || 0;
    user.pickaxedurability = user.pickaxedurability || 0;
    user.pancingandurability = user.pancingandurability || 0;
    user.herbs = user.herbs || 0;
    user.crystal = user.crystal || 0;
    user.feathers = user.feathers || 0;
    user.mushrooms = user.mushrooms || 0;
    user.shield = user.shield || 0;
    user.shieldDurability = user.shieldDurability || 0;
    user.role = user.role || 'Newbie';
    user.skill = user.skill || 'Tidak ada';
    user.attack = user.attack || 0;
    user.damage = user.damage || 0;
    user.bank = user.bank || 0;
    user.nasi = user.nasi || 0;
    user.mie = user.mie || 0;
    user.sate = user.sate || 0;
    user.burger = user.burger || 0;
    user.pizza = user.pizza || 0;
    user.bakso = user.bakso || 0;
    user.soto = user.soto || 0;
    user.ramen = user.ramen || 0;
    user.kebab = user.kebab || 0;
    user.kentang = user.kentang || 0;
    user.eskrim = user.eskrim || 0;
    user.banned = user.banned || false;

    let who = m.sender;
    let name = await conn.getName(who);

    // --- Penentuan URL Gambar Utama Menu (Foto User atau Fallback global.foto) ---
    let inventoryImageUrl;
    try {
        inventoryImageUrl = await conn.profilePictureUrl(who, 'image');
    } catch {
        // Fallback ke global.foto jika PP user tidak ada atau error
        inventoryImageUrl = global.foto || 'https://telegra.ph/file/ee60957d56941b8fdd221.jpg'; // URL fallback default jika global.foto juga tidak ada
    }
    // --- Akhir Penentuan URL Gambar Utama Menu ---


    // Fungsi untuk mendapatkan nama pet / hero / armor level
    const getItemLevelName = (itemType, level) => {
        if (level === 0) return 'Tidak Punya';
        switch (itemType) {
            case 'hero': return `Level ${level}` + (level >= 20 ? ' (MAX)' : '');
            case 'pet': return `Level ${level}` + (level >= 15 ? ' (MAX)' : '');
            case 'armor':
                const armorNames = ['Leather Armor', 'Iron Armor', 'Gold Armor', 'Diamond Armor', 'Netherite Armor', 'Dragonplate Armor', 'Celestial Armor', 'Stormbringer Armor'];
                return armorNames[level - 1] || `Level ${level}`;
            case 'sword':
                const swordNames = ['Wooden Sword', 'Iron Sword', 'Gold Sword', 'Diamond Sword', 'Netherite Sword', 'Shadowbane Sword', 'Stormbringer Sword', 'Excalibur Sword'];
                return swordNames[level - 1] || `Level ${level}`;
            case 'katana':
                const katanaNames = ['Fubuki Katana', 'Koyuki Katana', 'Mizore Katana', 'Shigure Katana', 'Yukikaze Katana'];
                return katanaNames[level - 1] || `Level ${level}`;
            case 'pistol': case 'pickaxe': case 'pancingan': case 'shield':
                return level > 0 ? 'Ada ✅' : 'Tidak Punya ❌';
            default: return 'Tidak Punya';
        }
    };

    // Max Health berdasarkan armor
    const maxHealthByArmorLevel = [100, 500, 550, 600, 650, 700, 750, 900, 1200, 1500, 1700];
    const userMaxHealth = maxHealthByArmorLevel[user.armor] || 100;
    const maxDurability = (level, base) => level * base;

    // --- Rangkuman singkat untuk deskripsi produk ---
    let productDescription = `
Health: ${user.health.toLocaleString()}/${userMaxHealth.toLocaleString()} | Exp: ${user.exp.toLocaleString()}
Money: Rp ${user.money.toLocaleString('id-ID')} | Diamond: ${user.diamond.toLocaleString()}
Role: ${user.role} | Level: ${user.level.toLocaleString()}
`.trim();

    // --- Detail lengkap untuk caption ---
    let fullInventoryCaption = `
🌷 *INVENTORI KAMU, KAK ${name.toUpperCase()}!* 🌷
----------------------------------------
🌟 *PLAYER STATS*
❤️ Health:    *${user.health.toLocaleString()}* / *${userMaxHealth.toLocaleString()}*
🌀 Stamina:   *${user.stamina.toLocaleString()}* / *250*
⚡ EXP:       *${user.exp.toLocaleString()}*
⚔️ Attack:    *${user.attack.toLocaleString()}*
💥 Damage:    *${user.damage.toLocaleString()}*
📈 Level:     *${user.level.toLocaleString()}*
👑 Role:      *${user.role}*
🎯 Skill:     *${user.skill}*
⚠️ Warn:      *${user.warn.toLocaleString()}*
🚫 Banned:    *${user.banned ? 'Ya ✅' : 'Tidak ❌'}*
----------------------------------------

🏛 *FINANCIAL STATS*
💰 Money:     *Rp ${user.money.toLocaleString('id-ID')}*
🏦 Bank:      *Rp ${user.bank.toLocaleString('id-ID')}*
🪙 Balance:   *Bc. ${user.balance.toLocaleString()}*
🔖 Limit:     *${user.limit.toLocaleString()}*
🎟️ G-Limit:   *${user.glimit.toLocaleString()}*
----------------------------------------

🛠 *EQUIPMENT & WEAPON*
🧥 Armor:    *${getItemLevelName('armor', user.armor)}*
╰╼ Durability: *${user.armordurability.toLocaleString()}* / *${maxDurability(user.armor, 50)}*
⚔️ Sword:    *${getItemLevelName('sword', user.sword)}*
╰╼ Durability: *${user.sworddurability.toLocaleString()}* / *${maxDurability(user.sword, 50)}*
🗡️ Katana:   *${getItemLevelName('katana', user.katana)}*
╰╼ Durability: *${user.katanadurability.toLocaleString()}* / *${maxDurability(user.katana, 50)}*
🔫 Pistol:   *${getItemLevelName('pistol', user.pistol)}*
╰╼ Peluru:   *${user.peluru.toLocaleString()}*
⛏️ Pickaxe:  *${getItemLevelName('pickaxe', user.pickaxe)}*
╰╼ Durability: *${user.pickaxedurability.toLocaleString()}* / *40*
🎣 Pancingan: *${getItemLevelName('pancingan', user.pancingan)}*
╰╼ Durability: *${user.pancingandurability.toLocaleString()}* / *250*
🪱 Umpan:    *${user.umpan.toLocaleString()}*
🛡 Shield:   *${getItemLevelName('shield', user.shield)}*
╰╼ Tersisa:  *${user.shieldDurability.toLocaleString()}* / *50*
----------------------------------------

👑 *HERO & PETS*
🤺 My Hero: *${getItemLevelName('hero', user.hero)}*
╰╼ Hero EXP: *${user.exphero.toLocaleString()}*
🐕‍🦺 Pet Random: *${user.pet.toLocaleString()}*
🐱 Kucing: *${getItemLevelName('pet', user.kucing)}* (Exp: ${user.anakkucing.toLocaleString()})
🐕 Anjing: *${getItemLevelName('pet', user.anjing)}* (Exp: ${user.anakanjing.toLocaleString()})
🐎 Kuda: *${getItemLevelName('pet', user.kuda)}* (Exp: ${user.anakkuda.toLocaleString()})
🦊 Rubah: *${getItemLevelName('pet', user.rubah)}* (Exp: ${user.anakrubah.toLocaleString()})
🐉 Naga: *${getItemLevelName('pet', user.naga)}* (Exp: ${user.anaknaga.toLocaleString()})
🦁 Griffin: *${getItemLevelName('pet', user.griffin)}* (Exp: ${user.anakgriffin.toLocaleString()})
🐺 Serigala: *${getItemLevelName('pet', user.serigala)}* (Exp: ${user.anakserigala.toLocaleString()})
🐦 Phoenix: *${getItemLevelName('pet', user.phonix)}* (Exp: ${user.anakphonix.toLocaleString()})
🦊 Kyubi: *${getItemLevelName('pet', user.kyubi)}* (Exp: ${user.anakkyubi.toLocaleString()})
🐴 Centaur: *${getItemLevelName('pet', user.centaur)}* (Exp: ${user.anakcentaur.toLocaleString()})
----------------------------------------

📦 *INVENTORI MATERIAL*
💎 Diamond:   *${user.diamond.toLocaleString()}*
💚 Emerald:   *${user.emerald.toLocaleString()}*
🪙 Gold:      *${user.gold.toLocaleString()}*
⚙️ Iron:      *${user.iron.toLocaleString()}*
🪵 Wood:      *${user.wood.toLocaleString()}*
🪨 Rock:      *${user.rock.toLocaleString()}*
⚫ Coal:      *${user.coal.toLocaleString()}*
🧶 String:    *${user.string.toLocaleString()}*
🧊 Kristal:   *${user.crystal.toLocaleString()}*
🪶 Feathers:  *${user.feathers.toLocaleString()}*
🌿 Herbal:    *${user.herbs.toLocaleString()}*
🍄 Jamur:     *${user.mushrooms.toLocaleString()}*
🗑️ Trash:     *${user.trash.toLocaleString()}*
📦 Common:    *${user.common.toLocaleString()}*
🎁 Uncommon:  *${user.uncommon.toLocaleString()}*
🔮 Mythic:    *${user.mythic.toLocaleString()}*
🏆 Legendary: *${user.legendary.toLocaleString()}*
🎁 Gardenboxs: *${user.gardenboxs.toLocaleString()}*
✨ Superior:  *${user.superior.toLocaleString()}*
🎫 Tiket Coin: *${user.tiketcoin.toLocaleString()}*
🎫 Tiket Monster: *${user.tiketm.toLocaleString()}*
🎟️ Kupon:     *${user.cupon.toLocaleString()}*
----------------------------------------

🍎 *INVENTORI BUAH & MAKANAN*
🍌 Pisang:      *${user.pisang.toLocaleString()}*
🍇 Anggur:      *${user.anggur.toLocaleString()}*
🥭 Mangga:      *${user.mangga.toLocaleString()}*
🍊 Jeruk:       *${user.jeruk.toLocaleString()}*
🍎 Apel:        *${user.apel.toLocaleString()}*
🍣 Sushi:       *${user.sushi.toLocaleString()}*
🍖 Ayam Bakar:  *${user.ayambakar.toLocaleString()}*
🍗 Ayam Goreng: *${user.ayamgoreng.toLocaleString()}*
🥩 Steak:       *${user.steak.toLocaleString()}*
🐟 Ikan Bakar:  *${user.ikanbakar.toLocaleString()}*
🐟 Lele Bakar:  *${user.lelebakar.toLocaleString()}*
🍚 Nasi:        *${user.nasi.toLocaleString()}*
🍞 Roti:        *${user.roti.toLocaleString()}*
🍜 Mie:         *${user.mie.toLocaleString()}*
🍢 Sate:        *${user.sate.toLocaleString()}*
🍔 Burger:      *${user.burger.toLocaleString()}*
🍕 Pizza:       *${user.pizza.toLocaleString()}*
🍛 Rendang:     *${user.rendang.toLocaleString()}*
🍲 Bakso:       *${user.bakso.toLocaleString()}*
🥣 Soto:        *${user.soto.toLocaleString()}*
🍜 Ramen:       *${user.ramen.toLocaleString()}*
🥙 Kebab:       *${user.kebab.toLocaleString()}*
🍟 Kentang:     *${user.kentang.toLocaleString()}*
🍦 Es Krim:     *${user.eskrim.toLocaleString()}*
🍖 Babi Panggang: *${user.babipanggang.toLocaleString()}*
🐔 Gulai Ayam:  *${user.gulaiayam.toLocaleString()}*
🥚 Opor Ayam:   *${user.oporayam.toLocaleString()}*
🍯 Madu:        *${user.fruits.toLocaleString()}*
🦴 Petfood:     *${user.petfood.toLocaleString()}*
----------------------------------------

🍹 *INVENTORI MINUMAN*
🥤 Aqua:        *${user.aqua.toLocaleString()}*
🥃 Vodka:       *${user.vodka.toLocaleString()}*
🍾 Soda:        *${user.soda.toLocaleString()}*
----------------------------------------

🌱 *BIBIT BUAH*
🌾 Bibit Apel:    *${user.bibitapel.toLocaleString()}*
🌾 Bibit Jeruk:   *${user.bibitjeruk.toLocaleString()}*
🌾 Bibit Pisang:  *${user.bibitpisang.toLocaleString()}*
🌾 Bibit Anggur:  *${user.anggur.toLocaleString()}*
🌾 Bibit Mangga:  *${user.mangga.toLocaleString()}*
----------------------------------------

🐄 *INVENTORI HEWAN TERNAK*
🐂 Banteng:     *${user.banteng.toLocaleString()}*
🐅 Harimau:     *${user.harimau.toLocaleString()}*
🐘 Gajah:       *${user.gajah.toLocaleString()}*
🐐 Kambing:     *${user.kambing.toLocaleString()}*
🐼 Panda:       *${user.panda.toLocaleString()}*
🐊 Buaya:       *${user.buaya.toLocaleString()}*
🐃 Kerbau:      *${user.kerbau.toLocaleString()}*
🐄 Sapi:        *${user.sapi.toLocaleString()}*
🐒 Monyet:      *${user.monyet.toLocaleString()}*
🐗 Babi Hutan:  *${user.babihutan.toLocaleString()}*
🐖 Babi:        *${user.babi.toLocaleString()}*
🐔 Ayam:        *${user.ayam.toLocaleString()}*
----------------------------------------

🐟 *INVENTORI IKAN*
🦈 Hiu:         *${user.hiu.toLocaleString()}*
🐋 Paus:        *${user.paus.toLocaleString()}*
🐳 Orca:        *${user.orca.toLocaleString()}*
🐬 Dory:        *${user.dory.toLocaleString()}*
🐬 Lumba-Lumba: *${user.lumba.toLocaleString()}*
🐡 Buntal:      *${user.buntal.toLocaleString()}*
🐙 Gurita:      *${user.gurita.toLocaleString()}*
🦑 Cumi:        *${user.cumi.toLocaleString()}*
🦐 Udang:       *${user.udang.toLocaleString()}*
🦞 Lobster:     *${user.lobster.toLocaleString()}*
🦀 Kepiting:    *${user.kepiting.toLocaleString()}*
----------------------------------------

> © ${global.namebot || 'Bot'} 2025 ✨`.trim();

    // --- Definisikan opsi-opsi untuk daftar pilihan ---
    const inventoryOptions = [
        {
            header: '💰 Cek Bank & Saldo',
            title: 'Lihat saldo dompet dan bank Anda',
            description: 'Akses informasi keuangan Anda.',
            id: `${usedPrefix}bank` 
        },
        {
            header: '⚔️ Cek Profil Lengkap',
            title: 'Lihat statistik dan informasi pribadi Anda',
            description: 'Kesehatan, level, role, dan lainnya.',
            id: `${usedPrefix}me` 
        },
        {
            header: '♻️ Buang Sampah',
            title: 'Bersihkan inventori Anda dari sampah',
            description: `Ketik: ${usedPrefix}buangsampah`,
            id: `${usedPrefix}buangsampah`
        },
        {
            header: '🛒 Kunjungi Toko',
            title: 'Beli item, senjata, atau armor',
            description: 'Lihat barang yang tersedia di toko bot.',
            id: `${usedPrefix}shop` // Asumsi ada command .shop
        },
        {
            header: '👨‍🌾 Mulai Bertani',
            title: 'Kelola kebun dan hasil panen Anda',
            description: 'Tanam bibit, panen buah, dll.',
            id: `${usedPrefix}farm` // Asumsi ada command .farm
        }
    ];

    // --- Susun interactiveButtons dengan single_select ---
    const interactiveButtons = [
        {
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
                title: 'Aksi Inventori & Lainnya', // Judul utama untuk daftar pilihan
                sections: [
                    {
                        title: 'Pilih Tindakan', // Judul bagian dalam daftar
                        highlight_label: 'Pilih Salah Satu',
                        rows: inventoryOptions // Baris-baris pilihan yang sudah didefinisikan
                    }
                ]
            })
        }
    ];

    const primaryOwnerJid = global.owner[0][0] + '@s.whatsapp.net';

    await conn.sendMessage(m.chat, {
        product: {
            productImage: { url: inventoryImageUrl }, // Gambar utama produk (profil user atau fallback)
            productId: '9999999999999999',
            title: `Inventori ${name}`, 
            description: productDescription, 
            currencyCode: 'IDR',
            priceAmount1000: '0',
            retailerId: 'user-inventory',
            url: 'https://api.ubed.my.id', // Ganti dengan URL bot Anda
            productImageCount: 1
        },
        businessOwnerJid: primaryOwnerJid, // **PASTIKAN JID WA BUSINESS BOT ANDA BENAR!**
        caption: fullInventoryCaption, 
        title: `✨ Detail Inventori ${name} ✨`, 
        subtitle: `Level: ${user.level} | Uang: Rp ${user.money.toLocaleString('id-ID')}`, 
        footer: `> © ${global.namebot || 'Bot'} | RPG System`, 
        interactiveButtons: interactiveButtons,
        hasMediaAttachment: false
    }, { quoted: fkontak });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
};

handler.help = ['inventory'];
handler.tags = ['rpg'];
handler.command = /^(inv|inventory|🪪)$/i;
handler.group = true;
handler.register = true;

export default handler;