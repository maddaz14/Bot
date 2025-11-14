let titles = {
    money: {
        "Novice Merchant": 10000000,
        "Silver Trader": 100000000,
        "Golden Tycoon": 1000000000,
        "King of Commerce": 10000000000,
        "Overlord of Wealth": 100000000000,
        "God of Riches": 1000000000000,
        "Eternal Sovereign of Gold": 10000000000000,
        "Emperor of Trade": 50000000000000,
        "Supreme Capitalist": 100000000000000,
        "Wealthiest Being": 500000000000000
    },
    exp: {
        "Aspiring Adventurer": 5000000,
        "Battle-Hardened Warrior": 50000000,
        "Grandmaster Tactician": 500000000,
        "Legendary Hero": 1000000000,
        "Ruler of Realms": 10000000000,
        "Celestial Sage": 100000000000,
        "Godslayer": 1000000000000,
        "Eternal Guardian of Dimensions": 15000000000000,
        "Champion of Time": 20000000000000,
        "Supreme Hero": 50000000000000
    },
    limit: {
        "Rookie Collector": 10000,
        "Limit Breaker": 1000000,
        "Shard Seeker": 10000000,
        "Master of Infinity": 1000000000,
        "Boundless Emperor": 10000000000,
        "Void Conqueror": 1000000000000,
        "Eternal Sovereign of Limits": 100000000000000,
        "Limitless Monarch": 500000000000000,
        "Ultimate Collector": 1000000000000000,
        "Infinity Master": 5000000000000000
    },
    level: {
        "Beginner": 100,
        "Novice": 200,
        "Apprentice": 300,
        "Skilled": 400,
        "Expert": 500,
        "Master": 600,
        "Grandmaster": 700,
        "Legend": 800,
        "Champion": 900,
        "Immortal": 1000,
        "Titan": 1100,
        "Colossus": 1200,
        "Demigod": 1300,
        "Champion of Fate": 1400,
        "Divine Hero": 1500,
        "Ascended Being": 1600,
        "Eternal Champion": 1700,
        "Supreme Hero": 1800,
        "Warlord": 1900,
        "Godslayer": 2000,
        "Immortal King": 2500,
        "Mythic Ruler": 3000,
        "Elder Champion": 3500,
        "Celestial Conqueror": 4000,
        "Unstoppable Force": 4500,
        "Primeval Guardian": 5000,
        "Ancient Overlord": 5500,
        "Cosmic Hero": 6000,
        "Ultimate Legend": 6500,
        "True Immortal": 7000,
        "Cosmic Emperor": 7500,
        "Alpha Titan": 8000,
        "Supreme Champion": 8500,
        "Master of the Universe": 9000,
        "Eternal Ruler": 9500,
        "Celestial Overlord": 10000
    }
};

function formatNumber(num) {
    if (num >= 1000000000000) {
        return (num / 1000000000000).toFixed(2) + " triliun";
    } else if (num >= 1000000000) {
        return (num / 1000000000).toFixed(2) + " miliyar";
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + " juta";
    } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + " ribu";
    } else {
        return num.toString();
    }
}

let handler = async (m, { conn, usedPrefix, text, command }) => {
    let user = global.db.data.users[m.sender];
    let args = text.trim().split(' ');
    let subCommand = args[0]?.toLowerCase();
    let category = args[1]?.toLowerCase();
    let titleIndex = parseInt(args[2]);

    function validateTitle() {
        if (user.title2) {
            let isValid = false;
            for (let [type, titleList] of Object.entries(titles)) {
                for (let [title, requirement] of Object.entries(titleList)) {
                    if (title === user.title2 && 
                        ((type === 'money' && user.eris + user.bank >= requirement) ||
                         (type === 'exp' && user.exp >= requirement) ||
                         (type === 'limit' && user.limit >= requirement) ||
                         (type === 'level' && user.level >= requirement))) {
                        isValid = true;
                        break;
                    }
                }
                if (isValid) break;
            }
            if (!isValid) {
                conn.reply(m.chat, `🔴 *Title Anda "${user.title2}" telah dicopot karena tidak lagi memenuhi syarat!*`, m);
                user.title2 = "";
            }
        }
    }

    if (command === 'title' && subCommand === 'list') {
        let listTitles = Object.entries(titles).map(([type, titles]) => {
            let titleList = Object.entries(titles)
                .map(([name, requirement], index) => {
                    let hasRequirement =
                        (type === 'money' && user.eris + user.bank >= requirement) ||
                        (type === 'exp' && user.exp >= requirement) ||
                        (type === 'limit' && user.limit >= requirement) ||
                        (type === 'level' && user.level >= requirement);
                    return `🔹 ${hasRequirement ? '✅' : '❌'} ${index + 1}. *${name}* (${formatNumber(requirement)})`;
                })
                .join('\n');
            return `*${type.toUpperCase()}* 🎯\n${titleList}`;
        }).join('\n\n');
        m.reply(`*🌟 D A F T A R   T I T L E*\n\n${listTitles}`);
        return;
    }

    if (command === 'title' && subCommand === 'pasang') {
        if (!category || !titleIndex) throw `⚠️ Gunakan format: ${usedPrefix}title pasang <money/exp/limit/level> <nomor>\n- contoh: .title pasang level 1`;
        if (!titles[category]) throw `🚫 Kategori ${category} tidak ditemukan!`;

        let titleList = Object.keys(titles[category]);
        let titleName = titleList[titleIndex - 1];

        if (!titleName) throw `❌ Tidak ada title dengan nomor tersebut!`;

        let requirement = titles[category][titleName];
        let isValidTitle = false;

        if ((category === 'money' && user.eris + user.bank >= requirement) ||
            (category === 'exp' && user.exp >= requirement) ||
            (category === 'limit' && user.limit >= requirement) ||
            (category === 'level' && user.level >= requirement)) {
            user.title2 = titleName;
            isValidTitle = true;
            m.reply(`🎉 *Berhasil memasang title: ${titleName}*`);
        }

        if (!isValidTitle) throw `❌ Tidak dapat memasang title: *${titleName}*. Pastikan Anda memenuhi syarat!`;
        return;
    }

    throw `⚠️ Gunakan salah satu perintah berikut:\n- ${usedPrefix}title list\n- ${usedPrefix}title pasang <money/exp/limit/level> <nomor>\n\n- contoh: .title pasang level 1`;
};

global.validateUser = (user) => {
    if (user.title2) {
        let isValid = false;
        for (let [type, titleList] of Object.entries(titles)) {
            for (let [title, requirement] of Object.entries(titleList)) {
                if (title === user.title2 && 
                    ((type === 'money' && user.eris + user.bank >= requirement) ||
                     (type === 'exp' && user.exp >= requirement) ||
                     (type === 'limit' && user.limit >= requirement) ||
                     (type === 'level' && user.level >= requirement))) {
                    isValid = true;
                    break;
                }
            }
            if (isValid) break;
        }
        if (!isValid) {
            user.title2 = "";
        }
    }
};

handler.help = ['title'];
handler.tags = ['main'];
handler.command = /^(title)$/i;
handler.register = true;
handler.group = true;

export default handler;