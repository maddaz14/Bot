// Dibuat oleh ubed - Dilarang keras menyalin tanpa izin!
// --- Kode Plugin Dimulai di sini ---
import { smsg } from '../lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile, readFileSync } from 'fs'
import fetch from 'node-fetch'
import moment from 'moment-timezone'
import PhoneNumber from 'awesome-phonenumber'
import fs from 'fs'

const ffCharacters = [
    { name: 'Kelly', skill: 'Dash', tagline: 'Si Cepat', imageUrl: 'https://telegra.ph/file/f787b47d56941b8fdd221.jpg' },
    { name: 'Andrew', skill: 'Armor Specialist', tagline: 'Sang Pelindung', imageUrl: 'https://telegra.ph/file/8904062b17875a2ab2984.jpg' },
    { name: 'Hayato', skill: 'Bushido', tagline: 'Samurai One Shot', imageUrl: 'https://telegra.ph/file/a65184a676cd648de34c3.jpg' },
    { name: 'Moco', skill: 'Hacker\'s Eye', tagline: 'Detektif Pintar', imageUrl: 'https://telegra.ph/file/2294b7ab49eca8a8046b2.jpg' },
    { name: 'Alok', skill: 'Drop the Beat', tagline: 'Support Legendaris', imageUrl: 'https://telegra.ph/file/180e28807e78419d45537.jpg' }
];

