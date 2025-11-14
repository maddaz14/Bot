let handler = async (m, { conn, args }) => {
    if (!args[0] || isNaN(args[0])) {
        throw '*Example*: .buylimit 10\n\nNote: 1 limit = 1000 exp (1-500,000 exp), 1 limit = 100k exp (500,000+ exp)';
    }

    conn.sendMessage(m.chat, {
        react: {
            text: '🕒',
            key: m.key,
        }
    });

    let count = parseInt(args[0]);
    let users = global.db.data.users;
    let user = users[m.sender];
    let price = user.exp <= 500000 ? count * 1000 : count * 100000;

    if (price > user.exp) {
        throw `Maaf, exp kamu tidak cukup untuk menukar ${count} limit. Harga 1 limit adalah ${user.exp <= 500000 ? 1000 : 100000} exp.`;
    }

    user.exp -= price;
    user.limit += count;
    conn.reply(m.chat, `Berhasil menukar ${count} limit dengan harga ${price} exp.`, m);
};

handler.help = ['buylimit'];
handler.tags = ['main'];
handler.command = /^(buylimit)$/i;
handler.register = true;
handler.limit = false;

export default handler;