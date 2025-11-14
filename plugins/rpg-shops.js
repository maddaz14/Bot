const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(num);

const potion = 45000
const Spotion = 100 

const Btiketcn = 500000

const Bpistol = 1500000
const Bpeluru = 29999

const Bdiamond = 200000
const Sdiamond = 25000

const Bcommon = 80000
const Scommon = 1000

const Suncommon = 4500
const Buncommon = 50000

const Bmythic = 200000
const Smythic = 1000

const Blegendary = 505000
const Slegendary = 5000

const Btrash = 120
const Strash = 5

const Bgelas = 150
const Sgelas = 50

const Bplastik = 250
const Splastik = 100

const Bwood = 1000
const Swood = 400

const Bbotol = 300
const Sbotol = 50

const Bkaleng = 400
const Skaleng = 100

const Bkardus = 400
const Skardus = 50

const Bpisang = 5500
const Spisang = 100

const Bmangga = 4600
const Smangga = 150

const Bjeruk = 6000
const Sjeruk = 300

const Banggur = 5500
const Sanggur = 150

const Bapel = 5500
const Sapel = 400

const Bbibitpisang = 550
const Sbibitpisang = 50

const Bbibitmangga = 550
const Sbibitmangga = 50

const Bbibitjeruk = 550
const Sbibitjeruk = 50

const Bbibitanggur = 550
const Sbibitanggur = 50

const Bbibitapel = 550
const Sbibitapel = 50

const Bgardenboxs = 65000
const Sgardenboxs = 35000

const Bberlian = 150000
const Sberlian = 10000

const Semerald = 55000
const Bemerald = 650000

const Bgoldbatang = 250000
const Sgoldbatang = 10000

const Bgold = 150000
const Sgold = 15000

const Bphonix = 1000000000
const Sphonix = 1000000

const Bgriffin = 100000000
const Sgriffin = 100000

const Bkyubi = 100000000
const Skyubi = 100000

const Bnaga = 100000000
const Snaga = 100000

const Bcentaur = 100000000
const Scentaur = 100000

const Bkuda = 50000000
const Skuda = 100000

const Brubah = 100000000
const Srubah = 100000

const Bkucing = 5000000
const Skucing = 50000

const Bserigala = 50000000
const Sserigala = 500000

const Bpetfood = 25000
const Spetfood = 10000

const Bhealtmonster = 20000

const Bpet = 150000
const Spet = 1000

const Blimit = 750000000

const Bexp = 550

const Baqua = 5000
const Saqua = 1000

const Biron = 20000
const Siron = 5000

const Bstring = 50000
const Sstring = 5000

const Bumpan = 1500
const Sumpan = 100

const Bpancingan = 1000000
const Spancingan = 50000

const Brock = 500
const Srock = 100

const Bketake = 15

const Btiketcoin = 500

const Bkoinexpg = 500000

const Bsushi = 12000

const Bpickaxe = 650000

const Beleksirb = 500

const Bcoal = 50000
const Scoal = 20000

const Bherbs = 17000
const Sherbs = 4500

const Bfruits = 7500
const Sfruits = 250

const Bmushrooms = 12000
const Smushrooms = 3000

const Bcrystal = 80000
const Scrystal = 38000

const Bfeathers = 10000
const Sfeathers = 4000

const Baerozine = 100000
const Saerozine = 30000

const Bshield = 12000000