const ffRanks = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Heroic', 'Grandmaster'];
const cooldownFF = 1 * 60 * 60 * 1000; // 1 jam

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];
    let userName = await conn.getName(m.sender);

    // Inisialisasi properti user
    user.ffrpg = user.ffrpg || {};
    user.ffrpg.character = user.ffrpg.character || null;
    user.ffrpg.kills = user.ffrpg.kills || 0;
    user.ffrpg.rank = user.ffrpg.rank || ffRanks[0]; // Default Bronze
    user.ffrpg.lastPlay = user.ffrpg.lastPlay || 0;
    user.money = user.money || 0;
    user.exp = user.exp || 0;
    
    // Default URL untuk gambar RPG, sesuaikan jika perlu
    let defaultRPGImage = 'https://telegra.ph/file/8904062b17875a2ab2984.jpg';
    let fotorpg = global.fotorpg || defaultRPGImage;
    const primaryOwnerJid = global.owner[0][0] + '@s.whatsapp.net';

    // --- Main Menu (jika tidak ada subcommand atau subcommand tidak dikenal) ---
    if (!args[0] || !['create', 'choose', 'play', 'profile'].includes(args[0])) {
        let oya = `
🌟 *SELAMAT DATANG DI FREE FIRE RPG!* 🌟
----------------------------------------
✨ Yuk, rasakan sensasi Battle Royale di sini!

Pilih menu di bawah ya:
• 🔫 *${usedPrefix}ffrpg create*: Buat karakter FF-mu!
• 🗺️ *${usedPrefix}ffrpg play*: Mulai pertandingan Battle Royale.
• 👤 *${usedPrefix}ffrpg profile*: Cek statistik FF-mu.
----------------------------------------
Ayo Booyah bareng! 🎉
`.trim();

        const interactiveButtons = [
            {
                name: "single_select",
                buttonParamsJson: JSON.stringify({
                    title: "Pilih Menu 🌟",
                    sections: [{
                        title: "List Menu",
                        highlight_label: "RPG",
                        rows: [
                            { header: "🔫", title: "Buat Karakter", description: "Pilih karakter FF", id: `${usedPrefix}ffrpg create` },
                            { header: "🗺️", title: "Mulai Bermain", description: "Terjun ke medan perang", id: `${usedPrefix}ffrpg play` },
                            { header: "👤", title: "Cek Profil", description: "Lihat statistik FF-mu", id: `${usedPrefix}ffrpg profile` }
                        ]
                    }]
                })
            }
        ];

        return conn.sendMessage(m.chat, {
            product: {
                productImage: { url: fotorpg },
                productId: '9999999999999999',
                title: 'Free Fire RPG',
                description: 'Bertarunglah hingga Booyah!',
                currencyCode: 'IDR',
                priceAmount1000: '0',
                retailerId: 'ffrpg-menu',
                url: 'https://api.ubed.my.id',
                productImageCount: 1
            },
            businessOwnerJid: primaryOwnerJid,
            caption: oya,
            title: '✨ Menu Free Fire RPG ✨',
            subtitle: `Hello, ${userName}!`,
            footer: `> © ${global.namebot || 'Bot'} 🌟`,
            interactiveButtons: interactiveButtons,
            hasMediaAttachment: false
        }, { quoted: m }); // Gunakan m sebagai quoted untuk pesan produk
    }

    // --- Subcommand: create/choose ---
    if (args[0] === 'create' || args[0] === 'choose') {
        if (user.ffrpg.character) {
            return conn.reply(m.chat, `❌ Kakak sudah punya karakter FF (*${user.ffrpg.character}*) kok! ✨\n\nUntuk bermain, ketik *${usedPrefix}ffrpg play* ya!`, m);
        }
        if (!args[1]) {
            let charList = ffCharacters.map((char, i) => `• ${i + 1}. *${char.name}* (${char.tagline}) - Skill: ${char.skill}`).join('\n');
            
            const interactiveCharButtons = ffCharacters.map(char => ({
                header: `Karakter ${char.name}`,
                title: char.name,
                description: `Skill: ${char.skill} - ${char.tagline}`,
                id: `${usedPrefix}ffrpg create ${char.name}`
            }));

            const listMessage = {
                title: "Pilih Karakter FF",
                text: `🔫 *PILIH KARAKTER FREE FIRE!* 🔫\n----------------------------------------\n✨ Yuk, pilih karakter favoritmu untuk memulai petualangan Battle Royale!\n\n*Daftar Karakter:*\n${charList}\n\nPilih dengan bijak ya, Player! 💖\n\n> © ${global.namebot || 'Bot'} 2025 ✨`,
                footer: "Pilih karaktermu di bawah ini",
                buttonText: "Pilih Karakter",
                sections: [{
                    title: "Daftar Karakter Free Fire",
                    highlight_label: "Pilih Salah Satu",
                    rows: interactiveCharButtons
                }],
                contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        showAdAttribution: true,
                        title: `Pilih Karaktermu, ${userName}!`,
                        body: "Mulai petualanganmu sekarang!",
                        mediaType: 1,
                        sourceUrl: "https://api.ubed.my.id",
                        thumbnailUrl: fotorpg,
                        renderLargerThumbnail: true
                    }
                }
            };
            return await conn.sendMessage(m.chat, listMessage, { quoted: m });
        }
        let chosenCharName = args.slice(1).join(' ').trim();
        let chosenChar = ffCharacters.find(c => c.name.toLowerCase() === chosenCharName.toLowerCase());
        if (!chosenChar) {
            return conn.reply(m.chat, `❌ Karakter *"${chosenCharName}"* tidak ditemukan. 😥 Pilih dari daftar ya!`, m);
        }
        user.ffrpg.character = chosenChar.name;
        user.ffrpg.kills = 0;
        user.ffrpg.rank = ffRanks[0];
        user.ffrpg.lastPlay = 0;

        let charImageUrl = chosenChar.imageUrl;
        const interactiveButtons = [
            {
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                    title: 'Aksi Selanjutnya',
                    sections: [{
                        title: "Ayo Main!",
                        highlight_label: "Pilih Salah Satu",
                        rows: [
                            { header: "", title: "Mulai Bermain 🔫", id: `${usedPrefix}ffrpg play` },
                            { header: "", title: "Cek Profil 👤", id: `${usedPrefix}ffrpg profile` }
                        ]
                    }]
                })
            }
        ];

        return conn.sendMessage(m.chat, {
            product: {
                productImage: { url: charImageUrl },
                productId: '9999999999999999',
                title: `Karakter Terpilih: ${chosenChar.name}`,
                description: chosenChar.tagline,
                currencyCode: 'IDR',
                priceAmount1000: '0',
                retailerId: 'ffrpg-char-selected',
                url: 'https://api.ubed.my.id',
                productImageCount: 1
            },
            businessOwnerJid: primaryOwnerJid,
            caption: `✅ Selamat! Kakak telah memilih karakter *${chosenChar.name}* (${chosenChar.tagline}) untuk Free Fire RPG! 🎉\n\nSekarang, ketik *${usedPrefix}ffrpg play* untuk memulai pertempuran! 🔫`,
            title: `Karakter Terpilih: ${chosenChar.name}`,
            subtitle: `Skill: ${chosenChar.skill}`,
            footer: `> © ${global.namebot || 'Bot'} 2025 ✨`,
            interactiveButtons: interactiveButtons,
            hasMediaAttachment: false
        }, { quoted: m });
    }

    // --- Subcommand: play ---
    else if (args[0] === 'play') {
        if (!user.ffrpg.character) {
            return conn.reply(m.chat, `❌ Kakak belum punya karakter FF. Buat dulu dengan *${usedPrefix}ffrpg create* ya! 😥`, m);
        }
        let timeSinceLastPlay = Date.now() - user.ffrpg.lastPlay;
        if (timeSinceLastPlay < cooldownFF) {
            let remainingTime = cooldownFF - timeSinceLastPlay;
            
            const interactiveButtons = [
                {
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({
                        title: 'Aksi Selanjutnya',
                        sections: [{
                            title: "Pilihan",
                            highlight_label: "Lihat",
                            rows: [
                                { header: "", title: "Cek Profil 👤", id: `${usedPrefix}ffrpg profile` },
                                { header: "", title: "Kembali ke Menu Utama 🏠", id: `${usedPrefix}menu` }
                            ]
                        }]
                    })
                }
            ];

            return conn.sendMessage(m.chat, {
                product: {
                    productImage: { url: fotorpg },
                    productId: '9999999999999999',
                    title: `Waktu Tunggu, ${userName}!`,
                    description: `Cooldown: ${formatTime(remainingTime)}`,
                    currencyCode: 'IDR',
                    priceAmount1000: '0',
                    retailerId: 'ffrpg-cooldown',
                    url: 'https://api.ubed.my.id',
                    productImageCount: 1
                },
                businessOwnerJid: primaryOwnerJid,
                caption: `
⏳ *COOLDOWN FREE FIRE RPG!* ⏳
----------------------------------------
Kamu baru saja bermain Free Fire. 😥
Tunggu *${formatTime(remainingTime)}* lagi sebelum bisa bermain kembali! ✨
----------------------------------------
Sabar ya, Player! 🌷

> © ${global.namebot || 'Bot'} 2025 ✨`.trim(),
                title: `Waktu Tunggu, ${userName}!`,
                subtitle: `Cooldown ${formatTime(remainingTime)}`,
                footer: `> © ${global.namebot || 'Bot'} 2025 ✨`,
                interactiveButtons: interactiveButtons,
                hasMediaAttachment: false
            }, { quoted: m });
        }

        // Simulasi Battle Royale
        await conn.sendMessage(m.chat, { react: { text: '✈️', key: m.key } });
        await conn.reply(m.chat, `🔫 *PERTEMPURAN DIMULAI!* 🔫\n\nKakak *${userName}* terjun dari pesawat di *Bermuda Map*! 🗺️`, m);
        await sleep(5000);

        let kills = 0;
        let survivedTime = 0;
        let isBooyah = false;
        let eliminatedBy = 'Zona';

        await conn.reply(m.chat, '🎒 *Mendarat dan mulai looting...* Mencari senjata dan armor!', m);
        await sleep(3000);
        let foundGun = Math.random() < 0.7;
        if (foundGun) await conn.reply(m.chat, '✅ Menemukan *Scar-L* dan *Vest Level 3*! Siap tempur! 🔥', m);
        else await conn.reply(m.chat, '😔 Hanya menemukan *Pistol* dan *Medkit*... harus berhati-hati!', m);
        await sleep(3000);

        let currentHealth = 100;
        let enemyEncounters = Math.floor(Math.random() * 4) + 1;
        let battleLog = '';

        for (let i = 0; i < enemyEncounters; i++) {
            let enemyName = pickRandom(['Bot', 'Noob Player', 'Pro Player', 'Cheater']);
            let outcome = Math.random();
            if (outcome < 0.6) {
                kills++;
                currentHealth = Math.min(100, currentHealth + 20);
                battleLog += `\n💥 Melawan *${enemyName}* dan berhasil mengeliminasi! Kills: ${kills}`;
            } else {
                currentHealth -= Math.floor(Math.random() * 30) + 10;
                battleLog += `\n💔 Terkena damage dari *${enemyName}*! HP sisa: ${currentHealth}`;
                if (currentHealth <= 0) {
                    eliminatedBy = enemyName;
                    break;
                }
            }
            await sleep(3000);
        }

        if (currentHealth > 0) {
            await conn.reply(m.chat, '🌪️ Zona mulai menyusut! Bergerak menuju safe zone!', m);
            await sleep(5000);
            let safe = Math.random();
            if (safe < 0.2 && currentHealth > 0) {
                currentHealth -= Math.floor(Math.random() * 40) + 20;
                battleLog += `\n🔥 Terkena damage zona! HP sisa: ${currentHealth}`;
                eliminatedBy = 'Zona';
            }
            if (currentHealth <= 0) eliminatedBy = 'Zona';
            await sleep(3000);
        }

        if (currentHealth > 0) {
            isBooyah = Math.random() < 0.5;
            if (isBooyah) {
                survivedTime = Math.floor(Math.random() * 20) + 10;
                eliminatedBy = 'Booyah!';
            } else {
                survivedTime = Math.floor(Math.random() * 10) + 1;
                eliminatedBy = 'Musuh terakhir';
            }
        } else {
            survivedTime = Math.floor(Math.random() * 10) + 1;
        }

        let moneyReward = 0;
        let expReward = 0;
        let rankPoints = 0;
        let finalStatus = '';

        if (isBooyah) {
            finalStatus = '🎉 BOOYAH! 🎉';
            moneyReward = getRandomReward(300000, 1000000) + (kills * 50000);
            expReward = getRandomReward(5000, 15000) + (kills * 500);
            rankPoints = getRandomReward(20, 50);
        } else if (currentHealth <= 0) {
            finalStatus = '💀 TERELIMINASI 💀';
            moneyReward = getRandomReward(10000, 50000) + (kills * 10000);
            expReward = getRandomReward(500, 2000) + (kills * 100);
            rankPoints = getRandomReward(-10, 5);
        } else {
            finalStatus = '🏁 PERTEMPURAN SELESAI 🏁';
            moneyReward = getRandomReward(50000, 200000) + (kills * 20000);
            expReward = getRandomReward(1000, 5000) + (kills * 200);
            rankPoints = getRandomReward(-5, 10);
        }

        let currentRankIndex = ffRanks.indexOf(user.ffrpg.rank);
        let newRankIndex = currentRankIndex;
        if (rankPoints > 0) {
            newRankIndex = Math.min(ffRanks.length - 1, currentRankIndex + Math.floor(rankPoints / 10));
        } else if (rankPoints < 0) {
            newRankIndex = Math.max(0, currentRankIndex + Math.ceil(rankPoints / 10));
        }
        user.ffrpg.rank = ffRanks[newRankIndex];

        user.money += moneyReward;
        user.exp += expReward;
        user.ffrpg.kills += kills;
        user.ffrpg.lastPlay = Date.now();
        
        let resultImage = isBooyah ? 'https://telegra.ph/file/f787b47d56941b8fdd221.jpg' : 'https://telegra.ph/file/a65184a676cd648de34c3.jpg';

        const interactiveButtons = [
            {
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                    title: 'Aksi Selanjutnya',
                    sections: [{
                        title: "Pilihan",
                        highlight_label: "Main Lagi",
                        rows: [
                            { header: "", title: "Main Lagi 🎮", id: `${usedPrefix}ffrpg play` },
                            { header: "", title: "Cek Profil 👤", id: `${usedPrefix}ffrpg profile` }
                        ]
                    }]
                })
            }
        ];

        return conn.sendMessage(m.chat, {
            product: {
                productImage: { url: resultImage },
                productId: '9999999999999999',
                title: `Hasil Pertandingan: ${finalStatus}`,
                description: `Kills: ${kills} | Rank: ${user.ffrpg.rank}`,
                currencyCode: 'IDR',
                priceAmount1000: '0',
                retailerId: 'ffrpg-result',
                url: 'https://api.ubed.my.id',
                productImageCount: 1
            },
            businessOwnerJid: primaryOwnerJid,
            caption: `
🔫 *HASIL FREE FIRE RPG!* 🔫
----------------------------------------
*Player:* ${userName} (${user.ffrpg.character})
*Status:* ${finalStatus}
*Kills:* ${kills}
*Bertahan:* ${survivedTime} menit
*Tereliminasi oleh:* ${eliminatedBy}

*Hadiah:*
💰 Money: +Rp ${moneyReward.toLocaleString('id-ID')}
⚡ EXP: +${expReward}
📈 Rank Point: ${rankPoints > 0 ? '+' : ''}${rankPoints} (New Rank: ${user.ffrpg.rank})
----------------------------------------
Ayo mabar lagi ya, Player! 💖

> © ${global.namebot || 'Bot'} 2025 ✨`.trim(),
            title: `Hasil Pertandingan, ${userName}!`,
            subtitle: finalStatus,
            footer: `> © ${global.namebot || 'Bot'} 2025 ✨`,
            interactiveButtons: interactiveButtons,
            hasMediaAttachment: false
        }, { quoted: m });
    }

    // --- Subcommand: profile ---
    else if (args[0] === 'profile') {
        if (!user.ffrpg.character) {
            return conn.reply(m.chat, `❌ Kakak belum punya karakter FF. Buat dulu dengan *${usedPrefix}ffrpg create* ya! 😥`, m);
        }
        let charInfo = ffCharacters.find(c => c.name === user.ffrpg.character);
        
        let profileImageUrl = charInfo?.imageUrl || fotorpg;
        
        let profileCaption = `
👤 *PROFIL FREE FIRE RPG!* 👤
----------------------------------------
*Player:* ${userName}
*Karakter:* ${user.ffrpg.character} (${charInfo?.tagline || ''})
*Skill Karakter:* ${charInfo?.skill || 'Tidak diketahui'}
*Total Kills:* ${user.ffrpg.kills}
*Rank:* ${user.ffrpg.rank}
*Money:* Rp ${user.money.toLocaleString('id-ID')}
*EXP:* ${user.exp.toLocaleString('id-ID')}
----------------------------------------
Terus Booyah ya, Player! 💪💖

> © ${global.namebot || 'Bot'} 2025 ✨`.trim();

        const interactiveProfileButtons = [
            {
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                    title: 'Aksi Selanjutnya',
                    sections: [{
                        title: "Pilihan",
                        highlight_label: "Main",
                        rows: [
                            { header: "", title: "Main Free Fire 🎮", id: `${usedPrefix}ffrpg play` },
                            { header: "", title: "Back to FF Menu", id: `${usedPrefix}ffrpg` }
                        ]
                    }]
                })
            }
        ];

        return conn.sendMessage(m.chat, {
            product: {
                productImage: { url: profileImageUrl },
                productId: '9999999999999999',
                title: `Profil FF: ${userName}`,
                description: `Karakter: ${user.ffrpg.character} | Rank: ${user.ffrpg.rank}`,
                currencyCode: 'IDR',
                priceAmount1000: '0',
                retailerId: 'ffrpg-profile',
                url: 'https://api.ubed.my.id',
                productImageCount: 1
            },
            businessOwnerJid: primaryOwnerJid,
            caption: profileCaption,
            title: `Detail Profil ${userName}`,
            subtitle: `Level EXP: ${user.exp}`,
            footer: `> © ${global.namebot || 'Bot'} | FF RPG`,
            interactiveButtons: interactiveProfileButtons,
            hasMediaAttachment: false
        }, { quoted: m });
    }
    // Jika command tidak dikenal
    else {
        // Fallback ke pesan teks jika subcommand tidak dikenali
        return conn.reply(m.chat, `❌ Perintah tidak dikenal. Ketik *${usedPrefix}ffrpg* untuk panduan. 😥`, m);
    }
};

handler.help = ['ffrpg', 'ff', 'freefire'];
handler.tags = ['game', 'rpg'];
handler.command = /^(ffrpg|ff|freefire)$/i;
handler.group = true;
handler.register = true;
handler.limit = true;

export default handler;

// Helper Functions
function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function getRandomReward(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatTime(ms) {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    minutes %= 60;
    seconds %= 60;
    let result = [];
    if (hours > 0) result.push(`${hours} jam`);
    if (minutes > 0) result.push(`${minutes} menit`);
    if (seconds > 0) result.push(`${seconds} detik`);
    return result.join(' ');
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}