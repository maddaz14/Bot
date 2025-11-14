const prices = {
    hiu: { buy: 1500, sell: 400 },
    ikan: { buy: 500, sell: 50 },
    dory: { buy: 800, sell: 200 },
    orca: { buy: 1500, sell: 400 },
    paus: { buy: 2000, sell: 900 },
    cumi: { buy: 1400, sell: 300 },
    gurita: { buy: 1600, sell: 500 },
    buntal: { buy: 700, sell: 100 },
    udang: { buy: 500, sell: 50 },
    lumba: { buy: 1500, sell: 400 },
    lobster: { buy: 800, sell: 200 },
    kepiting: { buy: 700, sell: 150 },
    lele: { buy: 600, sell: 120 }, // ✅ Ikan Lele ditambahkan
};

function formatNumber(num) {
    return num.toLocaleString('id-ID');
}

function generatePriceList() {
    let buyList = '*Fishing | Harga Beli*\n';
    let sellList = '*Fishing | Harga Jual*\n';

    for (const [name, { buy, sell }] of Object.entries(prices)) {
        buyList += `${capitalize(name)}: ${formatNumber(buy)}\n`;
        sellList += `${capitalize(name)}: ${formatNumber(sell)}\n`;
    }

    return `${buyList}\n${sellList}`.trim();
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

let handler = async (m, { conn, command, args, usedPrefix }) => {
    const user = global.db.data.users[m.sender] || {};
    for (let key in prices) {
        if (!(key in user)) user[key] = 0;
    }
    if (!user.eris) user.eris = 0;

    const jualbeli = args[0]?.toLowerCase();
    const type = args[1]?.toLowerCase();
    let count = 1;

    if (args[2]?.toLowerCase() === 'all') {
        count = user[type] || 0;
    } else if (!isNaN(args[2])) {
        count = Math.min(99999999, Math.max(parseInt(args[2]), 1));
    }

    const Kaine = `Cara Buy dan Sell:
.shopfish2 buy ikan 1  → beli 1 ikan
.shopfish2 sell hiu 3 → jual 3 hiu
.shopfish2 sell orca all → jual semua orca

============================

${generatePriceList()}`;

    try {
        if (/shopfish/i.test(command)) {
            if (!jualbeli || !type || !(type in prices))
                return conn.reply(m.chat, Kaine, m);

            switch (jualbeli) {
                case 'buy': {
                    const totalBuy = prices[type].buy * count;
                    if (user.eris < totalBuy)
                        return conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} ${type}.\nDibutuhkan: ${formatNumber(totalBuy)} Money`, m);

                    user[type] += count;
                    user.eris -= totalBuy;
                    conn.reply(m.chat, `✅ Berhasil membeli ${count} ${type} seharga ${formatNumber(totalBuy)} Money`, m);
                    break;
                }
                case 'sell': {
                    if (user[type] < count)
                        return conn.reply(m.chat, `❌ ${type} anda tidak cukup untuk dijual`, m);

                    const totalSell = prices[type].sell * count;
                    user[type] -= count;
                    user.eris += totalSell;
                    conn.reply(m.chat, `✅ Berhasil menjual ${count} ${type} dan mendapatkan ${formatNumber(totalSell)} Money`, m);
                    break;
                }
                default:
                    return conn.reply(m.chat, Kaine, m);
            }
        }
    } catch (e) {
        conn.reply(m.chat, Kaine, m);
        console.error(e);
    }
};

handler.help = ['shopfish2'];
handler.tags = ['rpg'];
handler.command = /^(shopfish2)$/i;
handler.limit = true;
handler.group = true;
handler.register = true;

export default handler;