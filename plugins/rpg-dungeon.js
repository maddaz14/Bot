async function handler(m, { conn, usedPrefix, command, text, args }) {
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = (await import("@fuxxy-star/baileys")).default
    let users = global.db.data.users[m.sender];
    let type = args[0]; // Get the difficulty type (easy, normal, or hard)
    let level = users.level;
    let lastDungeonTime = users.lastdungeon1 || 0;
    let currentTime = new Date().getTime();

    // Helper function to check cooldown
    function checkCooldown() {
        return currentTime - lastDungeonTime < 1800000;
    }

    // If type is undefined, list available dungeon levels
    if (!type) {
    let availableLevels = [
        '.dungeon easy\n\r\r\r\r\r╰╼ Level: _10_',
        '.dungeon normal\n\r\r\r\r\r╰╼ Level: _20_',
        '.dungeon hard\n\r\r\r\r\r╰╼ Level: _30_',
        '.dungeon extreme\n\r\r\r\r\r╰╼ Level: _40_',
        '.dungeon bos\n\r\r\r\r\r╰╼ Level: _100_',
        '.dungeon abyss\n\r\r\r\r\r╰╼ Level: _150_',
        '.dungeon king\n\r\r\r\r\r╰╼ Level: _180_',
        '.dungeon emperor\n\r\r\r\r\r╰╼ Level: _250_',
        '.dungeon demigod\n\r\r\r\r\r╰╼ Level: _500_',
        '.dungeon god\n\r\r\r\r\r╰╼ Level: _1000_'
    ];

    let pp = await conn
      .profilePictureUrl(m.sender, "image")
      .catch((_) => "https://telegra.ph/file/8904062b17875a2ab2984.jpg");
  let msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
            },
            interactiveMessage: {
              body: {
                text: `Level dungeon yang tersedia untuk kamu:\n\n${availableLevels.join('\n')}`,
              },
              footer: {
                text: wm,
              },
              header: {
                title: "",
                subtitle: "Server",
                hasMediaAttachment: true,
                ...(await prepareWAMessageMedia(
                  {
                    document: {
                      url: "https://chat.whatsapp.com/CZy0SzJKnfoLib7ICMjS4e",
                    },
                    mimetype: "image/webp",
                    fileName: `[ Hello ${m.name} ]`,
                    pageCount: 2024,
                    jpegThumbnail: await conn.resize(pp, 400, 400),
                    fileLength: 2024000,
                  },
                  { upload: conn.waUploadToServer },
                )),
              },
              contextInfo: {
                forwardingScore: 2024,
                isForwarded: true,
                mentionedJid: [m.sender],
                forwardedNewsletterMessageInfo: {
                  newsletterJid: "9999999@newsletter",
                  serverMessageId: null,
                  newsletterName: `© ${global.namebot}`,
                },
                externalAdReply: {
                  showAdAttribution: true,
                  title: "[ Yue Arifureta ]",
                  body: "",
                  mediaType: 1,
                  sourceUrl: "",
                  thumbnailUrl:
                    global.thumb,
                  renderLargerThumbnail: true,
                },
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: 
  '{"title":"Pilih Menu","sections":[{"title":"List Menu","highlight_label":"Noob","rows":[{"header":"","title":"Dungeon Easy ","description":"Minions Playground","id":".dungeon easy"},{"header":"","title":"Dungeon Normal","description":"Brave Adventurers Quest","id":".dungeon normal"},{"header":"","title":"Dungeon Hard","description":"Warriors Challenge","id":".dungeon hard"},{"header":"","title":"Dungeon Extreme","description":"Heros Trial","id":".dungeon extreme"},{"header":"","title":"Dungeon Boss","description":"Kings Battle","id":".dungeon bos"},{"header":"","title":"Dungeon Abyss","description":"Endless Darkness","id":".dungeon Abyss"},{"header":"","title":"Dungeon King","description":"Rulers Realm","id":".dungeon king"},{"header":"","title":"Dungeon Emperor","description":"Unconquerable Empire","id":".dungeon emperor"},{"header":"","title":"Dungeon DemiGod","description":"DemiGods Might","id":".dungeon demigod"},{"header":"","title":"Dungeon God","description":"Divine Supremacy","id":".dungeon god"}]}]}'
                  },
                ],
              },
            },
          },
        },
      },
      { quoted: m },
      {},
    );

    await conn.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id,
    });
    return;
}

    switch (type) {
        case 'easy':
            if (level < 10)
                return conn.reply(m.chat, `Kamu membutuhkan *Level 10* untuk bermain dungeon *easy*\nLevel Kamu: *${level}*`, m);

            if (checkCooldown()) {
                let remainingTime = 1800000 - (currentTime - lastDungeonTime);
                return conn.reply(m.chat, `Kamu sudah lelah untuk bermain Dungeon *Level easy*\nTunggu selama ${clockString(remainingTime)} lagi`, m);
            }
    // Notify user if the cooldown has expired
    setTimeout(() => {
            m.reply('Ayo Bermain Dungeon Kembali');
        }, 1800000);

            if (users.armor < 1 || users.sword < 1) return m.reply('Kamu belum cukup kuat untuk bermain di Dungeon level easy, karena belum memiliki *🧥Leather Armor* dan *🗡️Wooden Sword*\nSilahkan buy/craft terlebih dahulu.');
            
            if (users.armor < 1) return m.reply('Kamu blum memiliki *🧥Leather Armor* untuk bermain dungeon level easy\nSilahkan buy terlebih dahulu\nBeli Armor : *.shop buy armor*');
            
	if (users.sword < 1) return m.reply('Kamu blum memiliki *🗡️Wooden sword * untuk bermain dungeon level easy\nSilahkan buy terlebih dahulu\nBeli Sword : .*shop buy sword*');

            if (users.health < 90) return m.reply('Darah kamu kurang dari *90 ❤️* untuk bermain dungeon *Level easy*. Silahkan isi darah terlebih dahulu\nKetik: *.heal*');
            
            if (users.armordurability < 99) return m.reply('Durability Armor kamu kurang dari *99🛡️*, silahkan repair terlebih dahulu,\nKetik .repair');
            
	if (users.sworddurability < 99) return m.reply('Durability Sword kamu kurang dari *99🛡️*, silahkan repair terlebih dahulu,\nKetik .repair');

            // Rewards and updates
            let easyMoneyReward = Math.floor(Math.random() * 50000);
            let easyExpReward = Math.floor(Math.random() * 1000);
            let easyHealthLoss = Math.floor(Math.random() * 20);
            let easyArmorDuraLoss = Math.floor(Math.random() * 40);
            let easySwordDuraLoss = Math.floor(Math.random() * 40);
            let easyPotion = Math.floor(Math.random() * 10);
            let easyString = Math.floor(Math.random() * 10);
            let easyIron = Math.floor(Math.random() * 10);
            let easyDamage = Math.floor(Math.random() * 2000);
            let easyUncommon = Math.floor(Math.random() * 10);

            users.exp += easyExpReward;
            users.money += easyMoneyReward;
            users.health -= easyHealthLoss;
            users.armordurability -= easyArmorDuraLoss;
            users.sworddurability -= easySwordDuraLoss;
            users.potion += easyPotion;
            users.string += easyString;
            users.iron += easyIron;
            users.damage += easyDamage;
            users.uncommon += easyUncommon;
            users.lastdungeon1 = currentTime; // Update cooldown time

            let easyPonta = `Darah kamu berkurang *-${easyHealthLoss}❤️*, dan Sword durabilitymu berkurang *-${easySwordDuraLoss}🛡️*. Armor durability juga berkurang *-${easyArmorDuraLoss}🛡️* setelah mengalahkan monster di Dungeon level easy.
            
_*Hadiah yang kamu dapatkan*_
            
🥤 = [ *${easyPotion}* ] Potion
📦 = [ *${easyUncommon}* ] Uncommon
🕸️ = [ *${easyString}* ] String
⚙️ = [ *${easyIron}* ] Iron
💰 = [ *${easyMoneyReward}* ] Money
🧪 = [ *${easyExpReward}* ] Exp

_*Segera pulihkan kondisimu, dan mulai bermain dungeon kembali.*_`;

            setTimeout(() => {
                conn.reply(m.chat, 'Memasuki dungeon easy', m);
                setTimeout(() => {
                    conn.reply(m.chat, 'Berhasil keluar dari dungeon easy', m);
                    setTimeout(() => {
                        conn.reply(m.chat, easyPonta, floc);
                    }, 3000);
                }, 1500);
            }, 10);

            break;
        case 'normal':
            if (level < 20)
                return conn.reply(m.chat, `Kamu membutuhkan *Level 20* untuk bermain dungeon *normal*\nLevel Kamu: *${level}*`, m);

            if (checkCooldown()) {
                let remainingTime = 1800000 - (currentTime - lastDungeonTime);
                return conn.reply(m.chat, `Kamu sudah lelah untuk bermain Dungeon *Level normal*\nTunggu selama ${clockString(remainingTime)} lagi`, m);
            }
    // Notify user if the cooldown has expired
    setTimeout(() => {
            m.reply('Ayo Bermain Dungeon Kembali');
        }, 1800000);

            if (users.armor < 2 || users.sword < 2) return m.reply('Kamu belum cukup kuat untuk bermain di Dungeon level normal, karena belum memiliki *🧥Iron Armor* dan *🗡️Iron Sword*\nSilahkan buy/craft terlebih dahulu.');
            
            if (users.armor < 2) return m.reply('Kamu blum memiliki *🧥Iron Armor* untuk bermain dungeon level normal\nSilahkan buy terlebih dahulu\nBeli Armor : *.shop buy armor*');
            
	if (users.sword < 2) return m.reply('Kamu blum memiliki *🗡️Iron sword * untuk bermain dungeon level normal\nSilahkan buy terlebih dahulu\nBeli Sword : .*shop buy sword*');

            if (users.health < 150) return m.reply('Darah kamu kurang dari *150 ❤️* untuk bermain dungeon *Level normal*. Silahkan isi darah terlebih dahulu\nKetik: *.heal*');
            
            if (users.armordurability < 99) return m.reply('Durability Armor kamu kurang dari *99🛡️*, silahkan repair terlebih dahulu,\nKetik .repair');
            
	if (users.sworddurability < 99) return m.reply('Durability Sword kamu kurang dari *99🛡️*, silahkan repair terlebih dahulu,\nKetik .repair');

            // Rewards and updates
            let normalMoneyReward = Math.floor(Math.random() * 100000);
            let normalExpReward = Math.floor(Math.random() * 1000);
            let normalHealthLoss = Math.floor(Math.random() * 20);
            let normalArmorDuraLoss = Math.floor(Math.random() * 40);
            let normalSwordDuraLoss = Math.floor(Math.random() * 40);
            let normalPotion = Math.floor(Math.random() * 10);
            let normalString = Math.floor(Math.random() * 10);
            let normalIron = Math.floor(Math.random() * 10);
            let normalDamage = Math.floor(Math.random() * 2000);
            let normalUncommon = Math.floor(Math.random() * 10);

            users.exp += normalExpReward;
            users.money += normalMoneyReward;
            users.health -= normalHealthLoss;
            users.armordurability -= normalArmorDuraLoss;
            users.sworddurability -= normalSwordDuraLoss;
            users.potion += normalPotion;
            users.string += normalString;
            users.iron += normalIron;
            users.damage += normalDamage;
            users.uncommon += normalUncommon;
            users.lastdungeon1 = currentTime; // Update cooldown time

            let normalPonta = `Darah kamu berkurang *-${normalHealthLoss}❤️*, dan Sword durabilitymu berkurang *-${normalSwordDuraLoss}🛡️*. Armor durability juga berkurang *-${normalArmorDuraLoss}🛡️* setelah mengalahkan monster di Dungeon level normal.
            
_*Hadiah yang kamu dapatkan*_
            
🥤 = [ *${normalPotion}* ] Potion
📦 = [ *${normalUncommon}* ] Uncommon
🕸️ = [ *${normalString}* ] String
⚙️ = [ *${normalIron}* ] Iron
💰 = [ *${normalMoneyReward}* ] Money
🧪 = [ *${normalExpReward}* ] Exp

_*Segera pulihkan kondisimu, dan mulai bermain dungeon kembali.*_`;

            setTimeout(() => {
                conn.reply(m.chat, 'Memasuki dungeon normal', m);
                setTimeout(() => {
                    conn.reply(m.chat, 'Berhasil keluar dari dungeon normal', m);
                    setTimeout(() => {
                        conn.reply(m.chat, normalPonta, floc);
                    }, 3000);
                }, 1500);
            }, 10);

            break;
        case 'hard':
            if (level < 30)
                return conn.reply(m.chat, `Kamu membutuhkan *Level 30* untuk bermain dungeon *hard*\nLevel Kamu: *${level}*`, m);

            if (checkCooldown()) {
                let remainingTime = 1800000 - (currentTime - lastDungeonTime);
                return conn.reply(m.chat, `Kamu sudah lelah untuk bermain Dungeon *Level hard*\nTunggu selama ${clockString(remainingTime)} lagi`, m);
            }
    // Notify user if the cooldown has expired
    setTimeout(() => {
            m.reply('Ayo Bermain Dungeon Kembali');
        }, 1800000);

            if (users.armor < 3 || users.sword < 3) return m.reply('Kamu belum cukup kuat untuk bermain di Dungeon level hard, karena belum memiliki *🧥Gold Armor* dan *🗡️Gold Sword*\nSilahkan buy/craft terlebih dahulu.');
            
            if (users.armor < 3) return m.reply('Kamu blum memiliki *🧥Gold Armor* untuk bermain dungeon level hard\nSilahkan buy terlebih dahulu\nBeli Armor : *.shop buy armor*');
            
	if (users.sword < 3) return m.reply('Kamu blum memiliki *🗡️Gold Sword * untuk bermain dungeon level hard\nSilahkan buy terlebih dahulu\nBeli Sword : .*shop buy sword*');

            if (users.health < 300) return m.reply('Darah kamu kurang dari *300 ❤️* untuk bermain dungeon *Level hard*. Silahkan isi darah terlebih dahulu\nKetik: *.heal*');
            
            if (users.armordurability < 99) return m.reply('Durability Armor kamu kurang dari *99🛡️*, silahkan repair terlebih dahulu,\nKetik .repair');
            
	if (users.sworddurability < 99) return m.reply('Durability Sword kamu kurang dari *99🛡️*, silahkan repair terlebih dahulu,\nKetik .repair');

            // Rewards and updates
            let hardMoneyReward = Math.floor(Math.random() * 300000);
            let hardExpReward = Math.floor(Math.random() * 60000);
            let hardHealthLoss = Math.floor(Math.random() * 99);
            let hardArmorDuraLoss = Math.floor(Math.random() * 50);
            let hardSwordDuraLoss = Math.floor(Math.random() * 50);
            let hardPotion = Math.floor(Math.random() * 10);
            let hardString = Math.floor(Math.random() * 20);
            let hardIron = Math.floor(Math.random() * 20);
            let hardDamage = Math.floor(Math.random() * 2000);
            let hardUncommon = Math.floor(Math.random() * 20);

            users.exp += hardExpReward;
            users.money += hardMoneyReward;
            users.health -= hardHealthLoss;
            users.armordurability -= hardArmorDuraLoss;
            users.sworddurability -= hardSwordDuraLoss;
            users.potion += hardPotion;
            users.string += hardString;
            users.iron += hardIron;
            users.damage += hardDamage;
            users.uncommon += hardUncommon;
            users.lastdungeon1 = currentTime; // Update cooldown time

            let hardPonta = `Darah kamu berkurang *-${hardHealthLoss}❤️*, dan Sword durabilitymu berkurang *-${hardSwordDuraLoss}🛡️*. Armor durability juga berkurang *-${hardArmorDuraLoss}🛡️* setelah mengalahkan monster di Dungeon level hard.
            
_*Hadiah yang kamu dapatkan*_
            
🥤 = [ *${hardPotion}* ] Potion
📦 = [ *${hardUncommon}* ] Uncommon
🕸️ = [ *${hardString}* ] String
⚙️ = [ *${hardIron}* ] Iron
💰 = [ *${hardMoneyReward}* ] Money
🧪 = [ *${hardExpReward}* ] Exp

_*Segera pulihkan kondisimu, dan mulai bermain dungeon kembali.*_`;

            setTimeout(() => {
                conn.reply(m.chat, 'Memasuki dungeon hard', m);
                setTimeout(() => {
                    conn.reply(m.chat, 'Berhasil keluar dari dungeon hard', m);
                    setTimeout(() => {
                        conn.reply(m.chat, hardPonta, floc);
                    }, 3000);
                }, 1500);
            }, 10);

            break;
        case 'extreme':
            if (level < 40)
                return conn.reply(m.chat, `Kamu membutuhkan *Level 40* untuk bermain dungeon *extreme*\nLevel Kamu: *${level}*`, m);

            if (checkCooldown()) {
                let remainingTime = 1800000 - (currentTime - lastDungeonTime);
                return conn.reply(m.chat, `Kamu sudah lelah untuk bermain Dungeon *Level extreme*\nTunggu selama ${clockString(remainingTime)} lagi`, m);
            }
    // Notify user if the cooldown has expired
    setTimeout(() => {
            m.reply('Ayo Bermain Dungeon Kembali');
        }, 1800000);

            if (users.armor < 4 || users.sword < 4) return m.reply('Kamu belum cukup kuat untuk bermain di Dungeon level extreme, karena belum memiliki *🧥Diamond Armor* dan *🗡️Diamond Sword*\nSilahkan buy/craft terlebih dahulu.');
            
            if (users.armor < 4) return m.reply('Kamu blum memiliki *🧥Diamond Armor* untuk bermain dungeon level extreme\nSilahkan buy terlebih dahulu\nBeli Armor : *.shop buy armor*');
            
	if (users.sword < 4) return m.reply('Kamu blum memiliki *🗡️Diamond Sword * untuk bermain dungeon level extreme\nSilahkan buy terlebih dahulu\nBeli Sword : .*shop buy sword*');

            if (users.health < 350) return m.reply('Darah kamu kurang dari *350 ❤️* untuk bermain dungeon *Level extreme*. Silahkan isi darah terlebih dahulu\nKetik: *.heal*');
            
            if (users.armordurability < 99) return m.reply('Durability Armor kamu kurang dari *99🛡️*, silahkan repair terlebih dahulu,\nKetik .repair');
            
	if (users.sworddurability < 99) return m.reply('Durability Sword kamu kurang dari *99🛡️*, silahkan repair terlebih dahulu,\nKetik .repair');

            // Rewards and updates
            let extremeMoneyReward = Math.floor(Math.random() * 1000000);
            let extremeExpReward = Math.floor(Math.random() * 70000);
            let extremeHealthLoss = Math.floor(Math.random() * 99);
            let extremeArmorDuraLoss = Math.floor(Math.random() * 50);
            let extremeSwordDuraLoss = Math.floor(Math.random() * 50);
            let extremePotion = Math.floor(Math.random() * 20);
            let extremeString = Math.floor(Math.random() * 30);
            let extremeIron = Math.floor(Math.random() * 20);
            let extremeDamage = Math.floor(Math.random() * 2000);
            let extremeUncommon = Math.floor(Math.random() * 20);

            users.exp += extremeExpReward;
            users.money += extremeMoneyReward;
            users.health -= extremeHealthLoss;
            users.armordurability -= extremeArmorDuraLoss;
            users.sworddurability -= extremeSwordDuraLoss;
            users.potion += extremePotion;
            users.string += extremeString;
            users.iron += extremeIron;
            users.damage += extremeDamage;
            users.uncommon += extremeUncommon;
            users.lastdungeon1 = currentTime; // Update cooldown time

            let extremePonta = `Darah kamu berkurang *-${extremeHealthLoss}❤️*, dan Sword durabilitymu berkurang *-${extremeSwordDuraLoss}🛡️*. Armor durability juga berkurang *-${extremeArmorDuraLoss}🛡️* setelah mengalahkan monster di Dungeon level extreme.
            
_*Hadiah yang kamu dapatkan*_
            
🥤 = [ *${extremePotion}* ] Potion
📦 = [ *${extremeUncommon}* ] Uncommon
🕸️ = [ *${extremeString}* ] String
⚙️ = [ *${extremeIron}* ] Iron
💰 = [ *${extremeMoneyReward}* ] Money
🧪 = [ *${extremeExpReward}* ] Exp

_*Segera pulihkan kondisimu, dan mulai bermain dungeon kembali.*_`;

            setTimeout(() => {
                conn.reply(m.chat, 'Memasuki dungeon extreme', m);
                setTimeout(() => {
                    conn.reply(m.chat, 'Berhasil keluar dari dungeon extreme', m);
                    setTimeout(() => {
                        conn.reply(m.chat, extremePonta, floc);
                    }, 3000);
                }, 1500);
            }, 10);

            break;
        case 'bos':
            if (level < 100)
                return conn.reply(m.chat, `Kamu membutuhkan *Level 100* untuk bermain dungeon *bos*\nLevel Kamu: *${level}*`, m);

            if (checkCooldown()) {
                let remainingTime = 1800000 - (currentTime - lastDungeonTime);
                return conn.reply(m.chat, `Kamu sudah lelah untuk bermain Dungeon *Level bos*\nTunggu selama ${clockString(remainingTime)} lagi`, m);
            }
    // Notify user if the cooldown has expired
    setTimeout(() => {
            m.reply('Ayo Bermain Dungeon Kembali');
        }, 1800000);

            if (users.armor < 5 || users.sword < 5) return m.reply('Kamu belum cukup kuat untuk bermain di Dungeon level bos, karena belum memiliki *🧥Netherite Armor* dan *🗡️Netherite Sword*\nSilahkan buy/craft terlebih dahulu.');
            
            if (users.armor < 5) return m.reply('Kamu blum memiliki *🧥Netherite Armor* untuk bermain dungeon level bos\nSilahkan buy terlebih dahulu\nBeli Armor : *.shop buy armor*');
            
	if (users.sword < 5) return m.reply('Kamu blum memiliki *🗡️Netherite Sword * untuk bermain dungeon level bos\nSilahkan buy terlebih dahulu\nBeli Sword : .*shop buy sword*');

            if (users.health < 600) return m.reply('Darah kamu kurang dari *600 ❤️* untuk bermain dungeon *Level bos*. Silahkan isi darah terlebih dahulu\nKetik: *.heal*');
            
            if (users.armordurability < 99) return m.reply('Durability Armor kamu kurang dari *99🛡️*, silahkan repair terlebih dahulu,\nKetik .repair');
            
	if (users.sworddurability < 99) return m.reply('Durability Sword kamu kurang dari *99🛡️*, silahkan repair terlebih dahulu,\nKetik .repair');

            // Rewards and updates
            let bosMoneyReward = Math.floor(Math.random() * 4000000);
            let bosExpReward = Math.floor(Math.random() * 80000);
            let bosHealthLoss = Math.floor(Math.random() * 120);
            let bosArmorDuraLoss = Math.floor(Math.random() * 70);
            let bosSwordDuraLoss = Math.floor(Math.random() * 50);
            let bosPotion = Math.floor(Math.random() * 30);
            let bosString = Math.floor(Math.random() * 40);
            let bosIron = Math.floor(Math.random() * 30);
            let bosDamage = Math.floor(Math.random() * 2000);
            let bosUncommon = Math.floor(Math.random() * 20);

            users.exp += bosExpReward;
            users.money += bosMoneyReward;
            users.health -= bosHealthLoss;
            users.armordurability -= bosArmorDuraLoss;
            users.sworddurability -= bosSwordDuraLoss;
            users.potion += bosPotion;
            users.string += bosString;
            users.iron += bosIron;
            users.damage += bosDamage;
            users.uncommon += bosUncommon;
            users.lastdungeon1 = currentTime; // Update cooldown time

            let bosPonta = `Darah kamu berkurang *-${bosHealthLoss}❤️*, dan Sword durabilitymu berkurang *-${bosSwordDuraLoss}🛡️*. Armor durability juga berkurang *-${bosArmorDuraLoss}🛡️* setelah mengalahkan monster di Dungeon level bos.
            
_*Hadiah yang kamu dapatkan*_
            
🥤 = [ *${bosPotion}* ] Potion
📦 = [ *${bosUncommon}* ] Uncommon
🕸️ = [ *${bosString}* ] String
⚙️ = [ *${bosIron}* ] Iron
💰 = [ *${bosMoneyReward}* ] Money
🧪 = [ *${bosExpReward}* ] Exp

_*Segera pulihkan kondisimu, dan mulai bermain dungeon kembali.*_`;

            setTimeout(() => {
                conn.reply(m.chat, 'Memasuki dungeon bos', m);
                setTimeout(() => {
                    conn.reply(m.chat, 'Berhasil keluar dari dungeon bos', m);
                    setTimeout(() => {
                        conn.reply(m.chat, bosPonta, floc);
                    }, 3000);
                }, 1500);
            }, 10);

            break;
        case 'abyss':
            if (level < 150)
                return conn.reply(m.chat, `Kamu membutuhkan *Level 150* untuk bermain dungeon *abyss*\nLevel Kamu: *${level}*`, m);

            if (checkCooldown()) {
                let remainingTime = 1800000 - (currentTime - lastDungeonTime);
                return conn.reply(m.chat, `Kamu sudah lelah untuk bermain Dungeon *Level abyss*\nTunggu selama ${clockString(remainingTime)} lagi`, m);
            }
    // Notify user if the cooldown has expired
    setTimeout(() => {
            m.reply('Ayo Bermain Dungeon Kembali');
        }, 1800000);

            if (users.armor < 6 || users.sword < 6) return m.reply('Kamu belum cukup kuat untuk bermain di Dungeon level abyss, karena belum memiliki *🧥Dragonplate Armor* dan *🗡️Shadowbane Sword*\nSilahkan buy/craft terlebih dahulu.');
            
            if (users.armor < 6) return m.reply('Kamu blum memiliki *🧥Dragonplate Armor* untuk bermain dungeon level abyss\nSilahkan buy terlebih dahulu\nBeli Armor : *.shop buy armor*');
            
	if (users.sword < 6) return m.reply('Kamu blum memiliki *🗡️Shadowbane Sword * untuk bermain dungeon level abyss\nSilahkan buy terlebih dahulu\nBeli Sword : .*shop buy sword*');

            if (users.health < 800) return m.reply('Darah kamu kurang dari *800 ❤️* untuk bermain dungeon *Level abyss*. Silahkan isi darah terlebih dahulu\nKetik: *.heal*');
            
            if (users.armordurability < 99) return m.reply('Durability Armor kamu kurang dari *99🛡️*, silahkan repair terlebih dahulu,\nKetik .repair');
            
	if (users.sworddurability < 99) return m.reply('Durability Sword kamu kurang dari *99🛡️*, silahkan repair terlebih dahulu,\nKetik .repair');

            // Rewards and updates
            let abyssMoneyReward = Math.floor(Math.random() * 6000000);
            let abyssExpReward = Math.floor(Math.random() * 90000);
            let abyssHealthLoss = Math.floor(Math.random() * 120);
            let abyssArmorDuraLoss = Math.floor(Math.random() * 80);
            let abyssSwordDuraLoss = Math.floor(Math.random() * 60);
            let abyssPotion = Math.floor(Math.random() * 35);
            let abyssString = Math.floor(Math.random() * 50);
            let abyssIron = Math.floor(Math.random() * 60);
            let abyssDamage = Math.floor(Math.random() * 2000);
            let abyssUncommon = Math.floor(Math.random() * 20);

            users.exp += abyssExpReward;
            users.money += abyssMoneyReward;
            users.health -= abyssHealthLoss;
            users.armordurability -= abyssArmorDuraLoss;
            users.sworddurability -= abyssSwordDuraLoss;
            users.potion += abyssPotion;
            users.string += abyssString;
            users.iron += abyssIron;
            users.damage += abyssDamage;
            users.uncommon += abyssUncommon;
            users.lastdungeon1 = currentTime; // Update cooldown time

            let abyssPonta = `Darah kamu berkurang *-${abyssHealthLoss}❤️*, dan Sword durabilitymu berkurang *-${abyssSwordDuraLoss}🛡️*. Armor durability juga berkurang *-${abyssArmorDuraLoss}🛡️* setelah mengalahkan monster di Dungeon level abyss.
            
_*Hadiah yang kamu dapatkan*_
            
🥤 = [ *${abyssPotion}* ] Potion
📦 = [ *${abyssUncommon}* ] Uncommon
🕸️ = [ *${abyssString}* ] String
⚙️ = [ *${abyssIron}* ] Iron
💰 = [ *${abyssMoneyReward}* ] Money
🧪 = [ *${abyssExpReward}* ] Exp

_*Segera pulihkan kondisimu, dan mulai bermain dungeon kembali.*_`;

            setTimeout(() => {
                conn.reply(m.chat, 'Memasuki dungeon abyss', m);
                setTimeout(() => {
                    conn.reply(m.chat, 'Berhasil keluar dari dungeon abyss', m);
                    setTimeout(() => {
                        conn.reply(m.chat, abyssPonta, floc);
                    }, 3000);
                }, 1500);
            }, 10);

            break;
        case 'king':
            if (level < 180)
                return conn.reply(m.chat, `Kamu membutuhkan *Level 180* untuk bermain dungeon *king*\nLevel Kamu: *${level}*`, m);

            if (checkCooldown()) {
                let remainingTime = 1800000 - (currentTime - lastDungeonTime);
                return conn.reply(m.chat, `Kamu sudah lelah untuk bermain Dungeon *Level king*\nTunggu selama ${clockString(remainingTime)} lagi`, m);
            }
    // Notify user if the cooldown has expired
    setTimeout(() => {
            m.reply('Ayo Bermain Dungeon Kembali');
        }, 1800000);

            if (users.armor < 7 || users.sword < 7) return m.reply('Kamu belum cukup kuat untuk bermain di Dungeon level king, karena belum memiliki *🧥Celestial Armor* dan *🗡️Stormbringer Sword*\nSilahkan buy/craft terlebih dahulu.');
            
            if (users.armor < 7) return m.reply('Kamu blum memiliki *🧥Celestial Armor* untuk bermain dungeon level king\nSilahkan buy terlebih dahulu\nBeli Armor : *.shop buy armor*');
            
	if (users.sword < 7) return m.reply('Kamu blum memiliki *🗡️Stormbringer Sword * untuk bermain dungeon level king\nSilahkan buy terlebih dahulu\nBeli Sword : .*shop buy sword*');

            if (users.health < 1000) return m.reply('Darah kamu kurang dari *1000 ❤️* untuk bermain dungeon *Level king*. Silahkan isi darah terlebih dahulu\nKetik: *.heal*');
            
            if (users.armordurability < 99) return m.reply('Durability Armor kamu kurang dari *99🛡️*, silahkan repair terlebih dahulu,\nKetik .repair');
            
	if (users.sworddurability < 99) return m.reply('Durability Sword kamu kurang dari *99🛡️*, silahkan repair terlebih dahulu,\nKetik .repair');

            // Rewards and updates
            let kingMoneyReward = Math.floor(Math.random() * 7000000);
            let kingExpReward = Math.floor(Math.random() * 90000);
            let kingHealthLoss = Math.floor(Math.random() * 120);
            let kingArmorDuraLoss = Math.floor(Math.random() * 80);
            let kingSwordDuraLoss = Math.floor(Math.random() * 60);
            let kingPotion = Math.floor(Math.random() * 35);
            let kingString = Math.floor(Math.random() * 50);
            let kingIron = Math.floor(Math.random() * 60);
            let kingDamage = Math.floor(Math.random() * 2000);
            let kingUncommon = Math.floor(Math.random() * 20);

            users.exp += kingExpReward;
            users.money += kingMoneyReward;
            users.health -= kingHealthLoss;
            users.armordurability -= kingArmorDuraLoss;
            users.sworddurability -= kingSwordDuraLoss;
            users.potion += kingPotion;
            users.string += kingString;
            users.iron += kingIron;
            users.damage += kingDamage;
            users.uncommon += kingUncommon;
            users.lastdungeon1 = currentTime; // Update cooldown time

            let kingPonta = `Darah kamu berkurang *-${kingHealthLoss}❤️*, dan Sword durabilitymu berkurang *-${kingSwordDuraLoss}🛡️*. Armor durability juga berkurang *-${kingArmorDuraLoss}🛡️* setelah mengalahkan monster di Dungeon level king.
            
_*Hadiah yang kamu dapatkan*_
            
🥤 = [ *${kingPotion}* ] Potion
📦 = [ *${kingUncommon}* ] Uncommon
🕸️ = [ *${kingString}* ] String
⚙️ = [ *${kingIron}* ] Iron
💰 = [ *${kingMoneyReward}* ] Money
🧪 = [ *${kingExpReward}* ] Exp

_*Segera pulihkan kondisimu, dan mulai bermain dungeon kembali.*_`;

            setTimeout(() => {
                conn.reply(m.chat, 'Memasuki dungeon king', m);
                setTimeout(() => {
                    conn.reply(m.chat, 'Berhasil keluar dari dungeon king', m);
                    setTimeout(() => {
                        conn.reply(m.chat, kingPonta, floc);
                    }, 3000);
                }, 1500);
            }, 10);

            break;
        case 'emperor':
            if (level < 250)
                return conn.reply(m.chat, `Kamu membutuhkan *Level 250* untuk bermain dungeon *emperor*\nLevel Kamu: *${level}*`, m);

            if (checkCooldown()) {
                let remainingTime = 1800000 - (currentTime - lastDungeonTime);
                return conn.reply(m.chat, `Kamu sudah lelah untuk bermain Dungeon *Level emperor*\nTunggu selama ${clockString(remainingTime)} lagi`, m);
            }
    // Notify user if the cooldown has expired
    setTimeout(() => {
            m.reply('Ayo Bermain Dungeon Kembali');
        }, 1800000);

            if (users.armor < 8 || users.sword < 8) return m.reply('Kamu belum cukup kuat untuk bermain di Dungeon level emperor, karena belum memiliki *🧥Stormbringer Armor* dan *🗡️Excalibur Sword*\nSilahkan buy/craft terlebih dahulu.');
            
            if (users.armor < 8) return m.reply('Kamu blum memiliki *🧥Stormbringer Armor* untuk bermain dungeon level emperor\nSilahkan buy terlebih dahulu\nBeli Armor : *.shop buy armor*');
            
	if (users.sword < 8) return m.reply('Kamu blum memiliki *🗡️Excalibur Sword * untuk bermain dungeon level emperor\nSilahkan buy terlebih dahulu\nBeli Sword : .*shop buy sword*');

            if (users.health < 1200) return m.reply('Darah kamu kurang dari *1200 ❤️* untuk bermain dungeon *Level emperor*. Silahkan isi darah terlebih dahulu\nKetik: *.heal*');
            
            if (users.armordurability < 99) return m.reply('Durability Armor kamu kurang dari *99🛡️*, silahkan repair terlebih dahulu,\nKetik .repair');
            
	if (users.sworddurability < 99) return m.reply('Durability Sword kamu kurang dari *99🛡️*, silahkan repair terlebih dahulu,\nKetik .repair');

            // Rewards and updates
            let emperorMoneyReward = Math.floor(Math.random() * 8000000);
            let emperorExpReward = Math.floor(Math.random() * 100000);
            let emperorHealthLoss = Math.floor(Math.random() * 200);
            let emperorArmorDuraLoss = Math.floor(Math.random() * 600);
            let emperorSwordDuraLoss = Math.floor(Math.random() * 60);
            let emperorPotion = Math.floor(Math.random() * 30);
            let emperorString = Math.floor(Math.random() * 190);
            let emperorIron = Math.floor(Math.random() * 500);
            let emperorDamage = Math.floor(Math.random() * 3000);
            let emperorUncommon = Math.floor(Math.random() * 60);

            users.exp += emperorExpReward;
            users.money += emperorMoneyReward;
            users.health -= emperorHealthLoss;
            users.armordurability -= emperorArmorDuraLoss;
            users.sworddurability -= emperorSwordDuraLoss;
            users.potion += emperorPotion;
            users.string += emperorString;
            users.iron += emperorIron;
            users.damage += emperorDamage;
            users.uncommon += emperorUncommon;
            users.lastdungeon1 = currentTime; // Update cooldown time

            let emperorPonta = `Darah kamu berkurang *-${emperorHealthLoss}❤️*, dan Sword durabilitymu berkurang *-${emperorSwordDuraLoss}🛡️*. Armor durability juga berkurang *-${emperorArmorDuraLoss}🛡️* setelah mengalahkan monster di Dungeon level emperor.
            
_*Hadiah yang kamu dapatkan*_
            
🥤 = [ *${emperorPotion}* ] Potion
📦 = [ *${emperorUncommon}* ] Uncommon
🕸️ = [ *${emperorString}* ] String
⚙️ = [ *${emperorIron}* ] Iron
💰 = [ *${emperorMoneyReward}* ] Money
🧪 = [ *${emperorExpReward}* ] Exp

_*Segera pulihkan kondisimu, dan mulai bermain dungeon kembali.*_`;

            setTimeout(() => {
                conn.reply(m.chat, 'Memasuki dungeon emperor', m);
                setTimeout(() => {
                    conn.reply(m.chat, 'Berhasil keluar dari dungeon emperor', m);
                    setTimeout(() => {
                        conn.reply(m.chat, emperorPonta, floc);
                    }, 3000);
                }, 1500);
            }, 10);

            break;
        case 'demigod':
            if (level < 500)
                return conn.reply(m.chat, `Kamu membutuhkan *Level 500* untuk bermain dungeon *demigod*\nLevel Kamu: *${level}*`, m);

            if (checkCooldown()) {
                let remainingTime = 1800000 - (currentTime - lastDungeonTime);
                return conn.reply(m.chat, `Kamu sudah lelah untuk bermain Dungeon *Level demigod*\nTunggu selama ${clockString(remainingTime)} lagi`, m);
            }
    // Notify user if the cooldown has expired
    setTimeout(() => {
            m.reply('Ayo Bermain Dungeon Kembali');
        }, 1800000);

            if (users.armor < 8 || users.sword < 8) return m.reply('Kamu belum cukup kuat untuk bermain di Dungeon level demigod, karena belum memiliki *🧥Stormbringer Armor* dan *🗡️Excalibur Sword*\nSilahkan buy/craft terlebih dahulu.');
            
            if (users.armor < 8) return m.reply('Kamu blum memiliki *🧥Stormbringer Armor* untuk bermain dungeon level demigod\nSilahkan buy terlebih dahulu\nBeli Armor : *.shop buy armor*');
            
	if (users.sword < 8) return m.reply('Kamu blum memiliki *🗡️Excalibur Sword * untuk bermain dungeon level demigod\nSilahkan buy terlebih dahulu\nBeli Sword : .*shop buy sword*');

            if (users.health < 1300) return m.reply('Darah kamu kurang dari *1300 ❤️* untuk bermain dungeon *Level demigod*. Silahkan isi darah terlebih dahulu\nKetik: *.heal*');
            
            if (users.armordurability < 99) return m.reply('Durability Armor kamu kurang dari *99🛡️*, silahkan repair terlebih dahulu,\nKetik .repair');
            
	if (users.sworddurability < 99) return m.reply('Durability Sword kamu kurang dari *99🛡️*, silahkan repair terlebih dahulu,\nKetik .repair');

            // Rewards and updates
            let demigodMoneyReward = Math.floor(Math.random() * 9000000);
            let demigodExpReward = Math.floor(Math.random() * 100000);
            let demigodHealthLoss = Math.floor(Math.random() * 200);
            let demigodArmorDuraLoss = Math.floor(Math.random() * 600);
            let demigodSwordDuraLoss = Math.floor(Math.random() * 60);
            let demigodPotion = Math.floor(Math.random() * 30);
            let demigodString = Math.floor(Math.random() * 190);
            let demigodIron = Math.floor(Math.random() * 500);
            let demigodDamage = Math.floor(Math.random() * 3000);
            let demigodUncommon = Math.floor(Math.random() * 60);

            users.exp += demigodExpReward;
            users.money += demigodMoneyReward;
            users.health -= demigodHealthLoss;
            users.armordurability -= demigodArmorDuraLoss;
            users.sworddurability -= demigodSwordDuraLoss;
            users.potion += demigodPotion;
            users.string += demigodString;
            users.iron += demigodIron;
            users.damage += demigodDamage;
            users.uncommon += demigodUncommon;
            users.lastdungeon1 = currentTime; // Update cooldown time

            let demigodPonta = `Darah kamu berkurang *-${demigodHealthLoss}❤️*, dan Sword durabilitymu berkurang *-${demigodSwordDuraLoss}🛡️*. Armor durability juga berkurang *-${demigodArmorDuraLoss}🛡️* setelah mengalahkan monster di Dungeon level demigod.
            
_*Hadiah yang kamu dapatkan*_
            
🥤 = [ *${demigodPotion}* ] Potion
📦 = [ *${demigodUncommon}* ] Uncommon
🕸️ = [ *${demigodString}* ] String
⚙️ = [ *${demigodIron}* ] Iron
💰 = [ *${demigodMoneyReward}* ] Money
🧪 = [ *${demigodExpReward}* ] Exp

_*Segera pulihkan kondisimu, dan mulai bermain dungeon kembali.*_`;

            setTimeout(() => {
                conn.reply(m.chat, 'Memasuki dungeon demigod', m);
                setTimeout(() => {
                    conn.reply(m.chat, 'Berhasil keluar dari dungeon demigod', m);
                    setTimeout(() => {
                        conn.reply(m.chat, demigodPonta, floc);
                    }, 3000);
                }, 1500);
            }, 10);

            break;
        case 'god':
            if (level < 1000)
                return conn.reply(m.chat, `Kamu membutuhkan *Level 1000* untuk bermain dungeon *god*\nLevel Kamu: *${level}*`, m);

            if (checkCooldown()) {
                let remainingTime = 1800000 - (currentTime - lastDungeonTime);
                return conn.reply(m.chat, `Kamu sudah lelah untuk bermain Dungeon *Level god*\nTunggu selama ${clockString(remainingTime)} lagi`, m);
            }
    // Notify user if the cooldown has expired
    setTimeout(() => {
            m.reply('Ayo Bermain Dungeon Kembali');
        }, 1800000);

            if (users.armor < 8 || users.sword < 8) return m.reply('Kamu belum cukup kuat untuk bermain di Dungeon level god, karena belum memiliki *🧥Stormbringer Armor* dan *🗡️Excalibur Sword*\nSilahkan buy/craft terlebih dahulu.');
            
            if (users.armor < 8) return m.reply('Kamu blum memiliki *🧥Stormbringer Armor* untuk bermain dungeon level god\nSilahkan buy terlebih dahulu\nBeli Armor : *.shop buy armor*');
            
	if (users.sword < 8) return m.reply('Kamu blum memiliki *🗡️Excalibur Sword * untuk bermain dungeon level god\nSilahkan buy terlebih dahulu\nBeli Sword : .*shop buy sword*');

            if (users.health < 1400) return m.reply('Darah kamu kurang dari *1400 ❤️* untuk bermain dungeon *Level god*. Silahkan isi darah terlebih dahulu\nKetik: *.heal*');
            
            if (users.armordurability < 99) return m.reply('Durability Armor kamu kurang dari *99🛡️*, silahkan repair terlebih dahulu,\nKetik .repair');
            
	if (users.sworddurability < 99) return m.reply('Durability Sword kamu kurang dari *99🛡️*, silahkan repair terlebih dahulu,\nKetik .repair');

            // Rewards and updates
            let godMoneyReward = Math.floor(Math.random() * 10000000);
            let godExpReward = Math.floor(Math.random() * 300000);
            let godHealthLoss = Math.floor(Math.random() * 200);
            let godArmorDuraLoss = Math.floor(Math.random() * 600);
            let godSwordDuraLoss = Math.floor(Math.random() * 60);
            let godPotion = Math.floor(Math.random() * 30);
            let godString = Math.floor(Math.random() * 190);
            let godIron = Math.floor(Math.random() * 500);
            let godDamage = Math.floor(Math.random() * 3000);
            let godUncommon = Math.floor(Math.random() * 60);

            users.exp += godExpReward;
            users.money += godMoneyReward;
            users.health -= godHealthLoss;
            users.armordurability -= godArmorDuraLoss;
            users.sworddurability -= godSwordDuraLoss;
            users.potion += godPotion;
            users.string += godString;
            users.iron += godIron;
            users.damage += godDamage;
            users.uncommon += godUncommon;
            users.lastdungeon1 = currentTime; // Update cooldown time

            let godPonta = `Darah kamu berkurang *-${godHealthLoss}❤️*, dan Sword durabilitymu berkurang *-${godSwordDuraLoss}🛡️*. Armor durability juga berkurang *-${godArmorDuraLoss}🛡️* setelah mengalahkan monster di Dungeon level god.
            
_*Hadiah yang kamu dapatkan*_
            
🥤 = [ *${godPotion}* ] Potion
📦 = [ *${godUncommon}* ] Uncommon
🕸️ = [ *${godString}* ] String
⚙️ = [ *${godIron}* ] Iron
💰 = [ *${godMoneyReward}* ] Money
🧪 = [ *${godExpReward}* ] Exp

_*Segera pulihkan kondisimu, dan mulai bermain dungeon kembali.*_`;

            setTimeout(() => {
                conn.reply(m.chat, 'Memasuki dungeon god', m);
                setTimeout(() => {
                    conn.reply(m.chat, 'Berhasil keluar dari dungeon god', m);
                    setTimeout(() => {
                        conn.reply(m.chat, godPonta, floc);
                    }, 3000);
                }, 1500);
            }, 10);

            break;
    }
}

handler.help = ['dungeon'];
handler.command = /^(dungeon)$/i;
handler.register = true;
handler.group = true;
handler.limit = 1;

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

export default handler;

function clockString(ms) {
    let d = Math.floor(ms / 86400000);
    let h = Math.floor(ms / 3600000) % 24;
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return `${d} *Hari* ${h} *Jam* ${m} *Menit* ${s} *Detik*`;
}