let handler  = async (m, { conn, command, args, usedPrefix, owner }) => {
    const _armor = global.db.data.users[m.sender].armor
    const armor = (_armor == 0 ? 20000 : '' || _armor == 1 ? 49999 : '' || _armor == 2 ? 99999 : '' || _armor == 3 ? 149999 : '' || _armor == 4 ? 299999 : '')
    
    const _sword = global.db.data.users[m.sender].sword
    const sword = (_sword == 0 ? 50000 : '' || _sword == 1 ? 150000 : '' || _sword == 2 ? 300000 : '' || _sword == 3 ? 600000 : '' || _sword == 4 ? 1200000 : '')
    
    const _katana = global.db.data.users[m.sender].katana
    const katana = (_katana == 0 ? 65000 : '' || _katana == 1 ? 300000 : '' || _katana == 2 ? 650000 : '' || _katana == 3 ? 1300000 : '' || _katana == 4 ? 2600000 : '')
    let type = (args[0] || '').toLowerCase()
    let _type = (args[1] || '').toLowerCase()
    let jualbeli = (args[0] || '').toLowerCase()
    let nomors = m.sender
    const Kchat = `

█▀ █░█ █▀█ █▀█
▄█ █▀█ █▄█ █▀▀

Penggunaan ${usedPrefix}shop <Buy|sell> <item> <jumlah>
Contoh penggunaan: *${usedPrefix}shop buy potion 1*
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
*Kebutuhan   |  Harga Beli*
🔖 Limit:     Rp.${formatNumber(Blimit)}
🎫 TiketM:     Rp.${formatNumber(Bhealtmonster)}
🎟 Cupon:     Rp.${formatNumber(Btiketcoin)}
🎟 KoinExpg:     Rp.${formatNumber(Bkoinexpg)}
🎫 Tiketcn:     Rp.${formatNumber(Btiketcn)}
⛽ Aerozine:      Rp.${formatNumber(Baerozine)}
🛡 Shield:       Rp.${formatNumber(Bshield)}

*Kebutuhan   |  Harga Jual*
🔖 Limit:     Nggak Dijual
⛽ Aerozine:     Rp.${formatNumber(Saerozine)}
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
*Bibit Buah   |  Harga Beli*
🌾 BibitPisang:       Rp.${formatNumber(Bbibitpisang)}
🌾 BibitAnggur:       Rp.${formatNumber(Bbibitanggur)}
🌾 BibitMangga:       Rp.${formatNumber(Bbibitmangga)}
🌾 BibitJeruk:       Rp.${formatNumber(Bbibitjeruk)}
🌾 BibitApel:       Rp.${formatNumber(Bbibitapel)}
📦 Gardenboxs:     Rp.${formatNumber(Bgardenboxs)}
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
*Barang   |  Harga Beli*
🧪 Potion:       Rp.${formatNumber(potion)}
🌿 Herbal:       Rp.${formatNumber(Bherbs)}
💎 Diamond:     Rp.${formatNumber(Bdiamond)}
🧊 Kristal:       Rp.${formatNumber(Bcrystal)}
💚 Emerald:     Rp.${formatNumber(Bemerald)}
📦 Common:     Rp.${formatNumber(Bcommon)}
📦 Uncommon:  Rp.${formatNumber(Buncommon)}
🎁 Mythic:     Rp.${formatNumber(Bmythic)}
🎁 Legendary:  Rp.${formatNumber(Blegendary)}
🗑 Trash:     Rp.${formatNumber(Btrash)}
🧶 String:       Rp.${formatNumber(Bstring)}
⚙️ Iron:       Rp.${formatNumber(Biron)}
🪨 Rock:       Rp.${formatNumber(Brock)}
⚫ Coal:       Rp.${formatNumber(Bcoal)}
🪶 Bulu:       Rp.${formatNumber(Bfeathers)}
🍼 Botol:       Rp.${formatNumber(Bbotol)}
🍾 Kaleng:       Rp.${formatNumber(Bkaleng)}
📦 Kardus:       Rp.${formatNumber(Bkardus)}
🍶 Gelas:       Rp.${formatNumber(Bgelas)}
🥡 Plastik:       Rp.${formatNumber(Bplastik)}
🪵 Wood:       Rp.${formatNumber(Bwood)}
💍 Berlian:       Rp.${formatNumber(Bberlian)}
🪙 Gold:       Rp.${formatNumber(Bgold)}
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
*Barang   |  Harga Jual*
🧪 Potion:       Rp.${formatNumber(Spotion)}
🌿 Herbal:       Rp.${formatNumber(Sherbs)}
💎 Diamond:     Rp.${formatNumber(Sdiamond)}
🧊 Kristal:       Rp.${formatNumber(Scrystal)}
💚 Emerald      Rp.${formatNumber(Semerald)}
📦 Common:     Rp.${formatNumber(Scommon)}
📦 Uncommon:  Rp.${formatNumber(Suncommon)}
🎁 Mythic:     Rp.${formatNumber(Smythic)}
🎁 Legendary:  Rp.${formatNumber(Slegendary)}
🗑 Trash:     Rp.${formatNumber(Strash)}
🧶 String:       Rp.${formatNumber(Sstring)}
⚙️ Iron:       Rp.${formatNumber(Siron)}
🪨 Rock:       Rp.${formatNumber(Srock)}
⚫ Coal:       Rp.${formatNumber(Scoal)}
🪶 Bulu:       Rp.${formatNumber(Sfeathers)}
🍼 Botol:       Rp.${formatNumber(Sbotol)}
🍾 Kaleng:       Rp.${formatNumber(Skaleng)}
📦 Kardus:       Rp.${formatNumber(Skardus)}
🍶 Gelas:       Rp.${formatNumber(Sgelas)}
🥡 Plastik:       Rp.${formatNumber(Splastik)}
🪵 Wood:       Rp.${formatNumber(Swood)}
💍 Berlian:       Rp.${formatNumber(Sberlian)}
🪙 Gold:       Rp.${formatNumber(Sgold)}
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
*List Makanan:*

*Makanan | Harga Beli*
🍌 Pisang:       Rp.${formatNumber(Bpisang)}
🍇 Anggur:       Rp.${formatNumber(Banggur)}
🥭 Mangga:       Rp.${formatNumber(Bmangga)}
🍊 Jeruk:       Rp.${formatNumber(Bjeruk)}
🍎 Apel:       Rp.${formatNumber(Bapel)}
🍣 Sushi:       Rp.${formatNumber(Bsushi)}
🍯 Madu:        Rp.${formatNumber(Bfruits)}
🍄 Jamur:       Rp.${formatNumber(Bmushrooms)}
🦴 Petfood:       Rp.${formatNumber(Bpetfood)}
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
*Makanan | Harga Jual*
🍌 Pisang:       Rp.${formatNumber(Spisang)}
🍇 Anggur:       Rp.${formatNumber(Sanggur)}
🥭 Mangga:       Rp.${formatNumber(Smangga)}
🍊 Jeruk:       Rp.${formatNumber(Sjeruk)}
🍎 Apel:       Rp.${formatNumber(Sapel)}
🍯 Madu:        Rp.${formatNumber(Sfruits)}
🍄 Jamur:       Rp.${formatNumber(Smushrooms)}
🦴 Petfood:       Rp.${formatNumber(Spetfood)}
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
*Minuman | Harga Beli*
🥤 Aqua:       Rp.${formatNumber(Baqua)}

*Minuman | Harga Jual*
🥤 Aqua:       Rp.${formatNumber(Saqua)}
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
*Weapon   | Harga Beli*
🧥 Armor:       Rp.${formatNumber(armor)}
⚔️ Sword:       Rp.${formatNumber(sword)}
🗡 Katana:       Rp.${formatNumber(sword)}
⛏️ Pickaxe:       Rp.${formatNumber(Bpickaxe)}
🔫 Pistol:       Rp.${formatNumber(Bpistol)}
🪡 Peluru:       Rp.${formatNumber(Bpeluru)}
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
*Fishing | Harga Beli*
🎣 Pancingan:       Rp.${formatNumber(Bpancingan)}
🪱 Umpan:       Rp.${formatNumber(Bumpan)}

...
`.trim()
    try {
        if (/shop|toko/i.test(command)) {
            const count = args[2] && args[2].length > 0 ? Math.min(999999999999999, Math.max(parseInt(args[2]), 1)) : !args[2] || args.length < 4 ? 1 :Math.min(1, count)
            const trash = global.db.data.users[m.sender].trash
            const gelas = global.db.data.users[m.sender].gelas
            const plastik = global.db.data.users[m.sender].plastik
            switch (jualbeli) {
            case 'buy':
                switch (_type) {
                    case 'potion':
                            if (global.db.data.users[m.sender].money >= potion * count) {
                                global.db.data.users[m.sender].money -= potion * count
                                global.db.data.users[m.sender].potion += count * 1
                                conn.reply(m.chat, `Succes membeli ${count} Potion dengan harga ${potion * count} money\n\nGunakan potion dengan ketik: *${usedPrefix}use potion <jumlah>*`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Potion dengan harga ${potion * count} money`,)
                        break
                    case 'diamond':
                            if (global.db.data.users[m.sender].money >= Bdiamond * count) {
                                global.db.data.users[m.sender].diamond += count * 1
                                global.db.data.users[m.sender].money -= Bdiamond * count
                                conn.reply(m.chat, `Succes membeli ${count} Diamond dengan harga ${Bdiamond * count} money`, m)
                            } else conn.reply(m.chat, `money anda tidak cukup`, m)
                        
                        break
                    case 'common':
                            if (global.db.data.users[m.sender].money >= Bcommon * count) {
                                global.db.data.users[m.sender].common += count * 1
                                global.db.data.users[m.sender].money -= Bcommon * count
                                conn.reply(m.chat, `Succes membeli ${count} Common crate dengan harga ${Bcommon * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Common crate dengan harga ${Bcommon * count} money\n\nBuka crate dengan ketik: *${usedPrefix}open common*`, m)
                          
                        break
                    case 'uncommon':
                            if (global.db.data.users[m.sender].money >= Buncommon * count) {
                                global.db.data.users[m.sender].uncommon += count * 1
                                global.db.data.users[m.sender].money -= Buncommon * count
                                conn.reply(m.chat, `Succes membeli ${count} Uncommon crate dengan harga ${Buncommon * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Uncommon crate dengan harga ${Buncommon * count} money\n\nBuka crate dengan ketik: *${usedPrefix}open uncommon*`, m)
                        
                        break
                    case 'mythic':
                            if (global.db.data.users[m.sender].money >= Bmythic * count) {
                                    global.db.data.users[m.sender].mythic += count * 1
                                global.db.data.users[m.sender].money -= Bmythic * count
                                conn.reply(m.chat, `Succes membeli ${count} Mythic crate dengan harga ${Bmythic * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Mythic crate dengan harga ${Bmythic* count} money\n\nBuka crate dengan ketik: *${usedPrefix}open mythic*`, m)
                        
                        break
                    case 'legendary':
                            if (global.db.data.users[m.sender].money >= Blegendary * count) {
                                global.db.data.users[m.sender].legendary += count * 1
                                global.db.data.users[m.sender].money -= Blegendary * count
                                conn.reply(m.chat, `Succes membeli ${count} Legendary crate dengan harga ${Blegendary * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Legendary crate dengan harga ${Blegendary * count} money\n\nBuka crate dengan ketik: *${usedPrefix}open legendary*`, m)
                        
                        break
                    case 'trash':
                            if (global.db.data.users[m.sender].money >= Btrash * count) {
                                global.db.data.users[m.sender].trash += count * 1
                                global.db.data.users[m.sender].money -= Btrash * count
                                conn.reply(m.chat, `Succes membeli ${count} trash dengan harga ${Btrash * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} trash dengan harga ${Btrash * count} money`.trim(), m)
                        
                        break
                    case 'gelas':
                            if (global.db.data.users[m.sender].money >= Bgelas * count) {
                                global.db.data.users[m.sender].gelas += count * 1
                                global.db.data.users[m.sender].money -= Bgelas * count
                                conn.reply(m.chat, `Succes membeli ${count} gelas dengan harga ${Bgelas * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} gelas dengan harga ${Bgelas * count} money`.trim(), m)
                 
                        break
                    case 'tiketcn':
                            if (global.db.data.users[m.sender].money >= Btiketcn * count) {
                                global.db.data.users[m.sender].tiketcn += count * 1
                                global.db.data.users[m.sender].money -= Btiketcn * count
                                conn.reply(m.chat, `Succes membeli ${count} Tiketcn dengan harga ${Btiketcn * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Tiketcn dengan harga ${Btiketcn * count} money`.trim(), m)
                 
                        break
                    case 'kaleng':
                            if (global.db.data.users[m.sender].money >= Bkaleng * count) {
                                global.db.data.users[m.sender].kaleng += count * 1
                                global.db.data.users[m.sender].money -= Bkaleng * count
                                conn.reply(m.chat, `Succes membeli ${count} Kaleng dengan harga ${Bkaleng * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Kaleng dengan harga ${Bkaleng * count} money`.trim(), m)
                        
                        break
                    case 'plastik':
                            if (global.db.data.users[m.sender].money >= Bplastik * count) {
                                global.db.data.users[m.sender].plastik += count * 1
                                global.db.data.users[m.sender].money -= Bplastik * count
                                conn.reply(m.chat, `Succes membeli ${count} plastik dengan harga ${Bplastik * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} plastik dengan harga ${Bplastik * count} money`.trim(), m)
                    
                        break
                    case 'kardus':
                            if (global.db.data.users[m.sender].money >= Bkardus * count) {
                                global.db.data.users[m.sender].kardus += count * 1
                                global.db.data.users[m.sender].money -= Bkardus * count
                                conn.reply(m.chat, `Succes membeli ${count} Kardus dengan harga ${Bkardus * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Kardus dengan harga ${Bkardus * count} money`.trim(), m)
                        
                        break
                    case 'botol':
                            if (global.db.data.users[m.sender].money >= Bbotol * count) {
                                global.db.data.users[m.sender].botol += count * 1
                                global.db.data.users[m.sender].money -= Bbotol * count
                                conn.reply(m.chat, `Succes membeli ${count} Botol dengan harga ${Bbotol * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} botol dengan harga ${Bbotol * count} money`.trim(), m)
                        
                        break
                    case 'aerozine':
                            if (global.db.data.users[m.sender].money >= Baerozine * count) {
                                global.db.data.users[m.sender].aerozine += count * 1
                                global.db.data.users[m.sender].money -= Baerozine * count
                                conn.reply(m.chat, `Succes membeli ${count} aerozine dengan harga ${Baerozine * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} aerozine dengan harga ${Baerozine * count} money`.trim(), m)
                        
                        break
                    case 'sushi':
                            if (global.db.data.users[m.sender].money >= Bsushi * count) {
                                global.db.data.users[m.sender].sushi += count * 1
                                global.db.data.users[m.sender].money -= Bsushi * count
                                conn.reply(m.chat, `Succes membeli ${count} sushi dengan harga ${Bsushi * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} sushi dengan harga ${Bsushi * count} money`.trim(), m)
                        
                        break
                    case 'wood':
                            if (global.db.data.users[m.sender].money >= Bwood * count) {
                                global.db.data.users[m.sender].wood += count * 1
                                global.db.data.users[m.sender].money -= Bwood * count
                                conn.reply(m.chat, `Succes membeli ${count} wood dengan harga ${Bwood * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} wood dengan harga ${Bwood * count} money`.trim(), m)
                        
                        break
                    case 'pisang':
                            if (global.db.data.users[m.sender].money >= Bpisang * count) {
                                global.db.data.users[m.sender].pisang += count * 1
                                global.db.data.users[m.sender].money -= Bpisang * count
                                conn.reply(m.chat, `Succes membeli ${count} Pisang dengan harga ${Bpisang * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} pisang dengan harga ${Bpisang * count} money`.trim(), m)
                        
                        break
                    case 'anggur':
                            if (global.db.data.users[m.sender].money >= Banggur * count) {
                                global.db.data.users[m.sender].anggur += count * 1
                                global.db.data.users[m.sender].money -= Banggur * count
                                conn.reply(m.chat, `Succes membeli ${count} Anggur dengan harga ${Banggur * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} anggur dengan harga ${Banggur * count} money`.trim(), m)
                        
                        break
                    case 'mangga':
                            if (global.db.data.users[m.sender].money >= Bmangga * count) {
                                global.db.data.users[m.sender].mangga += count * 1
                                global.db.data.users[m.sender].money -= Bmangga * count
                                conn.reply(m.chat, `Succes membeli ${count} Mangga dengan harga ${Bmangga * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} mangga dengan harga ${Bmangga * count} money`.trim(), m)
                        
                        break
                    case 'jeruk':
                            if (global.db.data.users[m.sender].money >= Bjeruk * count) {
                                global.db.data.users[m.sender].jeruk += count * 1
                                global.db.data.users[m.sender].money -= Bjeruk * count
                                conn.reply(m.chat, `Succes membeli ${count} Jeruk dengan harga ${Bjeruk * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} jeruk dengan harga ${Bjeruk * count} money`.trim(), m)
                        
                        break
                    case 'apel':
                            if (global.db.data.users[m.sender].money >= Bapel * count) {
                                global.db.data.users[m.sender].apel += count * 1
                                global.db.data.users[m.sender].money -= Bapel * count
                                conn.reply(m.chat, `Succes membeli ${count} Apel dengan harga ${Bapel * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} apel dengan harga ${Bapel * count} money`.trim(), m)
                        
                        break
                    case 'bibitpisang':
                            if (global.db.data.users[m.sender].money >= Bbibitpisang * count) {
                                global.db.data.users[m.sender].bibitpisang += count * 1
                                global.db.data.users[m.sender].money -= Bbibitpisang * count
                                conn.reply(m.chat, `Succes membeli ${count} Bibit Pisang dengan harga ${Bbibitpisang * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} bibit pisang dengan harga ${Bbibitpisang * count} money`.trim(), m)
                        
                        break
                    case 'bibitanggur':
                            if (global.db.data.users[m.sender].money >= Bbibitanggur * count) {
                                global.db.data.users[m.sender].bibitanggur += count * 1
                                global.db.data.users[m.sender].money -= Bbibitanggur * count
                                conn.reply(m.chat, `Succes membeli ${count} Bibit Anggur dengan harga ${Bbibitanggur * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} bibit anggur dengan harga ${Bbibitanggur * count} money`.trim(), m)
                        
                        break
                    case 'bibitmangga':
                            if (global.db.data.users[m.sender].money >= Bbibitmangga * count) {
                                global.db.data.users[m.sender].bibitmangga += count * 1
                                global.db.data.users[m.sender].money -= Bbibitmangga * count
                                conn.reply(m.chat, `Succes membeli ${count} Bibit Mangga dengan harga ${Bbibitmangga * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} bibit mangga dengan harga ${Bbibitmangga * count} money`.trim(), m)
                        
                        break
                    case 'bibitjeruk':
                            if (global.db.data.users[m.sender].money >= Bbibitjeruk * count) {
                                global.db.data.users[m.sender].bibitjeruk += count * 1
                                global.db.data.users[m.sender].money -= Bbibitjeruk * count
                                conn.reply(m.chat, `Succes membeli ${count} Bibit Jeruk dengan harga ${Bbibitjeruk * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} bibit jeruk dengan harga ${Bbibitjeruk * count} money`.trim(), m)
                        
                        break
                    case 'bibitapel':
                            if (global.db.data.users[m.sender].money >= Bbibitapel * count) {
                                global.db.data.users[m.sender].bibitapel += count * 1
                                global.db.data.users[m.sender].money -= Bbibitapel * count
                                conn.reply(m.chat, `Succes membeli ${count} Bibit Apel dengan harga ${Bbibitapel * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} bibit apel dengan harga ${Bbibitapel * count} money`.trim(), m)
                        
                        break 
                    case 'gardenboxs':
                            if (global.db.data.users[m.sender].money >= Bgardenboxs * count) {
                                global.db.data.users[m.sender].gardenboxs += count * 1
                                global.db.data.users[m.sender].money -= Bgardenboxs * count
                                conn.reply(m.chat, `Succes membeli ${count} Gardenboxs dengan harga ${Bgardenboxs * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} gardenboxs dengan harga ${Bgardenboxs * count} money`.trim(), m)
                        
                        break
                    case 'berlian':
                            if (global.db.data.users[m.sender].money >= Bberlian * count) {
                                global.db.data.users[m.sender].berlian += count * 1
                                global.db.data.users[m.sender].money -= Bberlian * count
                                conn.reply(m.chat, `Succes membeli ${count} Berlian dengan harga ${Bberlian * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} berlian dengan harga ${Bberlian * count} money`.trim(), m)
                        
                        break
                    case 'gold':
                            if (global.db.data.users[m.sender].money >= Bgold * count) {
                                global.db.data.users[m.sender].gold += count * 1
                                global.db.data.users[m.sender].money -= Bgold * count
                                conn.reply(m.chat, `Succes membeli ${count} gold dengan harga ${Bgold * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} gold dengan harga ${Bgold * count} money`.trim(), m)
                        
                        break 
                     case 'pet':
                            if (global.db.data.users[m.sender].money >= Bpet * count) {
                                global.db.data.users[m.sender].pet += count * 1
                                global.db.data.users[m.sender].money -= Bpet * count
                                conn.reply(m.chat, `Succes membeli ${count} Pet Random dengan harga ${Bpet * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} pet random dengan harga ${Bpet * count} money`.trim(), m)
                        
                        break
                   case 'limit':
                            if (global.db.data.users[m.sender].money >= Blimit * count) {
                                global.db.data.users[m.sender].limit += count * 1
                                global.db.data.users[m.sender].money -= Blimit * count
                                conn.reply(m.chat, `Succes membeli ${count} Limit dengan harga ${Blimit * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} limit dengan harga ${Blimit * count} money`.trim(), m)
                        
                        break 
                  case 'cupon':
                            if (global.db.data.users[m.sender].tiketcoin >= Btiketcoin * count) {
                                global.db.data.users[m.sender].cupon += count * 1
                                global.db.data.users[m.sender].tiketcoin -= Btiketcoin * count
                                conn.reply(m.chat, `Succes membeli ${count} cupon dengan harga ${Btiketcoin * count} Tiketcoin`, m)
                            } else conn.reply(m.chat, `Tiketcoin anda tidak cukup untuk membeli ${count} cupon dengan harga ${Btiketcoin * count} Tiketcoin\n\nCara mendapatkan tiketcoin, anda harus memainkan semua fitur game..`.trim(), m)
                        
                        break 
                  case 'petfood':
                            if (global.db.data.users[m.sender].money >= Bpetfood * count) {
                                global.db.data.users[m.sender].petfood += count * 1
                                global.db.data.users[m.sender].money -= Bpetfood * count
                                conn.reply(m.chat, `Succes membeli ${count} Makanan Pet dengan harga ${Bpetfood * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} makanan pet dengan harga ${Bpetfood * count} money`.trim(), m)
                        
                        break 
                  case 'tiketm':
                            if (global.db.data.users[m.sender].money >= Bhealtmonster * count) {
                                global.db.data.users[m.sender].healtmonster += count * 1
                                global.db.data.users[m.sender].money -= Bhealtmonster * count
                                conn.reply(m.chat, `Succes membeli ${count} TiketM dengan harga ${Bhealtmonster * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} tiketm dengan harga ${Bhealtmonster * count} money`.trim(), m)
                        
                        break
                  case 'aqua':
                            if (global.db.data.users[m.sender].money >= Baqua * count) {
                                global.db.data.users[m.sender].aqua += count * 1
                                global.db.data.users[m.sender].money -= Baqua * count
                                conn.reply(m.chat, `Succes membeli ${count} Aqua dengan harga ${Baqua * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} aqua dengan harga ${Baqua * count} money`.trim(), m)
                        
                        break
                  case 'coal':
                            if (global.db.data.users[m.sender].money >= Bcoal * count) {
                                global.db.data.users[m.sender].coal += count * 1
                                global.db.data.users[m.sender].money -= Bcoal * count
                                conn.reply(m.chat, `Succes membeli ${count} coal dengan harga ${Bcoal * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} coal dengan harga ${Bcoal * count} money`.trim(), m)
                        
                        break
                  case 'iron':
                            if (global.db.data.users[m.sender].money >= Biron * count) {
                                global.db.data.users[m.sender].iron += count * 1
                                global.db.data.users[m.sender].money -= Biron * count
                                conn.reply(m.chat, `Succes membeli ${count} Iron dengan harga ${Biron * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} iron dengan harga ${Biron * count} money`.trim(), m)
                        
                        break
                  case 'string':
                            if (global.db.data.users[m.sender].money >= Bstring * count) {
                                global.db.data.users[m.sender].string += count * 1
                                global.db.data.users[m.sender].money -= Bstring * count
                                conn.reply(m.chat, `Succes membeli ${count} String dengan harga ${Bstring * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} string dengan harga ${Bstring * count} money`.trim(), m)
                        
                        break
                  case 'rock':
                            if (global.db.data.users[m.sender].money >= Brock * count) {
                                global.db.data.users[m.sender].rock += count * 1
                                global.db.data.users[m.sender].money -= Brock * count
                                conn.reply(m.chat, `Succes membeli ${count} rock dengan harga ${Brock * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} rock dengan harga ${Brock * count} money`.trim(), m)
                        
                        break 
                    case 'emerald':
                            if (global.db.data.users[m.sender].money >= Bemerald * count) {
                                global.db.data.users[m.sender].emerald += count * 1
                                global.db.data.users[m.sender].money -= Bemerald * count
                                conn.reply(m.chat, `Succes membeli ${count} emerald dengan harga ${Bemerald * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} emerald dengan harga ${Bemerald * count} money`.trim(), m)
                        
                        break 
                    case 'madu':
                            if (global.db.data.users[m.sender].money >= Bfruits * count) {
                                global.db.data.users[m.sender].fruits += count * 1
                                global.db.data.users[m.sender].money -= Bfruits * count
                                conn.reply(m.chat, `Succes membeli ${count} madu dengan harga ${Bfruits * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} madu dengan harga ${Bfruits * count} money`.trim(), m)
                        
                        break 
case 'bulu':
                            if (global.db.data.users[m.sender].money >= Bfeathers * count) {
                                global.db.data.users[m.sender].feathers += count * 1
                                global.db.data.users[m.sender].money -= Bfeathers * count
                                conn.reply(m.chat, `Succes membeli ${count} bulu dengan harga ${Bfeathers * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} bulu dengan harga ${Bfeathers * count} money`.trim(), m)
                        
                        break
case 'kristal':
                            if (global.db.data.users[m.sender].money >= Bcrystal * count) {
                                global.db.data.users[m.sender].crystal += count * 1
                                global.db.data.users[m.sender].money -= Bcrystal * count
                                conn.reply(m.chat, `Succes membeli ${count} kristal dengan harga ${Bcrystal * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} kristal dengan harga ${Bcrystal * count} money`.trim(), m)
                        
                        break 
case 'herbal':
                            if (global.db.data.users[m.sender].money >= Bherbs * count) {
                                global.db.data.users[m.sender].herbs += count * 1
                                global.db.data.users[m.sender].money -= Bherbs * count
                                conn.reply(m.chat, `Succes membeli ${count} tanaman herbal dengan harga ${Bherbs * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} tanaman herbal dengan harga ${Bherbs * count} money`.trim(), m)
                        
                        break 
case 'jamur':
                            if (global.db.data.users[m.sender].money >= Bmushrooms * count) {
                                global.db.data.users[m.sender].mushrooms += count * 1
                                global.db.data.users[m.sender].money -= Bmushrooms * count
                                conn.reply(m.chat, `Succes membeli ${count} jamur dengan harga ${Bmushrooms * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} jamur dengan harga ${Bmushrooms * count} money`.trim(), m)
                        
                        break 

                    case 'pistol':
                            if (global.db.data.users[m.sender].pistol == 1) return conn.reply(m.chat, 'Kamu Sudah Memiliki Pistol', m)
                            if (global.db.data.users[m.sender].money >= Bpistol ) {
                                global.db.data.users[m.sender].peluru += 50
                                global.db.data.users[m.sender].pistol += 1
                                global.db.data.users[m.sender].money -= Bpistol * 1
                                conn.reply(m.chat, `Succes membeli pistol dengan harga ${Bpistol} money\nFree +50 Peluru`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli pistol dengan harga ${Bpistol} money`.trim(), m)
                        
                        break
                    case 'pickaxe':
                            if (global.db.data.users[m.sender].pickaxe == 1) return conn.reply(m.chat, 'Kamu Sudah Memiliki Pickaxe', m)
                            if (global.db.data.users[m.sender].money >= Bpickaxe ) {
                                global.db.data.users[m.sender].pickaxe += 1
                                global.db.data.users[m.sender].money -= Bpickaxe * 1
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli pickaxe dengan harga ${Bpickaxe} money`.trim(), m)
                        
                        break
                    case 'peluru':
                            if (global.db.data.users[m.sender].money >= Bpeluru * count) {
                                global.db.data.users[m.sender].peluru += count * 1
                                global.db.data.users[m.sender].money -= Bpeluru * count
                                conn.reply(m.chat, `Succes membeli ${count} peluru dengan harga ${Bpeluru * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} peluru dengan harga ${Bpeluru * count} money`.trim(), m)
                        
                        break 
                    case 'umpan':
                            if (global.db.data.users[m.sender].money >= Bumpan * count) {
                                global.db.data.users[m.sender].umpan += count * 1
                                global.db.data.users[m.sender].money -= Bumpan * count
                                conn.reply(m.chat, `Succes membeli ${count} Umpan dengan harga ${Bumpan * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} umpan dengan harga ${Bumpan * count} money`.trim(), m)
                        
                        break 
                    case 'pancingan':
                            if (global.db.data.users[m.sender].pancingan == 1) return conn.reply(m.chat, 'Kamu Sudah Memilik Pancingan', m)
                            if (global.db.data.users[m.sender].money >= Bpancingan ) {
                                global.db.data.users[m.sender].pancingan += 1
                                global.db.data.users[m.sender].money -= Bpancingan * 1
                                conn.reply(m.chat, `Succes membeli Pancingan dengan harga ${Bpancingan} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli pancingan dengan harga ${Bpancingan} money`.trim(), m)
                        
                        break
                    case 'sword':
                            if (global.db.data.users[m.sender].sword >= 5) return conn.reply(m.chat, 'Untuk membeli level sword yang lebih tinggi pergi ke *.mistmoneyhop*', m)
                            if (global.db.data.users[m.sender].money > sword) {
                                global.db.data.users[m.sender].sword += 1
                                global.db.data.users[m.sender].sworddurability += 50
                                global.db.data.users[m.sender].money -= sword * 1
                                conn.reply(m.chat, `Succes membeli sword seharga ${sword} money` ,m)
                            } else conn.reply(m.chat, `uang mu tidak cukup untuk membeli sword seharga ${sword} money`, m)
                        
                        break
                    case 'katana':
                            if (global.db.data.users[m.sender].katana == 5) return conn.reply(m.chat, 'katana sudah *Level Max*', m)
                            if (global.db.data.users[m.sender].money > katana) {
                                global.db.data.users[m.sender].katana += 1
                                global.db.data.users[m.sender].katanadurability += 50
                                global.db.data.users[m.sender].money -= katana * 1
                                conn.reply(m.chat, `Succes membeli katana seharga ${katana} money` ,m)
                            } else conn.reply(m.chat, `uang mu tidak cukup untuk membeli katana seharga ${katana} money`, m)
                        
                        break
                    case 'armor':
                            if (global.db.data.users[m.sender].armor >= 5) return conn.reply(m.chat, 'Untuk membeli level armor yang lebih tinggi pergi ke *.mistmoneyhop*', m)
                            if (global.db.data.users[m.sender].money > armor) {
                                global.db.data.users[m.sender].armor += 1
                                global.db.data.users[m.sender].armordurability  += 50
                                global.db.data.users[m.sender].money -= armor * 1
                                conn.reply(m.chat, `Succes membeli armor seharga ${armor} money` ,m)
                            } else conn.reply(m.chat, `uang mu tidak cukup untuk membeli armor seharga ${armor} money`, m)
                        
                        break
                    case 'shield':
                            if (global.db.data.users[m.sender].shield == 1) return conn.reply(m.chat, 'Shield kamu masih aktif', m)
                            if (global.db.data.users[m.sender].money >= Bshield ) {
                                global.db.data.users[m.sender].shield += 1
                                global.db.data.users[m.sender].shieldDurability += 50
                                global.db.data.users[m.sender].money -= Bshield * 1
                                conn.reply(m.chat, `Succes membeli shield dengan harga ${Bshield} money\n\nSekarang uang mu di dompet aman`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli shield dengan harga ${Bshield} money`.trim(), m)
                        
                        break
                    default:
                        return conn.reply(m.chat, Kchat, m)
                }
                break
            case 'sell': 
                switch (_type) {
                    case 'potion':
                        if (global.db.data.users[m.sender].potion >= count * 1) {
                            global.db.data.users[m.sender].money += Spotion * count
                            global.db.data.users[m.sender].potion -= count * 1
                            conn.reply(m.chat, `Succes menjual ${count} Potion dengan harga ${Spotion * count} money`.trim(), m)
                        } else conn.reply(m.chat, `Potion kamu tidak cukup`.trim(), m)
                        break
                    case 'common':
                        if (global.db.data.users[m.sender].common >= count * 1) {
                            global.db.data.users[m.sender].money += Scommon * count
                            global.db.data.users[m.sender].common -= count * 1
                            conn.reply(m.chat, `Succes menjual ${count} Common Crate dengan harga ${Scommon * count} money`.trim(), m)
                        } else conn.reply(m.chat, `Common Crate kamu tidak cukup`.trim(), m)
                        break
                    case 'uncommon':
                        if (global.db.data.users[m.sender].uncommon >= count * 1) {
                            global.db.data.users[m.sender].money += Suncommon * count
                            global.db.data.users[m.sender].uncommon -= count * 1
                            conn.reply(m.chat, `Succes menjual ${count} Uncommon Crate dengan harga ${Suncommon * count} money`.trim(), m)
                        } else conn.reply(m.chat, `Uncommon Crate kamu tidak cukup`.trim(), m)
                        break
                    case 'mythic':
                        if (global.db.data.users[m.sender].mythic >= count * 1) {
                            global.db.data.users[m.sender].money += Smythic * count
                            global.db.data.users[m.sender].mythic -= count * 1
                            conn.reply(m.chat, `Succes menjual ${count} Mythic Crate dengan harga ${Smythic * count} money`.trim(), m)
                        } else conn.reply(m.chat, `Mythic Crate kamu tidak cukup`.trim(), m)
                        break
                    case 'legendary':
                        if (global.db.data.users[m.sender].legendary >= count * 1) {
                            global.db.data.users[m.sender].money += Slegendary * count
                            global.db.data.users[m.sender].legendary -= count * 1
                            conn.reply(m.chat, `Succes menjual ${count} Legendary Crate dengan harga ${Slegendary * count} money`.trim(), m)
                        } else conn.reply(m.chat, `Legendary Crate kamu tidak cukup`.trim(), m)
                        break
                    case 'trash':
                        if (global.db.data.users[m.sender].trash >= count * 1) {
                            global.db.data.users[m.sender].trash -= count * 1
                            global.db.data.users[m.sender].money += Strash * count
                            conn.reply(m.chat, `Succes menjual ${count} trash, dan anda mendapatkan ${Strash * count} money`, m)
                        } else conn.reply(m.chat, `trash anda tidak cukup`, m)
                        break
                    case 'gelas':
                        if (global.db.data.users[m.sender].gelas >= count * 1) {
                            global.db.data.users[m.sender].gelas -= count * 1
                            global.db.data.users[m.sender].money += Sgelas * count
                            conn.reply(m.chat, `Succes menjual ${count} gelas, dan anda mendapatkan ${Sgelas * count} money`, m)
                        } else conn.reply(m.chat, `gelas anda tidak cukup`, m)
                        break
                    case 'plastik':
                        if (global.db.data.users[m.sender].plastik >= count * 1) {
                            global.db.data.users[m.sender].plastik -= count * 1
                            global.db.data.users[m.sender].money += Splastik * count
                            conn.reply(m.chat, `Succes menjual ${count} plastik, dan anda mendapatkan ${Splastik * count} money`, m)
                        } else conn.reply(m.chat, `plastik anda tidak cukup`, m)
                        break
                    case 'kaleng':
                        if (global.db.data.users[m.sender].kaleng >= count * 1) {
                            global.db.data.users[m.sender].kaleng -= count * 1
                            global.db.data.users[m.sender].money += Skaleng * count
                            conn.reply(m.chat, `Succes menjual ${count} kaleng, dan anda mendapatkan ${Skaleng * count} money`, m)
                        } else conn.reply(m.chat, `Kaleng anda tidak cukup`, m)
                        break
                    case 'kardus':
                        if (global.db.data.users[m.sender].kardus >= count * 1) {
                            global.db.data.users[m.sender].kardus -= count * 1
                            global.db.data.users[m.sender].money += Skardus * count
                            conn.reply(m.chat, `Succes menjual ${count} kardus, dan anda mendapatkan ${Skardus * count} money`, m)
                        } else conn.reply(m.chat, `Kardus anda tidak cukup`, m)
                        break
                    case 'botol':
                        if (global.db.data.users[m.sender].botol >= count * 1) {
                            global.db.data.users[m.sender].botol -= count * 1
                            global.db.data.users[m.sender].money += Sbotol * count
                            conn.reply(m.chat, `Succes menjual ${count} botol, dan anda mendapatkan ${Sbotol * count} money`, m)
                        } else conn.reply(m.chat, `Botol anda tidak cukup`, m)
                        break
                    case 'aerozine':
                        if (global.db.data.users[m.sender].aerozine >= count * 1) {
                            global.db.data.users[m.sender].aerozine -= count * 1
                            global.db.data.users[m.sender].money += Saerozine * count
                            conn.reply(m.chat, `Succes menjual ${count} aerozine, dan anda mendapatkan ${Saerozine * count} money`, m)
                        } else conn.reply(m.chat, `aerozine anda tidak cukup`, m)
                        break
                    case 'wood':
                        if (global.db.data.users[m.sender].wood >= count * 1) {
                            global.db.data.users[m.sender].wood -= count * 1
                            global.db.data.users[m.sender].money += Swood * count
                            conn.reply(m.chat, `Succes menjual ${count} wood, dan anda mendapatkan ${Swood * count} money`, m)
                        } else conn.reply(m.chat, `wood anda tidak cukup`, m)
                        break
                    case 'pisang':
                        if (global.db.data.users[m.sender].pisang >= count * 1) {
                            global.db.data.users[m.sender].pisang -= count * 1
                            global.db.data.users[m.sender].money += Spisang * count
                            conn.reply(m.chat, `Succes menjual ${count} pisang, dan anda mendapatkan ${Spisang * count} money`, m)
                        } else conn.reply(m.chat, `Pisang anda tidak cukup`, m)
                        break
                    case 'anggur':
                        if (global.db.data.users[m.sender].anggur >= count * 1) {
                            global.db.data.users[m.sender].anggur -= count * 1
                            global.db.data.users[m.sender].money += Sanggur * count
                            conn.reply(m.chat, `Succes menjual ${count} anggur, dan anda mendapatkan ${Sanggur * count} money`, m)
                        } else conn.reply(m.chat, `Anggur anda tidak cukup`, m)
                        break
                    case 'mangga':
                        if (global.db.data.users[m.sender].mangga >= count * 1) {
                            global.db.data.users[m.sender].mangga -= count * 1
                            global.db.data.users[m.sender].money += Smangga * count
                            conn.reply(m.chat, `Succes menjual ${count} mangga, dan anda mendapatkan ${Smangga * count} money`, m)
                        } else conn.reply(m.chat, `Mangga anda tidak cukup`, m)
                        break
                    case 'jeruk':
                        if (global.db.data.users[m.sender].jeruk >= count * 1) {
                            global.db.data.users[m.sender].jeruk -= count * 1
                            global.db.data.users[m.sender].money += Sjeruk * count
                            conn.reply(m.chat, `Succes menjual ${count} jeruk, dan anda mendapatkan ${Sjeruk * count} money`, m)
                        } else conn.reply(m.chat, `Jeruk anda tidak cukup`, m)
                        break
                    case 'apel':
                        if (global.db.data.users[m.sender].apel >= count * 1) {
                            global.db.data.users[m.sender].apel -= count * 1
                            global.db.data.users[m.sender].money += Sapel * count
                            conn.reply(m.chat, `Succes menjual ${count} apel, dan anda mendapatkan ${Sapel * count} money`, m)
                        } else conn.reply(m.chat, `Apel anda tidak cukup`, m)
                        break
                   case 'berlian':
                        if (global.db.data.users[m.sender].berlian >= count * 1) {
                            global.db.data.users[m.sender].berlian -= count * 1
                            global.db.data.users[m.sender].money += Sberlian * count
                            conn.reply(m.chat, `Succes menjual ${count} berlian, dan anda mendapatkan ${Sberlian * count} money`, m)
                        } else conn.reply(m.chat, `Berlian anda tidak cukup`, m)
                        break
                   case 'gold':
                        if (global.db.data.users[m.sender].gold >= count * 1) {
                            global.db.data.users[m.sender].gold -= count * 1
                            global.db.data.users[m.sender].money += Sgold * count
                            conn.reply(m.chat, `Succes menjual ${count} gold , dan anda mendapatkan ${Sgold * count} money`, m)
                        } else conn.reply(m.chat, `gold anda tidak cukup`, m)
                        break  
                    case 'pet':
                        if (global.db.data.users[m.sender].pet >= count * 1) {
                            global.db.data.users[m.sender].pet -= count * 1
                            global.db.data.users[m.sender].money += Spet * count
                            conn.reply(m.chat, `Succes menjual ${count} pet random, dan anda mendapatkan ${Spet * count} money`, m)
                        } else conn.reply(m.chat, `Pet Random anda tidak cukup`, m)
                        break 
                    case 'petfood':
                        if (global.db.data.users[m.sender].petfood >= count * 1) {
                            global.db.data.users[m.sender].petfood -= count * 1
                            global.db.data.users[m.sender].money += Spetfood * count
                            conn.reply(m.chat, `Succes menjual ${count} makanan pet, dan anda mendapatkan ${Spetfood * count} money`, m)
                        } else conn.reply(m.chat, `Makanan pet anda tidak cukup`, m)
                        break
                    case 'aqua':
                        if (global.db.data.users[m.sender].aqua >= count * 1) {
                            global.db.data.users[m.sender].aqua -= count * 1
                            global.db.data.users[m.sender].money += Saqua * count
                            conn.reply(m.chat, `Succes menjual ${count} aqua, dan anda mendapatkan ${Saqua * count} money`, m)
                        } else conn.reply(m.chat, `Aqua anda tidak cukup`, m)
                        break
                    case 'coal':
                        if (global.db.data.users[m.sender].coal >= count * 1) {
                            global.db.data.users[m.sender].coal -= count * 1
                            global.db.data.users[m.sender].money += Scoal * count
                            conn.reply(m.chat, `Succes menjual ${count} coal, dan anda mendapatkan ${Scoal * count} money`, m)
                        } else conn.reply(m.chat, `coal anda tidak cukup`, m)
                        break
                    case 'pancingan':
                        if (global.db.data.users[m.sender].pancingan >= count * 1) {
                            global.db.data.users[m.sender].pancingan -= count * 1
                            global.db.data.users[m.sender].money += Spancingan * count
                            conn.reply(m.chat, `Succes menjual ${count} pancingan, dan anda mendapatkan ${Spancingan * count} money`, m)
                        } else conn.reply(m.chat, `Pancingan anda tidak cukup`, m)
                        break
                    case 'iron':
                        if (global.db.data.users[m.sender].iron >= count * 1) {
                            global.db.data.users[m.sender].iron -= count * 1
                            global.db.data.users[m.sender].money += Siron * count
                            conn.reply(m.chat, `Succes menjual ${count} pancingan, dan anda mendapatkan ${Siron * count} money`, m)
                        } else conn.reply(m.chat, `Iron anda tidak cukup`, m)
                        break
                    case 'string':
                        if (global.db.data.users[m.sender].string >= count * 1) {
                            global.db.data.users[m.sender].string -= count * 1
                            global.db.data.users[m.sender].money += Sstring * count
                            conn.reply(m.chat, `Succes menjual ${count} string, dan anda mendapatkan ${Sstring * count} money`, m)
                        } else conn.reply(m.chat, `String anda tidak cukup`, m)
                        break
                    case 'rock':
                        if (global.db.data.users[m.sender].rock >= count * 1) {
                            global.db.data.users[m.sender].rock -= count * 1
                            global.db.data.users[m.sender].money += Srock * count
                            conn.reply(m.chat, `Succes menjual ${count} rock, dan anda mendapatkan ${Srock * count} money`, m)
                        } else conn.reply(m.chat, `rock anda tidak cukup`, m)
                        break
                    case 'emerald':
                        if (global.db.data.users[m.sender].emerald >= count * 1) {
                            global.db.data.users[m.sender].emerald -= count * 1
                            global.db.data.users[m.sender].money += Semerald * count
                            conn.reply(m.chat, `Succes menjual ${count} emerald, dan anda mendapatkan ${Semerald * count} money`, m)
                        } else conn.reply(m.chat, `emerald anda tidak cukup`, m)
                        break
                    case 'jamur':
                        if (global.db.data.users[m.sender].mushrooms >= count * 1) {
                            global.db.data.users[m.sender].mushrooms -= count * 1
                            global.db.data.users[m.sender].money += Smushrooms * count
                            conn.reply(m.chat, `Succes menjual ${count} jamur, dan anda mendapatkan ${Smushrooms * count} money`, m)
                        } else conn.reply(m.chat, `jamur anda tidak cukup`, m)
                        break
case 'herbal':
                        if (global.db.data.users[m.sender].herbs >= count * 1) {
                            global.db.data.users[m.sender].herbs -= count * 1
                            global.db.data.users[m.sender].money += Sherbs * count
                            conn.reply(m.chat, `Succes menjual ${count} tanaman herbal, dan anda mendapatkan ${Sherbs * count} money`, m)
                        } else conn.reply(m.chat, `tanaman herbal anda tidak cukup`, m)
                        break
case 'kristal':
                        if (global.db.data.users[m.sender].crystal >= count * 1) {
                            global.db.data.users[m.sender].crystal -= count * 1
                            global.db.data.users[m.sender].money += Scrystal * count
                            conn.reply(m.chat, `Succes menjual ${count} kristal, dan anda mendapatkan ${Scrystal * count} money`, m)
                        } else conn.reply(m.chat, `kristal anda tidak cukup`, m)
                        break
case 'bulu':
                        if (global.db.data.users[m.sender].feathers >= count * 1) {
                            global.db.data.users[m.sender].feathers -= count * 1
                            global.db.data.users[m.sender].money += Sfeathers * count
                            conn.reply(m.chat, `Succes menjual ${count} bulu, dan anda mendapatkan ${Sfeathers * count} money`, m)
                        } else conn.reply(m.chat, `bulu anda tidak cukup`, m)
                        break
case 'madu':
                        if (global.db.data.users[m.sender].fruits >= count * 1) {
                            global.db.data.users[m.sender].fruits -= count * 1
                            global.db.data.users[m.sender].money += Sfruits * count
                            conn.reply(m.chat, `Succes menjual ${count} madu, dan anda mendapatkan ${Sfruits * count} money`, m)
                        } else conn.reply(m.chat, `madu anda tidak cukup`, m)
                        break
                    case 'diamond':
                        if (global.db.data.users[m.sender].diamond >= count * 1) {
                            global.db.data.users[m.sender].diamond -= count * 1
                            global.db.data.users[m.sender].money += Sdiamond * count
                            conn.reply(m.chat, `Succes menjual ${count} Diamond, dan anda mendapatkan ${Sdiamond * count} money`, m)
                        } else conn.reply(m.chat, `Diamond anda tidak cukup`, m)
                        break
                    default:
                        return conn.reply(m.chat, Kchat, m)
                }
                break
            default:
                return conn.reply(m.chat, Kchat, m)
            }
        }
    } catch (e) {
        conn.reply(m.chat, Kchat, m)
        console.log(e)
    }
}

handler.help = ['shop <sell|buy> <args>']
handler.tags = ['rpg']
    
handler.command = /^(shop)$/i
handler.limit = false
handler.group = true
export default handler
