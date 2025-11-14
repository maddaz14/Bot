import fs from 'fs';

const leaderboards = [
    'atm', 'level', 'exp', 'money', 'iron', 'gold', 'diamond', 'emerald', 'limit',
    'trash', 'potion', 'subscribers', 'rock', 'string', 'umpan', 'petfood',
    'common', 'uncommon', 'mythic', 'legendary', 'pet', 'bank', 'chip',
    'skata', 'donasi', 'deposit', 'subscribers', 'minyak', 'gandum', 'steak',
    'ayam_goreng', 'ribs', 'roti', 'udang_goreng', 'bacon', 'bankkeluarga' // Tambahkan 'bankkeluarga'
];

leaderboards.sort((a, b) => a.localeCompare(b));

let handler = async (m, { conn, data, args, participants, usedPrefix, command }) => {
    let users = Object.entries(global.db.data.users).map(([key, value]) => {
        return { ...value, jid: key, bankkeluarga: value.bankkeluarga || 0, premium: value.premium || false }; // Menambahkan info premium
    });

    let leaderboard = leaderboards.filter(v => v && users.some(user => user && user[v]));
    let type = (args[0] || '').toLowerCase();

    const getPage = item => Math.ceil(users.filter(user => user && user[item]).length / 5);
    let wrong = `🔖 Type list:
${leaderboard.map(v => `⮕ ${global.rpg.emoticon(v)} - ${v}`).join('\n')}
––––––––––––––––––––––––
💁🏻‍♂ Tip:
⮕ To view different leaderboard:
${usedPrefix}${command} [type]
★ Example:
${usedPrefix}${command} legendary`.trim();

    if (!leaderboard.includes(type)) {
        let responseText = '*––––『 𝙻𝙴𝙰𝙳𝙴𝚁𝙱𝙾𝙰𝚁𝙳 』––––*\n' + wrong;
        return conn.sendMessage(m.chat, { text: responseText }, { quoted: m });
    }

    let page = isNumber(args[1]) ? Math.min(Math.max(parseInt(args[1]), 0), getPage(type)) : 0;
    
    // Menyaring pengguna premium dan menempatkannya paling atas
    let sortedItem = users.map(toNumber(type)).sort((a, b) => {
        if (a.premium === b.premium) {
            return b[type] - a[type];  // Mengurutkan berdasarkan nilai (descending)
        }
        return a.premium ? -1 : 1;  // Memprioritaskan premium
    });
    
    let userItem = sortedItem.map(enumGetKey);

    // Menampilkan teks leaderboard tanpa gambar
    let dataUser = await Promise.all(sortedItem.slice(page * 10, (page + 1) * 10).map(async (user, i) => {
        // Mencari nama pengguna dengan skor yang sama
        let usersWithSameScore = sortedItem.filter(u => u[type] === user[type]);
        let names = usersWithSameScore.map(u => u.registered ? u.name : conn.getName(u.jid));
        
        return {
            top: i + 1,
            tag: names.join(' & '), // Menampilkan dua nama atau lebih jika memiliki saldo yang sama
            score: parseInt(user[type]) || 0,
            premium: user.premium
        };
    }));

    let text = `
🏆 Rank: ${toRupiah(userItem.indexOf(m.sender) + 1)} out of ${toRupiah(userItem.length)}

                *• ${global.rpg.emoticon(type)} ${type} •*

${dataUser.map(user => {
    // Jika leaderboard adalah limit dan pengguna premium, tampilkan simbol ∞
    let scoreText = user.premium && type === 'limit' ? '∞' : toRupiah(user.score); // Gunakan '∞' jika pengguna premium dan tipe leaderboard adalah limit
    let premiumText = user.premium ? ' ∞' : ''; // Tambahkan ∞ untuk pengguna premium
    
    return `${user.top}.*﹙${scoreText}﹚*- ${user.tag}${premiumText}`;
}).join('\n\n')}
`.trim();

    // Mengirimkan teks leaderboard saja
    await conn.sendMessage(m.chat, { text: text }, { quoted: m });
};

handler.help = ['leaderboard'];
handler.tags = ['xp'];
handler.command = /^(leaderboard|lb)$/i;
handler.register = true;
handler.group = true;
handler.rpg = true;

export default handler;

function sort(property, ascending = true) {
    return (...args) => args[ascending ? 1 : 0][property] - args[ascending ? 0 : 1][property];
}

function toNumber(property, _default = 0) {
    return (a, i, b) => {
        return { ...b[i], [property]: a[property] === undefined ? _default : a[property] };
    };
}

function enumGetKey(a) {
    return a.jid;
}

function isNumber(number) {
    if (!number) return false;
    number = parseInt(number);
    return !isNaN(number);
}

const toRupiah = number => parseInt(number).toLocaleString().replace(/,/g, ".");