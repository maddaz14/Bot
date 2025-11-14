import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let handler = async (m, { conn, args }) => {
    let type = (args[0] || '').toLowerCase();

    let valid = [
        'money', 'bank', 'limit', 'common', 'uncommon', 'mythic', 'legendary', 'diamond', 'emerald', 'exp',
        'gold', 'iron', 'level', 'pet', 'petfood', 'potion', 'rock', 'roti', 'skata', 'steak', 'string',
        'subscribers', 'trash', 'umpan'
    ];

    if (!valid.includes(type)) {
        return m.reply(`*📊 Leaderboard Web*\nGunakan perintah:\n.weblb [${valid.join(' | ')}]`);
    }

    let emojiMap = {
        money: '💵', bank: '🏦', limit: '📦', common: '📦', uncommon: '📦', mythic: '🗳️', legendary: '🗃️',
        diamond: '💎', emerald: '💚', exp: '✉️', gold: '👑', iron: '⛓️', level: '🧬', pet: '🎁',
        petfood: '🎁', potion: '🥤', rock: '🪨', roti: '🍞', skata: '🧻', steak: '🥩', string: '🕸️',
        subscribers: '📢', trash: '🗑', umpan: '🪱'
    };

    let users = Object.entries(global.db.data.users).map(([key, value]) => ({ jid: key, ...value }));

    let sorted = users
        .filter(user => user[type] !== undefined)
        .sort((a, b) => (b[type] || 0) - (a[type] || 0))
        .slice(0, 20);

    let html = `
    <html>
    <head>
        <title>Leaderboard ${type}</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4; }
            h1 { color: #333; }
            table { border-collapse: collapse; width: 100%; background: white; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #333; color: white; }
            tr:hover { background-color: #f1f1f1; }
        </style>
    </head>
    <body>
        <h1>🏆 Leaderboard ${type.toUpperCase()} ${emojiMap[type] || ''}</h1>
        <table>
            <tr><th>Rank</th><th>Name</th><th>Value</th></tr>
    `;

    for (let i = 0; i < sorted.length; i++) {
        let u = sorted[i];
        let name = await conn.getName(u.jid) || 'No Name';
        let value = u[type] || 0;
        html += `<tr><td>${i + 1}</td><td>${name}</td><td>${value}</td></tr>`;
    }

    html += `</table></body></html>`;

    let savePath = path.join(__dirname, '../public/leaderboard');
    if (!fs.existsSync(savePath)) fs.mkdirSync(savePath, { recursive: true });

    let fileName = `${type}.html`;
    fs.writeFileSync(path.join(savePath, fileName), html);

    let url = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 2000}/leaderboard/${fileName}`;
    m.reply(`✅ Leaderboard untuk *${type}* siap!\nBuka di Chrome:\n${url}`);
};

handler.help = ['weblb [type]'];
handler.tags = ['rpg'];
handler.command = /^weblb$/i;

export default handler;