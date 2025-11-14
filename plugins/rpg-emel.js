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

const mlRoles = [
    { name: 'Marksman', strength: 'Damage Jauh', tagline: 'Penembak Jitu', imageUrl: 'https://telegra.ph/file/ee60557d56941b8fdd221.jpg' },
    { name: 'Mage', strength: 'Magic Damage', tagline: 'Penguasa Sihir', imageUrl: 'https://telegra.ph/file/b2a74fc0b6ef732c398f4.png' },
    { name: 'Tank', strength: 'Defense Tinggi', tagline: 'Pelindung Tim', imageUrl: 'https://telegra.ph/file/0z4nvv.jpg' },
    { name: 'Fighter', strength: 'Melee Damage', tagline: 'Petarung Garis Depan', imageUrl: 'https://telegra.ph/file/rpgnej.jpg' },
    { name: 'Support', strength: 'Healing & Buff', tagline: 'Penyokong Tim', imageUrl: 'https://telegra.ph/file/intcl3.jpg' },
    { name: 'Assassin', strength: 'Burst Damage', tagline: 'Pembunuh Senyap', imageUrl: 'https://telegra.ph/file/krt1fc.jpg' }
];

const mlRanks = ['Warrior', 'Elite', 'Master', 'Grandmaster', 'Epic', 'Legend', 'Mythic', 'Mythical Glory'];
const cooldownML = 1 * 60 * 60 * 1000; // 1 jam

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];
    let userName = await conn.getName(m.sender);

    // Inisialisasi properti user
    user.mlrpg = user.mlrpg || {};
    user.mlrpg.role = user.mlrpg.role || null;
    user.mlrpg.kills = user.mlrpg.kills || 0;
    user.mlrpg.deaths = user.mlrpg.deaths || 0;
    user.mlrpg.assists = user.mlrpg.assists || 0;
    user.mlrpg.rank = user.mlrpg.rank || mlRanks[0]; // Default Warrior
    user.mlrpg.lastPlay = user.mlrpg.lastPlay || 0;
    user.money = user.money || 0;
    user.exp = user.exp || 0;

    // Default URL untuk gambar RPG
    const defaultMLImage = 'https://telegra.ph/file/b2a74fc0b6ef732c398f4.png';
    const fotorpg = global.fotorpg || defaultMLImage;
    const primaryOwnerJid = global.owner[0][0] + '@s.whatsapp.net';

    // --- Main Menu (jika tidak ada subcommand atau subcommand tidak dikenal) ---
    if (!args[0] || !['create', 'choose', 'play', 'profile'].includes(args[0])) {
        const ppUrl = await conn.profilePictureUrl(conn.user.jid, 'image').catch(() => fotorpg);

        let oya = `
🌟 *SELAMAT DATANG DI MOBILE LEGENDS RPG!* 🌟
----------------------------------------
✨ Yuk, taklukkan Land of Dawn di sini!

Pilih menu di bawah ya:
• 🎮 *${usedPrefix}mlrpg create*: Pilih role hero-mu!
• ⚔️ *${usedPrefix}mlrpg play*: Mulai pertandingan Classic.
• 👤 *${usedPrefix}mlrpg profile*: Cek statistik ML-mu.
----------------------------------------
Ayo raih Mythical Glory! 💖
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
                            { header: "🎮", title: "Pilih Role Hero", description: "Mulai petualangan", id: `${usedPrefix}mlrpg create` },
                            { header: "⚔️", title: "Mulai Bermain", description: "Masuk ke pertandingan", id: `${usedPrefix}mlrpg play` },
                            { header: "👤", title: "Cek Profil", description: "Lihat statistik hero", id: `${usedPrefix}mlrpg profile` }
                        ]
                    }]
                })
            }
        ];

        return conn.sendMessage(m.chat, {
            product: {
                productImage: { url: ppUrl },
                productId: '9999999999999999',
                title: 'Mobile Legends RPG',
                description: 'Taklukkan Land of Dawn!',
                currencyCode: 'IDR',
                priceAmount1000: '0',
                retailerId: 'mlrpg-menu',
                url: 'https://api.ubed.my.id',
                productImageCount: 1
            },
            businessOwnerJid: primaryOwnerJid,
            caption: oya,
            title: '✨ Menu Mobile Legends RPG ✨',
            subtitle: `Hello, ${userName}!`,
            footer: `> © ${global.namebot || 'Bot'} 🌟`,
            interactiveButtons: interactiveButtons,
            hasMediaAttachment: false
        }, { quoted: m });
    }

    // --- Subcommand: create/choose ---
    if (args[0] === 'create' || args[0] === 'choose') {
        if (user.mlrpg.role) {
            return conn.reply(m.chat, `❌ Kakak sudah punya role ML (*${user.mlrpg.role}*) kok! ✨\n\nUntuk bermain, ketik *${usedPrefix}mlrpg play* ya!`, m);
        }
        if (!args[1]) {
            let roleListText = mlRoles.map((role, i) => `• ${i + 1}. *${role.name}* (${role.tagline}) - Kekuatan: ${role.strength}`).join('\n');
            
            const interactiveRoleButtons = mlRoles.map(role => ({
                header: `Role ${role.name}`,
                title: role.name,
                description: `Kekuatan: ${role.strength} - ${role.tagline}`,
                id: `${usedPrefix}mlrpg create ${role.name}`
            }));

            return conn.sendMessage(m.chat, {
                product: {
                    productImage: { url: fotorpg },
                    productId: '9999999999999999',
                    title: 'Pilih Role Hero ML',
                    description: `Pilih role hero favoritmu untuk memulai petualangan di Land of Dawn!`,
                    currencyCode: 'IDR',
                    priceAmount1000: '0',
                    retailerId: 'mlrpg-choose-role',
                    url: 'https://api.ubed.my.id',
                    productImageCount: 1
                },
                businessOwnerJid: primaryOwnerJid,
                caption: `🎮 *PILIH ROLE MOBILE LEGENDS!* 🎮\n----------------------------------------\n✨ Yuk, pilih role favoritmu untuk memulai petualangan di Land of Dawn!\n\n*Daftar Role:*\n${roleListText}\n\nPilih dengan bijak ya, Player! 💖\n\n> © ${global.namebot || 'Bot'} 2025 ✨`,
                title: "Pilih Role Hero ML",
                subtitle: "Pilih role hero-mu di bawah ini",
                footer: "Pilih dengan bijak ya!",
                interactiveButtons: [
                    {
                        name: "single_select",
                        buttonParamsJson: JSON.stringify({
                            title: "Pilih Role",
                            sections: [{
                                title: "Daftar Role Mobile Legends",
                                highlight_label: "Pilih Salah Satu",
                                rows: interactiveRoleButtons
                            }]
                        })
                    }
                ],
                hasMediaAttachment: false
            }, { quoted: m });
        }

        let chosenRoleName = args.slice(1).join(' ').trim();
        let chosenRole = mlRoles.find(r => r.name.toLowerCase() === chosenRoleName.toLowerCase());
        if (!chosenRole) {
            return conn.reply(m.chat, `❌ Role *"${chosenRoleName}"* tidak ditemukan. 😥 Pilih dari daftar ya!`, m);
        }
        user.mlrpg.role = chosenRole.name;
        user.mlrpg.kills = 0; user.mlrpg.deaths = 0; user.mlrpg.assists = 0;
        user.mlrpg.rank = mlRanks[0];
        user.mlrpg.lastPlay = 0;

        let roleImageUrl = chosenRole.imageUrl;
        const interactiveButtons = [
            {
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                    title: 'Aksi Selanjutnya',
                    sections: [{
                        title: "Ayo Main!",
                        highlight_label: "Pilih Salah Satu",
                        rows: [
                            { header: "🎮", title: "Mulai Pertandingan", id: `${usedPrefix}mlrpg play` },
                            { header: "👤", title: "Cek Profil", id: `${usedPrefix}mlrpg profile` }
                        ]
                    }]
                })
            }
        ];

        return conn.sendMessage(m.chat, {
            product: {
                productImage: { url: roleImageUrl },
                productId: '9999999999999999',
                title: `Role Terpilih: ${chosenRole.name}`,
                description: chosenRole.tagline,
                currencyCode: 'IDR',
                priceAmount1000: '0',
                retailerId: 'mlrpg-char-selected',
                url: 'https://api.ubed.my.id',
                productImageCount: 1
            },
            businessOwnerJid: primaryOwnerJid,
            caption: `✅ Selamat! Kakak telah memilih role *${chosenRole.name}* (${chosenRole.tagline}) untuk Mobile Legends RPG! 🎉\n\nSekarang, ketik *${usedPrefix}mlrpg play* untuk memulai pertandingan! 🎮`,
            title: `Role Terpilih: ${chosenRole.name}`,
            subtitle: `Kekuatan: ${chosenRole.strength}`,
            footer: `> © ${global.namebot || 'Bot'} 2025 ✨`,
            interactiveButtons: interactiveButtons,
            hasMediaAttachment: false
        }, { quoted: m });
    }

    // --- Subcommand: play ---
    else if (args[0] === 'play') {
        if (!user.mlrpg.role) {
            return conn.reply(m.chat, `❌ Kakak belum punya role ML. Buat dulu dengan *${usedPrefix}mlrpg create* ya! 😥`, m);
        }
        let timeSinceLastPlay = Date.now() - user.mlrpg.lastPlay;
        if (timeSinceLastPlay < cooldownML) {
            let remainingTime = cooldownML - timeSinceLastPlay;
            
            const interactiveButtons = [
                {
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({
                        title: 'Aksi Selanjutnya',
                        sections: [{
                            title: "Pilihan",
                            highlight_label: "Lihat",
                            rows: [
                                { header: "👤", title: "Cek Profil", id: `${usedPrefix}mlrpg profile` },
                                { header: "🏠", title: "Kembali ke Menu Utama", id: `${usedPrefix}menu` }
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
                    retailerId: 'mlrpg-cooldown',
                    url: 'https://api.ubed.my.id',
                    productImageCount: 1
                },
                businessOwnerJid: primaryOwnerJid,
                caption: `
⏳ *COOLDOWN MOBILE LEGENDS RPG!* ⏳
----------------------------------------
Kamu baru saja bermain Mobile Legends. 😥
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

        // Simulasi Match Classic
        await conn.sendMessage(m.chat, { react: { text: '🎮', key: m.key } });
        await conn.reply(m.chat, `🎮 *MATCHMAKING!* 🎮\n\nKakak *${userName}* masuk ke pertandingan Classic! Siap bertarung di Land of Dawn! 🗺️`, m);
        await sleep(5000);

        let kills = getRandomReward(0, 15);
        let deaths = getRandomReward(0, 10);
        let assists = getRandomReward(0, 20);
        let win = Math.random() < 0.6;
        let matchDuration = getRandomReward(10, 25);
        let rankUp = false;
        let rankDown = false;

        await conn.reply(m.chat, '🌾 *Early Game:* Mulai farming dan skirmish di lane!', m);
        await sleep(3000);
        let firstBlood = Math.random() < 0.3;
        if (firstBlood) await conn.reply(m.chat, '💥 *FIRST BLOOD!* Timmu mendapatkan First Blood!', m);
        else await conn.reply(m.chat, '😔 Gagal mendapatkan First Blood, tapi farming lancar.', m);
        await sleep(3000);

        await conn.reply(m.chat, '🔥 *Mid Game:* Mulai teamfight dan push turret lawan!', m);
        await sleep(5000);
        let turretDestroyed = Math.random() < 0.7;
        if (turretDestroyed) await conn.reply(m.chat, '🏰 Turret musuh hancur! Timmu unggul!', m);
        else await conn.reply(m.chat, '💔 Terjadi wipe out di teamfight. Perlu strategi baru!', m);
        await sleep(3000);

        let moneyReward = 0;
        let expReward = 0;
        let rankPoints = 0;
        let finalStatus = '';

        if (win) {
            finalStatus = '🎉 VICTORY! 🎉';
            moneyReward = getRandomReward(50000, 200000) + (kills * 5000) + (assists * 2000);
            expReward = getRandomReward(2000, 5000) + (kills * 200) + (assists * 100);
            rankPoints = getRandomReward(8, 15);
        } else {
            finalStatus = '💀 DEFEAT 💀';
            moneyReward = getRandomReward(10000, 30000) + (kills * 1000);
            expReward = getRandomReward(500, 1500) + (kills * 50);
            rankPoints = getRandomReward(-10, -3);
        }

        let currentRankIndex = mlRanks.indexOf(user.mlrpg.rank);
        let newRankIndex = currentRankIndex;
        if (rankPoints > 0) {
            newRankIndex = Math.min(mlRanks.length - 1, currentRankIndex + Math.floor(rankPoints / 8));
            if (newRankIndex > currentRankIndex) rankUp = true;
        } else if (rankPoints < 0) {
            newRankIndex = Math.max(0, currentRankIndex + Math.ceil(rankPoints / 8));
            if (newRankIndex < currentRankIndex) rankDown = true;
        }
        user.mlrpg.rank = mlRanks[newRankIndex];

        user.money += moneyReward;
        user.exp += expReward;
        user.mlrpg.kills += kills;
        user.mlrpg.deaths += deaths;
        user.mlrpg.assists += assists;
        user.mlrpg.lastPlay = Date.now();
        
        let resultImageUrl = win ? 'https://telegra.ph/file/0z4nvv.jpg' : 'https://telegra.ph/file/krt1fc.jpg';

        const interactiveButtons = [
            {
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                    title: 'Aksi Selanjutnya',
                    sections: [{
                        title: "Pilihan",
                        highlight_label: "Main Lagi",
                        rows: [
                            { header: "🎮", title: "Main Lagi", id: `${usedPrefix}mlrpg play` },
                            { header: "👤", title: "Cek Profil", id: `${usedPrefix}mlrpg profile` }
                        ]
                    }]
                })
            }
        ];

        return conn.sendMessage(m.chat, {
            product: {
                productImage: { url: resultImageUrl },
                productId: '9999999999999999',
                title: `Hasil Pertandingan: ${finalStatus}`,
                description: `K/D/A: ${kills}/${deaths}/${assists} | Rank: ${user.mlrpg.rank}`,
                currencyCode: 'IDR',
                priceAmount1000: '0',
                retailerId: 'mlrpg-result',
                url: 'https://api.ubed.my.id',
                productImageCount: 1
            },
            businessOwnerJid: primaryOwnerJid,
            caption: `
🎮 *HASIL MOBILE LEGENDS RPG!* 🎮
----------------------------------------
*Player:* ${userName} (${user.mlrpg.role})
*Status:* ${finalStatus}
*K/D/A:* ${kills}/${deaths}/${assists}
*Durasi Match:* ${matchDuration} menit
${rankUp ? `⬆️ *RANK UP!* Kamu naik ke *${user.mlrpg.rank}*!` : rankDown ? `⬇️ *RANK DOWN!* Kamu turun ke *${user.mlrpg.rank}*!` : `📈 Rank: *${user.mlrpg.rank}*`}

*Hadiah:*
💰 Money: +Rp ${moneyReward.toLocaleString('id-ID')}
⚡ EXP: +${expReward}
----------------------------------------
Ayo push rank lagi ya, Player! 💖

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
        if (!user.mlrpg.role) {
            return conn.reply(m.chat, `❌ Kakak belum punya role ML. Buat dulu dengan *${usedPrefix}mlrpg create* ya! 😥`, m);
        }
        let roleInfo = mlRoles.find(r => r.name === user.mlrpg.role);
        
        let profileImageUrl = roleInfo?.imageUrl || fotorpg;
        
        let profileCaption = `
👤 *PROFIL MOBILE LEGENDS RPG!* 👤
----------------------------------------
*Player:* ${userName}
*Role:* ${user.mlrpg.role} (${roleInfo?.tagline || ''})
*Kekuatan Utama:* ${roleInfo?.strength || 'Tidak diketahui'}
*K/D/A:* ${user.mlrpg.kills}/${user.mlrpg.deaths}/${user.mlrpg.assists}
*Rank:* ${user.mlrpg.rank}
*Money:* Rp ${user.money.toLocaleString('id-ID')}
*EXP:* ${user.exp.toLocaleString('id-ID')}
----------------------------------------
Terus push rank ya, Player! 💪💖`.trim();

        const interactiveProfileButtons = [
            {
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                    title: 'Aksi Selanjutnya',
                    sections: [{
                        title: "Pilihan",
                        highlight_label: "Main",
                        rows: [
                            { header: "🎮", title: "Main Mobile Legends", id: `${usedPrefix}mlrpg play` },
                            { header: "🏠", title: "Back to ML Menu", id: `${usedPrefix}mlrpg` }
                        ]
                    }]
                })
            }
        ];

        return conn.sendMessage(m.chat, {
            product: {
                productImage: { url: profileImageUrl },
                productId: '9999999999999999',
                title: `Profil ML: ${userName}`,
                description: `Role: ${user.mlrpg.role} | Rank: ${user.mlrpg.rank}`,
                currencyCode: 'IDR',
                priceAmount1000: '0',
                retailerId: 'mlrpg-profile',
                url: 'https://api.ubed.my.id',
                productImageCount: 1
            },
            businessOwnerJid: primaryOwnerJid,
            caption: profileCaption,
            title: `Detail Profil ${userName}`,
            subtitle: `Total EXP: ${user.exp}`,
            footer: `> © ${global.namebot || 'Bot'} | ML RPG`,
            interactiveButtons: interactiveProfileButtons,
            hasMediaAttachment: false
        }, { quoted: m });
    }
    // Jika command tidak dikenal
    else {
        return conn.reply(m.chat, `❌ Perintah tidak dikenal. Ketik *${usedPrefix}mlrpg* untuk panduan. 😥`, m);
    }
};

handler.help = ['mlrpg', 'ml'];
handler.tags = ['game', 'rpg'];
handler.command = /^mlrpg|ml|mobilelegends$/i;
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