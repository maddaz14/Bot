let handler = async (m, { conn, args, usedPrefix }) => {
    let type = (args[0] || '').toLowerCase();
    let users = Object.entries(global.db.data.users).map(([key, value]) => {
        return { jid: key, ...value };
    });

    let valid = [
        'money', 'bank', 'limit', 'common', 'uncommon', 'mythic', 'legendary', 'diamond', 'emerald', 'exp',
        'gold', 'iron', 'level', 'pet', 'petfood', 'potion', 'rock', 'roti', 'skata', 'steak', 'string',
        'subscribers', 'trash', 'umpan'
    ];

    if (!valid.includes(type)) {
        return m.reply(`*📊 Leaderboard*\nGunakan:\n${usedPrefix}lb [${valid.join(' | ')}]`);
    }

    let emojiMap = {
        money: '💵',
        bank: '🏦',
        limit: '📦',
        common: '📦',
        uncommon: '📦',
        mythic: '🗳️',
        legendary: '🗃️',
        diamond: '💎',
        emerald: '💚',
        exp: '✉️',
        gold: '👑',
        iron: '⛓️',
        level: '🧬',
        pet: '🎁',
        petfood: '🎁',
        potion: '🥤',
        rock: '🪨',
        roti: '🍞',
        skata: '🧻',
        steak: '🥩',
        string: '🕸️',
        subscribers: '📢',
        trash: '🗑',
        umpan: '🪱'
    };

    let sorted = users
        .filter(user => user[type] !== undefined)
        .sort((a, b) => (b[type] || 0) - (a[type] || 0))
        .slice(0, 20);

    let text = `*🏆 Leaderboard Top 20: ${type.toUpperCase()} ${emojiMap[type] || ''}*\n\n`;

    for (let i = 0; i < sorted.length; i++) {
        let u = sorted[i];
        let name = (await conn.getName(u.jid)) || 'No Name';
        let value = u[type] || 0;
        text += `${i + 1}. *${name}*\n   ${emojiMap[type] || ''} *${value}*\n`;
    }

    m.reply(text);
};

handler.help = ['lb [type]'];
handler.tags = ['rpg'];
handler.command = /^lb|leaderboard$/i;

export default handler;